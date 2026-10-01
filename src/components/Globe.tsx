"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LAND } from "@/lib/land";

/**
 * The hero globe.
 *
 * - Fibonacci point cloud, brightened wherever the equirectangular land mask
 *   says "land".
 * - Grab-and-spin: pointer drag rotates it directly and releases with inertia,
 *   easing back to the idle spin once the momentum dies.
 * - Evolution ripples: expanding rings fire from random points on the surface
 *   and brighten + lift the dots they pass through, so the world reads as
 *   something continually changing rather than a static prop.
 * - City beacons, travelling arc pulses and two orbit rings carry the rest of
 *   the motion.
 */

const LAND_POINTS = 30000;
const ARC_COUNT = 9;
const MAX_RIPPLES = 4;

/** Rasterise LAND into a 1024x512 alpha mask we can sample per point. */
function buildMask(): ImageData | null {
  const w = 1024;
  const h = 512;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";

  for (const poly of LAND) {
    ctx.beginPath();
    poly.forEach(([lon, lat], i) => {
      const x = ((lon + 180) / 360) * w;
      const y = ((90 - lat) / 180) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  }
  return ctx.getImageData(0, 0, w, h);
}

function isLand(mask: ImageData, lon: number, lat: number) {
  const x = Math.floor(((lon + 180) / 360) * mask.width);
  const y = Math.floor(((90 - lat) / 180) * mask.height);
  const i = (y * mask.width + x) * 4;
  return mask.data[i] > 128;
}

const CITIES: { lon: number; lat: number; name: string }[] = [
  { lon: -100.3, lat: 25.7, name: "Monterrey" },
  { lon: -95.4, lat: 29.8, name: "Houston" },
  { lon: 55.3, lat: 25.2, name: "Dubai" },
  { lon: -0.1, lat: 51.5, name: "London" },
  { lon: 103.8, lat: 1.35, name: "Singapore" },
  { lon: -46.6, lat: -23.5, name: "Sao Paulo" },
  { lon: 77.2, lat: 28.6, name: "Delhi" },
  { lon: 139.7, lat: 35.7, name: "Tokyo" },
  { lon: -74, lat: 40.7, name: "New York" },
  { lon: 151.2, lat: -33.9, name: "Sydney" },
];

function toVec(lon: number, lat: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

export default function Globe({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mask = buildMask();
    if (!mask) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 3.05;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      width: "100%",
      height: "100%",
      display: "block",
      cursor: "grab",
      touchAction: "pan-y",
    });

    const world = new THREE.Group();
    world.rotation.z = -0.36; // axial tilt
    scene.add(world);

    const spin = new THREE.Group(); // everything that turns with the planet
    world.add(spin);

    const R = 1;

    /* ── ripple state, shared by the land shader ───────────────── */
    const rippleOrigin = Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector3(0, 1, 0));
    const rippleStart = new Float32Array(MAX_RIPPLES).fill(-999);
    let rippleSlot = 0;

    const fireRipple = (time: number, at?: THREE.Vector3) => {
      const v =
        at ??
        (() => {
          const c = CITIES[Math.floor(Math.random() * CITIES.length)];
          return toVec(c.lon, c.lat, 1);
        })();
      rippleOrigin[rippleSlot].copy(v).normalize();
      rippleStart[rippleSlot] = time;
      rippleSlot = (rippleSlot + 1) % MAX_RIPPLES;
    };

    /* ── land + ocean dots ─────────────────────────────────────── */
    const landPos: number[] = [];
    const landAlpha: number[] = [];
    const seaPos: number[] = [];

    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < LAND_POINTS; i++) {
      const y = 1 - (i / (LAND_POINTS - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = Math.atan2(z, -x) * (180 / Math.PI);

      if (isLand(mask, lon, lat)) {
        landPos.push(x * R, y * R, z * R);
        landAlpha.push(0.62 + Math.random() * 0.38);
      } else if (i % 5 === 0) {
        seaPos.push(x * R, y * R, z * R);
      }
    }

    const dotTex = (() => {
      const s = 64;
      const c = document.createElement("canvas");
      c.width = c.height = s;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.45, "rgba(255,255,255,0.85)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
      return new THREE.CanvasTexture(c);
    })();

    const landGeo = new THREE.BufferGeometry();
    landGeo.setAttribute("position", new THREE.Float32BufferAttribute(landPos, 3));
    landGeo.setAttribute("aAlpha", new THREE.Float32BufferAttribute(landAlpha, 1));

    const landMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uSize: { value: 2.3 * Math.min(window.devicePixelRatio, 2) },
        uTex: { value: dotTex },
        uColor: { value: new THREE.Color("#013e8a") },
        uHot: { value: new THREE.Color("#00b4d9") },
        uTime: { value: 0 },
        uRippleOrigin: { value: rippleOrigin },
        uRippleStart: { value: rippleStart },
      },
      vertexShader: /* glsl */ `
        attribute float aAlpha;
        uniform float uSize;
        uniform float uTime;
        uniform vec3 uRippleOrigin[${MAX_RIPPLES}];
        uniform float uRippleStart[${MAX_RIPPLES}];
        varying float vAlpha;
        varying float vHeat;

        void main() {
          vAlpha = aAlpha;

          // how strongly an expanding wavefront is passing through this dot
          float heat = 0.0;
          vec3 n = normalize(position);
          for (int i = 0; i < ${MAX_RIPPLES}; i++) {
            float age = uTime - uRippleStart[i];
            if (age < 0.0 || age > 3.2) continue;
            float ang = acos(clamp(dot(n, normalize(uRippleOrigin[i])), -1.0, 1.0));
            float front = age * 1.25;                 // radians travelled
            float band  = 1.0 - smoothstep(0.0, 0.16, abs(ang - front));
            heat = max(heat, band * (1.0 - age / 3.2));
          }
          vHeat = heat;

          vec3 p = position * (1.0 + heat * 0.045);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uSize * (3.0 / -mv.z) * (1.0 + heat * 1.5);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTex;
        uniform vec3 uColor;
        uniform vec3 uHot;
        varying float vAlpha;
        varying float vHeat;
        void main() {
          vec4 t = texture2D(uTex, gl_PointCoord);
          if (t.a < 0.05) discard;
          vec3 col = mix(uColor, uHot, vHeat);
          gl_FragColor = vec4(col, t.a * (vAlpha + vHeat * 0.6));
        }
      `,
    });

    spin.add(new THREE.Points(landGeo, landMat));

    const seaGeo = new THREE.BufferGeometry();
    seaGeo.setAttribute("position", new THREE.Float32BufferAttribute(seaPos, 3));
    spin.add(
      new THREE.Points(
        seaGeo,
        new THREE.PointsMaterial({
          color: new THREE.Color("#0076b5"),
          size: 0.005,
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
        }),
      ),
    );

    /* ── planet body: deep navy with a lit limb, not flat black ── */
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.985, 96, 96),
      new THREE.ShaderMaterial({
        uniforms: {
          uDeep: { value: new THREE.Color("#eef3fa") },
          uLimb: { value: new THREE.Color("#b9c9e0") },
        },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uDeep;
          uniform vec3 uLimb;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float f = 1.0 - clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0);
            // soft key light from the upper left so the sphere reads as a body
            float key = clamp(dot(normalize(vNormal), normalize(vec3(-0.5, 0.55, 0.75))), 0.0, 1.0);
            vec3 col = mix(uDeep, uLimb, pow(f, 1.6)) + vec3(key * 0.05);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    );
    spin.add(core);

    /* ── atmosphere ────────────────────────────────────────────── */
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.13, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color("#0076b5") } },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          varying vec3 vNormal;
          void main() {
            float i = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.4);
            gl_FragColor = vec4(uColor, clamp(i, 0.0, 1.0) * 0.30);
          }
        `,
      }),
    );
    world.add(atmo);

    /* ── city beacons ──────────────────────────────────────────── */
    const beaconGeo = new THREE.BufferGeometry();
    const beaconPos: number[] = [];
    const beaconPhase: number[] = [];
    CITIES.forEach((c, i) => {
      const v = toVec(c.lon, c.lat, R * 1.008);
      beaconPos.push(v.x, v.y, v.z);
      beaconPhase.push(i * 0.7);
    });
    beaconGeo.setAttribute("position", new THREE.Float32BufferAttribute(beaconPos, 3));
    beaconGeo.setAttribute("aPhase", new THREE.Float32BufferAttribute(beaconPhase, 1));

    const beaconMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uTex: { value: dotTex },
        uColor: { value: new THREE.Color("#00b4d9") },
        uScale: { value: 9 * Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: /* glsl */ `
        attribute float aPhase;
        uniform float uTime;
        uniform float uScale;
        varying float vPulse;
        void main() {
          vPulse = 0.55 + 0.45 * sin(uTime * 2.1 + aPhase * 3.0);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uScale * (3.0 / -mv.z) * (0.75 + vPulse * 0.6);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTex;
        uniform vec3 uColor;
        varying float vPulse;
        void main() {
          vec4 t = texture2D(uTex, gl_PointCoord);
          if (t.a < 0.03) discard;
          gl_FragColor = vec4(uColor, t.a * vPulse * 0.9);
        }
      `,
    });
    spin.add(new THREE.Points(beaconGeo, beaconMat));

    /* ── orbit rings ───────────────────────────────────────────── */
    const rings: THREE.Line[] = [];
    [1.28, 1.42].forEach((rad, i) => {
      const pts: THREE.Vector3[] = [];
      for (let a = 0; a <= 128; a++) {
        const t = (a / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(t) * rad, 0, Math.sin(t) * rad));
      }
      const ring = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({
          color: new THREE.Color(i ? "#013e8a" : "#0076b5"),
          transparent: true,
          opacity: i ? 0.28 : 0.4,
          depthWrite: false,
        }),
      );
      ring.rotation.x = i ? 1.15 : 0.42;
      ring.rotation.z = i ? -0.5 : 0.3;
      world.add(ring);
      rings.push(ring);
    });

    /* ── satellites riding the rings ───────────────────────────── */
    const satGeo = new THREE.BufferGeometry();
    satGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Float32Array(rings.length * 3), 3),
    );
    const satMat = new THREE.PointsMaterial({
      color: new THREE.Color("#0076b5"),
      size: 0.035,
      map: dotTex,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const sats = new THREE.Points(satGeo, satMat);
    world.add(sats);

    /* ── travelling arcs ───────────────────────────────────────── */
    type Arc = {
      line: THREE.Line;
      mat: THREE.LineBasicMaterial;
      total: number;
      t: number;
      speed: number;
      end: THREE.Vector3;
      fired: boolean;
    };
    const arcs: Arc[] = [];

    const makeArc = (): Arc => {
      const a = CITIES[Math.floor(Math.random() * CITIES.length)];
      let b = CITIES[Math.floor(Math.random() * CITIES.length)];
      while (b === a) b = CITIES[Math.floor(Math.random() * CITIES.length)];

      const start = toVec(a.lon, a.lat, 1);
      const end = toVec(b.lon, b.lat, 1);
      const mid = start
        .clone()
        .add(end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(1 + start.distanceTo(end) * 0.3);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const pts = curve.getPoints(110);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      geo.setDrawRange(0, 0);
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color("#0076b5"),
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      spin.add(line);
      return {
        line,
        mat,
        total: pts.length,
        t: 0,
        speed: 0.5 + Math.random() * 0.7,
        end,
        fired: false,
      };
    };

    for (let i = 0; i < ARC_COUNT; i++) {
      const arc = makeArc();
      arc.t = Math.random() * 2.2;
      arcs.push(arc);
    }

    /* ── resize ────────────────────────────────────────────────── */
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // plain timer: THREE.Clock is deprecated in this three version
    const t0 = performance.now();
    const now = () => (performance.now() - t0) / 1000;
    let prev = now();

    /* ── grab to spin ──────────────────────────────────────────── */
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let velY = 0;
    let idleBoost = 1; // eases the auto-spin back in after a throw
    let pointerX = 0;
    let pointerY = 0;

    const canvas = renderer.domElement;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      velX = 0;
      velY = 0;
      idleBoost = 0;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(e.pointerId);
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already gone */
      }
    };

    const onMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      velX = dx * 0.005;
      velY = dy * 0.005;
      spin.rotation.y += velX;
      world.rotation.x = THREE.MathUtils.clamp(world.rotation.x + velY, -0.85, 0.85);
    };

    // a click that did not turn into a drag fires a ripple where you hit
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const onClick = (e: PointerEvent) => {
      if (Math.abs(velX) > 0.002 || Math.abs(velY) > 0.002) return;
      const r = canvas.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObject(core, false)[0];
      if (hit) {
        const local = spin.worldToLocal(hit.point.clone()).normalize();
        fireRipple(now(), local);
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("click", onClick);
    window.addEventListener("pointermove", onMove, { passive: true });

    /* ── loop ──────────────────────────────────────────────────── */
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(el);

    let nextRipple = 1.5;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const time = now();
      const dt = Math.min(time - prev, 0.05);
      prev = time;

      landMat.uniforms.uTime.value = time;
      beaconMat.uniforms.uTime.value = time;

      // periodic ripples keep the world "evolving" on its own
      if (!reduce && time > nextRipple) {
        fireRipple(time);
        nextRipple = time + 2.4 + Math.random() * 2.6;
      }

      if (!dragging) {
        // inertia, then hand back to the idle spin
        spin.rotation.y += velX;
        world.rotation.x = THREE.MathUtils.clamp(world.rotation.x + velY, -0.85, 0.85);
        velX *= 0.94;
        velY *= 0.94;
        if (Math.abs(velX) < 0.0004) velX = 0;
        if (Math.abs(velY) < 0.0004) velY = 0;

        idleBoost = Math.min(1, idleBoost + dt * 0.5);
        if (!reduce) spin.rotation.y += dt * 0.055 * idleBoost;

        // drift back to level when left alone
        world.rotation.x += (pointerY * 0.12 - world.rotation.x) * 0.012;
      }

      scene.rotation.y += (pointerX * 0.06 - scene.rotation.y) * 0.03;

      // rings counter-rotate slightly for parallax
      rings[0].rotation.y += dt * 0.09;
      rings[1].rotation.y -= dt * 0.06;

      // satellites ride their rings
      const satAttr = sats.geometry.getAttribute("position") as THREE.BufferAttribute;
      rings.forEach((ring, i) => {
        const rad = i ? 1.42 : 1.28;
        const a = time * (i ? -0.45 : 0.6) + i * 2.2;
        const p = new THREE.Vector3(Math.cos(a) * rad, 0, Math.sin(a) * rad);
        p.applyEuler(ring.rotation);
        satAttr.setXYZ(i, p.x, p.y, p.z);
      });
      satAttr.needsUpdate = true;

      for (const arc of arcs) {
        arc.t += dt * arc.speed;
        const cycle = arc.t % 2.4;
        const head = Math.min(1, cycle / 1.1);
        arc.line.geometry.setDrawRange(0, Math.floor(head * arc.total));
        arc.mat.opacity =
          cycle > 1.1 ? Math.max(0, 1 - (cycle - 1.1) / 1.3) * 0.55 : 0.55;

        // when a packet lands, the destination ripples
        if (!arc.fired && head >= 1) {
          arc.fired = true;
          if (!reduce) fireRipple(time, arc.end);
        }
        if (cycle < 0.05) arc.fired = false;
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", onMove);
      renderer.dispose();
      landGeo.dispose();
      seaGeo.dispose();
      beaconGeo.dispose();
      satGeo.dispose();
      dotTex.dispose();
      arcs.forEach((a) => {
        a.line.geometry.dispose();
        a.mat.dispose();
      });
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} className={className} />;
}
