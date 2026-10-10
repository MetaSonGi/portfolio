/* ============================================================
   LEGO 월드 포트폴리오 — Three.js 미니 디오라마 게임
   - WASD/방향키 또는 클릭으로 미니피겨 이동
   - 구역에 들어가면 설명 패널 표시
   - 상단 메뉴 → 캐릭터가 해당 구역으로 걸어감
============================================================ */
(function () {
  const loadingEl = document.getElementById('loading');
  if (!window.THREE) {
    loadingEl.innerHTML = '<div class="load-box error">Three.js를 불러오지 못했습니다.<br>네트워크 연결을 확인하고 새로고침해 주세요.</div>';
    return;
  }

  /* ---------------- 데이터 ---------------- */
  const TECHS = [
    { icon: '🔷', name: 'C#', tag: 'main language', desc: '주력 언어. 스마트팩토리 솔루션과 디지털트윈 시스템의 핵심 로직, 데이터 수집·제어 모듈을 개발합니다.' },
    { icon: '🕹️', name: 'Unity', tag: 'realtime 3D engine', desc: 'AR/VR/MR 콘텐츠와 실시간 3D 디지털트윈 구축의 기반 엔진. 현장 적용형 XR 솔루션을 다수 개발했습니다.' },
    { icon: '⚙️', name: '.NET', tag: 'backend & desktop', desc: '서버·DB 연동 백엔드와 데스크톱 애플리케이션 개발. C# 생태계 전반을 다룹니다.' },
    { icon: '🤖', name: 'Python / AI', tag: 'now expanding', desc: '제조 데이터 분석, 이상 탐지, 예지정비(RUL). 현장 경험을 AI로 확장하는 중입니다.' },
    { icon: '🧊', name: 'Three.js', tag: 'web 3D', desc: '웹에서 바로 실행되는 3D 시각화. 브라우저 기반 디지털트윈과 인터랙티브 데모를 만듭니다.' },
    { icon: '🏭', name: 'Digital Twin · OPC UA', tag: 'industrial IoT', desc: '로봇·설비 데이터 연동 실시간 모니터링. OPC UA 기반 로봇 데이터 수집과 상태 확인 경험.' },
  ];
  const CHIPS = ['Python', 'Three.js', 'JavaScript', 'SQL / Database', 'Unreal Engine', 'OPC UA', 'MQTT', 'PLC 연동', '머신 비전', 'HoloLens / MR 디바이스', 'GitHub'];
  const PROJECTS = [
    { icon: '🧠', name: 'Digital Twin AI Lab', desc: '3D 디지털트윈(AI 이상탐지·RUL 예지정비), 시장 트렌드 분석, AI 챗봇·리포트 생성기를 담은 3탭 웹앱.', tags: ['Three.js', 'AI', 'Digital Twin'], demo: 'https://metasongi.github.io/digital-twin-ai-lab/', repo: 'https://github.com/MetaSonGi/digital-twin-ai-lab' },
    { icon: '🏭', name: 'Smart Factory Trainer', desc: '스마트공장 검증장비 실습 시뮬레이터. 3D 가상 장비, 5단계 실습 엔진, 실시간 대시보드와 평가·수료 판정.', tags: ['3D', 'Simulator', '교육'], demo: 'https://metasongi.github.io/smart-factory-trainer/', repo: 'https://github.com/MetaSonGi/smart-factory-trainer' },
    { icon: '📷', name: 'Camera to 3D Viewer', desc: '카메라로 촬영한 사진을 3D로 변환해 바로 확인하는 웹 뷰어.', tags: ['Web', '3D 변환', '카메라'], demo: 'https://metasongi.github.io/camera-to-3d-viewer/', repo: 'https://github.com/MetaSonGi/camera-to-3d-viewer' },
    { icon: '🖼️', name: 'Image to 3D Viewer', desc: '이미지를 업로드하면 3D 모델로 변환해 보여주는 웹 뷰어.', tags: ['Web', '3D 변환'], demo: 'https://metasongi.github.io/image-to-3d-viewer/', repo: 'https://github.com/MetaSonGi/image-to-3d-viewer' },
    { icon: '🔁', name: 'Digital Twin Mini Sim', desc: '디지털트윈 개념을 가볍게 체험하는 미니 시뮬레이션 웹앱.', tags: ['시뮬레이션', 'Web'], demo: 'https://metasongi.github.io/digital-twin-mini-sim/', repo: 'https://github.com/MetaSonGi/digital-twin-mini-sim' },
    { icon: '🎨', name: 'AI Media Art Generator', desc: 'AI로 미디어아트를 생성하는 웹앱. 생성형 AI와 비주얼 아트의 결합.', tags: ['AI', '미디어아트'], demo: 'https://metasongi.github.io/ai-media-art-generator/', repo: 'https://github.com/MetaSonGi/ai-media-art-generator' },
    { icon: '📊', name: 'Manufacturing Data Analyzer', desc: '제조 데이터를 분석·시각화하는 데이터 분석 도구.', tags: ['데이터 분석', '제조'], repo: 'https://github.com/MetaSonGi/manufacturing-data-analyzer' },
    { icon: '🤖', name: 'Dev Automation Agent', desc: 'GPT를 활용한 개발 자동화 에이전트. 반복 작업을 자동화합니다.', tags: ['자동화', 'GPT'], repo: 'https://github.com/MetaSonGi/dev-automation-agent' },
  ];
  const ABOUT = {
    lead: '현장과 코드를 잇는 개발자',
    p1: '저는 Unity 엔진을 기반으로 DB 설계, AR/VR 콘텐츠 구축 등의 다양한 프로젝트를 성공적으로 수행하며 실력을 다져온 개발자 손효기입니다. 끊임없이 새로운 기술에 도전하며 자기 개발에 힘써 왔고, 그 결과 급변하는 기술 트렌드 속에서도 항상 한 발 앞서가는 개발자로 성장할 수 있었습니다.',
    p2: '스마트팩토리 AR/VR/MR 서비스 개발·운영, 로봇 디지털트윈 현장 적용, 대학·고등학교 제조 관련 유니티 강의를 거쳐 지금은 <strong>제조 AI 기술</strong>로 방향을 확장하고 있습니다.',
    facts: [['15+', 'XR·디지털트윈<br>현장 프로젝트'], ['8', '공개 GitHub<br>프로젝트'], ['6', '웹 실행 가능<br>라이브 데모']],
    profile: [['이름', '손효기 (Hyogi Son)'], ['위치', '경기도 성남시'], ['이메일', '<a href="mailto:5264939@naver.com">5264939@naver.com</a>'], ['GitHub', '<a href="https://github.com/MetaSonGi" target="_blank" rel="noopener">github.com/MetaSonGi</a>'], ['관심 분야', '제조 AI · 디지털트윈 · XR · 자동화']],
  };
  const CAREER_GROUPS = [
    { badge: 'Digital Twin', items: ['로봇산업진흥원 디지털트윈 플랫폼 혼합현실 개발', '대구과학고등학교 스마트팩토리 디지털트윈 플랫폼 개발', '디지털트윈 MR 혼합현실 개발', 'Unreal 엔진 기반 생산 자동화 실습 모듈 개발', '스마트팩토리 VR 및 디지털트윈 콘텐츠 개발', '계명대학교 스마트팩토리 혼합현실 개발', '폴리텍대학 청주캠퍼스 디지털트윈 구현'] },
    { badge: 'AR · 증강현실', items: ['중소벤처기업연수원(안산) 스마트공장 데모라인 고도화', '삼성전자 상생협력아카데미 스마트팩토리 고도화 사업'] },
    { badge: 'VR · 가상현실', items: ['산업 디지털전환 포럼 메타버스 플랫폼 개발', '2022 스마트공장 자동화산업전 전시', '잡월드 스마트팩토리'] },
    { badge: 'MR · 혼합현실', items: ['로봇산업진흥원 디지털트윈 플랫폼 혼합현실 개발', '대구과학고등학교 스마트팩토리 디지털트윈 플랫폼 개발', '디지털트윈 MR 혼합현실 개발'] },
  ];
  const EDU = [
    ['2024', '한국기술교육대학교', '기계설비제어공학과 졸업'],
    ['2019', '국가평생교육진흥원', '컴퓨터공학과 졸업'],
    ['2014', '인덕대학교(서울)', '컴퓨터전자과 졸업'],
  ];
  const SKILLS = [['C#', 90], ['Unity', 80], ['Database', 70], ['.NET', 60]];

  const ZONES = [
    { id: 'tech', name: '기술 스택', icon: '🧱', color: 0x2f6df6, pos: [-20, -14], r: 9 },
    { id: 'about', name: '소개', icon: '😊', color: 0x35c26e, pos: [20, -14], r: 9 },
    { id: 'career', name: '경력', icon: '📜', color: 0xf59e0b, pos: [-20, 14], r: 9 },
    { id: 'projects', name: '프로젝트', icon: '🚀', color: 0xef4444, pos: [20, 14], r: 9 },
    { id: 'contact', name: '연락', icon: '✉️', color: 0x8b5cf6, pos: [0, -25], r: 9 },
  ];

  /* ---------------- 씬 기본 ---------------- */
  const canvas = document.getElementById('game');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e18);
  scene.fog = new THREE.Fog(0x0a0e18, 55, 130);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 400);

  scene.add(new THREE.AmbientLight(0x8fa3d9, 0.55));
  const moon = new THREE.DirectionalLight(0xbdd0ff, 0.7);
  moon.position.set(-30, 40, 20);
  scene.add(moon);
  const warm1 = new THREE.PointLight(0xffd9a0, 0.9, 26);
  warm1.position.set(7, 5, 7); scene.add(warm1);
  const warm2 = new THREE.PointLight(0xffd9a0, 0.9, 26);
  warm2.position.set(-7, 5, -7); scene.add(warm2);

  const lam = c => new THREE.MeshLambertMaterial({ color: c });
  const bas = c => new THREE.MeshBasicMaterial({ color: c });
  function box(w, h, d, mat) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); }
  function put(mesh, x, y, z, parent) { mesh.position.set(x, y, z); (parent || scene).add(mesh); return mesh; }

  const colliders = [];
  function addCollider(x, z, hw, hd) {
    colliders.push({ x0: x - hw, x1: x + hw, z0: z - hd, z1: z + hd });
  }

  /* ---------------- 베이스플레이트 + 스터드 ---------------- */
  const PLATE = 64;
  put(box(PLATE, 2, PLATE, lam(0x1f8a4c)), 0, -1, 0);
  put(box(PLATE + 2, 1, PLATE + 2, lam(0x146038)), 0, -2, 0);
  // 스터드 (InstancedMesh)
  {
    const geo = new THREE.CylinderGeometry(0.42, 0.42, 0.35, 12);
    const mat = lam(0x27a35a);
    const n = 24, inst = new THREE.InstancedMesh(geo, mat, n * n);
    const m4 = new THREE.Matrix4();
    let i = 0;
    for (let ix = 0; ix < n; ix++) for (let iz = 0; iz < n; iz++) {
      m4.makeTranslation(-30 + ix * (60 / (n - 1)), 0.17, -30 + iz * (60 / (n - 1)));
      inst.setMatrixAt(i++, m4);
    }
    scene.add(inst);
  }

  /* ---------------- 도로 + 중앙 광장 + 분수 ---------------- */
  const roadMat = lam(0x3a4358);
  ZONES.forEach(z => {
    const [zx, zz] = z.pos;
    const len = Math.hypot(zx, zz) - 6;
    const road = box(3.2, 0.12, len, roadMat);
    road.position.set(zx / 2 * (1 - 3 / Math.hypot(zx, zz) * 0) , 0.06, 0);
    // 방향 계산
    const ang = Math.atan2(zx, zz);
    road.position.set(Math.sin(ang) * (len / 2 + 3), 0.06, Math.cos(ang) * (len / 2 + 3));
    road.rotation.y = ang;
    scene.add(road);
  });
  put(new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 0.25, 32), lam(0x2b3350)), 0, 0.12, 0);
  // 분수
  {
    const f = new THREE.Group();
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3, 1.2, 20), lam(0x8a93a8));
    basin.position.y = 0.6; f.add(basin);
    const water = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.3, 20), new THREE.MeshBasicMaterial({ color: 0x38e1c6, transparent: true, opacity: 0.75 }));
    water.position.y = 1.25; f.add(water);
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 2.2, 12), lam(0x8a93a8));
    pillar.position.y = 1.6; f.add(pillar);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.35, 14), lam(0x8a93a8));
    top.position.y = 2.8; f.add(top);
    scene.add(f);
    addCollider(0, 0, 3.2, 3.2);
  }

  /* ---------------- 건물 ---------------- */
  const hitMeshes = [];
  function makeBuilding(zone) {
    const [zx, zz] = zone.pos;
    const grp = new THREE.Group();
    const col = new THREE.Color(zone.color);
    const dark = col.clone().multiplyScalar(0.55);
    const W = 10, D = 8, H = 7;
    const base = box(W, H, D, lam(col)); base.position.y = H / 2; grp.add(base);
    base.userData.zoneId = zone.id; hitMeshes.push(base);
    const slab = box(W + 1, 1, D + 1, lam(dark)); slab.position.y = H + 0.5; grp.add(slab);
    // 지붕 스터드
    const studGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 10);
    const studMat = lam(dark);
    for (let ix = -3; ix <= 3; ix += 2) for (let iz = -2; iz <= 2; iz += 2) {
      const s = new THREE.Mesh(studGeo, studMat); s.position.set(ix, H + 1.2, iz); grp.add(s);
    }
    // 문 (광장 쪽)
    const door = box(2.6, 3.6, 0.4, lam(0x141a2e)); door.position.set(0, 1.8, D / 2 + 0.1); grp.add(door);
    const knob = box(0.3, 0.3, 0.2, bas(0x38e1c6)); knob.position.set(0.8, 1.8, D / 2 + 0.35); grp.add(knob);
    // 창문 (불 켜진 느낌)
    const winMat = new THREE.MeshBasicMaterial({ color: 0xffd27a });
    const winMat2 = new THREE.MeshBasicMaterial({ color: 0x27304d });
    [[-3, 5.2], [0, 5.2], [3, 5.2], [-3, 2.6], [3, 2.6]].forEach(([wx, wy], idx) => {
      const w = box(1.7, 1.7, 0.25, (idx % 3 === 2) ? winMat2 : winMat);
      w.position.set(wx, wy, D / 2 + 0.08); grp.add(w);
    });
    // 남쪽 건물은 뒤집어서 문이 광장을 향하게
    if (zz > 0) grp.rotation.y = Math.PI;
    grp.position.set(zx, 0, zz);
    scene.add(grp);
    addCollider(zx, zz, W / 2 + 0.4, D / 2 + 0.4);
    // 구역 링
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(zone.r - 0.5, zone.r, 48),
      new THREE.MeshBasicMaterial({ color: zone.color, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2; ring.position.set(zx, 0.15, zz);
    scene.add(ring);
    zone.topY = H + 3;
    return grp;
  }
  ZONES.forEach(makeBuilding);

  /* ---------------- 나무 · 가로등 · 구름 · 별 ---------------- */
  function makeTree(x, z) {
    const t = new THREE.Group();
    const trunk = box(0.8, 2, 0.8, lam(0x7a5230)); trunk.position.y = 1; t.add(trunk);
    const l1 = box(2.6, 1.8, 2.6, lam(0x1f7a3d)); l1.position.y = 2.8; t.add(l1);
    const l2 = box(1.8, 1.4, 1.8, lam(0x27a35a)); l2.position.y = 4; t.add(l2);
    t.position.set(x, 0, z); scene.add(t);
    addCollider(x, z, 1, 1);
  }
  [[-28, -25], [28, -25], [-28, 25], [28, 25], [-29, 0], [29, 2], [12, 24], [-12, -26]].forEach(([x, z]) => makeTree(x, z));

  function makeLamp(x, z, withLight) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 5, 8), lam(0x3a4358));
    pole.position.set(x, 2.5, z); scene.add(pole);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffe2a8 }));
    bulb.position.set(x, 5.3, z); scene.add(bulb);
    if (withLight) { const pl = new THREE.PointLight(0xffd9a0, 0.7, 18); pl.position.set(x, 5.3, z); scene.add(pl); }
    addCollider(x, z, 0.5, 0.5);
  }
  makeLamp(7, 7, true); makeLamp(-7, -7, true); makeLamp(-7, 7, false); makeLamp(7, -7, false);

  const clouds = [];
  function makeCloud(x, y, z, s) {
    const c = new THREE.Group();
    const m = lam(0x232c47);
    [[0, 0, 0, 5], [3, -0.5, 1, 3.4], [-3, -0.4, -1, 3]].forEach(([ox, oy, oz, w]) => {
      const b = box(w, 1.8, 2.6, m); b.position.set(ox, oy, oz); c.add(b);
    });
    c.position.set(x, y, z); c.scale.setScalar(s); scene.add(c); clouds.push(c);
  }
  makeCloud(-20, 26, -30, 1.2); makeCloud(15, 30, -20, 1.5); makeCloud(25, 27, 25, 1.1); makeCloud(-25, 29, 20, 1.3);
  {
    const n = 220, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 260;
      pos[i * 3 + 1] = 35 + Math.random() * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 260;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xaFC4ff, size: 0.7 })));
  }
  // 땅 (받침 아래 어둠)
  const groundPlane = new THREE.Mesh(new THREE.PlaneGeometry(PLATE, PLATE), new THREE.MeshBasicMaterial({ visible: false }));
  groundPlane.rotation.x = -Math.PI / 2; scene.add(groundPlane);

  /* ---------------- 미니피겨 ---------------- */
  function faceTexture() {
    const c = document.createElement('canvas'); c.width = 96; c.height = 80;
    const x = c.getContext('2d');
    x.fillStyle = '#f7c500'; x.fillRect(0, 0, 96, 80);
    x.fillStyle = '#141414';
    x.beginPath(); x.roundRect(26, 26, 11, 18, 5); x.fill();
    x.beginPath(); x.roundRect(59, 26, 11, 18, 5); x.fill();
    x.strokeStyle = '#141414'; x.lineWidth = 5; x.lineCap = 'round';
    x.beginPath(); x.arc(48, 52, 14, 0.35, Math.PI - 0.35); x.stroke();
    const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; return t;
  }
  const fig = new THREE.Group();
  const YELLOW = lam(0xf7c500), BLUE = lam(0x2f6df6), DBLUE = lam(0x1e4fd1);
  function limb(x, hipY, w, h, mat) {
    const grp = new THREE.Group(); grp.position.set(x, hipY, 0);
    const m = box(w, h, w, mat); m.position.y = -h / 2; grp.add(m);
    fig.add(grp); return grp;
  }
  const legL = limb(-0.36, 1.15, 0.62, 1.15, DBLUE);
  const legR = limb(0.36, 1.15, 0.62, 1.15, DBLUE);
  const torso = box(1.7, 1.5, 0.95, BLUE); torso.position.y = 1.9; fig.add(torso);
  const chest = box(0.7, 0.5, 0.12, bas(0x38e1c6)); chest.position.set(0, 2.05, 0.52); fig.add(chest);
  const armL = limb(-1.08, 2.55, 0.44, 1.25, BLUE);
  const armR = limb(1.08, 2.55, 0.44, 1.25, BLUE);
  [armL, armR].forEach(a => { const hand = box(0.44, 0.32, 0.5, YELLOW); hand.position.y = -1.35; a.add(hand); });
  const headMats = [YELLOW, YELLOW, YELLOW, YELLOW, new THREE.MeshLambertMaterial({ map: faceTexture() }), YELLOW];
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.95, 1.05), headMats);
  head.position.y = 3.12; fig.add(head);
  fig.position.set(0, 0, 10);
  scene.add(fig);

  /* ---------------- 조작 ---------------- */
  const keys = new Set();
  const KEYMAP = { KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right' };
  window.addEventListener('keydown', e => {
    if (KEYMAP[e.code]) { keys.add(KEYMAP[e.code]); autoTarget = null; e.preventDefault(); }
    if (e.code === 'Escape') closePanel();
  });
  window.addEventListener('keyup', e => { if (KEYMAP[e.code]) keys.delete(KEYMAP[e.code]); });

  let autoTarget = null; // Vector3 | null
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downPos = null;
  canvas.addEventListener('pointerdown', e => { downPos = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', e => {
    if (!downPos) return;
    const moved = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]);
    downPos = null;
    if (moved > 8) return;
    const r = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects([...hitMeshes, groundPlane]);
    if (!hits.length) return;
    const hit = hits[0];
    const zoneId = hit.object.userData.zoneId;
    if (zoneId) {
      const z = ZONES.find(z => z.id === zoneId);
      goToZone(z.id);
      openPanel(z.id);
    } else {
      autoTarget = new THREE.Vector3(
        Math.max(-30, Math.min(30, hit.point.x)), 0,
        Math.max(-30, Math.min(30, hit.point.z))
      );
    }
  });

  function collide(p) {
    p.x = Math.max(-30.5, Math.min(30.5, p.x));
    p.z = Math.max(-30.5, Math.min(30.5, p.z));
    const R = 0.85;
    for (const c of colliders) {
      const nx = Math.max(c.x0, Math.min(c.x1, p.x));
      const nz = Math.max(c.z0, Math.min(c.z1, p.z));
      const dx = p.x - nx, dz = p.z - nz;
      const d2 = dx * dx + dz * dz;
      if (d2 < R * R) {
        if (d2 > 1e-6) { const d = Math.sqrt(d2); p.x = nx + dx / d * R; p.z = nz + dz / d * R; }
        else {
          const pl = p.x - c.x0, pr = c.x1 - p.x, pt = p.z - c.z0, pb = c.z1 - p.z;
          const m = Math.min(pl, pr, pt, pb);
          if (m === pl) p.x = c.x0 - R; else if (m === pr) p.x = c.x1 + R;
          else if (m === pt) p.z = c.z0 - R; else p.z = c.z1 + R;
        }
      }
    }
  }

  /* ---------------- 구역 라벨 ---------------- */
  const labelsEl = document.getElementById('labels');
  ZONES.forEach(z => {
    const d = document.createElement('div');
    d.className = 'zone-label';
    d.textContent = `${z.icon} ${z.name}`;
    labelsEl.appendChild(d);
    z.labelEl = d;
  });
  const projV = new THREE.Vector3();
  function updateLabels() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    ZONES.forEach(z => {
      projV.set(z.pos[0], z.topY + 2.5, z.pos[1]).project(camera);
      if (projV.z > 1) { z.labelEl.style.display = 'none'; return; }
      z.labelEl.style.display = 'block';
      z.labelEl.style.left = ((projV.x * 0.5 + 0.5) * w) + 'px';
      z.labelEl.style.top = ((-projV.y * 0.5 + 0.5) * h) + 'px';
    });
  }

  /* ---------------- 패널 ---------------- */
  const panel = document.getElementById('panel');
  const panelBody = document.getElementById('panel-body');
  let currentZone = null;

  function techHTML() {
    return `<div class="p-eyebrow">// Technologies</div><div class="p-title">🧱 기술 스택</div>
    <p class="p-sub">새로운 기술을 시도하는 것을 좋아합니다. 현장에서 검증된 기술 스택으로 프로젝트를 만듭니다.</p>
    <div class="p-tech">${TECHS.map(t => `<div class="p-tech-card"><span class="ti">${t.icon}</span><h4>${t.name}</h4><span class="tt">${t.tag}</span><p>${t.desc}</p></div>`).join('')}</div>
    <div class="p-sec-title">그 외 경험</div>
    <div class="p-chips">${CHIPS.map(c => `<span class="p-chip">${c}</span>`).join('')}</div>`;
  }
  function aboutHTML() {
    return `<div class="p-eyebrow">// About me</div><div class="p-title">😊 소개</div>
    <p class="p-sub" style="font-size:17px;font-weight:700;color:var(--accent2)">${ABOUT.lead}</p>
    <p class="p-text">${ABOUT.p1}</p><p class="p-text">${ABOUT.p2}</p>
    <div class="p-facts">${ABOUT.facts.map(([n, l]) => `<div class="p-fact"><b>${n}</b><span>${l}</span></div>`).join('')}</div>
    <div class="p-sec-title">프로필</div>
    <ul class="p-list">${ABOUT.profile.map(([k, v]) => `<li><span>${k}</span><div>${v}</div></li>`).join('')}</ul>`;
  }
  function careerHTML() {
    return `<div class="p-eyebrow">// Career</div><div class="p-title">📜 경력</div>
    <p class="p-sub">현장에서 수행한 XR · 디지털트윈 프로젝트와 학력입니다.</p>
    <div class="p-tl">${CAREER_GROUPS.map(gr => `<div class="p-tl-item"><span class="p-badge">${gr.badge}</span><ul>${gr.items.map(i => `<li>${i}</li>`).join('')}</ul></div>`).join('')}</div>
    <div class="p-sec-title">학력</div>
    ${EDU.map(([y, s, d]) => `<div class="p-edu"><b>${y}</b><div><strong>${s}</strong><p>${d}</p></div></div>`).join('')}
    <div class="p-sec-title">스킬 레벨</div>
    ${SKILLS.map(([n, v]) => `<div class="p-bar-row"><span>${n}</span><div class="p-bar"><i style="width:${v}%"></i></div><b>${v}</b></div>`).join('')}
    <div class="p-sec-title">현재 집중</div>
    <p class="p-text">제조 AI · 예지정비(RUL) · AI 미디어아트 · 개발 자동화 — 현장 경험을 AI로 확장하는 중입니다.</p>`;
  }
  function projectsHTML() {
    return `<div class="p-eyebrow">// Projects</div><div class="p-title">🚀 프로젝트</div>
    <p class="p-sub">직접 만들고 웹에서 바로 실행할 수 있는 개인 프로젝트입니다.</p>
    ${PROJECTS.map(p => `<div class="p-proj"><div class="p-proj-top"><span class="pi">${p.icon}</span>
      <div class="p-links">${p.demo ? `<a class="live" href="${p.demo}" target="_blank" rel="noopener">라이브 데모</a>` : ''}<a href="${p.repo}" target="_blank" rel="noopener">GitHub</a></div></div>
      <h4>${p.name}</h4><p>${p.desc}</p><div class="p-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div></div>`).join('')}`;
  }
  function contactHTML() {
    return `<div class="p-eyebrow">// Contact</div><div class="p-title">✉️ 연락</div>
    <p class="p-sub">프로젝트 협업, 기술 문의, 채용 제안 — 편하게 연락 주세요.</p>
    <div class="p-contact">
      <a class="p-contact-card" href="mailto:5264939@naver.com"><span class="cl">Email</span><span class="cv">5264939@naver.com</span></a>
      <a class="p-contact-card" href="https://github.com/MetaSonGi" target="_blank" rel="noopener"><span class="cl">GitHub</span><span class="cv">github.com/MetaSonGi</span></a>
      <div class="p-contact-card"><span class="cl">Location</span><span class="cv">경기도 성남시, 대한민국</span></div>
    </div>
    <p class="p-text" style="margin-top:18px">© 2026 Hyogi Son · Built with Three.js</p>`;
  }
  const RENDER = { tech: techHTML, about: aboutHTML, career: careerHTML, projects: projectsHTML, contact: contactHTML };

  function openPanel(id) {
    currentZone = id;
    panelBody.innerHTML = RENDER[id]();
    panelBody.scrollTop = 0;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.querySelectorAll('.nav-zones button').forEach(b => b.classList.toggle('active', b.dataset.zone === id));
    document.getElementById('hint').classList.add('hidden');
  }
  function closePanel() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    currentZone = null;
    document.querySelectorAll('.nav-zones button').forEach(b => b.classList.remove('active'));
  }
  document.getElementById('panel-close').addEventListener('click', closePanel);
  document.getElementById('hint-close').addEventListener('click', () => document.getElementById('hint').classList.add('hidden'));

  function goToZone(id) {
    const z = ZONES.find(z => z.id === id);
    const [zx, zz] = z.pos;
    const len = Math.hypot(zx, zz);
    autoTarget = new THREE.Vector3(zx - (zx / len) * 7.2, 0, zz - (zz / len) * 7.2);
  }
  document.querySelectorAll('.nav-zones button').forEach(b =>
    b.addEventListener('click', () => goToZone(b.dataset.zone)));

  /* ---------------- 카메라 ---------------- */
  const camOffset = new THREE.Vector3(0, 15.5, 13);
  const smoothPos = new THREE.Vector3(0, 0, 10);
  camera.position.copy(smoothPos).add(camOffset);
  camera.lookAt(0, 1.5, 10);

  /* ---------------- 리사이즈 ---------------- */
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight - 55;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  /* ---------------- 메인 루프 ---------------- */
  const clock = new THREE.Clock();
  const SPEED = 10;
  let walkPhase = 0;
  let firstFrame = true;

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // 이동 입력
    let mx = 0, mz = 0;
    if (keys.has('up')) mz -= 1;
    if (keys.has('down')) mz += 1;
    if (keys.has('left')) mx -= 1;
    if (keys.has('right')) mx += 1;
    let moving = false;
    const p = fig.position;

    if (mx !== 0 || mz !== 0) {
      const l = Math.hypot(mx, mz); mx /= l; mz /= l;
      p.x += mx * SPEED * dt; p.z += mz * SPEED * dt;
      fig.rotation.y = Math.atan2(mx, mz);
      moving = true;
    } else if (autoTarget) {
      const dx = autoTarget.x - p.x, dz = autoTarget.z - p.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.7) { autoTarget = null; }
      else {
        const step = Math.min(SPEED * dt, d);
        p.x += dx / d * step; p.z += dz / d * step;
        fig.rotation.y = Math.atan2(dx, dz);
        moving = true;
      }
    }
    collide(p);

    // 걷기 애니메이션
    if (moving) {
      walkPhase += dt * 11;
      const s = Math.sin(walkPhase);
      legL.rotation.x = s * 0.7; legR.rotation.x = -s * 0.7;
      armL.rotation.x = -s * 0.55; armR.rotation.x = s * 0.55;
      fig.position.y = Math.abs(Math.cos(walkPhase)) * 0.09;
    } else {
      legL.rotation.x *= 0.85; legR.rotation.x *= 0.85;
      armL.rotation.x *= 0.85; armR.rotation.x *= 0.85;
      fig.position.y = Math.sin(t * 2) * 0.03;
    }

    // 구역 진입 체크
    for (const z of ZONES) {
      const d = Math.hypot(p.x - z.pos[0], p.z - z.pos[1]);
      if (d < z.r && currentZone !== z.id) { openPanel(z.id); break; }
    }

    // 카메라 따라가기
    const k = 1 - Math.pow(0.002, dt);
    smoothPos.lerp(p, k);
    camera.position.set(smoothPos.x + camOffset.x, camOffset.y, smoothPos.z + camOffset.z);
    camera.lookAt(smoothPos.x, 1.6, smoothPos.z);

    // 구름 이동
    clouds.forEach((c, i) => {
      c.position.x += dt * (0.5 + i * 0.15);
      if (c.position.x > 70) c.position.x = -70;
    });

    updateLabels();
    renderer.render(scene, camera);
    if (firstFrame) { firstFrame = false; loadingEl.classList.add('done'); }
  }
  animate();
})();
