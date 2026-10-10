/* ============================================================
   LEGO 놀이동산 포트폴리오 — Three.js 어뮤즈먼트 파크
   - WASD/방향키 또는 클릭으로 미니피겨 이동
   - 5개 놀이기구 = 5개 포트폴리오 구역 (기술/소개/경력/프로젝트/연락)
   - 구역 진입 → 설명 패널 / 구역 이탈 → 패널 자동 닫힘
   - 놀이기구 탑승 가능 (타기 버튼 → 탑승 → 운행 → 내리기)
   - NPC 미니피겨들이 공원을 돌아다님
============================================================ */
(function () {
  const loadingEl = document.getElementById('loading');
  if (!window.THREE) {
    loadingEl.innerHTML = '<div class="load-box error">Three.js를 불러오지 못했습니다.<br>네트워크 연결을 확인하고 새로고침해 주세요.</div>';
    return;
  }

  /* ---------------- 데이터 (기존 포트폴리오 내용) ---------------- */
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

  /* ---------------- 구역 = 놀이기구 ---------------- */
  const ZONES = [
    { id: 'tech', name: '기술 스택', icon: '🧱', color: 0x2f6df6, pos: [-34, 24], r: 12,
      ride: { name: '자이로드롭', icon: '🗼', desc: '기술 스택이 치솟는 만큼 높이 올라갔다가 짜릿하게 낙하!', clear: 8 } },
    { id: 'about', name: '소개', icon: '😊', color: 0x35c26e, pos: [-32, -24], r: 12,
      ride: { name: '회전목마', icon: '🎠', desc: '빙글빙글 돌아가며 만나는 손효기의 이야기', clear: 10 } },
    { id: 'career', name: '경력', icon: '📜', color: 0xf59e0b, pos: [34, -26], r: 12,
      ride: { name: '관람차', icon: '🎡', desc: '높이 올라가면 보이는 커리어의 전체 풍경', clear: 11 } },
    { id: 'projects', name: '프로젝트', icon: '🚀', color: 0xef4444, pos: [36, 26], r: 12,
      ride: { name: '바이킹', icon: '🏴‍☠️', desc: '스릴 넘치는 8개 프로젝트 대항해', clear: 11 } },
    { id: 'contact', name: '연락', icon: '✉️', color: 0x8b5cf6, pos: [0, -40], r: 12,
      ride: { name: '범퍼카', icon: '🚗', desc: '부딪히듯 편하게! 연락은 여기로', clear: 14 } },
  ];

  /* ---------------- 씬 기본 ---------------- */
  const WORLD = 120, BOUND = 57;
  const canvas = document.getElementById('game');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e18);
  scene.fog = new THREE.Fog(0x0a0e18, 70, 170);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);

  scene.add(new THREE.AmbientLight(0x8fa3d9, 0.6));
  const moon = new THREE.DirectionalLight(0xbdd0ff, 0.75);
  moon.position.set(-40, 50, 25);
  scene.add(moon);

  const lam = c => new THREE.MeshLambertMaterial({ color: c });
  const bas = c => new THREE.MeshBasicMaterial({ color: c });
  function box(w, h, d, mat) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); }
  function put(mesh, x, y, z, parent) { mesh.position.set(x, y, z); (parent || scene).add(mesh); return mesh; }
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

  const colliders = [];
  function addCollider(x, z, hw, hd) { colliders.push({ x0: x - hw, x1: x + hw, z0: z - hd, z1: z + hd }); }

  /* ---------------- 베이스플레이트 + 스터드 ---------------- */
  put(box(WORLD, 2, WORLD, lam(0x1f8a4c)), 0, -1, 0);
  put(box(WORLD + 3, 1, WORLD + 3, lam(0x146038)), 0, -2, 0);
  {
    const geo = new THREE.CylinderGeometry(0.42, 0.42, 0.35, 10);
    const mat = lam(0x27a35a);
    const n = 34, inst = new THREE.InstancedMesh(geo, mat, n * n);
    const m4 = new THREE.Matrix4();
    let i = 0;
    for (let ix = 0; ix < n; ix++) for (let iz = 0; iz < n; iz++) {
      m4.makeTranslation(-57 + ix * (114 / (n - 1)), 0.17, -57 + iz * (114 / (n - 1)));
      inst.setMatrixAt(i++, m4);
    }
    scene.add(inst);
  }
  const groundPlane = new THREE.Mesh(new THREE.PlaneGeometry(WORLD, WORLD), new THREE.MeshBasicMaterial({ visible: false }));
  groundPlane.rotation.x = -Math.PI / 2; scene.add(groundPlane);

  /* ---------------- 도로 + 광장 + 분수 ---------------- */
  const roadMat = lam(0x3a4358);
  function roadTo(x, z) {
    const len = Math.hypot(x, z);
    const start = 9, end = len - 6;
    const roadLen = end - start;
    if (roadLen <= 0) return;
    const ang = Math.atan2(x, z);
    const road = box(4, 0.12, roadLen, roadMat);
    road.position.set(Math.sin(ang) * (start + roadLen / 2), 0.06, Math.cos(ang) * (start + roadLen / 2));
    road.rotation.y = ang;
    scene.add(road);
  }
  ZONES.forEach(z => roadTo(z.pos[0], z.pos[1]));
  roadTo(0, 52);
  put(new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 0.25, 32), lam(0x2b3350)), 0, 0.12, 0);
  {
    const f = new THREE.Group();
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.6, 1.4, 20), lam(0x8a93a8));
    basin.position.y = 0.7; f.add(basin);
    const water = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.35, 20),
      new THREE.MeshBasicMaterial({ color: 0x38e1c6, transparent: true, opacity: 0.75 }));
    water.position.y = 1.45; f.add(water);
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 2.6, 12), lam(0x8a93a8));
    pillar.position.y = 1.9; f.add(pillar);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.4, 14), lam(0x8a93a8));
    top.position.y = 3.3; f.add(top);
    scene.add(f);
    addCollider(0, 0, 4, 4);
  }

  /* ---------------- 입구 아치 + 매표소 ---------------- */
  function textSign(w, h, text, bg, fg, fontPx) {
    const c = document.createElement('canvas'); c.width = 512; c.height = Math.round(512 * h / w);
    const x = c.getContext('2d');
    x.fillStyle = bg; x.fillRect(0, 0, c.width, c.height);
    x.strokeStyle = fg; x.lineWidth = 10; x.strokeRect(8, 8, c.width - 16, c.height - 16);
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `900 ${fontPx}px 'Noto Sans KR', sans-serif`;
    x.fillText(text, c.width / 2, c.height / 2 + 4);
    const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter;
    return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: false }));
  }
  {
    const arch = new THREE.Group();
    const pm = lam(0xef4444);
    put(box(2.4, 11, 2.4, pm), -8, 5.5, 0, arch);
    put(box(2.4, 11, 2.4, pm), 8, 5.5, 0, arch);
    put(box(18.5, 1.2, 2.6, lam(0xf7c500)), 0, 11.6, 0, arch);
    const sign = textSign(15, 3, '🎢 HYOGI LAND', '#141a2e', '#38e1c6', 64);
    sign.position.set(0, 9.2, 0.2); arch.add(sign);
    const sign2 = sign.clone(); sign2.rotation.y = Math.PI; sign2.position.z = -0.2; arch.add(sign2);
    // 스터드 장식
    for (let ix = -7; ix <= 7; ix += 2.8) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 10), lam(0xf7c500));
      s.position.set(ix, 12.45, 0); arch.add(s);
    }
    arch.position.set(0, 0, 52); scene.add(arch);
    addCollider(-8, 52, 1.6, 1.6); addCollider(8, 52, 1.6, 1.6);
    // 매표소
    const tb = new THREE.Group();
    put(box(6, 4.5, 5, lam(0x8b5cf6)), 0, 2.25, 0, tb);
    put(box(7, 1, 6, lam(0x5b21b6)), 0, 5, 0, tb);
    const win = box(4.4, 1.6, 0.3, bas(0xffd27a)); win.position.set(0, 2.6, 2.55); tb.add(win);
    const tsign = textSign(4.4, 1.1, 'TICKETS', '#141a2e', '#f7c500', 56);
    tsign.position.set(0, 4, 2.56); tb.add(tsign);
    tb.position.set(14, 0, 47); tb.rotation.y = -0.35; scene.add(tb);
    addCollider(14, 47, 3.6, 3.2);
  }

  /* ---------------- 놀이기구 ---------------- */
  const hitMeshes = [];
  function zoneBase(zone) {
    // 구역 링 + 라벨용 높이
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(zone.r - 0.6, zone.r, 48),
      new THREE.MeshBasicMaterial({ color: zone.color, transparent: true, opacity: 0.28, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2; ring.position.set(zone.pos[0], 0.15, zone.pos[1]);
    scene.add(ring);
    zone.topY = 20;
  }
  function boardPointFor(zone) {
    const [zx, zz] = zone.pos;
    const len = Math.hypot(zx, zz);
    return V3(zx - (zx / len) * zone.ride.clear, 0, zz - (zz / len) * zone.ride.clear);
  }

  function buildCarousel(zone) {
    const [zx, zz] = zone.pos;
    const g = new THREE.Group(); g.position.set(zx, 0, zz);
    const col = new THREE.Color(zone.color);
    put(new THREE.Mesh(new THREE.CylinderGeometry(6, 6.4, 0.9, 24), lam(col)), 0, 0.45, 0, g);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 7.5, 12), lam(0xf7c500));
    pole.position.y = 4.4; g.add(pole);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(7.6, 3.4, 24), lam(col.clone().multiplyScalar(0.75)));
    roof.position.y = 9.6; g.add(roof);
    const trim = new THREE.Mesh(new THREE.CylinderGeometry(7.6, 7.6, 0.7, 24), lam(0xf7c500));
    trim.position.y = 7.9; g.add(trim);
    const bulbMat = bas(0xffe2a8);
    for (let i = 0; i < 12; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), bulbMat);
      b.position.set(Math.cos(i / 12 * Math.PI * 2) * 7.6, 7.9, Math.sin(i / 12 * Math.PI * 2) * 7.6);
      g.add(b);
    }
    const spinner = new THREE.Group(); spinner.position.y = 1.1; g.add(spinner);
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 5.4, 0.35, 24), lam(0x2b3350));
    spinner.add(floor);
    const horses = [];
    const horseCols = [0xffffff, 0xf7c500, 0xff9ecf, 0x9ed8ff];
    for (let i = 0; i < 4; i++) {
      const hg = new THREE.Group();
      const a = i / 4 * Math.PI * 2;
      hg.position.set(Math.cos(a) * 3.4, 0.4, Math.sin(a) * 3.4);
      hg.rotation.y = -a + Math.PI / 2;
      const body = box(0.8, 0.9, 1.9, lam(horseCols[i])); body.position.y = 0.9; hg.add(body);
      const headH = box(0.55, 0.7, 0.6, lam(horseCols[i])); headH.position.set(0, 1.55, 0.85); hg.add(headH);
      const mane = box(0.2, 0.6, 0.5, lam(0xef4444)); mane.position.set(0, 1.6, 0.55); hg.add(mane);
      const hpole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.4, 8), lam(0xd9dee9));
      hpole.position.y = 1.4; hg.add(hpole);
      spinner.add(hg); horses.push(hg);
    }
    scene.add(g);
    addCollider(zx, zz, 7.4, 7.4);
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 6.4, 8, 12), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.set(zx, 4, zz); hit.userData.zoneId = zone.id; scene.add(hit); hitMeshes.push(hit);
    return {
      seat: horses[0], seatPos: V3(0, 1.7, 0),
      update(dt, t) {
        spinner.rotation.y += dt * 0.7;
        horses.forEach((h, i) => { h.position.y = 0.4 + Math.abs(Math.sin(t * 2.2 + i * 1.7)) * 0.7; });
      }
    };
  }

  function buildFerris(zone) {
    const [zx, zz] = zone.pos;
    const g = new THREE.Group(); g.position.set(zx, 0, zz);
    const col = new THREE.Color(zone.color);
    // 지지대: 앞뒤 A프레임 (바퀴는 XY평면, Z축 회전)
    [[-2.2], [2.2]].forEach(([sz]) => {
      const l1 = box(0.9, 11.5, 0.9, lam(0x8a93a8)); l1.position.set(-1.6, 5.2, sz); l1.rotation.z = 0.27; g.add(l1);
      const l2 = box(0.9, 11.5, 0.9, lam(0x8a93a8)); l2.position.set(1.6, 5.2, sz); l2.rotation.z = -0.27; g.add(l2);
    });
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 6.4, 10), lam(0x3a4358));
    axle.rotation.x = Math.PI / 2; axle.position.y = 10.4; g.add(axle);
    const wheel = new THREE.Group(); wheel.position.y = 10.4; g.add(wheel);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(6.4, 0.4, 10, 32), lam(col));
    wheel.add(rim);
    for (let i = 0; i < 4; i++) {
      const sp = box(0.35, 12.6, 0.35, lam(col.clone().multiplyScalar(0.8)));
      sp.rotation.z = i * Math.PI / 4; wheel.add(sp);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.2, 12), lam(0xf7c500));
    hub.rotation.z = Math.PI / 2; wheel.add(hub);
    const cabins = [];
    const cabCols = [0xef4444, 0x2f6df6, 0x35c26e, 0xf7c500, 0x8b5cf6, 0xff9ecf, 0x38e1c6, 0xf59e0b];
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2;
      const pivot = new THREE.Group();
      pivot.position.set(Math.cos(a) * 6.4, Math.sin(a) * 6.4, 0);
      const gondola = new THREE.Group(); gondola.position.y = -1.7; pivot.add(gondola);
      const fl = box(2.6, 0.35, 2.6, lam(cabCols[i])); gondola.add(fl);
      const wallM = lam(cabCols[i]);
      [[0, 1.15, 1.15, 2.6, 1.1, 0.25], [0, 1.15, -1.15, 2.6, 1.1, 0.25], [1.15, 1.15, 0, 0.25, 1.1, 2.6], [-1.15, 1.15, 0, 0.25, 1.1, 2.6]]
        .forEach(([wx, wy, wz, ww, wh, wd]) => { const wmesh = box(ww, wh, wd, wallM); wmesh.position.set(wx, wy, wz); gondola.add(wmesh); });
      const roofC = box(3, 0.3, 3, lam(0xf7c500)); roofC.position.y = 2; gondola.add(roofC);
      const hang = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.7, 8), lam(0x3a4358));
      hang.position.y = -0.85; pivot.add(hang);
      wheel.add(pivot); cabins.push({ pivot, gondola });
    }
    scene.add(g);
    addCollider(zx, zz, 8, 3.6);
    const hit = box(16, 18, 7, new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.set(zx, 9, zz); hit.userData.zoneId = zone.id; scene.add(hit); hitMeshes.push(hit);
    return {
      seat: cabins[0].gondola, seatPos: V3(0, 0.35, 0),
      update(dt) {
        wheel.rotation.z += dt * 0.28;
        cabins.forEach(c => { c.pivot.rotation.z = -wheel.rotation.z; });
      }
    };
  }

  function buildDropTower(zone) {
    const [zx, zz] = zone.pos;
    const g = new THREE.Group(); g.position.set(zx, 0, zz);
    const col = new THREE.Color(zone.color);
    put(box(6, 1.2, 6, lam(0x3a4358)), 0, 0.6, 0, g);
    put(box(2.6, 19, 2.6, lam(col.clone().multiplyScalar(0.85))), 0, 10.1, 0, g);
    put(box(4.6, 1.4, 4.6, lam(0xf7c500)), 0, 20.2, 0, g);
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 10), bas(0xff5b5b));
    beacon.position.y = 21.4; g.add(beacon);
    // 스터드 장식
    for (let ix = -1.6; ix <= 1.6; ix += 1.6) for (let iz = -1.6; iz <= 1.6; iz += 1.6) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.4, 8), lam(0xf7c500));
      s.position.set(ix, 21.1, iz); g.add(s);
    }
    const carriage = new THREE.Group(); g.add(carriage);
    const seatM = lam(0x141a2e);
    put(box(4.6, 0.5, 4.6, seatM), 0, 0, 0, carriage);
    put(box(4.6, 1.6, 0.4, lam(col)), 0, 1, -2.1, carriage);
    put(box(4.6, 1.6, 0.4, lam(col)), 0, 1, 2.1, carriage);
    put(box(0.4, 1.6, 4.6, lam(col)), -2.1, 1, 0, carriage);
    put(box(0.4, 1.6, 4.6, lam(col)), 2.1, 1, 0, carriage);
    scene.add(g);
    addCollider(zx, zz, 3.4, 3.4);
    const hit = box(6, 22, 6, new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.set(zx, 11, zz); hit.userData.zoneId = zone.id; scene.add(hit); hitMeshes.push(hit);
    const easeIO = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    return {
      seat: carriage, seatPos: V3(0, 0.45, 0),
      update(dt, t) {
        const ph = t % 15;
        let y;
        if (ph < 6) y = 2.5 + (15 - 2.5) * easeIO(ph / 6);
        else if (ph < 8) y = 15;
        else if (ph < 8.9) { const k = (ph - 8) / 0.9; y = 15 - (15 - 2.8) * k * k; }
        else if (ph < 10) y = 2.8 + Math.sin((ph - 8.9) / 1.1 * Math.PI) * 0.7;
        else y = 2.8;
        carriage.position.y = y;
        beacon.material.color.setHex((ph > 8 && ph < 10) ? 0xff2222 : 0xff5b5b);
      }
    };
  }

  function buildViking(zone) {
    const [zx, zz] = zone.pos;
    const g = new THREE.Group(); g.position.set(zx, 0, zz);
    const col = new THREE.Color(zone.color);
    // 프레임
    [[-5.5], [5.5]].forEach(([sx]) => {
      const l1 = box(0.9, 10.5, 0.9, lam(0x8a93a8)); l1.position.set(sx, 4.8, -1.8); l1.rotation.x = 0.17; g.add(l1);
      const l2 = box(0.9, 10.5, 0.9, lam(0x8a93a8)); l2.position.set(sx, 4.8, 1.8); l2.rotation.x = -0.17; g.add(l2);
    });
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 13, 10), lam(0x3a4358));
    axle.rotation.z = Math.PI / 2; axle.position.y = 9.4; g.add(axle);
    const ship = new THREE.Group(); ship.position.y = 9.4; g.add(ship);
    const hullM = lam(col);
    const hull = box(10.5, 1.7, 3.4, hullM); hull.position.y = -2.2; ship.add(hull);
    const bow = box(1.6, 3, 3.2, hullM); bow.position.set(5.4, -1.4, 0); bow.rotation.z = -0.35; ship.add(bow);
    const stern = box(1.6, 3, 3.2, hullM); stern.position.set(-5.4, -1.4, 0); stern.rotation.z = 0.35; ship.add(stern);
    const deck = box(9.6, 0.3, 2.8, lam(0x7a5230)); deck.position.y = -1.25; ship.add(deck);
    // 난간
    [[1.45], [-1.45]].forEach(([rz]) => {
      const rail = box(9.6, 0.9, 0.25, lam(0xf7c500)); rail.position.set(0, -0.6, rz); ship.add(rail);
    });
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 5.5, 8), lam(0x7a5230));
    mast.position.y = 0.6; ship.add(mast);
    const flag = box(1.8, 1.1, 0.12, bas(0x38e1c6)); flag.position.set(1.05, 2.6, 0); ship.add(flag);
    // 행거
    [[-3.4], [3.4]].forEach(([hx]) => {
      const hang = box(0.4, 7.4, 0.4, lam(0x3a4358)); hang.position.set(hx, -5.6, 0); hang.rotation.z = hx > 0 ? 0.12 : -0.12; ship.add(hang);
    });
    scene.add(g);
    addCollider(zx, zz, 7.6, 3.2);
    const hit = box(14, 12, 7, new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.set(zx, 6, zz); hit.userData.zoneId = zone.id; scene.add(hit); hitMeshes.push(hit);
    return {
      seat: ship, seatPos: V3(0, -1.05, 0),
      update(dt, t) { ship.rotation.z = Math.sin(t * 1.25) * 0.52; }
    };
  }

  function buildBumper(zone) {
    const [zx, zz] = zone.pos;
    const g = new THREE.Group(); g.position.set(zx, 0, zz);
    const col = new THREE.Color(zone.color);
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 9.5, 0.35, 28), lam(0x39415c));
    floor.position.y = 0.18; g.add(floor);
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * Math.PI * 2;
      const wseg = box(4.4, 1.1, 0.5, lam(i % 2 ? col : 0xf7c500));
      wseg.position.set(Math.cos(a) * 9.7, 0.75, Math.sin(a) * 9.7);
      wseg.rotation.y = -a + Math.PI / 2;
      g.add(wseg);
    }
    const poleC = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 7, 8), lam(0x8a93a8));
    poleC.position.y = 3.5; g.add(poleC);
    const canopy = new THREE.Mesh(new THREE.ConeGeometry(3, 1.8, 12), lam(col.clone().multiplyScalar(0.8)));
    canopy.position.y = 7.8; g.add(canopy);
    const cars = [];
    const carCols = [0xef4444, 0x2f6df6, 0x35c26e, 0xf7c500, 0xff9ecf];
    for (let i = 0; i < 5; i++) {
      const car = new THREE.Group();
      const body = box(2, 0.9, 3, lam(carCols[i])); body.position.y = 0.75; car.add(body);
      const bumperM = lam(0x141a2e);
      const bf = box(2.3, 0.5, 0.4, bumperM); bf.position.set(0, 0.6, 1.6); car.add(bf);
      const bb = box(2.3, 0.5, 0.4, bumperM); bb.position.set(0, 0.6, -1.6); car.add(bb);
      const seatB = box(1.4, 0.9, 0.9, lam(0x141a2e)); seatB.position.set(0, 1.1, -0.6); car.add(seatB);
      const cpole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.4, 6), lam(0xd9dee9));
      cpole.position.set(0, 2.4, -1.2); cpole.rotation.x = 0.25; car.add(cpole);
      const wheelM = lam(0x141a2e);
      [[-0.9, 1], [0.9, 1], [-0.9, -1], [0.9, -1]].forEach(([wx, wz]) => {
        const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.3, 10), wheelM);
        wh.rotation.z = Math.PI / 2; wh.position.set(wx, 0.34, wz); car.add(wh);
      });
      g.add(car);
      cars.push({ g: car, a: i / 5 * Math.PI * 2, r: 3 + (i % 3) * 1.8, sp: (0.55 + i * 0.09) * (i % 2 ? 1 : -1) });
    }
    scene.add(g);
    addCollider(zx, zz, 10.6, 10.6);
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 4, 16), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.set(zx, 2, zz); hit.userData.zoneId = zone.id; scene.add(hit); hitMeshes.push(hit);
    return {
      seat: cars[0].g, seatPos: V3(0, 1.15, -0.4),
      update(dt) {
        cars.forEach(c => {
          c.a += dt * c.sp;
          const px = Math.cos(c.a) * c.r, pz = Math.sin(c.a) * c.r;
          c.g.position.set(px, 0.35, pz);
          c.g.rotation.y = -c.a + (c.sp > 0 ? -Math.PI / 2 : Math.PI / 2) + Math.PI;
        });
      }
    };
  }

  const BUILDERS = { tech: buildDropTower, about: buildCarousel, career: buildFerris, projects: buildViking, contact: buildBumper };
  ZONES.forEach(z => {
    zoneBase(z);
    z.rideObj = BUILDERS[z.id](z);
    z.boardPoint = boardPointFor(z);
  });

  /* ---------------- 장식: 나무·가로등·벤치·화단·구름·별 ---------------- */
  function makeTree(x, z, s) {
    const t = new THREE.Group();
    const trunk = box(0.9, 2.2, 0.9, lam(0x7a5230)); trunk.position.y = 1.1; t.add(trunk);
    const l1 = box(3, 2, 3, lam(0x1f7a3d)); l1.position.y = 3.1; t.add(l1);
    const l2 = box(2, 1.5, 2, lam(0x27a35a)); l2.position.y = 4.4; t.add(l2);
    t.position.set(x, 0, z); t.scale.setScalar(s || 1); scene.add(t);
    addCollider(x, z, 1.2, 1.2);
  }
  [[-50, -45], [50, -45], [-50, 45], [50, 45], [-52, 0], [52, 2], [-20, 48], [24, 44],
   [-48, -8], [48, -10], [-14, -48], [16, -50], [-52, 28], [52, 30], [10, 14], [-12, -12]
  ].forEach(([x, z]) => makeTree(x, z, 0.9 + Math.random() * 0.5));

  function makeLamp(x, z) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 5.5, 8), lam(0x3a4358));
    pole.position.set(x, 2.75, z); scene.add(pole);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 10), bas(0xffe2a8));
    bulb.position.set(x, 5.8, z); scene.add(bulb);
    const pl = new THREE.PointLight(0xffd9a0, 0.75, 20); pl.position.set(x, 5.8, z); scene.add(pl);
    addCollider(x, z, 0.5, 0.5);
  }
  [[10, 6], [-10, -6], [7, -10], [-7, 10], [20, 20], [-20, -20], [0, 30], [0, -28]].forEach(([x, z]) => makeLamp(x, z));

  function makeBench(x, z, ry) {
    const b = new THREE.Group();
    put(box(3, 0.35, 1.1, lam(0x7a5230)), 0, 0.85, 0, b);
    put(box(3, 1, 0.25, lam(0x7a5230)), 0, 1.5, -0.5, b);
    [[-1.2], [1.2]].forEach(([lx]) => put(box(0.3, 0.85, 1, lam(0x3a4358)), lx, 0.42, 0, b));
    b.position.set(x, 0, z); b.rotation.y = ry || 0; scene.add(b);
    addCollider(x, z, 1.6, 0.8);
  }
  makeBench(12, 3, 0.4); makeBench(-12, -3, -0.4); makeBench(4, 14, 1.2); makeBench(-4, -14, 1.2);

  function makeFlowers(x, z) {
    const f = new THREE.Group();
    put(box(3.4, 0.7, 2.2, lam(0x5b3a1e)), 0, 0.35, 0, f);
    const cols = [0xef4444, 0xf7c500, 0xff9ecf, 0xffffff, 0x8b5cf6, 0x38e1c6];
    for (let i = 0; i < 6; i++) {
      const fl = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), lam(cols[i]));
      fl.position.set(-1.2 + (i % 3) * 1.2, 0.95, i < 3 ? -0.45 : 0.45);
      f.add(fl);
    }
    f.position.set(x, 0, z); scene.add(f);
    addCollider(x, z, 1.9, 1.3);
  }
  makeFlowers(14, -4); makeFlowers(-14, 4); makeFlowers(6, -16); makeFlowers(-6, 16);

  const clouds = [];
  function makeCloud(x, y, z, s) {
    const c = new THREE.Group();
    const m = lam(0x232c47);
    [[0, 0, 0, 6], [3.6, -0.5, 1, 4], [-3.6, -0.4, -1, 3.6]].forEach(([ox, oy, oz, w]) => {
      const b = box(w, 2, 3, m); b.position.set(ox, oy, oz); c.add(b);
    });
    c.position.set(x, y, z); c.scale.setScalar(s); scene.add(c); clouds.push(c);
  }
  makeCloud(-30, 32, -40, 1.4); makeCloud(20, 36, -30, 1.7); makeCloud(35, 33, 30, 1.2); makeCloud(-35, 35, 30, 1.5); makeCloud(0, 38, 0, 1.8);
  {
    const n = 260, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 340;
      pos[i * 3 + 1] = 40 + Math.random() * 70;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 340;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xafc4ff, size: 0.8 })));
  }

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
  const FACE_TEX = faceTexture();
  function makeMinifig(torsoColor, legColor) {
    const fig = new THREE.Group();
    const YELLOW = lam(0xf7c500), TORSO = lam(torsoColor), LEG = lam(legColor);
    function limb(px, hipY, w, h, mat) {
      const grp = new THREE.Group(); grp.position.set(px, hipY, 0);
      const m = box(w, h, w, mat); m.position.y = -h / 2; grp.add(m);
      fig.add(grp); return grp;
    }
    const legL = limb(-0.36, 1.15, 0.62, 1.15, LEG);
    const legR = limb(0.36, 1.15, 0.62, 1.15, LEG);
    const torso = box(1.7, 1.5, 0.95, TORSO); torso.position.y = 1.9; fig.add(torso);
    const chest = box(0.7, 0.5, 0.12, bas(0x38e1c6)); chest.position.set(0, 2.05, 0.52); fig.add(chest);
    const armL = limb(-1.08, 2.55, 0.44, 1.25, TORSO);
    const armR = limb(1.08, 2.55, 0.44, 1.25, TORSO);
    [armL, armR].forEach(a => { const hand = box(0.44, 0.32, 0.5, YELLOW); hand.position.y = -1.35; a.add(hand); });
    const headMats = [YELLOW, YELLOW, YELLOW, YELLOW, new THREE.MeshLambertMaterial({ map: FACE_TEX }), YELLOW];
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.95, 1.05), headMats);
    head.position.y = 3.12; fig.add(head);
    scene.add(fig);
    return { fig, legL, legR, armL, armR, phase: Math.random() * 6 };
  }
  function walkAnim(ch, dt, moving, t) {
    const onGround = ch.fig.parent === scene; // 탑승 중이면 y 보정 안 함
    if (moving) {
      ch.phase += dt * 11;
      const s = Math.sin(ch.phase);
      ch.legL.rotation.x = s * 0.7; ch.legR.rotation.x = -s * 0.7;
      ch.armL.rotation.x = -s * 0.55; ch.armR.rotation.x = s * 0.55;
      if (onGround) ch.fig.position.y = Math.abs(Math.cos(ch.phase)) * 0.09;
    } else {
      ch.legL.rotation.x *= 0.85; ch.legR.rotation.x *= 0.85;
      ch.armL.rotation.x *= 0.85; ch.armR.rotation.x *= 0.85;
      if (onGround) ch.fig.position.y = Math.sin(t * 2 + ch.phase) * 0.03;
    }
  }

  const player = makeMinifig(0x2f6df6, 0x1e4fd1);
  player.fig.position.set(0, 0, 44);
  player.fig.rotation.y = Math.PI;

  /* NPC들 */
  const NPC_PALETTES = [[0xef4444, 0x1e3a8a], [0x35c26e, 0x713f12], [0x8b5cf6, 0x1f2937], [0xf59e0b, 0x0e7490], [0xff9ecf, 0x374151]];
  const waypoints = [];
  ZONES.forEach(z => waypoints.push(z.boardPoint));
  waypoints.push(V3(10, 0, 4), V3(-10, 0, -4), V3(4, 0, 12), V3(-4, 0, -12), V3(0, 0, 48), V3(14, 0, 30), V3(-14, 0, -30));
  const npcs = NPC_PALETTES.map(([tc, lc], i) => {
    const ch = makeMinifig(tc, lc);
    const wp = waypoints[i * 2 % waypoints.length];
    ch.fig.position.set(wp.x + 3, 0, wp.z + 3);
    return { ...ch, target: null, idleT: Math.random() * 3, speed: 4 + Math.random() * 2 };
  });
  function updateNPC(npc, dt, t) {
    const p = npc.fig.position;
    let moving = false;
    if (!npc.target) {
      npc.idleT -= dt;
      if (npc.idleT <= 0) npc.target = waypoints[Math.floor(Math.random() * waypoints.length)];
    } else {
      const dx = npc.target.x - p.x, dz = npc.target.z - p.z;
      const d = Math.hypot(dx, dz);
      if (d < 1.2) { npc.target = null; npc.idleT = 1 + Math.random() * 3.5; }
      else {
        const step = Math.min(npc.speed * dt, d);
        p.x += dx / d * step; p.z += dz / d * step;
        npc.fig.rotation.y = Math.atan2(dx, dz);
        moving = true;
      }
    }
    walkAnim(npc, dt, moving, t);
  }

  /* ---------------- 조작 ---------------- */
  const keys = new Set();
  const KEYMAP = { KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right' };
  window.addEventListener('keydown', e => {
    if (KEYMAP[e.code]) {
      if (rideState === 'riding' || rideState === 'boarding') cancelRide();
      keys.add(KEYMAP[e.code]); autoTarget = null; e.preventDefault();
    }
    if (e.code === 'Escape') {
      if (rideState === 'riding' || rideState === 'boarding') cancelRide();
      else closePanel();
    }
  });
  window.addEventListener('keyup', e => { if (KEYMAP[e.code]) keys.delete(KEYMAP[e.code]); });

  let autoTarget = null;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downPos = null;
  canvas.addEventListener('pointerdown', e => { downPos = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', e => {
    if (!downPos) return;
    const moved = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]);
    downPos = null;
    if (moved > 8) return;
    if (rideState === 'riding' || rideState === 'boarding') cancelRide();
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
      autoTarget = z.boardPoint.clone();
      openPanel(z.id);
    } else {
      autoTarget = V3(
        Math.max(-BOUND, Math.min(BOUND, hit.point.x)), 0,
        Math.max(-BOUND, Math.min(BOUND, hit.point.z))
      );
    }
  });

  function collide(p) {
    p.x = Math.max(-BOUND, Math.min(BOUND, p.x));
    p.z = Math.max(-BOUND, Math.min(BOUND, p.z));
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

  /* ---------------- 탑승 ---------------- */
  let rideState = 'none'; // none | boarding | riding
  let activeZone = null;
  const rideChip = document.getElementById('ride-chip');
  const rideChipText = document.getElementById('ride-chip-text');
  function boardRide(zoneId) {
    const z = ZONES.find(z => z.id === zoneId);
    activeZone = z;
    rideState = 'boarding';
    autoTarget = z.boardPoint.clone();
    rideChipText.textContent = `🎢 ${z.ride.name} 탑승장으로 이동 중…`;
    rideChip.classList.remove('hidden');
  }
  function startRiding() {
    rideState = 'riding';
    const seat = activeZone.rideObj.seat;
    seat.attach(player.fig);
    player.fig.position.copy(activeZone.rideObj.seatPos);
    player.fig.rotation.set(0, 0, 0);
    rideChipText.textContent = `🎢 ${activeZone.ride.name} 운행 중!`;
    rideChip.classList.remove('hidden');
  }
  function cancelRide() {
    if (rideState === 'none') return;
    if (rideState === 'riding') {
      scene.attach(player.fig);
      const bp = activeZone.boardPoint;
      player.fig.position.set(bp.x, 0, bp.z);
      player.fig.rotation.set(0, player.fig.rotation.y, 0);
    }
    rideState = 'none'; activeZone = null; autoTarget = null;
    rideChip.classList.add('hidden');
  }
  document.getElementById('ride-chip-btn').addEventListener('click', cancelRide);

  /* ---------------- 구역 라벨 ---------------- */
  const labelsEl = document.getElementById('labels');
  ZONES.forEach(z => {
    const d = document.createElement('div');
    d.className = 'zone-label';
    d.textContent = `${z.ride.icon} ${z.ride.name} · ${z.name}`;
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

  function rideHeaderHTML(z) {
    const hex = '#' + z.color.toString(16).padStart(6, '0');
    return `<div class="p-ride" style="border-color:${hex}">
      <div class="p-ride-row"><span class="p-ride-icon">${z.ride.icon}</span>
      <div><h3>${z.ride.name}</h3><p>${z.ride.desc}</p></div></div>
      <button class="p-ride-btn" id="ride-btn">🎢 ${z.ride.name} 타기!</button>
    </div>`;
  }
  function openPanel(id) {
    const z = ZONES.find(z => z.id === id);
    currentZone = id;
    panelBody.innerHTML = rideHeaderHTML(z) + RENDER[id]();
    panelBody.scrollTop = 0;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.querySelectorAll('.nav-zones button').forEach(b => b.classList.toggle('active', b.dataset.zone === id));
    document.getElementById('hint').classList.add('hidden');
    const btn = document.getElementById('ride-btn');
    if (btn) btn.addEventListener('click', () => boardRide(id));
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
    if (rideState === 'riding' || rideState === 'boarding') cancelRide();
    const z = ZONES.find(z => z.id === id);
    autoTarget = z.boardPoint.clone();
  }
  document.querySelectorAll('.nav-zones button').forEach(b =>
    b.addEventListener('click', () => goToZone(b.dataset.zone)));

  /* ---------------- 카메라 ---------------- */
  const camOffset = new THREE.Vector3(0, 17, 15);
  const smoothPos = new THREE.Vector3(0, 0, 44);
  const smoothY = { v: 0 };
  const worldP = new THREE.Vector3();
  camera.position.set(0, 17, 44 + 15);
  camera.lookAt(0, 2, 44);

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
  const SPEED = 11;
  let firstFrame = true;

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // 놀이기구 업데이트
    ZONES.forEach(z => z.rideObj.update(dt, t));

    // NPC
    npcs.forEach(n => updateNPC(n, dt, t));

    // 플레이어 이동 (탑승 중이 아닐 때)
    const p = player.fig.position;
    let moving = false;
    if (rideState !== 'riding') {
      let mx = 0, mz = 0;
      if (keys.has('up')) mz -= 1;
      if (keys.has('down')) mz += 1;
      if (keys.has('left')) mx -= 1;
      if (keys.has('right')) mx += 1;
      if (mx !== 0 || mz !== 0) {
        const l = Math.hypot(mx, mz); mx /= l; mz /= l;
        p.x += mx * SPEED * dt; p.z += mz * SPEED * dt;
        player.fig.rotation.y = Math.atan2(mx, mz);
        moving = true;
      } else if (autoTarget) {
        const dx = autoTarget.x - p.x, dz = autoTarget.z - p.z;
        const d = Math.hypot(dx, dz);
        if (d < 0.8) {
          autoTarget = null;
          if (rideState === 'boarding') startRiding();
        } else {
          const step = Math.min(SPEED * dt, d);
          p.x += dx / d * step; p.z += dz / d * step;
          player.fig.rotation.y = Math.atan2(dx, dz);
          moving = true;
        }
      }
      collide(p);
    }
    walkAnim(player, dt, moving, t);

    // 구역 진입/이탈 체크
    if (rideState === 'none') {
      for (const z of ZONES) {
        const d = Math.hypot(p.x - z.pos[0], p.z - z.pos[1]);
        if (d < z.r && currentZone !== z.id) { openPanel(z.id); break; }
      }
      if (currentZone) {
        const z = ZONES.find(z => z.id === currentZone);
        const d = Math.hypot(p.x - z.pos[0], p.z - z.pos[1]);
        if (d > z.r + 2.5) closePanel();
      }
    }

    // 카메라 따라가기 (월드 좌표 기준, 높이도 따라감)
    player.fig.getWorldPosition(worldP);
    const k = 1 - Math.pow(0.002, dt);
    smoothPos.x += (worldP.x - smoothPos.x) * k;
    smoothPos.z += (worldP.z - smoothPos.z) * k;
    smoothY.v += (worldP.y - smoothY.v) * k;
    camera.position.set(smoothPos.x + camOffset.x, smoothY.v + camOffset.y, smoothPos.z + camOffset.z);
    camera.lookAt(smoothPos.x, smoothY.v + 2, smoothPos.z);

    // 구름
    clouds.forEach((c, i) => {
      c.position.x += dt * (0.6 + i * 0.15);
      if (c.position.x > 90) c.position.x = -90;
    });

    updateLabels();
    renderer.render(scene, camera);
    if (firstFrame) { firstFrame = false; loadingEl.classList.add('done'); }
  }
  // 디버그 훅 (테스트용)
  window.__park = { player, ZONES, boardRide, cancelRide, goToZone, openPanel,
    teleport(x, z) { if (rideState !== 'none') cancelRide(); player.fig.position.set(x, 0, z); autoTarget = null; } };

  animate();
})();
