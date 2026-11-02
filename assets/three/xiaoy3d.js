/* 3D 小Y：「我的」页上的搪胶玩具版小Y（水晶眼睛、竖长方身体、细长手脚）
   用法：const yy = mountXiaoY3D(容器元素)；yy.setEye("#E8434F") 换眼睛颜色，yy.hop() 跳一下，yy.start() / yy.stop() 开关动画。
   依赖同目录的 three.min.js（r128）、OrbitControls.js、BufferGeometryUtils.js。 */
(function () {
  window.mountXiaoY3D = function (host) {
    const V = (x, y, z) => new THREE.Vector3(x, y, z || 0);
    const C = { pink: 0xFFB8D0, navy: 0x1D2A6B, gold: 0xFFC61A, blush: 0xFF7FAE, mouth: 0xFF6F8E, throat: 0xB23A62, socket: 0xF08FB4 };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 4 / 5, 0.1, 100);
    camera.position.set(4.6, 4.2, 13.2);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2.6, 0);
    controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false;
    controls.minPolarAngle = Math.PI * 0.25; controls.maxPolarAngle = Math.PI * 0.56;
    controls.autoRotate = !reduce; controls.autoRotateSpeed = 1.1;

    // 一圈柔光灯板，给搪胶光泽和水晶眼睛反光
    const pmrem = new THREE.PMREMGenerator(renderer), envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ color: 0x2B3F8C, side: THREE.BackSide })));
    [[0, 12, 6, 0xffffff, 14, 4], [-10, 4, 8, 0xffffff, 6, 8], [10, 6, -4, 0xffd3e2, 8, 6], [0, -8, 8, 0xffc61a, 10, 3]].forEach((l) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(l[4], l[5]), new THREE.MeshBasicMaterial({ color: l[3], side: THREE.DoubleSide }));
      m.position.set(l[0], l[1], l[2]); m.lookAt(0, 0, 0); envScene.add(m);
    });
    scene.environment = pmrem.fromScene(envScene, 0.02).texture;

    scene.add(new THREE.HemisphereLight(0xffffff, 0xffc2d6, 0.42));
    const key = new THREE.DirectionalLight(0xfff3ee, 0.6);
    key.position.set(4, 9, 8); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 5;
    Object.assign(key.shadow.camera, { left: -4, right: 4, top: 7, bottom: -2, near: 1, far: 30 });
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xa9c0ff, 0.3); rim.position.set(-7, 6, -6); scene.add(rim);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(3, 48), new THREE.ShadowMaterial({ opacity: 0.18 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

    // ---------- 材质 ----------
    function makeMat(color, o) {
      o = o || {};
      if (o.crystal) return new THREE.MeshPhysicalMaterial({
        color, roughness: 0.03, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.02, reflectivity: 1,
        transparent: true, opacity: 0.4, flatShading: true, envMapIntensity: 1.6, emissive: color, emissiveIntensity: 0.08, depthWrite: false
      });
      return new THREE.MeshPhysicalMaterial({
        color, roughness: o.gloss ? 0.18 : 0.5, clearcoat: o.gloss ? 1 : 0.55, clearcoatRoughness: 0.25, metalness: 0, envMapIntensity: o.glow ? 1 : 0.3,
        emissive: o.glow ? color : 0x000000, emissiveIntensity: o.glow ? 0.35 : 1
      });
    }
    function smooth(g) {
      let s = g.clone();
      s.deleteAttribute("normal");
      if (s.attributes.uv) s.deleteAttribute("uv");
      s = THREE.BufferGeometryUtils.mergeVertices(s, 1e-4);
      s.computeVertexNormals();
      return s;
    }
    function part(geo, color, opt) {
      opt = opt || {};
      const m = new THREE.Mesh(opt.raw ? geo : smooth(geo), makeMat(color, opt));
      m.castShadow = opt.cast !== false; m.receiveShadow = true;
      return m;
    }
    const flat = (geo, color) => new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color }));
    const ball = (r, color, opt) => part(new THREE.SphereGeometry(r, 32, 22), color, opt);
    const tube = (pts, r, seg) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg || 32, r, 14, false);
    function rrect(w, h, r) {
      const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
      return s;
    }
    // 软软的圆角长方块：上面略宽，中间收一点腰，肚子微微鼓
    function pillow(w, h, d, r) {
      const g = new THREE.BoxGeometry(1, 1, 1, 28, 28, 20), p = g.attributes.position, v = new THREE.Vector3(), c = new THREE.Vector3();
      const ix = w / 2 - r, iy = h / 2 - r, iz = d / 2 - r;
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).multiply(V(w, h, d));
        c.set(Math.max(-ix, Math.min(ix, v.x)), Math.max(-iy, Math.min(iy, v.y)), Math.max(-iz, Math.min(iz, v.z)));
        v.sub(c).normalize().multiplyScalar(r).add(c);
        const up = (v.y + h / 2) / h;
        v.x *= (0.9 + 0.12 * up) * (1 - 0.07 * Math.sin(Math.PI * up));
        if (v.z > 0) v.z *= 1 + 0.08 * Math.cos(Math.PI * (up - 0.45));
        p.setXYZ(i, v.x, v.y, v.z);
      }
      return g;
    }

    // ---------- 小Y ----------
    const yy = new THREE.Group(); scene.add(yy);
    const torso = new THREE.Group(); torso.position.y = 1.0; yy.add(torso);
    const BW = 2.7, BH = 3.7, BD = 1.7, BR = 0.55;
    const body = part(pillow(BW, BH, BD, BR), C.pink); body.position.y = BH / 2; torso.add(body);
    const FZ = BD / 2 + 0.06;

    // 头顶一圈带小圆珠的黄毛
    [[-0.95, 0.3, -0.14, 0.34], [-0.62, 0.42, 0.08, 0.44], [-0.3, 0.34, -0.1, 0.38], [0.02, 0.4, 0.12, 0.34],
     [-0.8, -0.32, 0.1, 0.3], [-0.38, -0.36, -0.08, 0.36], [0.22, -0.3, 0.12, 0.3], [0.92, 0.25, -0.12, 0.3]].forEach((h) => {
      const b = V(h[0], BH - 0.06, h[1]);
      torso.add(part(tube([b, b.clone().add(V(h[2] * 0.3, h[3] * 0.55, 0)), b.clone().add(V(h[2], h[3], 0))], 0.045, 12), C.gold, { gloss: true }));
      const tip = ball(0.075, C.gold, { gloss: true }); tip.position.copy(b).add(V(h[2], h[3], 0)); torso.add(tip);
    });

    // 天线
    const ant = new THREE.Group(); ant.position.set(0.55, BH - 0.06, 0); torso.add(ant);
    ant.add(part(tube([V(0, -0.1), V(-0.02, 0.34), V(0.12, 0.56), V(0.36, 0.64)], 0.07), C.navy));
    const bob = ball(0.28, C.gold, { gloss: true }); bob.position.set(0.56, 0.7, 0); ant.add(bob);

    // 脸
    const face = new THREE.Group(); face.position.set(0, BH - 1.75, 0); torso.add(face);
    const socket = part(new THREE.ExtrudeGeometry(rrect(1.86, 1.34, 0.42), { depth: 0.01, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.04, bevelSegments: 4, curveSegments: 18 }), C.socket, { cast: false, raw: true });
    socket.position.set(0, 0.32, FZ - 0.035); face.add(socket);
    const eyes = new THREE.Group(); eyes.position.set(0, 0.32, FZ); face.add(eyes);

    // 水晶眼睛：发光的底 + 封在里面的波浪纹 + 带切面的透明水晶 + 一闪一闪的星光
    const cores = [], gems = [], waves = [], sparks = [];
    const starShape = new THREE.Shape();
    starShape.moveTo(0, 1); starShape.quadraticCurveTo(0, 0, 1, 0); starShape.quadraticCurveTo(0, 0, 0, -1);
    starShape.quadraticCurveTo(0, 0, -1, 0); starShape.quadraticCurveTo(0, 0, 0, 1);
    const starGeo = new THREE.ShapeGeometry(starShape, 8);
    [-0.5, 0.5].forEach((x) => {
      const e = new THREE.Group(); e.position.x = x; e.rotation.y = x * 0.18; eyes.add(e);
      e.add(part(new THREE.ExtrudeGeometry(rrect(0.84, 1.1, 0.4), { depth: 0.03, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 4, curveSegments: 18 }), C.navy, { cast: false }));
      const core = part(new THREE.ExtrudeGeometry(rrect(0.66, 0.92, 0.32), { depth: 0.03, bevelEnabled: false, curveSegments: 18 }), 0xB9363F, { cast: false, gloss: true, glow: true, raw: true });
      core.position.z = 0.05; e.add(core); cores.push(core);
      [0.2, 0, -0.2].forEach((y) => {
        const pts = [];
        for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push(V(-0.2 + 0.4 * u, y + 0.03 * Math.sin(u * Math.PI * 4), 0.1)); }
        const w = part(tube(pts, 0.022, 48), 0x74212A, { cast: false, raw: true }); e.add(w); waves.push(w);
      });
      const gem = part(new THREE.ExtrudeGeometry(rrect(0.62, 0.88, 0.3), { depth: 0.02, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.03, bevelSegments: 2, curveSegments: 5 }), 0xE8434F, { cast: false, crystal: true, raw: true });
      gem.position.z = 0.09; gem.renderOrder = 2; e.add(gem); gems.push(gem);
      [[0.13, 0.24, 0.13], [-0.15, -0.27, 0.065]].forEach((s, i) => {
        const g = new THREE.Mesh(starGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false }));
        g.position.set(s[0], s[1], 0.3); g.scale.setScalar(s[2]); g.renderOrder = 3; g.userData.s = s[2]; g.userData.ph = x * 3 + i * 1.7;
        e.add(g); sparks.push(g);
      });
      const dot = flat(new THREE.CircleGeometry(0.035, 16), 0xffffff); dot.position.set(0.22, 0.04, 0.3); dot.renderOrder = 3; e.add(dot);
    });
    const nose = ball(0.09, C.blush, { cast: false }); nose.position.set(0, -0.36, FZ + 0.02); face.add(nose);
    const mouth = new THREE.Group(); mouth.position.set(0, -0.68, FZ - 0.01); mouth.scale.set(0.85, 1.7, 1); face.add(mouth);
    mouth.add(part(new THREE.TorusGeometry(0.13, 0.045, 14, 40), C.navy, { cast: false, raw: true }));
    const inner = part(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 40), C.mouth, { cast: false, raw: true }); inner.rotation.x = Math.PI / 2; mouth.add(inner);
    const throat = part(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 30), C.throat, { cast: false, raw: true });
    throat.rotation.x = Math.PI / 2; throat.position.set(0, -0.03, 0.03); mouth.add(throat);
    [-1, 1].forEach((s) => {
      const b = ball(0.3, C.blush, { cast: false }); b.position.set(0.7 * s, -0.42, FZ - 0.01); b.scale.set(1.0, 0.75, 0.25); b.rotation.y = s * 0.3; face.add(b);
    });

    // 细长手臂 + 五根带圆头的长手指
    function arm(s) {
      const g = new THREE.Group(); g.position.set(1.22 * s, 1.3, 0.2); torso.add(g);
      g.add(part(tube([V(-0.1 * s, 0, 0), V(0.42 * s, -0.16, 0.05), V(0.86 * s, -0.04, 0.12)], 0.11, 20), C.pink));
      const palm = V(0.95 * s, 0.0, 0.14);
      const hand = ball(0.17, C.pink); hand.position.copy(palm); g.add(hand);
      [[-0.95, 0.32], [-0.45, 0.44], [0, 0.5], [0.45, 0.46], [0.9, 0.38]].forEach((f) => {
        const ang = f[0] + 0.45, dir = V(Math.sin(ang) * s, Math.cos(ang), 0.05);
        const a = palm.clone().addScaledVector(dir, 0.1), b = palm.clone().addScaledVector(dir, f[1]);
        g.add(part(tube([a, a.clone().lerp(b, 0.5), b], 0.05, 12), C.pink));
        const tip = ball(0.078, C.pink); tip.position.copy(b); g.add(tip);
      });
      const dot = ball(0.055, C.gold, { cast: false }); dot.position.set(palm.x, palm.y, palm.z + 0.18); g.add(dot);
      return g;
    }
    const armL = arm(-1), armR = arm(1);

    // 扎马步的腿
    [-1, 1].forEach((s) => {
      const hip = V(0.52 * s, 1.15, 0.05), knee = V(1.05 * s, 0.66, 0.28), ankle = V(0.84 * s, 0.18, 0.12);
      yy.add(part(tube([hip, hip.clone().lerp(knee, 0.5).add(V(0.06 * s, 0.04, 0)), knee], 0.27, 16), C.pink));
      const k = ball(0.25, C.pink); k.position.copy(knee); yy.add(k);
      yy.add(part(tube([knee, knee.clone().lerp(ankle, 0.5), ankle], 0.17, 16), C.pink));
      const foot = ball(0.3, C.pink); foot.position.set(0.98 * s, 0.1, 0.3); foot.scale.set(1.4, 0.38, 0.95); foot.rotation.y = -0.5 * s; yy.add(foot);
    });

    // ---------- 交互 ----------
    const clock = new THREE.Clock();
    let pop = -10, hopAt = -10, raf = 0;
    function paint(list, col, emissive) {
      list.forEach((m) => { m.material.color.copy(col); if (emissive) m.material.emissive.copy(col); });
    }
    function setEye(hex) {
      const c = new THREE.Color(hex);
      paint(cores, c.clone().multiplyScalar(0.85), true);
      paint(gems, c, true);
      paint(waves, c.clone().multiplyScalar(0.5));
      pop = clock.getElapsedTime();
    }
    function hop() { hopAt = clock.getElapsedTime(); }

    const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
    let down = null;
    renderer.domElement.addEventListener("pointerdown", (e) => { down = [e.clientX, e.clientY]; });
    renderer.domElement.addEventListener("pointerup", (e) => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
      const r = renderer.domElement.getBoundingClientRect();
      ptr.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
      ray.setFromCamera(ptr, camera);
      if (ray.intersectObject(yy, true).length) { hop(); host.dispatchEvent(new CustomEvent("yytap")); }
    });

    function fit() {
      const r = host.getBoundingClientRect();
      if (!r.width) return;
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
    }
    new ResizeObserver(fit).observe(host); fit();

    function frame() {
      const t = clock.getElapsedTime(), a = reduce ? 0 : 1;
      const breath = Math.sin(t * 2.2);
      const hp = Math.min(1, (t - hopAt) / 0.7), jump = hp < 1 ? Math.sin(hp * Math.PI) : 0;
      const squash = hp < 1 && hp > 0.85 ? Math.sin((hp - 0.85) / 0.15 * Math.PI) : 0;
      yy.position.y = 0.04 * a * Math.max(0, breath) + 0.9 * jump;
      torso.scale.set(1 - 0.01 * a * breath + 0.08 * squash, 1 + 0.015 * a * breath - 0.1 * squash + 0.06 * jump, 1);
      torso.rotation.z = a * 0.035 * Math.sin(t * 1.1);
      ant.rotation.z = a * 0.12 * Math.sin(t * 1.8) + 0.3 * jump;
      armL.rotation.z = a * 0.08 * Math.sin(t * 1.6) - 0.7 * jump;
      armR.rotation.z = 0.55 + a * 0.22 * Math.sin(t * 3.2) + 0.5 * jump;
      const ph = t % 3.8, blink = a && ph > 3.6 ? Math.sin((ph - 3.6) / 0.2 * Math.PI) : 0;
      const p = Math.min(1, (t - pop) / 0.45), boing = p < 1 ? 1 + 0.25 * Math.sin(p * Math.PI) * (1 - p) : 1;
      eyes.scale.set(boing, (1 - 0.9 * blink) * boing, 1);
      sparks.forEach((s) => { s.scale.setScalar(s.userData.s * (1 + a * 0.3 * Math.sin(t * 2.6 + s.userData.ph))); s.rotation.z = a * 0.4 * Math.sin(t * 0.9 + s.userData.ph); });
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf) { fit(); raf = requestAnimationFrame(frame); } }
    function stop() { cancelAnimationFrame(raf); raf = 0; }
    start();
    return { setEye, hop, start, stop };
  };
})();
