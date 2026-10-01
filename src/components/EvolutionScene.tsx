"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The intro backdrop: a particle field that continuously re-forms itself —
 * scattered dust → a cell → a double helix → an ordered lattice → a network,
 * and round again. It is the "evolution mindset" idea rendered rather than
 * filmed, so it loops forever, weighs nothing and stays on-brand.
 *
 * Used automatically when no /media/intro.mp4 is supplied.
 */

const COUNT = 14000;

type Form = (i: number, n: number, out: THREE.Vector3) => void;

/** 1 — primordial scatter */
const scatter: Form = (i, n, out) => {
  const g = Math.PI * (3 - Math.sqrt(5));
  const r = 5 + Math.pow(hash(i), 0.5) * 15;
  const a = g * i;
  const y = (hash(i * 3.1) - 0.5) * 20;
  out.set(Math.cos(a) * r, y, Math.sin(a) * r);
};

/** 2 — a single cell */
const cell: Form = (i, n, out) => {
  const g = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / (n - 1)) * 2;
  const rad = Math.sqrt(Math.max(0, 1 - y * y));
  const th = g * i;
  const R = 7.4 + hash(i * 1.7) * 0.5;
  out.set(Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R);
};

/** 3 — double helix */
const helix: Form = (i, n, out) => {
  const strand = i % 2;
  const t = (i / n) * Math.PI * 12;
  const R = 4.6;
  const off = strand * Math.PI;
  // every so often a particle becomes a rung between the strands
  if (i % 37 === 0) {
    const k = (hash(i * 5.3) - 0.5) * 2;
    out.set(Math.cos(t) * R * k, (i / n) * 30 - 15, Math.sin(t) * R * k);
    return;
  }
  out.set(Math.cos(t + off) * R, (i / n) * 30 - 15, Math.sin(t + off) * R);
};

/** 4 — ordered lattice */
const lattice: Form = (i, n, out) => {
  const side = Math.ceil(Math.cbrt(n));
  const x = i % side;
  const y = Math.floor(i / side) % side;
  const z = Math.floor(i / (side * side));
  const s = 15 / side;
  out.set((x - side / 2) * s, (y - side / 2) * s, (z - side / 2) * s);
};

/** 5 — connected network */
const network: Form = (i, n, out) => {
  const nodes = 26;
  const node = i % nodes;
  const g = Math.PI * (3 - Math.sqrt(5));
  const ny = 1 - (node / (nodes - 1)) * 2;
  const nr = Math.sqrt(Math.max(0, 1 - ny * ny));
  const nth = g * node;
  const NR = 8.5;
  const cx = Math.cos(nth) * nr * NR;
  const cy = ny * NR;
  const cz = Math.sin(nth) * nr * NR;
  // most particles hug their node, some stream between nodes
  if (i % 5 === 0) {
    const other = (node + 7) % nodes;
    const oy = 1 - (other / (nodes - 1)) * 2;
    const or_ = Math.sqrt(Math.max(0, 1 - oy * oy));
    const oth = g * other;
    const k = hash(i * 2.9);
    out.set(
      cx + (Math.cos(oth) * or_ * NR - cx) * k,
      cy + (oy * NR - cy) * k,
      cz + (Math.sin(oth) * or_ * NR - cz) * k,
    );
    return;
  }
  const s = 1.5;
  out.set(
    cx + (hash(i * 1.1) - 0.5) * s,
    cy + (hash(i * 2.2) - 0.5) * s,
    cz + (hash(i * 3.3) - 0.5) * s,
  );
};

const FORMS: Form[] = [scatter, cell, helix, lattice, network];

function hash(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

function build(form: Form) {
  const arr = new Float32Array(COUNT * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < COUNT; i++) {
    form(i, COUNT, v);
    arr[i * 3] = v.x;
    arr[i * 3 + 1] = v.y;
    arr[i * 3 + 2] = v.z;
  }
  return arr;
}

export default function EvolutionScene({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shapes = FORMS.map(build);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.026);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    camera.position.set(0, 0, 30);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      width: "100%",
      height: "100%",
      display: "block",
    });

    const geo = new THREE.BufferGeometry();
    const from = new THREE.BufferAttribute(shapes[0].slice(), 3);
    const to = new THREE.BufferAttribute(shapes[1].slice(), 3);
    geo.setAttribute("position", from);
    geo.setAttribute("aTarget", to);

    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) seeds[i] = hash(i * 7.77);
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const sprite = (() => {
      const s = 64;
      const c = document.createElement("canvas");
      c.width = c.height = s;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.42, "rgba(255,255,255,0.7)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
      return new THREE.CanvasTexture(c);
    })();

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uTex: { value: sprite },
        uNear: { value: new THREE.Color("#013e8a") },
        uFar: { value: new THREE.Color("#7f97bb") },
        uSize: { value: 3.3 * Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aTarget;
        attribute float aSeed;
        uniform float uMix;
        uniform float uTime;
        uniform float uSize;
        varying float vDepth;
        varying float vSeed;

        void main() {
          // stagger the morph so the cloud re-forms in a wave, not all at once
          float local = clamp((uMix - aSeed * 0.35) / 0.65, 0.0, 1.0);
          float e = local * local * (3.0 - 2.0 * local);   // smoothstep
          vec3 p = mix(position, aTarget, e);

          // drift so the form never looks frozen between morphs
          float t = uTime * 0.35 + aSeed * 30.0;
          p += vec3(sin(t), cos(t * 1.13), sin(t * 0.77)) * 0.34;

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vDepth = clamp((-mv.z - 12.0) / 34.0, 0.0, 1.0);
          vSeed = aSeed;
          gl_PointSize = uSize * (26.0 / -mv.z) * (0.55 + aSeed * 0.75);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTex;
        uniform vec3 uNear;
        uniform vec3 uFar;
        uniform float uTime;
        varying float vDepth;
        varying float vSeed;

        void main() {
          vec4 t = texture2D(uTex, gl_PointCoord);
          if (t.a < 0.03) discard;
          vec3 col = mix(uNear, uFar, vDepth);
          // slow twinkle
          float tw = 0.75 + 0.25 * sin(uTime * 1.6 + vSeed * 45.0);
          gl_FragColor = vec4(col, t.a * (1.0 - vDepth * 0.35) * tw);
        }
      `,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

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

    let px = 0;
    let py = 0;
    const onMove = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      rootMargin: "60px",
    });
    io.observe(el);

    /* ── morph scheduler ──────────────────────────────────────── */
    const HOLD = 2.1; // seconds resting in a form
    const MORPH = 2.6; // seconds travelling to the next
    let stage = 1; // index of the form currently being travelled to
    let phase = 0; // seconds within hold+morph

    let raf = 0;
    // plain timer: THREE.Clock is deprecated in this three version
    const t0 = performance.now();
    const now = () => (performance.now() - t0) / 1000;
    let prev = now();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const t = now();
      const dt = Math.min(t - prev, 0.05);
      prev = t;
      mat.uniforms.uTime.value = t;

      if (!reduce) {
        phase += dt;
        if (phase < HOLD) {
          mat.uniforms.uMix.value = 0;
        } else if (phase < HOLD + MORPH) {
          mat.uniforms.uMix.value = (phase - HOLD) / MORPH;
        } else {
          // land on the target, then queue the next form
          const cur = geo.getAttribute("position") as THREE.BufferAttribute;
          const nxt = geo.getAttribute("aTarget") as THREE.BufferAttribute;
          (cur.array as Float32Array).set(nxt.array as Float32Array);
          stage = (stage + 1) % shapes.length;
          (nxt.array as Float32Array).set(shapes[stage]);
          cur.needsUpdate = true;
          nxt.needsUpdate = true;
          mat.uniforms.uMix.value = 0;
          phase = 0;
        }

        points.rotation.y += dt * 0.075;
      }

      points.rotation.x += (py * 0.22 - points.rotation.x) * 0.03;
      camera.position.x += (px * 3.2 - camera.position.x) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      sprite.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} className={className} aria-hidden="true" />;
}
