/* ============ 데이터 ============ */
const TECHS = [
  { icon:'🔷', name:'C#', tag:'main language', desc:'주력 언어. 스마트팩토리 솔루션과 디지털트윈 시스템의 핵심 로직, 데이터 수집·제어 모듈을 개발합니다.' },
  { icon:'🕹️', name:'Unity', tag:'realtime 3D engine', desc:'AR/VR/MR 콘텐츠와 실시간 3D 디지털트윈 구축의 기반 엔진. 현장 적용형 XR 솔루션을 다수 개발했습니다.' },
  { icon:'⚙️', name:'.NET', tag:'backend & desktop', desc:'서버·DB 연동 백엔드와 데스크톱 애플리케이션 개발. C# 생태계 전반을 다룹니다.' },
  { icon:'🤖', name:'Python / AI', tag:'now expanding', desc:'제조 데이터 분석, 이상 탐지, 예지정비(RUL). 현장 경험을 AI로 확장하는 중입니다.' },
  { icon:'🧊', name:'Three.js', tag:'web 3D', desc:'웹에서 바로 실행되는 3D 시각화. 브라우저 기반 디지털트윈과 인터랙티브 데모를 만듭니다.' },
  { icon:'🏭', name:'Digital Twin · OPC UA', tag:'industrial IoT', desc:'로봇·설비 데이터 연동 실시간 모니터링. OPC UA 기반 로봇 데이터 수집과 상태 확인 경험.' },
];

const PROJECTS = [
  { icon:'🧠', name:'Digital Twin AI Lab', desc:'3D 디지털트윈(AI 이상탐지·RUL 예지정비), 시장 트렌드 분석, AI 챗봇·리포트 생성기를 담은 3탭 웹앱.', tags:['Three.js','AI','Digital Twin'], demo:'https://metasongi.github.io/digital-twin-ai-lab/', repo:'https://github.com/MetaSonGi/digital-twin-ai-lab' },
  { icon:'🏭', name:'Smart Factory Trainer', desc:'스마트공장 검증장비 실습 시뮬레이터. 3D 가상 장비, 5단계 실습 엔진, 실시간 대시보드와 평가·수료 판정.', tags:['3D','Simulator','교육'], demo:'https://metasongi.github.io/smart-factory-trainer/', repo:'https://github.com/MetaSonGi/smart-factory-trainer' },
  { icon:'📷', name:'Camera to 3D Viewer', desc:'카메라로 촬영한 사진을 3D로 변환해 바로 확인하는 웹 뷰어.', tags:['Web','3D 변환','카메라'], demo:'https://metasongi.github.io/camera-to-3d-viewer/', repo:'https://github.com/MetaSonGi/camera-to-3d-viewer' },
  { icon:'🖼️', name:'Image to 3D Viewer', desc:'이미지를 업로드하면 3D 모델로 변환해 보여주는 웹 뷰어.', tags:['Web','3D 변환'], demo:'https://metasongi.github.io/image-to-3d-viewer/', repo:'https://github.com/MetaSonGi/image-to-3d-viewer' },
  { icon:'🔁', name:'Digital Twin Mini Sim', desc:'디지털트윈 개념을 가볍게 체험하는 미니 시뮬레이션 웹앱.', tags:['시뮬레이션','Web'], demo:'https://metasongi.github.io/digital-twin-mini-sim/', repo:'https://github.com/MetaSonGi/digital-twin-mini-sim' },
  { icon:'🎨', name:'AI Media Art Generator', desc:'AI로 미디어아트를 생성하는 웹앱. 생성형 AI와 비주얼 아트의 결합.', tags:['AI','미디어아트'], demo:'https://metasongi.github.io/ai-media-art-generator/', repo:'https://github.com/MetaSonGi/ai-media-art-generator' },
  { icon:'📊', name:'Manufacturing Data Analyzer', desc:'제조 데이터를 분석·시각화하는 데이터 분석 도구.', tags:['데이터 분석','제조'], repo:'https://github.com/MetaSonGi/manufacturing-data-analyzer' },
  { icon:'🤖', name:'Dev Automation Agent', desc:'GPT를 활용한 개발 자동화 에이전트. 반복 작업을 자동화합니다.', tags:['자동화','GPT'], repo:'https://github.com/MetaSonGi/dev-automation-agent' },
];

/* ============ 렌더링 ============ */
document.getElementById('tech-grid').innerHTML = TECHS.map(t => `
  <div class="tech-card reveal">
    <span class="tech-icon">${t.icon}</span>
    <h3>${t.name}</h3>
    <span class="tech-tag">${t.tag}</span>
    <p>${t.desc}</p>
  </div>`).join('');

document.getElementById('project-grid').innerHTML = PROJECTS.map(p => `
  <div class="project-card reveal">
    <div class="project-top">
      <span class="project-icon">${p.icon}</span>
      <div class="project-links">
        ${p.demo ? `<a class="plink live" href="${p.demo}" target="_blank" rel="noopener">라이브 데모</a>` : ''}
        <a class="plink" href="${p.repo}" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>
    <h3>${p.name}</h3>
    <p>${p.desc}</p>
    <div class="project-tags">${p.tags.map(t => `<span class="ptag">${t}</span>`).join('')}</div>
  </div>`).join('');

/* ============ 스크롤 리빌 ============ */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ============ 숫자 카운터 ============ */
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count;
    const t0 = performance.now(), dur = 1200;
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.fact-num').forEach(el => counterIO.observe(el));

/* ============ 스킬바 애니메이션 ============ */
const barIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.bar i').forEach(i => { i.style.width = i.style.getPropertyValue('--w'); });
    barIO.unobserve(e.target);
  });
}, { threshold: 0.4 });
document.querySelectorAll('.skillbars').forEach(el => barIO.observe(el));

/* ============ Hero: Three.js 파티클 네트워크 ============ */
(function initHero() {
  const canvas = document.getElementById('hero-bg');
  if (!window.THREE) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 14;

  const N = 130;
  const pos = new Float32Array(N * 3);
  const vel = [];
  for (let i = 0; i < N; i++) {
    pos[i*3]   = (Math.random() - .5) * 30;
    pos[i*3+1] = (Math.random() - .5) * 18;
    pos[i*3+2] = (Math.random() - .5) * 12;
    vel.push({ x:(Math.random()-.5)*.012, y:(Math.random()-.5)*.012, z:(Math.random()-.5)*.008 });
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0x5b8cff, size: 0.09, transparent: true, opacity: 0.85 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const lineGeo = new THREE.BufferGeometry();
  const linePos = new Float32Array(N * N * 6);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x38e1c6, transparent: true, opacity: 0.14 });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  function resize() {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth;
    const h = canvas.clientHeight || canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - .5) * 2;
    my = (e.clientY / window.innerHeight - .5) * 2;
  });

  const p = geo.attributes.position.array;
  function animate() {
    requestAnimationFrame(animate);
    for (let i = 0; i < N; i++) {
      p[i*3]   += vel[i].x;
      p[i*3+1] += vel[i].y;
      p[i*3+2] += vel[i].z;
      if (Math.abs(p[i*3]) > 15)   vel[i].x *= -1;
      if (Math.abs(p[i*3+1]) > 9)  vel[i].y *= -1;
      if (Math.abs(p[i*3+2]) > 6)  vel[i].z *= -1;
    }
    geo.attributes.position.needsUpdate = true;

    let li = 0;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = p[i*3]-p[j*3], dy = p[i*3+1]-p[j*3+1], dz = p[i*3+2]-p[j*3+2];
        if (dx*dx + dy*dy + dz*dz < 9 && li < linePos.length - 6) {
          linePos[li++]=p[i*3]; linePos[li++]=p[i*3+1]; linePos[li++]=p[i*3+2];
          linePos[li++]=p[j*3]; linePos[li++]=p[j*3+1]; linePos[li++]=p[j*3+2];
        }
      }
    }
    lineGeo.setDrawRange(0, li / 3);
    lineGeo.attributes.position.needsUpdate = true;

    camera.position.x += (mx * 1.6 - camera.position.x) * 0.03;
    camera.position.y += (-my * 1.0 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();
})();
