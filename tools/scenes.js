'use strict';
const { Iso, K, r } = require('./iso');
const P = require('./parts');
const { mv, slab, crate, ICON, pallet, conveyor, tower, cabinet, board, txt, pie, bars, fence, gantry, worker, arm, car } = P;

const svg = (label, inner) =>
  `<svg viewBox="20 30 600 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;

const line = (pts, col = '#E8505A', w = 1.6, extra = '') =>
  `<polyline class="draw" pathLength="100" points="${pts}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;

const badge = (s, x, y, z, icon, dx, dy, d, col = '#D7262F') => {
  const [sx, sy] = s.p(x, y, z);
  return `<g transform="translate(${r(sx + dx)} ${r(sy + dy)})"><g class="float" style="--d:${d}s"><circle r="15" fill="#fff" stroke="${col}" stroke-width="2"/><g transform="scale(1.25)">${icon}</g></g></g>`;
};

const origin = () => new Iso(270, 190);

/* 1 — Design */
function design() {
  const s = origin();
  let o = slab(s, 340, 240);

  const specs = [0.8, 0.55, 0.7].map((v, i) =>
    `<rect x="8" y="${24 + i * 15}" width="56" height="5" rx="2.5" fill="#333A44"/><rect class="hbar" style="--i:${i}" x="8" y="${24 + i * 15}" width="${56 * v}" height="5" rx="2.5" fill="#D7262F"/>`).join('') +
    txt(8, 20, 'PLATFORM', 5.5) + txt(8, 35, 'FEATURES', 5.5) + txt(8, 50, 'SAFETY', 5.5);
  const profile = `<g transform="translate(70 30) scale(.78)"><path d="M0 40 H146 M73 0 V80" stroke="#2B313A" stroke-width="1"/>` +
    `<path class="draw" pathLength="100" d="M4 66 V54 Q4 48 14 46 L36 40 Q48 24 70 22 H92 Q112 24 124 42 L136 46 Q142 50 142 58 V66 Z" fill="none" stroke="#E8505A" stroke-width="2.2" stroke-linejoin="round"/>` +
    `<circle cx="32" cy="68" r="11" fill="none" stroke="#E8505A" stroke-width="2"/><circle cx="116" cy="68" r="11" fill="none" stroke="#E8505A" stroke-width="2"/>` +
    `<path d="M50 40 L56 28 H90 L102 40 Z" fill="none" stroke="#8F97A3" stroke-width="1.2"/></g>`;
  const bom = txt(190, 20, 'BOM', 5.5) + [0, 1, 2, 3, 4, 5].map((i) =>
    `<rect x="190" y="${27 + i * 11}" width="5" height="5" fill="#D7262F"/><rect class="row" style="--i:${i}" x="199" y="${28 + i * 11}" width="${[34, 26, 32, 22, 30, 28][i]}" height="3" rx="1.5" fill="#8F97A3"/>`).join('');
  o += board(s, 50, 10, 28, 240, 110, specs + profile + bom);

  // turntable and clay model
  o += s.cyl(180, 135, 0, 88, 6, 'dark');
  o += s.planeT(110, 65, 6, `<circle class="dashflow" cx="70" cy="70" r="64" fill="none" stroke="#E8505A" stroke-width="1.8" stroke-dasharray="9 9"/><circle cx="70" cy="70" r="52" fill="none" stroke="#8F97A3" stroke-width="1" opacity=".6"/>`);
  o += car(s, 130, 112, 6, { pal: 'white' });
  o += mv(s.poly([[130, 98, 6], [130, 172, 6], [130, 172, 66], [130, 98, 66]], 'url(#beam)', { stroke: '#E8505A', sw: 1.2 }), 100, 5, 0, 'scan');

  o += badge(s, 180, 135, 104, ICON.shield(), -58, -18, 0);
  o += badge(s, 180, 135, 104, ICON.gear(), 0, -34, -0.9);
  o += badge(s, 180, 135, 104, ICON.list(), 58, -18, -1.8);

  // designer desk
  o += s.box(16, 170, 0, 88, 42, 24, 'white');
  o += s.planeX(16, 212, 24, `<rect x="4" y="3" width="26" height="17" rx="1.5" fill="#E4E9EE"/><rect x="36" y="3" width="26" height="17" rx="1.5" fill="#E4E9EE"/><circle cx="17" cy="11" r="1.5" fill="#8F97A3"/><circle cx="49" cy="11" r="1.5" fill="#8F97A3"/>`);
  o += s.box(30, 180, 24, 36, 4, 24, 'black');
  o += s.planeX(30, 184.2, 48, `<rect width="36" height="24" fill="#1D2127"/><g transform="translate(18 13) scale(.9)">${ICON.car('#E8505A')}</g>`);
  o += s.box(32, 192, 24, 30, 12, 2, 'steel');
  o += worker(...s.p(122, 214, 0), { pose: 'tablet', flip: true });

  // skateboard platform
  o += s.cyl(250, 172, 0, 8, 7, 'black') + s.cyl(300, 172, 0, 8, 7, 'black');
  o += s.box(236, 174, 0, 78, 42, 6, 'dark');
  o += s.box(244, 180, 6, 62, 30, 6, 'steel');
  o += s.planeT(244, 180, 12, `<g stroke="#AEB7C2" stroke-width="1">${[1, 2, 3, 4, 5].map((i) => `<line x1="${i * 10.3}" y1="0" x2="${i * 10.3}" y2="30"/>`).join('')}</g><rect x="22" y="9" width="18" height="12" fill="#D7262F"/>`);
  o += s.cyl(250, 214, 0, 8, 7, 'black') + s.cyl(300, 214, 0, 8, 7, 'black');
  o += tower(s, 322, 24, 0, 'g');
  return svg('Isometric design studio: CAD wall display, clay vehicle model on a scanning turntable, designer desk and chassis platform', o);
}

/* 2 — Plan & Source */
function plan() {
  const s = origin();
  let o = slab(s, 340, 240);
  const content = txt(8, 14, 'DEMAND', 5.5) + txt(130, 14, 'CAPACITY', 5.5) + txt(200, 14, 'SUPPLY', 5.5) +
    `<g stroke="#2B313A" stroke-width="1"><path d="M8 30H120M8 46H120M8 62H120"/></g>` +
    line('8,62 24,54 40,58 56,40 72,44 90,28 112,24', '#E8505A', 2) +
    line('8,66 30,64 50,60 76,58 98,50 112,46', '#F4F6F8', 1.4) +
    bars(130, 24, 60, 52, [0.5, 0.7, 0.6, 0.85, 0.75]) +
    pie(222, 50, 20);
  o += board(s, 40, 10, 42, 250, 82, content);

  const items = [
    [ICON.bolt('#D7262F'), 'white'], [ICON.chip(), 'dark'], [ICON.bolt('#D7262F'), 'white'], [ICON.chip(), 'dark'], [ICON.bolt('#D7262F'), 'white'],
  ].map(([ic, pal], i) => mv(crate(s, 22, 74, 28, 26, 22, 20, pal, ic), 244, 14, -i * 2.8)).join('');
  const cv = conveyor(s, 10, 64, 320, 42, 28, items);
  o += cv.all;
  o += tower(s, 324, 70, 0, 'cycle');

  const labels = ['BATTERY', 'CHIPS', 'TIRES', 'GLASS', 'SEATS'];
  const X = [10, 76, 142, 208, 274];
  const Y = 160, W = 54, D = 48;
  X.forEach((x, i) => {
    o += pallet(s, x, Y, W, D);
    if (i === 0) {
      [0, 1].forEach((k) => { for (let row = 0; row < 2; row++) for (let c = 0; c < 2; c++) o += crate(s, x + 1 + c * 26, Y + 1 + row * 23, 7 + k * 16, 26, 22, 16, 'white', ICON.bolt('#D7262F', 1)); });
    } else if (i === 1) {
      [0, 1].forEach((k) => { for (let row = 0; row < 3; row++) for (let c = 0; c < 3; c++) o += crate(s, x + 1.5 + c * 17, Y + 1.5 + row * 15.5, 7 + k * 13, 17, 15, 13, 'dark', ICON.chip()); });
    } else if (i === 2) {
      [0, 1, 2].forEach((k) => { for (let row = 0; row < 2; row++) for (let c = 0; c < 2; c++) {
        const cx = x + 14 + c * 27, cy = Y + 13 + row * 24, z = 7 + k * 9;
        o += s.cyl(cx, cy, z, 12, 9, 'black') + s.cyl(cx, cy, z + 9, 6, 0.6, 'grey');
      } });
    } else if (i === 3) {
      o += s.box(x + 3, Y + 3, 7, 3, 42, 44, 'red');
      for (let k = 0; k < 5; k++) o += s.box(x + 7, Y + 5 + k * 8, 7, 40, 2.5, 38, 'glass');
      o += s.box(x + 48, Y + 3, 7, 3, 42, 44, 'red');
    } else {
      [0, 1].forEach((k) => {
        const yy = Y + 2 + k * 25;
        o += s.box(x + 5, yy, 7, 44, 20, 9, 'dark') + s.box(x + 5, yy, 16, 44, 6, 26, 'dark') + s.box(x + 5, yy + 6, 16, 44, 1.2, 26, 'red');
      });
    }
    o += s.box(x + 7, Y + D + 3, 0, 40, 2, 12, 'white');
    o += s.planeX(x + 7, Y + D + 5.1, 12, txt(20, 8.5, labels[i], 6.5, '#2E3238', ' text-anchor="middle"'));
  });
  o += worker(...s.p(330, 128, 0), { pose: 'tablet', flip: true });
  return svg('Isometric warehouse: demand and capacity board, inbound conveyor with crates, pallets of batteries, chips, tires, glass and seats', o);
}

/* 3 — Make */
function make() {
  const s = origin();
  let o = slab(s, 340, 240);
  // stamping press
  o += s.box(12, 14, 0, 70, 56, 8, 'dark');
  o += s.box(14, 16, 8, 5, 5, 44, 'red') + s.box(73, 16, 8, 5, 5, 44, 'red');
  o += s.box(28, 30, 8, 38, 28, 6, 'steel');
  o += s.box(33, 35, 14, 28, 18, 2, 'white');
  o += `<g class="press">${s.box(32, 34, 36, 30, 22, 12, 'dark')}</g>`;
  o += s.box(14, 63, 8, 5, 5, 44, 'red') + s.box(73, 63, 8, 5, 5, 44, 'red');
  o += s.box(12, 14, 52, 70, 56, 10, 'red');
  o += s.planeX(12, 70, 62, `<rect x="6" y="2" width="26" height="3.5" fill="#fff" opacity=".85"/><circle class="blink" cx="58" cy="4" r="2.2" fill="#FFC247"/>`);
  o += s.box(92, 22, 0, 22, 20, 5, 'red') + s.box(95, 25, 5, 16, 14, 2, 'white') + s.box(95, 25, 7, 16, 14, 2, 'white');

  const carHtml = `<g class="car-make">${car(s, 12, 105, 26, { L: 100, W: 40, late: true, pal: 'red' })}</g>`;
  const items = [0, 1].map((i) => mv(carHtml, 220, 18, -i * 9)).join('');
  const cv = conveyor(s, 8, 98, 326, 50, 26);
  const bx = 152, bw = 58, by = 90, bd = 66;
  o += cv.under + s.box(bx, by, 0, 3, 3, 70, 'red') + s.box(bx + bw - 3, by, 0, 3, 3, 70, 'red');
  o += items + cv.over;

  o += arm(...s.p(112, 70, 0), { s: 0.5, flip: true, tool: 'weld', delay: 0 });
  o += arm(...s.p(106, 178, 0), { s: 0.5, tool: 'weld', delay: -1.6 });
  o += arm(...s.p(180, 68, 0), { s: 0.5, flip: true, tool: 'spray', delay: -0.8 });
  // paint booth frame (front posts and roof beams drawn after the car)
  o += s.box(bx, by + bd - 3, 0, 3, 3, 70, 'red') + s.box(bx + bw - 3, by + bd - 3, 0, 3, 3, 70, 'red');
  o += s.box(bx - 2, by - 2, 70, bw + 4, 4, 4, 'red') + s.box(bx - 2, by + bd - 2, 70, bw + 4, 4, 4, 'red');
  o += s.box(bx - 2, by + 2, 70, 4, bd - 4, 4, 'red') + s.box(bx + bw - 2, by + 2, 70, 4, bd - 4, 4, 'red');
  o += s.planeX(bx - 2, by + bd + 2, 70, `<rect x="${bw / 2 - 16}" y="0" width="32" height="5" rx="1" fill="#fff"/>` + txt(bw / 2 + 2, 4, 'PAINT', 4.5, '#D7262F', ' text-anchor="middle"'));
  o += arm(...s.p(272, 68, 0), { s: 0.5, flip: true, delay: -2.4 });
  o += pallet(s, 180, 172, 50, 40);
  [0, 1].forEach((k) => { for (let row = 0; row < 2; row++) for (let c = 0; c < 2; c++) {
    const cx = 192 + c * 24, cy = 182 + row * 22, z = 7 + k * 9;
    o += s.cyl(cx, cy, z, 10, 9, 'black') + s.cyl(cx, cy, z + 9, 5, 0.6, 'grey');
  } });
  o += cabinet(s, 296, 172, 0, 'cycle');
  o += worker(...s.p(232, 208, 0), { pose: 'panel', flip: false });
  return svg('Isometric assembly line: stamping press, welding robots, paint booth and final assembly while a car body moves along the conveyor', o);
}

/* 4 — Quality */
function quality() {
  const s = origin();
  let o = slab(s, 340, 240);
  const rows = ['WELD', 'PAINT', 'ALIGN', 'FUNCTION', 'SAFETY'].map((t, i) =>
    txt(8, 21 + i * 12, t, 5.5, '#C6CED7') + `<g class="tick" style="--i:${i}" transform="translate(88 ${18 + i * 12})">${ICON.check('#3DE08B')}</g>`).join('');
  const ring = `<circle cx="196" cy="42" r="17" fill="none" stroke="#333A44" stroke-width="6"/><circle class="ring" cx="196" cy="42" r="17" fill="none" stroke="#3DE08B" stroke-width="6" pathLength="100" stroke-dasharray="98 100" transform="rotate(-90 196 42)"/>` + txt(196, 45, '99%', 8, '#fff', ' text-anchor="middle"') + txt(196, 72, 'FIRST PASS', 5, '#9AA3AF', ' text-anchor="middle"');
  o += board(s, 30, 10, 38, 240, 82, txt(8, 10, 'INSPECTION', 5, '#9AA3AF') + rows + ring);

  const gt = gantry(s, 138, 94, 34, 62, 78, 'white');
  const chk = `<g class="after-scan">${(() => { const [sx, sy] = s.p(62, 125, 100); return `<g transform="translate(${sx} ${sy})"><circle r="13" fill="#fff" stroke="#2DB872" stroke-width="2.4"/>${ICON.check('#2DB872')}</g>`; })()}</g>`;
  const items = [0, 1].map((i) => mv(car(s, 12, 105, 26, { L: 100, W: 40 }) + chk, 220, 18, -i * 9)).join('');
  const cv = conveyor(s, 8, 98, 326, 50, 26, items);
  o += cv.under + gt.back + items + cv.over;
  // laser curtain
  const cx = 155;
  o += `<g class="curtain">${s.poly([[cx, 100, 26], [cx, 146, 26], [cx, 146, 90], [cx, 100, 90]], 'url(#beam)', { stroke: '#E8505A', sw: 0.8 })}</g>`;
  o += `<g class="sweep">${s.poly([[cx, 100, 26], [cx, 146, 26], [cx, 146, 27.5], [cx, 100, 27.5]], '#FF8A8F', { sw: 1.2 })}</g>`;
  o += gt.front;
  o += s.box(144, 96, 82, 22, 14, 6, 'dark');
  o += s.planeX(144, 110, 88, `<circle class="blink" cx="6" cy="3" r="2" fill="#E8505A"/><circle cx="15" cy="3" r="2" fill="#7FB7D6"/>`);

  o += arm(...s.p(250, 72, 0), { s: 0.62, flip: true, tool: 'cam', delay: -1 });
  o += cabinet(s, 24, 172, 0, 'g');
  o += worker(...s.p(86, 196, 0), { pose: 'tablet' });
  o += s.box(236, 176, 0, 90, 46, 4, 'steel');
  o += s.planeT(236, 176, 4, `<g stroke="#AEB7C2" stroke-width="1.4" stroke-dasharray="6 5"><rect x="6" y="6" width="78" height="34" fill="none"/></g><g fill="#D7262F"><rect x="12" y="12" width="8" height="22"/><rect x="70" y="12" width="8" height="22"/></g>`);
  o += tower(s, 328, 100, 0, 'g');
  return svg('Isometric quality bay: laser scan gantry, inspection robot with camera, checklist display and finished cars passing through', o);
}

/* 5 — Maintain */
function maintain() {
  const s = origin();
  let o = slab(s, 340, 240);
  const gauge = `<path d="M10 62 A36 36 0 0 1 82 62" fill="none" stroke="#333A44" stroke-width="8"/><path d="M10 62 A36 36 0 0 1 70 34" fill="none" stroke="#3DE08B" stroke-width="8"/>` +
    `<g class="needle" style="transform-origin:46px 62px"><path d="M46 62 L46 32" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g><circle cx="46" cy="62" r="4" fill="#D7262F"/>` +
    txt(46, 78, 'AVAILABILITY', 5, '#9AA3AF', ' text-anchor="middle"') +
    bars(100, 26, 70, 40, [0.9, 0.8, 0.95, 0.85, 0.92, 0.88], '#3DE08B') + txt(100, 78, 'UPTIME / SHIFT', 5, '#9AA3AF');
  o += board(s, 20, 8, 46, 190, 88, gauge);

  const items = [0, 1, 2].map((i) => mv(crate(s, 20, 102, 26, 24, 22, 18, 'white'), 250, 15, -i * 5)).join('');
  const cv = conveyor(s, 10, 94, 320, 42, 26, items);
  o += cv.all;

  // overhead torque tool balancer
  o += s.box(236, 18, 0, 5, 5, 110, 'dark') + s.box(318, 18, 0, 5, 5, 110, 'dark') + s.box(232, 16, 108, 94, 8, 6, 'red');
  const [tx, ty] = s.p(280, 20, 106);
  o += `<g class="swing" style="transform-origin:${tx}px ${ty}px"><path d="M${tx} ${ty} V${r(ty + 46)}" stroke="#5B626D" stroke-width="1.8"/><rect x="${tx - 6}" y="${r(ty + 44)}" width="12" height="22" rx="3" fill="#D7262F"/><rect x="${tx - 8}" y="${r(ty + 38)}" width="16" height="10" rx="3" fill="#3E444D"/><rect x="${tx - 3}" y="${r(ty + 66)}" width="6" height="8" fill="#AEB5BF"/></g>`;

  o += tower(s, 322, 94, 0, 'cycle');

  // paint system cabinet
  o += s.box(10, 164, 0, 66, 42, 46, 'steel');
  o += s.planeX(10, 206, 46, `<rect x="6" y="6" width="34" height="26" rx="2" fill="#2F3E4B"/><path class="spray" d="M12 14 L36 14 M12 20 L30 20" stroke="#E8505A" stroke-width="2"/><rect x="46" y="6" width="14" height="30" fill="#D7262F"/><circle class="blink" cx="53" cy="12" r="2.2" fill="#FFC247"/>`);
  o += s.cyl(22, 176, 46, 4, 14, 'dark') + s.cyl(58, 176, 46, 4, 14, 'dark');
  // toolbox
  o += s.box(92, 176, 0, 44, 26, 26, 'red');
  o += s.planeX(92, 202, 26, `<rect x="4" y="4" width="36" height="7" rx="1" fill="#A51A22"/><rect x="4" y="14" width="36" height="7" rx="1" fill="#A51A22"/><rect x="17" y="6" width="10" height="2" fill="#F4F6F8"/><rect x="17" y="16" width="10" height="2" fill="#F4F6F8"/>`);
  o += s.box(96, 181, 26, 36, 6, 6, 'dark');
  o += worker(...s.p(170, 198, 0), { pose: 'wrench' });
  o += arm(...s.p(236, 190, 0), { s: 0.62, delay: -1.5 });
  // spare parts pallet
  o += pallet(s, 268, 176, 52, 40);
  o += crate(s, 270, 178, 7, 24, 18, 16, 'white', ICON.wrench('#D7262F')) + crate(s, 296, 178, 7, 22, 18, 16, 'dark', ICON.gear('#fff')) + crate(s, 282, 196, 7, 24, 18, 14, 'white', ICON.gear('#D7262F'));
  return svg('Isometric maintenance bay: technician servicing a robot arm, torque tool, paint system, tool chest and an availability dashboard', o);
}

/* 6 — Deliver */
function deliver() {
  const s = origin();
  let o = slab(s, 340, 240);
  o += s.box(0, 96, 0, 340, 82, 1.6, 'dark');
  o += s.planeT(0, 96, 1.6, `<rect y="2" width="340" height="1.6" fill="#F4F6F8" opacity=".85"/><rect y="78.4" width="340" height="1.6" fill="#F4F6F8" opacity=".85"/><line class="dashflow" x1="0" y1="40" x2="340" y2="40" stroke="#F4F6F8" stroke-width="2" stroke-dasharray="10 8"/>`);

  // plant
  o += s.box(10, 10, 0, 104, 70, 44, 'white');
  [0, 1, 2].forEach((i) => { o += s.box(10 + i * 35, 10, 44, 34, 70, 8, 'red'); });
  o += s.planeX(10, 80, 44, `<rect x="34" y="14" width="36" height="30" fill="#2A2E35"/><g stroke="#4B515B" stroke-width="1.2">${[20, 26, 32, 38].map((v) => `<line x1="34" y1="${v}" x2="70" y2="${v}"/>`).join('')}</g>` + txt(52, 8, 'PLANT', 6.5, '#D7262F', ' text-anchor="middle"'));
  o += s.cyl(96, 24, 52, 5, 22, 'dark');
  // distribution centre
  o += s.box(150, 10, 0, 170, 60, 34, 'steel');
  o += s.box(150, 10, 34, 170, 60, 4, 'red');
  o += s.planeX(150, 70, 34, [0, 1, 2, 3].map((i) => `<rect x="${10 + i * 40}" y="8" width="28" height="26" fill="#2A2E35"/><rect x="${10 + i * 40}" y="8" width="28" height="9" fill="#4B515B"/>`).join('') + txt(85, 6, 'DISTRIBUTION CENTER', 5.5, '#2E3238', ' text-anchor="middle"'));

  const colors = ['red', 'white', 'dark'];
  const cars = colors.map((c, i) => mv(car(s, 4, 102, 1.6, { L: 64, W: 32, pal: c }), 260, 14, -i * 4.7)).join('');
  o += cars;

  const truck = mv(
    s.box(0, 140, 4, 118, 34, 6, 'dark') + s.box(0, 140, 10, 118, 34, 1.5, 'steel') +
    car(s, 4, 142, 11.5, { L: 52, W: 30, pal: 'red', noShadow: true }) + car(s, 60, 142, 11.5, { L: 52, W: 30, pal: 'white', noShadow: true }) +
    s.box(120, 140, 4, 34, 34, 30, 'red') + s.box(144, 142, 18, 10, 30, 14, 'dark') +
    s.planeX(0, 174, 10, [14, 40, 80, 102, 136].map((u) => `<circle cx="${u}" cy="6" r="8" fill="#1F2227"/><circle cx="${u}" cy="6" r="3.4" fill="#AEB5BF"/>`).join('')),
    190, 15, -5);
  o += truck;

  // dealer
  o += s.box(206, 190, 0, 114, 44, 30, 'white');
  o += s.box(202, 232, 22, 122, 8, 5, 'red');
  o += s.planeX(206, 234, 30, `<rect x="8" y="2" width="98" height="12" fill="#CFE6F2" opacity=".0"/>` + txt(57, -4, 'DEALER', 6.5, '#D7262F', ' text-anchor="middle"'));
  o += s.planeX(206, 234, 22, `<rect x="6" y="3" width="102" height="19" fill="#CFE6F2"/><g transform="translate(36 15) scale(2.4)">${ICON.car('#D7262F')}</g><g transform="translate(78 15) scale(2.4)">${ICON.car('#5B626D')}</g>`);
  const [px, py] = s.p(263, 205, 64);
  o += `<g transform="translate(${px} ${py})"><ellipse class="ping" cx="0" cy="32" rx="12" ry="5" fill="none" stroke="#D7262F" stroke-width="2"/><g class="float" style="--d:0s"><path d="M0 28 C-14 10 -12 -10 0 -10 C12 -10 14 10 0 28Z" fill="#D7262F"/><circle cy="-0.5" r="5" fill="#fff"/></g></g>`;
  o += tower(s, 332, 100, 0, 'g');
  return svg('Isometric logistics scene: finished cars leave the plant, move along the road by car carrier to the distribution center and dealer', o);
}

/* 7 — Serve */
function serve() {
  const s = origin();
  let o = slab(s, 340, 240);
  const tile = (x, ic, label, i) => `<g class="tile" style="--i:${i}"><rect x="${x}" y="8" width="52" height="46" rx="3" fill="#2A3039"/><g transform="translate(${x + 26} 26) scale(1.7)">${ic}</g>${txt(x + 26, 48, label, 5.5, '#E4E9EE', ' text-anchor="middle"')}</g>`;
  const content = tile(6, ICON.wrench('#E8505A'), 'REPAIR', 0) + tile(64, ICON.shield('#E8505A'), 'WARRANTY', 1) + tile(122, ICON.warn('#E8505A'), 'RECALL', 2) + tile(180, ICON.cloud('#E8505A'), 'OTA UPDATE', 3) +
    `<rect x="6" y="62" width="226" height="6" rx="3" fill="#333A44"/><rect class="progress" x="6" y="62" width="226" height="6" rx="3" fill="#3DE08B"/>`;
  o += board(s, 40, 10, 40, 238, 74, content);

  // bay markings
  o += s.planeT(90, 70, 0, `<rect x="2" y="2" width="176" height="106" fill="none" stroke="#F5B031" stroke-width="2.4" stroke-dasharray="10 6"/>`);
  // lift
  o += s.box(146, 76, 0, 7, 7, 80, 'red');
  const lift = `<g class="lift">` +
    s.box(144, 92, 3, 14, 62, 3, 'dark') + s.box(114, 98, 5, 78, 4, 3, 'grey') + s.box(114, 140, 5, 78, 4, 3, 'grey') +
    car(s, 122, 98, 0, { L: 100, W: 44, pal: 'red', noShadow: true }) + `</g>`;
  o += s.shadow(118, 94, 108, 52, 0, 0.12);
  o += lift;
  o += s.box(146, 162, 0, 7, 7, 80, 'red');
  o += s.box(143, 74, 80, 13, 98, 5, 'red');

  const [wx, wy] = s.p(172, 124, 118);
  o += [0, 1, 2].map((i) => `<path class="wave" style="--i:${i}" d="M${wx - 10 - i * 8} ${wy - i * 5 + 4} Q${wx} ${wy - 12 - i * 8} ${wx + 10 + i * 8} ${wy - i * 5 + 4}" fill="none" stroke="#D7262F" stroke-width="2.4" stroke-linecap="round"/>`).join('');

  o += cabinet(s, 36, 160, 0, 'a');
  o += worker(...s.p(98, 196, 0), { pose: 'tablet' });
  o += s.box(266, 176, 0, 44, 28, 26, 'red');
  o += s.planeX(266, 204, 26, `<rect x="4" y="4" width="36" height="7" rx="1" fill="#A51A22"/><rect x="4" y="14" width="36" height="7" rx="1" fill="#A51A22"/>`);
  o += s.cyl(322, 214, 0, 10, 8, 'black') + s.cyl(322, 214, 8, 5, 0.6, 'grey');
  return svg('Isometric service bay: a car on a two-post lift, technician with diagnostic tablet, warranty, recall and software update display', o);
}

/* 8 — Learn & Improve */
function learn() {
  const s = origin();
  let o = slab(s, 340, 240);
  const dash = txt(8, 14, 'DEFECT RATE', 5.5) + txt(128, 14, 'FIX SPEED', 5.5) +
    `<path d="M8 66H112M8 46H112M8 26H112" stroke="#2B313A"/>` +
    line('8,28 24,32 40,36 56,44 72,50 90,56 112,60', '#3DE08B', 2.2) +
    line('8,34 30,34 52,42 74,48 96,54 112,58', '#E8505A', 1.4) +
    bars(128, 24, 62, 44, [0.35, 0.5, 0.62, 0.75, 0.9], '#E8505A') + `<path d="M196 40 l8 -8 l8 8 M204 32 v24" stroke="#3DE08B" stroke-width="2.2" fill="none" transform="translate(4 4)"/>` + txt(214, 56, '-38%', 9, '#fff');
  o += board(s, 40, 8, 40, 250, 78, dash);

  // loop track
  const TX = 60, TY = 62, LX = 220, LY = 116;
  o += s.planeT(0, 0, 0,
    `<rect x="${TX}" y="${TY}" width="${LX}" height="${LY}" rx="14" fill="none" stroke="#3E444D" stroke-width="16"/>` +
    `<rect x="${TX - 8}" y="${TY - 8}" width="${LX + 16}" height="${LY + 16}" rx="20" fill="none" stroke="#D7262F" stroke-width="2"/>` +
    `<rect x="${TX + 8}" y="${TY + 8}" width="${LX - 16}" height="${LY - 16}" rx="8" fill="none" stroke="#D7262F" stroke-width="2"/>` +
    `<rect class="dashflow" x="${TX}" y="${TY}" width="${LX}" height="${LY}" rx="14" fill="none" stroke="#F4F6F8" stroke-width="2" stroke-dasharray="8 10"/>`);
  // centre loop hologram
  o += s.planeT(170, 120, 0.5, `<g class="spin" style="transform-origin:0px 0px"><path d="M30 0 A30 30 0 0 1 0 30" fill="none" stroke="#D7262F" stroke-width="5" stroke-linecap="round"/><path d="M-30 0 A30 30 0 0 1 0 -30" fill="none" stroke="#2E3238" stroke-width="5" stroke-linecap="round"/><path d="M-5 38 L5 30 L-5 22 Z" fill="#D7262F"/><path d="M5 -38 L-5 -30 L5 -22 Z" fill="#2E3238"/></g>`);
  o += s.cyl(170, 120, 0, 12, 4, 'red');
  const [cx, cy] = s.p(170, 120, 12);
  o += `<g transform="translate(${cx} ${cy})"><g class="float" style="--d:0s"><g transform="scale(1.6)">${ICON.gear('#2E3238')}</g></g></g>`;

  // nodes
  o += s.box(6, 8, 0, 50, 44, 26, 'white') + s.box(6, 8, 26, 50, 44, 5, 'red') + s.cyl(42, 22, 31, 4, 16, 'dark');
  o += s.planeX(6, 52, 26, `<rect x="6" y="6" width="38" height="14" fill="#2A2E35"/>` + txt(25, -3, 'PRODUCTION', 5, '#D7262F', ' text-anchor="middle"'));
  o += s.box(286, 12, 0, 48, 44, 30, 'steel');
  o += s.planeX(286, 56, 30, `<rect x="4" y="4" width="40" height="19" rx="1.5" fill="#1D2127"/>` + line('8,18 16,12 24,15 32,8 40,10', '#E8505A', 1.4) + txt(24, -4, 'ENGINEERING', 5, '#D7262F', ' text-anchor="middle"'));

  const tok = (pal, ic) => crate(s, TX - 8, TY - 8, 0, 16, 16, 12, pal, ic);
  const specs = [['red', ICON.warn('#fff')], ['white', ICON.chat()], ['dark', ICON.car('#fff')], ['red', ICON.warn('#fff')], ['white', ICON.chat()]];
  o += specs.map(([pal, ic], i) =>
    `<g class="orbit" style="--ax:${r(LX * K)}px;--ay:${r(LX * 0.5)}px;--bx:${r(-LY * K)}px;--by:${r(LY * 0.5)}px;--delay:${-i * 3.6}s">${tok(pal, ic)}</g>`).join('');

  const inputs = [['FIELD', ICON.car('#D7262F'), 74], ['DEFECTS', ICON.warn('#D7262F'), 134], ['FEEDBACK', ICON.chat('#D7262F'), 194]];
  inputs.forEach(([t, ic, x]) => {
    o += s.box(x, 200, 0, 48, 26, 16, 'white');
    o += s.planeX(x, 226, 16, `<g transform="translate(12 -1)"><g transform="scale(1.4)">${ic}</g></g>` + txt(30, 10, t, 5.5, '#2E3238', ' text-anchor="middle"'));
  });
  o += tower(s, 326, 200, 0, 'cycle');
  return svg('Isometric feedback loop: field failures, defects and customer feedback circulate on a track back to engineering and production', o);
}

module.exports = { scenes: [design, plan, make, quality, maintain, deliver, serve, learn].map((f) => f()) };
