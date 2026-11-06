// The hero's 3D scene: a low-poly patch of hexagonal shell plates, drawn with
// plain WebGL so it adds no package. It loads only through a dynamic import from
// hero-art.tsx. Frames are drawn only when something changes: after one short
// settle it rests, and then only the pointer or scrolling moves it. It never
// runs a loop by itself.

const PLATE_RINGS = 3; // 37 plates, and the patch's outline is a hexagon
const PLATE_RADIUS = 0.52;
const PLATE_GAP = 0.94;
const BEVEL = 0.72;
const DOME = 0.075;
const MAX_PIXEL_RATIO = 2;
const REST_X = -0.5;
const REST_Y = 0.32;
const SETTLE_FROM = 0.3; // radians away from rest at the start
const SETTLE_SPEED = 4.5; // reaches rest in about 1.4 seconds
const POINTER_REACH = 0.1;
const SCROLL_REACH = 0.14;
const STILL = 0.0008;
const CAMERA = 11.5; // far enough that the whole patch fits, so its hexagon outline shows

const VERTEX = `
attribute vec3 position;
attribute vec3 normal;
uniform mat4 projection;
uniform mat3 rotation;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vec3 p = rotation * position;
  vNormal = rotation * normal;
  vPosition = p;
  gl_Position = projection * vec4(p + vec3(0.0, 0.0, -${CAMERA.toFixed(1)}), 1.0);
}`;

const FRAGMENT = `
precision mediump float;
uniform vec3 base;
uniform vec3 shade;
uniform vec3 amber;
uniform vec3 rose;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vec3 n = normalize(vNormal);
  vec3 view = normalize(vec3(0.0, 0.0, ${CAMERA.toFixed(1)}) - vPosition);
  float light = clamp(dot(n, normalize(vec3(-0.4, 0.6, 0.7))), 0.0, 1.0);
  float rim = pow(1.0 - clamp(dot(n, view), 0.0, 1.0), 1.6);
  float side = smoothstep(-0.35, 0.35, vPosition.x);
  vec3 color = mix(shade, base, light);
  color = mix(color, mix(amber, rose, side), clamp(rim * 1.5, 0.0, 0.85));
  gl_FragColor = vec4(color, 1.0);
}`;

type Vector = [number, number, number];

const subtract = (a: Vector, b: Vector): Vector => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
];

const cross = (a: Vector, b: Vector): Vector => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

function normalise(a: Vector): Vector {
  const size = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / size, a[1] / size, a[2] / size];
}

/** The plates as flat-shaded triangles: position then normal, per corner. */
function buildPlates() {
  const data: number[] = [];

  const triangle = (a: Vector, b: Vector, c: Vector) => {
    const normal = normalise(cross(subtract(b, a), subtract(c, a)));
    for (const corner of [a, b, c]) data.push(...corner, ...normal);
  };

  // Each plate has its own slight height, so the facets catch the light unevenly.
  const lift = (q: number, r: number) =>
    0.09 + 0.05 * Math.sin(q * 12.9 + r * 78.2);

  for (let q = -PLATE_RINGS; q <= PLATE_RINGS; q++) {
    for (let r = -PLATE_RINGS; r <= PLATE_RINGS; r++) {
      if (Math.abs(q + r) > PLATE_RINGS) continue;

      const cx = Math.sqrt(3) * PLATE_RADIUS * (q + r / 2);
      const cy = 1.5 * PLATE_RADIUS * r;
      const dome = -DOME * (cx * cx + cy * cy);
      const center: Vector = [cx, cy, dome + lift(q, r)];
      const outer: Vector[] = [];
      const inner: Vector[] = [];

      for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 6 + (i * Math.PI) / 3;
        const x = Math.cos(angle) * PLATE_RADIUS * PLATE_GAP;
        const y = Math.sin(angle) * PLATE_RADIUS * PLATE_GAP;
        const ox = cx + x;
        const oy = cy + y;
        outer.push([ox, oy, -DOME * (ox * ox + oy * oy)]);
        inner.push([
          cx + x * BEVEL,
          cy + y * BEVEL,
          -DOME * ((cx + x * BEVEL) ** 2 + (cy + y * BEVEL) ** 2) + lift(q, r),
        ]);
      }

      for (let i = 0; i < 6; i++) {
        const next = (i + 1) % 6;
        triangle(center, inner[i], inner[next]);
        triangle(inner[i], outer[i], outer[next]);
        triangle(inner[i], outer[next], inner[next]);
      }
    }
  }

  return new Float32Array(data);
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function perspective(aspect: number) {
  const fov = 1 / Math.tan(0.34);
  const near = 1;
  const far = 30;
  return new Float32Array([
    fov / aspect,
    0,
    0,
    0,
    0,
    fov,
    0,
    0,
    0,
    0,
    (far + near) / (near - far),
    -1,
    0,
    0,
    (2 * far * near) / (near - far),
    0,
  ]);
}

function rotation(x: number, y: number) {
  const [sx, cx, sy, cy] = [
    Math.sin(x),
    Math.cos(x),
    Math.sin(y),
    Math.cos(y),
  ];
  return new Float32Array([cy, 0, -sy, sx * sy, cx, sx * cy, cx * sy, -sx, cx * cy]);
}

// The browser writes any colour back as #rrggbb here. Reading the token directly
// is not safe, because the CSS build shortens #ffffff to #fff.
function toColor(context: CanvasRenderingContext2D, color: string) {
  context.fillStyle = color;
  const hex = String(context.fillStyle);
  return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
}

/**
 * Starts the scene on a canvas. Returns a stop function, or null if the scene
 * could not start. onDrawn runs after the first frame, onLost if the browser
 * drops the graphics context.
 */
export function startHeroScene(
  canvas: HTMLCanvasElement,
  onDrawn: () => void,
  onLost: () => void,
) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const plates = buildPlates();
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, plates, gl.STATIC_DRAW);

  for (const [name, offset] of [
    ["position", 0],
    ["normal", 12],
  ] as const) {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 24, offset);
  }

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const projectionAt = uniform("projection");
  const rotationAt = uniform("rotation");
  const count = plates.length / 6;

  // Current and target angle, as offsets from the resting pose.
  const now = { x: SETTLE_FROM, y: -SETTLE_FROM };
  const target = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0 };

  let frame = 0;
  let last = 0;
  let onScreen = true;
  let drawn = false;

  const palette = document.createElement("canvas").getContext("2d");

  const readColors = () => {
    if (!palette) return;
    const styles = getComputedStyle(document.documentElement);
    for (const [name, token] of [
      ["base", "--card"],
      ["shade", "--secondary"],
      ["amber", "--sunset-amber"],
      ["rose", "--sunset-rose"],
    ]) {
      const [r, g, b] = toColor(palette, styles.getPropertyValue(token).trim());
      gl.uniform3f(uniform(name), r, g, b);
    }
  };

  const draw = () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix3fv(
      rotationAt,
      false,
      rotation(REST_X + now.x, REST_Y + now.y),
    );
    gl.drawArrays(gl.TRIANGLES, 0, count);
    if (!drawn) {
      drawn = true;
      onDrawn();
    }
  };

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    const width = Math.round(canvas.clientWidth * ratio);
    const height = Math.round(canvas.clientHeight * ratio);
    if (!width || !height) return;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.uniformMatrix4fv(projectionAt, false, perspective(width / height));
  };

  const canRun = () => onScreen && !document.hidden;

  const step = (time: number) => {
    frame = 0;
    if (!canRun()) return;

    const seconds = Math.min((time - last) / 1000, 0.05);
    last = time;
    const ease = 1 - Math.exp(-seconds * SETTLE_SPEED);
    now.x += (target.x - now.x) * ease;
    now.y += (target.y - now.y) * ease;

    const moving =
      Math.abs(target.x - now.x) > STILL || Math.abs(target.y - now.y) > STILL;
    if (!moving) {
      now.x = target.x;
      now.y = target.y;
    }
    draw();
    if (moving) frame = requestAnimationFrame(step);
  };

  const wake = () => {
    if (frame || !canRun()) return;
    last = performance.now();
    frame = requestAnimationFrame(step);
  };

  const aim = () => {
    const height = document.documentElement.clientHeight || 1;
    target.x = pointer.y + Math.min(window.scrollY / height, 1) * SCROLL_REACH;
    target.y = pointer.x;
    wake();
  };

  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2 * POINTER_REACH;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2 * POINTER_REACH;
    aim();
  };

  const onResize = () => {
    resize();
    if (canRun()) draw();
  };

  const onLose = (event: Event) => {
    event.preventDefault();
    onLost();
  };

  const sizer = new ResizeObserver(onResize);
  const watcher = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    wake();
  });
  const theme = new MutationObserver(() => {
    readColors();
    if (canRun()) draw();
  });

  readColors();
  resize();
  sizer.observe(canvas);
  watcher.observe(canvas);
  theme.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("scroll", aim, { passive: true });
  document.addEventListener("visibilitychange", wake);
  canvas.addEventListener("webglcontextlost", onLose);
  aim();

  return () => {
    if (frame) cancelAnimationFrame(frame);
    sizer.disconnect();
    watcher.disconnect();
    theme.disconnect();
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("scroll", aim);
    document.removeEventListener("visibilitychange", wake);
    canvas.removeEventListener("webglcontextlost", onLose);
  };
}
