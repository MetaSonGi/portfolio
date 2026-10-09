/* ============ 픽셀 로봇 캐릭터 ============
   히어로 섹션 하단을 돌아다니는 작은 로봇.
   - 마우스를 따라다니고, 가만히 두면 알아서 돌아다님
   - 클릭하면 점프 + 말풍선
=========================================== */
(function initCharacter() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  const canvas = document.getElementById('character-layer');
  if (!hero || !canvas) return;
  const ctx = canvas.getContext('2d');

  const SCALE = 3;            // 픽셀 확대 배율
  const GW = 24, GH = 30;     // 스프라이트 그리드
  const CHAR_W = GW * SCALE, CHAR_H = GH * SCALE;

  // 색상
  const C = {
    outline: '#0b1020',
    body: '#33415f',
    bodyDark: '#232c47',
    blue: '#5b8cff',
    cyan: '#38e1c6',
    visor: '#10162a',
    bubble: '#f2f5ff',
  };

  function R(g, x, y, w, h, color) { g.fillStyle = color; g.fillRect(x, y, w, h); }

  // 로봇 스프라이트를 오프스크린에 그리기 (walkPhase: 0~1 걷기 사이클, facing: 1/-1)
  const sprite = document.createElement('canvas');
  sprite.width = GW; sprite.height = GH;
  const g = sprite.getContext('2d');

  function drawRobot(walkPhase, jumping, blink) {
    g.clearRect(0, 0, GW, GH);
    const legSwing = Math.sin(walkPhase * Math.PI * 2);
    const bob = Math.abs(Math.sin(walkPhase * Math.PI * 2)) * 1.2;

    // 그림자
    g.fillStyle = 'rgba(0,0,0,.35)';
    g.beginPath(); g.ellipse(GW/2, GH - 1.5, 8, 2, 0, 0, Math.PI * 2); g.fill();

    const liftL = jumping ? 0 : Math.max(0, legSwing) * 2;
    const liftR = jumping ? 0 : Math.max(0, -legSwing) * 2;
    const armSwing = jumping ? 0 : -legSwing * 2;

    // 다리 (왼쪽/오른쪽, 걷기에 따라 번갈아 들림)
    R(g, 8, 21 - liftL + bob * 0, 3, 6 - liftL, C.outline);
    R(g, 8.6, 21 - liftL, 1.8, 6 - liftL, C.bodyDark);
    R(g, 13, 21 - liftR, 3, 6 - liftR, C.outline);
    R(g, 13.6, 21 - liftR, 1.8, 6 - liftR, C.bodyDark);
    // 발
    R(g, 7, 26 - liftL, 5, 2, C.blue);
    R(g, 12, 26 - liftR, 5, 2, C.blue);

    // 팔 (다리와 반대로 흔들림)
    R(g, 3, 12 + armSwing * 0.6, 3, 7, C.outline);
    R(g, 3.5, 12 + armSwing * 0.6, 2, 7, C.body);
    R(g, 18, 12 - armSwing * 0.6, 3, 7, C.outline);
    R(g, 18.5, 12 - armSwing * 0.6, 2, 7, C.body);

    // 몸통
    R(g, 7, 12 + bob * 0.4, 10, 10, C.outline);
    R(g, 8, 13 + bob * 0.4, 8, 8, C.body);
    R(g, 8, 13 + bob * 0.4, 8, 2, C.bodyDark);
    // 가슴 라이트 (깜빡임)
    const chestOn = (Date.now() % 1600) < 1100;
    R(g, 10, 16 + bob * 0.4, 4, 3, chestOn ? C.cyan : '#1d5a52');

    // 머리
    R(g, 6, 4 + bob * 0.5, 12, 8, C.outline);
    R(g, 7, 5 + bob * 0.5, 10, 6, C.body);
    // 바이저
    R(g, 8, 6 + bob * 0.5, 8, 4, C.visor);
    if (blink) {
      R(g, 9, 8 + bob * 0.5, 6, 1, C.blue);
    } else {
      R(g, 9, 7 + bob * 0.5, 2.6, 2.6, C.cyan);
      R(g, 12.6, 7 + bob * 0.5, 2.6, 2.6, C.cyan);
    }

    // 안테나
    R(g, 11, 1 + bob * 0.5, 2, 3, C.outline);
    R(g, 11.4, 1 + bob * 0.5, 1.2, 3, C.bodyDark);
    const antOn = (Date.now() % 900) < 450;
    R(g, 10.6, 0 + bob * 0.5, 2.8, 1.6, antOn ? '#ff6b81' : '#5a2430');
  }

  // 말풍선 문구
  const PHRASES = ['Hello World!', "console.log('hi')", '배포 완료!', '점프!', '</>', 'AI 가동 중…', '삐-빅'];
  let bubble = null; // {text, until}

  // 상태
  const S = {
    x: 120, vx: 0,
    y: 0, vy: 0, groundY: 0,
    facing: 1,
    mode: 'idle',       // idle | walk | jump
    walkPhase: 0,
    targetX: 200,
    idleUntil: 0,
    blinkUntil: 0, nextBlink: 0,
    mouseX: null, mouseAt: 0,
  };

  function resize() {
    const r = hero.getBoundingClientRect();
    canvas.width = Math.max(320, r.width);
    canvas.height = 150;
    S.groundY = canvas.height - 14;
    if (S.mode !== 'jump') S.y = S.groundY;
    S.x = Math.min(Math.max(S.x, 50), canvas.width - 50);
  }
  window.addEventListener('resize', resize);
  resize();
  S.y = S.groundY;
  S.targetX = canvas.width * 0.7;

  hero.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    S.mouseX = e.clientX - r.left;
    S.mouseAt = performance.now();
  });
  hero.addEventListener('mouseleave', () => { S.mouseX = null; });

  hero.addEventListener('click', e => {
    if (e.target.closest('a, button')) return; // 버튼 클릭은 제외
    if (S.mode === 'jump') return;
    S.mode = 'jump';
    S.vy = -460;
    bubble = { text: PHRASES[(Math.random() * PHRASES.length) | 0], until: performance.now() + 1400 };
  });
  // 가끔 혼잣말
  setInterval(() => {
    if (S.mode === 'idle' && Math.random() < 0.4 && !bubble) {
      bubble = { text: PHRASES[(Math.random() * PHRASES.length) | 0], until: performance.now() + 1400 };
    }
  }, 7000);

  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    requestAnimationFrame(tick);

    // 눈 깜빡임
    if (now > S.nextBlink) { S.blinkUntil = now + 130; S.nextBlink = now + 2200 + Math.random() * 2500; }
    const blink = now < S.blinkUntil;

    // 목표 지점: 최근 마우스 > 랜덤 웨이포인트
    const mouseFresh = S.mouseX !== null && now - S.mouseAt < 3500;
    if (mouseFresh) {
      S.targetX = Math.min(Math.max(S.mouseX, 50), canvas.width - 50);
    } else if (S.mode === 'idle' && now > S.idleUntil) {
      S.targetX = 50 + Math.random() * (canvas.width - 100);
      S.mode = 'walk';
    }

    const SPEED = 150;
    if (S.mode === 'walk') {
      const dx = S.targetX - S.x;
      if (Math.abs(dx) < 5) {
        S.mode = 'idle';
        S.idleUntil = now + 1200 + Math.random() * 2200;
      } else {
        S.facing = dx > 0 ? 1 : -1;
        S.x += Math.sign(dx) * SPEED * dt;
        S.walkPhase += dt * 2.2;
      }
    } else if (S.mode === 'jump') {
      S.vy += 1500 * dt;
      S.y += S.vy * dt;
      S.x += S.facing * 90 * dt;
      if (S.y >= S.groundY) { S.y = S.groundY; S.mode = 'idle'; S.idleUntil = now + 800; }
    } else {
      S.walkPhase += dt * 0.4; // idle에서도 살짝 움직임
    }

    // 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    // 바닥 픽셀 라인
    ctx.fillStyle = 'rgba(91,140,255,.22)';
    for (let x = 0; x < canvas.width; x += 12) ctx.fillRect(x, S.groundY + CHAR_H - 4, 7, 2);

    drawRobot(S.walkPhase, S.mode === 'jump', blink);

    const dx = Math.round(S.x - CHAR_W / 2);
    const dy = Math.round(S.y - CHAR_H + 6);
    ctx.save();
    if (S.facing < 0) { ctx.translate(dx + CHAR_W, 0); ctx.scale(-1, 1); ctx.drawImage(sprite, 0, dy, CHAR_W, CHAR_H); }
    else ctx.drawImage(sprite, dx, dy, CHAR_W, CHAR_H);
    ctx.restore();

    // 말풍선
    if (bubble && now < bubble.until) {
      ctx.font = '12px "JetBrains Mono", monospace';
      const tw = ctx.measureText(bubble.text).width;
      const bx = Math.min(Math.max(S.x - tw / 2 - 10, 6), canvas.width - tw - 26);
      const by = dy - 34;
      ctx.fillStyle = C.bubble;
      ctx.strokeStyle = C.outline; ctx.lineWidth = 2;
      const bw = tw + 20, bh = 24;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 6);
      ctx.fill(); ctx.stroke();
      // 꼬리
      ctx.beginPath();
      ctx.moveTo(bx + bw / 2 - 5, by + bh); ctx.lineTo(bx + bw / 2 + 5, by + bh); ctx.lineTo(S.x, dy - 2);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#1a2140';
      ctx.fillText(bubble.text, bx + 10, by + 16);
    } else if (bubble) bubble = null;
  }
  requestAnimationFrame(tick);
})();
