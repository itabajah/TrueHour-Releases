import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export function initHeroScene() {
  const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement;
  if (!canvas) return;

  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ── Theme detection ──
  function isDark() {
    return document.documentElement.classList.contains("dark");
  }

  // ── Scene ──
  const scene = new THREE.Scene();
  const fogColor = isDark() ? 0x0a0e17 : 0xf0f2f5;
  scene.fog = new THREE.FogExp2(fogColor, isDark() ? 0.035 : 0.025);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(0, 0, 30);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(isDark() ? 0x0a0e17 : 0xf0f2f5, 1);

  // ── Node network: particles as data nodes, lines as connections ──
  const NODE_COUNT = isMobile ? 120 : 300;
  const FIELD_SIZE = 50;
  const CONNECTION_DIST = isMobile ? 6 : 5;
  const MAX_CONNECTIONS = isMobile ? 200 : 600;

  // Node positions & velocities
  const nodePositions = new Float32Array(NODE_COUNT * 3);
  const nodeVelocities = new Float32Array(NODE_COUNT * 3);
  const nodePulsePhase = new Float32Array(NODE_COUNT);

  for (let i = 0; i < NODE_COUNT; i++) {
    nodePositions[i * 3] = (Math.random() - 0.5) * FIELD_SIZE;
    nodePositions[i * 3 + 1] = (Math.random() - 0.5) * FIELD_SIZE;
    nodePositions[i * 3 + 2] = (Math.random() - 0.5) * FIELD_SIZE * 0.6;
    nodeVelocities[i * 3] = (Math.random() - 0.5) * 0.01;
    nodeVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
    nodeVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    nodePulsePhase[i] = Math.random() * Math.PI * 2;
  }

  // ── Node Points ──
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));

  // Custom sizes per node
  const nodeSizes = new Float32Array(NODE_COUNT);
  for (let i = 0; i < NODE_COUNT; i++) {
    nodeSizes[i] = 1.5 + Math.random() * 2.5;
  }
  nodeGeo.setAttribute("size", new THREE.BufferAttribute(nodeSizes, 1));

  // Custom shader for glowing dots with varying sizes
  const nodeShaderMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(0x3b82f6) },
      uColor2: { value: new THREE.Color(0xe94560) },
      uDarkMode: { value: isDark() ? 1.0 : 0.0 },
    },
    vertexShader: `
      attribute float size;
      varying float vDist;
      varying float vSize;
      void main() {
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (200.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
        vDist = length(position.xy) / 25.0;
        vSize = size;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform float uTime;
      uniform float uDarkMode;
      varying float vDist;
      varying float vSize;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        if (d > 1.0) discard;

        vec3 color = mix(uColor1, uColor2, vDist + sin(uTime + vDist * 6.0) * 0.2);

        // Dark mode: soft additive glow
        float glowDark = exp(-d * d * 3.0) * (0.5 + vSize * 0.12);

        // Light mode: solid circle with soft edge
        float edge = 1.0 - smoothstep(0.6, 1.0, d);
        float glowLight = edge * (0.6 + vSize * 0.1);

        float alpha = mix(glowLight, glowDark, uDarkMode);
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const nodePoints = new THREE.Points(nodeGeo, nodeShaderMat);
  scene.add(nodePoints);

  // ── Connection Lines ──
  const linePositions = new Float32Array(MAX_CONNECTIONS * 2 * 3);
  const lineColors = new Float32Array(MAX_CONNECTIONS * 2 * 4);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 4));

  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  // ── Distant star field (background depth) ──
  const starCount = isMobile ? 300 : 800;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 150;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 150;
    starPositions[i * 3 + 2] = -30 - Math.random() * 70;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0x4a6fa5,
    size: 0.3,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // ── A few brighter "pulse" nodes scattered in the network ──
  const pulseNodeCount = isMobile ? 5 : 12;
  const pulseNodes: THREE.Mesh[] = [];
  const pulseGeo = new THREE.SphereGeometry(0.12, 8, 8);
  for (let i = 0; i < pulseNodeCount; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.5 ? 0xe94560 : 0x3b82f6,
      transparent: true,
      opacity: 0.8,
    });
    const mesh = new THREE.Mesh(pulseGeo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * FIELD_SIZE * 0.7,
      (Math.random() - 0.5) * FIELD_SIZE * 0.7,
      (Math.random() - 0.5) * FIELD_SIZE * 0.3
    );
    mesh.userData.phase = Math.random() * Math.PI * 2;
    scene.add(mesh);
    pulseNodes.push(mesh);
  }

  // ── Post-processing (bloom, dark mode only) ──
  let composer: EffectComposer | null = null;
  let bloomPass: UnrealBloomPass | null = null;
  if (!isMobile) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      isDark() ? 0.8 : 0.0,  // strength: off in light mode
      1.0,  // radius
      0.2   // threshold
    );
    composer.addPass(bloomPass);
  }

  // ── Mouse interaction ──
  const mouse = { x: 0, y: 0 };
  const smoothMouse = { x: 0, y: 0 };
  // Mouse world position for repulsion
  const mouseWorld = new THREE.Vector3();
  const MOUSE_RADIUS = 8; // repulsion radius
  const MOUSE_FORCE = 0.15;

  const onMouseMove = (e: MouseEvent) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener("mousemove", onMouseMove, { passive: true });

  // ── Resize ──
  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer?.setSize(w, h);
  };
  window.addEventListener("resize", onResize);

  // ── Visibility-based pause ──
  let isVisible = true;
  const visObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
    },
    { threshold: 0.1 }
  );
  visObserver.observe(canvas);

  // ── Theme change observer ──
  function applyThemeToScene() {
    const dark = isDark();
    // Background
    const fogCol = dark ? 0x0a0e17 : 0xf0f2f5;
    (scene.fog as THREE.FogExp2).color.setHex(fogCol);
    (scene.fog as THREE.FogExp2).density = dark ? 0.035 : 0.02;
    renderer.setClearColor(fogCol, 1);

    // Particles: vibrant on dark, deeper on light
    nodeShaderMat.uniforms.uColor1.value.setHex(dark ? 0x3b82f6 : 0x1a5276);
    nodeShaderMat.uniforms.uColor2.value.setHex(dark ? 0xe94560 : 0xc0392b);
    nodeShaderMat.uniforms.uDarkMode.value = dark ? 1.0 : 0.0;
    nodeShaderMat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    nodeShaderMat.needsUpdate = true;

    // Lines
    lineMat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    lineMat.needsUpdate = true;

    // Stars
    starMat.opacity = dark ? 0.4 : 0.08;
    starMat.color.setHex(dark ? 0x4a6fa5 : 0x1a5276);
    starMat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    starMat.needsUpdate = true;

    // Bloom: off in light mode
    if (bloomPass) bloomPass.strength = dark ? 0.8 : 0.0;

    // Pulse nodes
    for (const pn of pulseNodes) {
      const mat = pn.material as THREE.MeshBasicMaterial;
      mat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
      mat.opacity = dark ? 0.8 : 0.6;
      mat.needsUpdate = true;
    }

    // Hero overlays
    const overlayTop = document.getElementById('hero-overlay-top');
    const overlayBottom = document.getElementById('hero-overlay-bottom');
    if (overlayTop) {
      overlayTop.style.background = dark
        ? 'linear-gradient(to bottom, rgba(10,14,23,0.4), transparent, rgba(10,14,23,1))'
        : 'linear-gradient(to bottom, rgba(240,242,245,0.3), transparent, rgba(240,242,245,0.8))';
    }
    if (overlayBottom) {
      overlayBottom.style.background = dark
        ? 'linear-gradient(to top, #0a0e17, transparent)'
        : 'linear-gradient(to top, #f0f2f5, transparent)';
    }
  }
  applyThemeToScene();

  const themeObserver = new MutationObserver(() => applyThemeToScene());
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  // ── Spatial grid for O(n) connection lookups ──
  const CELL_SIZE = CONNECTION_DIST;
  const GRID_DIM = Math.ceil(FIELD_SIZE / CELL_SIZE) + 1;
  const grid = new Map<number, number[]>();

  function getCellKey(x: number, y: number, z: number): number {
    const cx = ((x + FIELD_SIZE / 2) / CELL_SIZE) | 0;
    const cy = ((y + FIELD_SIZE / 2) / CELL_SIZE) | 0;
    const cz = ((z + FIELD_SIZE * 0.3) / CELL_SIZE) | 0;
    return cx + cy * GRID_DIM + cz * GRID_DIM * GRID_DIM;
  }

  // ── Animation ──
  let animId: number;
  const clock = new THREE.Clock();
  const halfField = FIELD_SIZE / 2;
  const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
  const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
  const TWO_PI = Math.PI * 2;

  // Reduced-motion: render once and stop
  if (prefersReducedMotion) {
    if (composer) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
    // Re-render only on theme change
    const reducedMotionThemeObs = new MutationObserver(() => {
      applyThemeToScene();
      if (composer) { composer.render(); } else { renderer.render(scene, camera); }
    });
    reducedMotionThemeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const cleanup = () => {
      reducedMotionThemeObs.disconnect();
      themeObserver.disconnect();
      visObserver.disconnect();
      nodeGeo.dispose(); nodeShaderMat.dispose();
      lineGeo.dispose(); lineMat.dispose();
      starGeo.dispose(); starMat.dispose();
      pulseGeo.dispose();
      pulseNodes.forEach((pn) => (pn.material as THREE.MeshBasicMaterial).dispose());
      renderer.dispose(); composer?.dispose();
    };
    window.addEventListener("pagehide", cleanup);
    return cleanup;
  }

  const animate = () => {
    animId = requestAnimationFrame(animate);
    if (!isVisible) return;

    const elapsed = clock.getElapsedTime();

    // Smooth mouse lerp
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.03;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.03;

    // Camera follows mouse subtly
    camera.position.x = smoothMouse.x * 4;
    camera.position.y = -smoothMouse.y * 3;
    camera.lookAt(0, 0, 0);

    // Compute mouse world position for particle repulsion
    mouseWorld.set(smoothMouse.x * 20, -smoothMouse.y * 15, 0);

    // Move nodes
    const pos = nodeGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3;
      // Drift + gentle wave
      pos[i3] += nodeVelocities[i3] + Math.sin(elapsed * 0.3 + nodePulsePhase[i]) * 0.003;
      pos[i3 + 1] += nodeVelocities[i3 + 1] + Math.cos(elapsed * 0.2 + nodePulsePhase[i]) * 0.003;
      pos[i3 + 2] += nodeVelocities[i3 + 2];

      // Mouse repulsion: squared-distance early exit avoids sqrt when far away
      const dx = pos[i3] - mouseWorld.x;
      const dy = pos[i3 + 1] - mouseWorld.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < MOUSE_RADIUS_SQ && distSq > 0.01) {
        const distToMouse = Math.sqrt(distSq);
        const force = (1 - distToMouse / MOUSE_RADIUS) * MOUSE_FORCE;
        pos[i3] += (dx / distToMouse) * force;
        pos[i3 + 1] += (dy / distToMouse) * force;
      }

      // Wrap around field boundaries
      if (pos[i3] > halfField) pos[i3] = -halfField;
      if (pos[i3] < -halfField) pos[i3] = halfField;
      if (pos[i3 + 1] > halfField) pos[i3 + 1] = -halfField;
      if (pos[i3 + 1] < -halfField) pos[i3 + 1] = halfField;
      const halfZ = halfField * 0.3;
      if (pos[i3 + 2] > halfZ) pos[i3 + 2] = -halfZ;
      if (pos[i3 + 2] < -halfZ) pos[i3 + 2] = halfZ;
    }
    nodeGeo.attributes.position.needsUpdate = true;

    // Build spatial grid for connection lookups
    grid.clear();
    for (let i = 0; i < NODE_COUNT; i++) {
      const key = getCellKey(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      let cell = grid.get(key);
      if (!cell) { cell = []; grid.set(key, cell); }
      cell.push(i);
    }

    // Update connections: check only neighboring cells
    let lineIdx = 0;
    const lp = lineGeo.attributes.position.array as Float32Array;
    const lc = lineGeo.attributes.color.array as Float32Array;
    const dark = isDark();
    const checked = new Set<number>();

    for (let i = 0; i < NODE_COUNT && lineIdx < MAX_CONNECTIONS; i++) {
      const ix = pos[i * 3], iy = pos[i * 3 + 1], iz = pos[i * 3 + 2];
      const cx = ((ix + halfField) / CELL_SIZE) | 0;
      const cy = ((iy + halfField) / CELL_SIZE) | 0;
      const cz = ((iz + FIELD_SIZE * 0.3) / CELL_SIZE) | 0;

      // Check 3x3x3 neighborhood
      for (let ox = -1; ox <= 1 && lineIdx < MAX_CONNECTIONS; ox++) {
        for (let oy = -1; oy <= 1 && lineIdx < MAX_CONNECTIONS; oy++) {
          for (let oz = -1; oz <= 1 && lineIdx < MAX_CONNECTIONS; oz++) {
            const nkey = (cx + ox) + (cy + oy) * GRID_DIM + (cz + oz) * GRID_DIM * GRID_DIM;
            const cell = grid.get(nkey);
            if (!cell) continue;

            for (const j of cell) {
              if (j <= i) continue;
              // Deduplicate via canonical pair key
              const pairKey = i * NODE_COUNT + j;
              if (checked.has(pairKey)) continue;
              checked.add(pairKey);

              const ddx = ix - pos[j * 3];
              const ddy = iy - pos[j * 3 + 1];
              const ddz = iz - pos[j * 3 + 2];
              const distSq = ddx * ddx + ddy * ddy + ddz * ddz;

              if (distSq < CONNECTION_DIST_SQ) {
                const dist = Math.sqrt(distSq);
                const alpha = (1 - dist / CONNECTION_DIST) * (dark ? 0.25 : 0.35);
                const li = lineIdx * 6;
                lp[li] = ix;
                lp[li + 1] = iy;
                lp[li + 2] = iz;
                lp[li + 3] = pos[j * 3];
                lp[li + 4] = pos[j * 3 + 1];
                lp[li + 5] = pos[j * 3 + 2];

                const ci = lineIdx * 8;
                const centerDist = Math.sqrt(ix * ix + iy * iy) / halfField;
                let r: number, g: number, b: number;
                if (dark) {
                  r = 0.23 + centerDist * 0.68;
                  g = 0.51 - centerDist * 0.24;
                  b = 0.96 - centerDist * 0.6;
                } else {
                  r = 0.10 + centerDist * 0.55;
                  g = 0.32 - centerDist * 0.10;
                  b = 0.46 - centerDist * 0.20;
                }
                lc[ci] = r; lc[ci + 1] = g; lc[ci + 2] = b; lc[ci + 3] = alpha;
                lc[ci + 4] = r; lc[ci + 5] = g; lc[ci + 6] = b; lc[ci + 7] = alpha;

                lineIdx++;
              }
            }
          }
        }
      }
    }

    // Zero out unused line vertices
    for (let i = lineIdx * 6; i < MAX_CONNECTIONS * 6; i++) {
      lp[i] = 0;
    }
    for (let i = lineIdx * 8; i < MAX_CONNECTIONS * 8; i++) {
      lc[i] = 0;
    }

    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;
    lineGeo.setDrawRange(0, lineIdx * 2);

    // Pulse bright nodes
    for (const pn of pulseNodes) {
      const s = 0.5 + Math.sin(elapsed * 2 + pn.userData.phase) * 0.5;
      pn.scale.setScalar(0.8 + s * 1.5);
      (pn.material as THREE.MeshBasicMaterial).opacity = 0.3 + s * 0.7;
    }

    // Subtle star parallax (bounded to avoid precision loss)
    stars.rotation.y = (elapsed * 0.003) % TWO_PI;
    stars.rotation.x = (elapsed * 0.001) % TWO_PI;

    // Shader time uniform
    nodeShaderMat.uniforms.uTime.value = elapsed;

    if (composer) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  };

  animate();

  // ── Cleanup ──
  const cleanup = () => {
    cancelAnimationFrame(animId);
    visObserver.disconnect();
    themeObserver.disconnect();
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pagehide", cleanup);
    nodeGeo.dispose();
    nodeShaderMat.dispose();
    lineGeo.dispose();
    lineMat.dispose();
    starGeo.dispose();
    starMat.dispose();
    pulseGeo.dispose();
    pulseNodes.forEach((pn) => (pn.material as THREE.MeshBasicMaterial).dispose());
    renderer.dispose();
    composer?.dispose();
  };

  window.addEventListener("pagehide", cleanup);
  return cleanup;
}
