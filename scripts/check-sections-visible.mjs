// Fails if any home page section is invisible on a wide desktop screen.
//
// Run it after a build:  npm run build && npm run check:sections
//
// It starts the production site, opens it in headless Edge or Chrome, and looks
// at every <section> in <main> at 1280, 1440 and 1920px wide, in dark and light:
//   1. On load, with no scrolling: is the section's opacity full?
//   2. Full-page capture: are the section's pixels really painted?
//   3. Scrolled to the section: are its pixels painted there too?
// No packages needed. Set BROWSER_PATH to use a different browser.

import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const WIDTHS = [
  [1280, 800],
  [1440, 900],
  [1920, 1080],
];
const THEMES = ["dark", "light"];
const SITE_PORT = 3123;
const BROWSER_PORT = 9340;
const SITE = `http://localhost:${SITE_PORT}/`;
const PROFILE = path.resolve(".tmp-shots/check-sections-profile");

// A pixel counts as "ink" when it differs from the section's background by at
// least this much on one colour channel (0 to 255). Text under about 40%
// opacity stays below it, so a faded-out section fails.
const INK_DIFFERENCE = 96;
const MIN_INK_PIXELS = 100;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findBrowser() {
  const candidates = [
    process.env.BROWSER_PATH,
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  return candidates.find((candidate) => candidate && existsSync(candidate));
}

async function waitFor(task, what) {
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      return await task();
    } catch {
      await sleep(250);
    }
  }
  throw new Error(`Timed out waiting for ${what}.`);
}

/** Talks to the browser over the DevTools protocol. */
async function connect(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve) => (socket.onopen = resolve));
  const pending = new Map();
  let lastId = 0;

  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    pending.get(message.id)?.(message);
    pending.delete(message.id);
  };

  return (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++lastId;
      const timer = setTimeout(() => reject(new Error(`${method} hung.`)), 30000);
      pending.set(id, (message) => {
        clearTimeout(timer);
        if (message.error) reject(new Error(`${method}: ${message.error.message}`));
        else resolve(message.result);
      });
      socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
}

// Runs in the page. Multiplies opacity up the tree, because a fully opaque
// section is still invisible if the wrapper inside it, or a parent, is at 0.
const READ_SECTIONS = `(() => {
  const opacityOf = (start) => {
    let total = 1;
    for (let el = start; el; el = el.parentElement) {
      total *= Number(getComputedStyle(el).opacity);
    }
    return total;
  };
  return [...document.querySelectorAll("main section[id]")].map((section) => {
    const box = section.getBoundingClientRect();
    const opacity = opacityOf(section.firstElementChild ?? section);
    return {
      id: section.id,
      opacity: Number(opacity.toFixed(3)),
      hiddenByCss: getComputedStyle(section).visibility !== "visible",
      x: box.left + scrollX,
      y: box.top + scrollY,
      width: box.width,
      height: box.height,
      hasText: section.textContent.trim().length > 0,
    };
  });
})()`;

// Runs in the page. Decodes a screenshot and counts the pixels that stand out
// from its most common colour, which is the background.
const countInk = (png) => `(async () => {
  const image = new Image();
  image.src = "data:image/png;base64,${png}";
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, image.width, image.height);
  const seen = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const key = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  const background = [...seen].sort((a, b) => b[1] - a[1])[0][0];
  const [r, g, b] = [background >> 16, (background >> 8) & 255, background & 255];
  let ink = 0;
  for (let i = 0; i < data.length; i += 4) {
    const difference = Math.max(
      Math.abs(data[i] - r),
      Math.abs(data[i + 1] - g),
      Math.abs(data[i + 2] - b),
    );
    if (difference >= ${INK_DIFFERENCE}) ink++;
  }
  return ink;
})()`;

async function checkPage(send, sessionId, width, height, theme, report) {
  const page = (method, params) => send(method, params, sessionId);
  const run = async (expression) =>
    (
      await page("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true,
      })
    ).result.value;
  const inkIn = async (clip, captureBeyondViewport) => {
    const { data } = await page("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport,
      clip: { ...clip, scale: 1 },
    });
    return run(countInk(data));
  };
  const box = ({ x, y, width: w, height: h }) => ({ x, y, width: w, height: h });

  await page("Page.enable");
  await page("Runtime.enable");
  await page("Page.bringToFront");
  await page("Emulation.setFocusEmulationEnabled", { enabled: true });
  await page("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await page("Page.addScriptToEvaluateOnNewDocument", {
    source: `localStorage.setItem("theme", "${theme}");`,
  });
  await page("Page.navigate", { url: SITE });
  await sleep(1500);

  const sections = await run(READ_SECTIONS);
  if (sections.length === 0) report(`${width}px ${theme}: found no sections`);

  // 1. On load, with no scrolling.
  for (const section of sections) {
    const where = `${width}px ${theme} #${section.id}`;
    if (section.opacity < 0.99) {
      report(`${where}: opacity ${section.opacity} on load`);
    }
    if (section.hiddenByCss || section.height === 0 || !section.hasText) {
      report(`${where}: hidden, empty or zero height`);
    }
  }

  // 2. Full-page capture, like a screenshot tool or a printout.
  for (const section of sections) {
    const ink = await inkIn(box(section), true);
    if (ink < MIN_INK_PIXELS) {
      report(`${width}px ${theme} #${section.id}: blank in a full-page capture (${ink} ink pixels)`);
    }
  }

  // 3. Scrolled to each section in turn.
  for (const { id } of sections) {
    await run(`document.getElementById("${id}").scrollIntoView({ block: "start" })`);
    await sleep(700);
    // A hidden tab stops painting, which freezes a fade partway. That says
    // nothing about the site, so stop instead of calling the section blank.
    if ((await run("document.visibilityState")) !== "visible") {
      throw new Error("The browser hid the test tab, so this result cannot be trusted. Run the check again.");
    }
    const section = (await run(READ_SECTIONS)).find((item) => item.id === id);
    const scrollY = await run("scrollY");
    const ink = await inkIn(
      {
        x: section.x,
        y: Math.max(section.y, scrollY),
        width: section.width,
        height: Math.min(section.height, height),
      },
      false,
    );
    if (ink < MIN_INK_PIXELS) {
      report(`${width}px ${theme} #${id}: blank after scrolling to it (${ink} ink pixels)`);
    }
  }
}

async function main() {
  const browserPath = findBrowser();
  if (!browserPath) {
    throw new Error("No Edge or Chrome found. Set BROWSER_PATH to your browser.");
  }
  if (!existsSync(".next/BUILD_ID")) {
    throw new Error("No production build found. Run npm run build first.");
  }
  const portTaken = await fetch(SITE).then(
    () => true,
    () => false,
  );
  if (portTaken) throw new Error(`Port ${SITE_PORT} is in use. Stop what is using it.`);

  mkdirSync(PROFILE, { recursive: true });
  const site = spawn(`npx next start -p ${SITE_PORT}`, { shell: true, stdio: "ignore" });
  const browser = spawn(
    browserPath,
    [
      "--headless=new",
      `--remote-debugging-port=${BROWSER_PORT}`,
      `--user-data-dir=${PROFILE}`,
      "--no-first-run",
      // A fresh profile can open its own dialog, which hides the test tab.
      "--disable-renderer-backgrounding",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  // Stops only the two programs this script started.
  const stopAll = async (send) => {
    await send?.("Browser.close").catch(() => {});
    for (const child of [site, browser]) {
      if (process.platform === "win32") {
        try {
          execFileSync("taskkill", ["/F", "/T", "/PID", String(child.pid)], {
            stdio: "ignore",
          });
        } catch {
          // It has already exited.
        }
      } else {
        child.kill();
      }
    }
    await sleep(500);
    rmSync(PROFILE, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  };

  let send;
  const failures = [];
  try {
    await waitFor(async () => {
      if (!(await fetch(SITE)).ok) throw new Error("not ready");
    }, "the site");
    const { webSocketDebuggerUrl } = await waitFor(
      async () => (await fetch(`http://127.0.0.1:${BROWSER_PORT}/json/version`)).json(),
      "the browser",
    );
    send = await connect(webSocketDebuggerUrl);

    for (const [width, height] of WIDTHS) {
      for (const theme of THEMES) {
        const { targetId } = await send("Target.createTarget", { url: "about:blank" });
        const { sessionId } = await send("Target.attachToTarget", {
          targetId,
          flatten: true,
        });
        const before = failures.length;
        await checkPage(send, sessionId, width, height, theme, (line) =>
          failures.push(line),
        );
        console.log(
          `${width}px ${theme}: ${failures.length === before ? "ok" : `${failures.length - before} problem(s)`}`,
        );
        await send("Target.closeTarget", { targetId });
      }
    }
  } finally {
    await stopAll(send);
  }

  if (failures.length > 0) {
    console.error(`\nFAILED: ${failures.length} problem(s)`);
    for (const line of failures) console.error(`  ${line}`);
    process.exit(1);
  }
  console.log("\nPASSED: every home page section is visible at 1280, 1440 and 1920px.");
  process.exit(0);
}

main().catch((error) => {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
});
