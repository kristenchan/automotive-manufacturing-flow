'use strict';
const { PAL, K, r } = require('./iso');

let clipCount = 0;
const mv = (content, len, dur, delay, cls = '') =>
  `<g class="mv ${cls}" style="--dx:${r(len * K)}px;--dy:${r(len * 0.5)}px;--dur:${dur}s;--delay:${delay}s">${content}</g>`;

function slab(s, W, D) {
  let g = s.box(-6, -6, -18, W + 12, D + 12, 14, 'black') +
    s.box(-6, -6, -4, W + 12, D + 12, 4, { top: '#EEF1F4', left: '#D5DBE2', right: '#B8C0CA' });
  let lines = '';
  for (let i = 40; i < W; i += 40) lines += `<line x1="${i}" y1="0" x2="${i}" y2="${D}"/>`;
  for (let j = 40; j < D; j += 40) lines += `<line x1="0" y1="${j}" x2="${W}" y2="${j}"/>`;
  g += s.planeT(0, 0, 0, `<g stroke="#DCE2E8" stroke-width="1">${lines}</g>`);
  return g;
}

function crate(s, x, y, z, w, d, h, pal = 'white', icon = '') {
  let g = s.box(x, y, z, w, d, h, pal);
  g += s.poly([[x + w * 0.42, y, z + h], [x + w * 0.58, y, z + h], [x + w * 0.58, y + d, z + h], [x + w * 0.42, y + d, z + h]], '#C7CED6', { sw: 0 });
  if (icon) g += s.planeX(x, y + d, z + h, `<g transform="translate(${r(w / 2)} ${r(h / 2)})">${icon}</g>`);
  return g;
}

const ICON = {
  bolt: (c = '#D7262F', k = 1) => `<path transform="scale(${k})" d="M1.5 -6 L-4 1 H0 L-1.5 7 L4 -1 H0 Z" fill="${c}"/>`,
  chip: (c = '#9AA3AF') => `<rect x="-4" y="-4" width="8" height="8" fill="#2E3238"/><g stroke="${c}" stroke-width="1.2"><path d="M-6 -2h2M-6 2h2M4 -2h2M4 2h2M-2 -6v2M2 -6v2M-2 4v2M2 4v2"/></g>`,
  shield: (c = '#D7262F') => `<path d="M0 -8 L7 -5 V1 Q7 6 0 9 Q-7 6 -7 1 V-5 Z" fill="${c}"/><path d="M-3 0 L-1 2.5 L3.5 -2.5" stroke="#fff" stroke-width="1.8" fill="none"/>`,
  gear: (c = '#D7262F') => `<circle r="5.5" fill="none" stroke="${c}" stroke-width="3.5" stroke-dasharray="3.2 2.4"/><circle r="3.2" fill="${c}"/><circle r="1.2" fill="#fff"/>`,
  list: (c = '#D7262F') => `<g stroke="${c}" stroke-width="2" stroke-linecap="round"><path d="M-6 -4h12M-6 0h12M-6 4h8"/></g>`,
  wrench: (c = '#D7262F') => `<g transform="rotate(-45)"><rect x="-1.7" y="-2" width="3.4" height="11" rx="1.4" fill="${c}"/><circle cy="-4.5" r="4" fill="${c}"/><rect x="-1.3" y="-9" width="2.6" height="5" fill="#2A3039"/></g>`,
  warn: (c = '#D7262F') => `<path d="M0 -8 L8 6 H-8 Z" fill="${c}"/><path d="M0 -3v5" stroke="#fff" stroke-width="1.8"/><circle cy="4" r="1" fill="#fff"/>`,
  cloud: (c = '#D7262F') => `<path d="M-6 3 Q-8 -2 -3 -3 Q-1 -8 4 -5 Q9 -4 7 3 Z" fill="${c}"/><path d="M0 -1 V6 M-2.5 3.5 L0 6.5 L2.5 3.5" stroke="#fff" stroke-width="1.6" fill="none"/>`,
  check: (c = '#2DB872') => `<path d="M-6 0 L-2 4 L6 -5" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  car: (c = '#D7262F') => `<path d="M-8 3 V-1 Q-8 -3 -5 -3 L-3 -6 H3 L6 -3 Q9 -3 9 -1 V3 Z" fill="${c}"/><circle cx="-4" cy="3.5" r="2" fill="#23262B"/><circle cx="5" cy="3.5" r="2" fill="#23262B"/>`,
  chat: (c = '#D7262F') => `<path d="M-7 -5 H7 V3 H0 L-4 7 V3 H-7 Z" fill="${c}"/><path d="M-3 -1h6" stroke="#fff" stroke-width="1.4"/>`,
};

function pallet(s, x, y, w, d) {
  let g = s.box(x, y, 0, w, d, 7, 'red');
  const gap = (u) => `<rect x="${r(w * u)}" y="1.5" width="${r(w * 0.14)}" height="4" fill="#2A2E35"/>`;
  g += s.planeX(x, y + d, 7, gap(0.12) + gap(0.43) + gap(0.74));
  return g;
}

function conveyor(s, x, y, len, w, h, items = '') {
  let back = '';
  const n = Math.max(2, Math.round(len / 80) + 1);
  const lx = [];
  for (let i = 0; i < n; i++) lx.push(8 + (i * (len - 16)) / (n - 1));
  lx.forEach((u) => { back += s.box(x + u - 3, y + 1, 0, 6, 6, h - 4, 'red'); });
  back += s.box(x, y, h - 10, len, 5, 12, 'red');
  back += s.box(x, y + 5, h - 8, len, w - 10, 8, 'black');
  let chev = '';
  for (let u = -16; u < len; u += 16) chev += `<path d="M${u} ${(w - 10) * 0.3} l5 ${(w - 10) * 0.2} l-5 ${(w - 10) * 0.2}"/>`;
  const cid = `cl${clipCount++}`;
  back += s.planeT(x, y + 5, h, `<clipPath id="${cid}"><rect width="${len}" height="${w - 10}"/></clipPath><g clip-path="url(#${cid})"><g class="belt-chev" fill="none" stroke="#5B626D" stroke-width="1.6">${chev}</g></g>`);
  let front = '';
  front += s.box(x, y + w - 5, h - 24, len, 5, 14, 'dark');
  front += s.box(x, y + w - 5, h - 10, len, 5, 12, 'red');
  lx.forEach((u) => { front += s.box(x + u - 3, y + w - 7, 0, 6, 6, h - 24, 'red'); });
  let dots = '';
  for (let u = 8; u < len - 4; u += 12) dots += `<circle cx="${u}" cy="7" r="2.2"/>`;
  front += s.planeX(x, y + w, h - 10, `<g fill="#8F97A3">${dots}</g>`);
  return { under: back, over: front, all: back + items + front };
}

function tower(s, x, y, z, mode = 'cycle') {
  const [cx, cy] = s.p(x, y, z + 28);
  let g = s.cyl(x, y, z, 2.2, 10, 'dark');
  const lamps = [['green', 'g'], ['amber', 'a'], ['red', 'r']];
  lamps.forEach(([pal, k], i) => {
    const cls = mode === 'cycle' ? 'lamp' : mode === k ? 'lamp-slow' : 'lamp-off';
    const d = mode === 'cycle' ? ` style="--d:${-(3 - i)}s"` : '';
    g += `<g class="${cls}"${d}>${s.cyl(x, y, z + 10 + i * 6, 4.5, 6, pal)}</g>`;
  });
  const gl = mode === 'cycle' ? 'r' : mode;
  g += `<circle class="halo" cx="${cx}" cy="${r(cy + 6)}" r="16" fill="url(#glow-${gl})"/>`;
  g += s.cyl(x, y, z + 28, 4.5, 2, 'dark');
  return g;
}

function cabinet(s, x, y, z, mode = 'green') {
  let g = s.box(x, y, z, 34, 28, 36, 'white');
  g += s.planeX(x, y + 28, z + 36,
    `<rect x="4" y="5" width="26" height="15" rx="2" fill="#2A2E35"/>` +
    `<polyline class="draw" pathLength="100" points="6,16 11,12 15,15 20,8 25,11 28,7" fill="none" stroke="#3DE08B" stroke-width="1.4"/>` +
    `<circle cx="9" cy="28" r="2" fill="#D7262F"/><circle cx="16" cy="28" r="2" fill="#F5B031"/><circle class="blink" cx="23" cy="28" r="2" fill="#2DB872"/>`);
  g += tower(s, x + 26, y + 6, z + 36, mode);
  return g;
}

function board(s, x, y, z, w, h, content) {
  let g = s.box(x + 10, y + 1, 0, 6, 4, z, 'dark') + s.box(x + w - 16, y + 1, 0, 6, 4, z, 'dark');
  g += s.box(x - 3, y, z - 3, w + 6, 5, h + 6, 'black');
  g += s.planeX(x, y + 5.2, z + h, `<rect width="${w}" height="${h}" rx="2" fill="#1D2127"/>${content}`);
  return g;
}

const txt = (x, y, t, size = 7, fill = '#9AA3AF', extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="700" fill="${fill}" font-family="Segoe UI,Arial,sans-serif" letter-spacing=".6"${extra}>${t}</text>`;

function pie(cx, cy, rad) {
  const c = (col, a, b) => `<circle cx="${cx}" cy="${cy}" r="${rad / 2}" fill="none" stroke="${col}" stroke-width="${rad}" pathLength="100" stroke-dasharray="${a} ${100 - a}" stroke-dashoffset="${-b}"/>`;
  return `<g class="spin" style="transform-origin:${cx}px ${cy}px"><g transform="rotate(-90 ${cx} ${cy})">${c('#D7262F', 38, 0)}${c('#F4F6F8', 24, 38)}${c('#6B7380', 38, 62)}</g></g>`;
}

function bars(x, y, w, h, vals, col = '#D7262F') {
  const bw = w / vals.length;
  return vals.map((v, i) => `<rect class="bar" style="--i:${i}" x="${r(x + i * bw + 1)}" y="${r(y + h - v * h)}" width="${r(bw - 2.5)}" height="${r(v * h)}" fill="${col}"/>`).join('');
}

function fence(s, axis, x, y, z, len, h) {
  let lines = '';
  for (let i = 0; i <= len; i += 6) lines += `<line x1="${i}" y1="0" x2="${i}" y2="${h}"/>`;
  for (let j = 0; j <= h; j += 6) lines += `<line x1="0" y1="${j}" x2="${len}" y2="${j}"/>`;
  const content = `<rect width="${len}" height="${h}" fill="rgba(255,255,255,.18)"/><g stroke="#4B515B" stroke-width=".7" opacity=".75">${lines}</g><rect width="${len}" height="${h}" fill="none" stroke="#D7262F" stroke-width="2.4"/>`;
  if (axis === 'x') {
    return s.planeX(x, y, z + h, content) + s.box(x - 1.5, y - 1.5, z, 3, 3, h + 2, 'red') + s.box(x + len - 1.5, y - 1.5, z, 3, 3, h + 2, 'red');
  }
  return s.planeY(x, y, z + h, content) + s.box(x - 1.5, y - 1.5, z, 3, 3, h + 2, 'red') + s.box(x - 1.5, y + len - 1.5, z, 3, 3, h + 2, 'red');
}

// Pass-through gantry over a belt running along x. Returns the back pillar and the front part (beam + pillar).
function gantry(s, x, y0, xd, span, h, pal = 'white') {
  const back = s.box(x, y0, 0, xd, 7, h, pal);
  const front = s.box(x, y0 + span - 7, 0, xd, 7, h, pal) + s.box(x - 1, y0 - 1, h - 12, xd + 2, span + 2, 12, 'red');
  return { back, front };
}

function worker(sx, sy, o = {}) {
  const sc = o.s || 1;
  const fl = o.flip ? -1 : 1;
  const pose = o.pose || 'panel';
  let arm = '';
  if (pose === 'panel') {
    arm = `<g class="w-arm"><path d="M12 -85 Q26 -80 35 -76" stroke="#D7262F" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="37" cy="-75" r="4.6" fill="#E2B592"/></g>`;
  } else if (pose === 'tablet') {
    arm = `<g class="w-arm"><path d="M12 -85 Q24 -76 26 -88" stroke="#D7262F" stroke-width="9" fill="none" stroke-linecap="round"/><g transform="rotate(-12 28 -92)"><rect x="19" y="-108" width="17" height="22" rx="2" fill="#2A2E35"/><rect x="21" y="-106" width="13" height="18" rx="1" fill="#7FB7D6"/><circle cx="27" cy="-100" r="2.2" fill="#fff"/></g><circle cx="26" cy="-87" r="4.4" fill="#E2B592"/></g>`;
  } else if (pose === 'wrench') {
    arm = `<g class="w-arm"><path d="M12 -85 Q28 -88 36 -74" stroke="#D7262F" stroke-width="9" fill="none" stroke-linecap="round"/><g class="wrench"><path d="M36 -72 L52 -56" stroke="#AEB5BF" stroke-width="4" stroke-linecap="round"/><circle cx="54" cy="-54" r="5" fill="none" stroke="#AEB5BF" stroke-width="3" stroke-dasharray="20 6"/></g><circle cx="37" cy="-74" r="4.6" fill="#E2B592"/></g>`;
  }
  return `<g transform="translate(${sx} ${sy}) scale(${fl * sc} ${sc})">` +
    `<ellipse cx="0" cy="2" rx="22" ry="7" fill="#1c2230" opacity=".16"/>` +
    `<path d="M-14 -88 Q-21 -68 -15 -52" stroke="#A51A22" stroke-width="8" fill="none" stroke-linecap="round"/>` +
    `<rect x="-13" y="-52" width="12" height="44" rx="2" fill="#2E3238"/><rect x="1" y="-52" width="12" height="44" rx="2" fill="#23262B"/>` +
    `<path d="M-14 -8 h14 v8 h-17 q-1 -6 3 -8z" fill="#15171A"/><path d="M1 -8 h14 q4 2 3 8 h-17z" fill="#0F1114"/>` +
    `<path d="M-16 -88 Q-16 -95 -9 -95 H9 Q16 -95 16 -88 V-50 H-16 Z" fill="#D7262F"/><path d="M0 -95 H9 Q16 -95 16 -88 V-50 H0 Z" fill="#000" opacity=".16"/>` +
    `<rect x="-16" y="-70" width="32" height="3.2" fill="#F4F6F8"/>` +
    `<rect x="-3.5" y="-99" width="7" height="6" fill="#E2B592"/>` +
    `<ellipse cx="0" cy="-106" rx="10.5" ry="11" fill="#E2B592"/>` +
    `<path d="M-11 -107 Q-11 -120 0 -120 Q11 -120 11 -107 Z" fill="#D7262F"/><path d="M-11 -107 H15 Q17 -105 14 -103.5 H-11 Z" fill="#A51A22"/>` +
    arm + `</g>`;
}

function arm(sx, sy, o = {}) {
  const sc = o.s || 1;
  const fl = o.flip ? -1 : 1;
  const d = o.delay || 0;
  const tool = o.tool === 'weld'
    ? `<g class="a-grip"><rect x="90" y="-143" width="18" height="12" fill="#3E444D"/><path d="M99 -131 L99 -112" stroke="#8F97A3" stroke-width="4" stroke-linecap="round"/><g class="spark" style="transform-origin:99px -108px"><path d="M99 -112 l-7 -5 M99 -112 l7 -6 M99 -112 l0 -9 M99 -112 l-9 3 M99 -112 l9 3" stroke="#FFC247" stroke-width="2" stroke-linecap="round"/><circle cx="99" cy="-111" r="5" fill="#FFF3C4"/></g></g>`
    : o.tool === 'spray'
      ? `<g class="a-grip"><rect x="90" y="-143" width="18" height="12" fill="#3E444D"/><path d="M95 -131 h8 l-2 12 h-4z" fill="#8F97A3"/><g class="spray"><path d="M99 -119 L84 -88 M99 -119 L114 -88" stroke="#D7262F" stroke-width="1.6" opacity=".5"/><path d="M99 -119 L84 -88 L114 -88 Z" fill="#D7262F" opacity=".22"/></g></g>`
      : o.tool === 'cam'
        ? `<g class="a-grip"><rect x="88" y="-143" width="22" height="12" fill="#3E444D"/><circle cx="99" cy="-128" r="7" fill="#23262B"/><circle cx="99" cy="-128" r="3.6" fill="#7FB7D6"/><g class="spray"><path d="M99 -121 L86 -88 H112 Z" fill="#7FB7D6" opacity=".28"/></g></g>`
        : `<g class="a-grip"><rect x="90" y="-143" width="20" height="12" fill="#3E444D"/><rect class="finger-l" x="91" y="-131" width="4.5" height="17" fill="#2A2E35"/><rect class="finger-r" x="104.5" y="-131" width="4.5" height="17" fill="#2A2E35"/></g>`;
  return `<g transform="translate(${sx} ${sy}) scale(${fl * sc} ${sc})"><g style="--d:${d}s">` +
    `<ellipse cx="0" cy="0" rx="40" ry="20" fill="#2E3238"/><ellipse cx="0" cy="-5" rx="35" ry="17" fill="#4B515B"/>` +
    `<rect x="-24" y="-36" width="48" height="31" fill="url(#gc-red)"/><ellipse cx="0" cy="-36" rx="24" ry="12" fill="#E8505A"/>` +
    `<g class="a-j1"><rect x="-12" y="-150" width="24" height="104" rx="12" fill="url(#gc-red)"/><rect x="2" y="-140" width="4" height="84" rx="2" fill="#000" opacity=".12"/>` +
    `<circle cx="0" cy="-52" r="18" fill="#A51A22"/><circle cx="0" cy="-52" r="12" fill="#D7262F"/><circle cx="0" cy="-52" r="4" fill="#2A2E35"/>` +
    `<g class="a-j2"><rect x="-11" y="-161" width="110" height="22" rx="11" fill="url(#gc-red)"/><rect x="6" y="-150" width="86" height="3" rx="1.5" fill="#000" opacity=".14"/>` +
    tool + `<circle cx="0" cy="-150" r="16" fill="#A51A22"/><circle cx="0" cy="-150" r="10" fill="#D7262F"/><circle cx="0" cy="-150" r="3.5" fill="#2A2E35"/><circle cx="99" cy="-150" r="9" fill="#3E444D"/></g></g>` +
    `</g></g>`;
}

function car(s, x, y, z, o = {}) {
  const L = o.L || 100;
  const W = o.W || 46;
  const late = o.late ? ' late' : '';
  const P = PAL[o.pal || 'red'];
  const C = { top: `var(--ct,${P.top})`, left: `var(--cl,${P.left})`, right: `var(--cr,${P.right})` };
  const lerp = (a, b, u) => a.map((v, i) => v + (b[i] - v) * u);
  let g = o.noShadow ? '' : s.shadow(x - 3, y - 3, L + 8, W + 8, z, 0.18);
  g += s.box(x, y, z + 6, L, W, 16, C);
  const xa = x + L * 0.24, xb = x + L * 0.76, ya = y + 4, yb = y + W - 4;
  const z0 = z + 22, z1 = z + 38, s1 = 10, s2 = 14, t = 3;
  const A = [xa, yb, z0], B = [xb, yb, z0], Cc = [xb - s2, yb - t, z1], D = [xa + s1, yb - t, z1];
  const Ar = [xb, ya, z0], Br = [xb, yb, z0], Cr = [xb - s2, yb - t, z1], Dr = [xb - s2, ya + t, z1];
  const fq = (a, b, c, d) => (u1, u2, v1, v2) => {
    const f = (u, v) => lerp(lerp(a, b, u), lerp(d, c, u), v);
    return [f(u1, v1), f(u2, v1), f(u2, v2), f(u1, v2)];
  };
  g += s.poly([Ar, Br, Cr, Dr], C.right);
  g += s.poly([A, B, Cc, D], C.left);
  g += s.poly([[xa + s1, ya + t, z1], [xb - s2, ya + t, z1], [xb - s2, yb - t, z1], [xa + s1, yb - t, z1]], C.top);
  const gl = '#2F3E4B';
  const lf = fq(A, B, Cc, D);
  const rf = fq(Ar, Br, Cr, Dr);
  g += s.poly(lf(0.07, 0.47, 0.14, 0.86), gl, { cls: 'glass' + late });
  g += s.poly(lf(0.53, 0.93, 0.14, 0.86), gl, { cls: 'glass' + late });
  g += s.poly(rf(0.08, 0.92, 0.12, 0.86), '#3A4C5B', { cls: 'glass' + late });
  g += s.planeY(x + L, y, z + 22,
    `<rect x="4" y="3" width="11" height="5" rx="1.5" fill="#FFF7D6"/><rect x="${W - 15}" y="3" width="11" height="5" rx="1.5" fill="#FFF7D6"/>` +
    `<rect x="${r(W * 0.32)}" y="5" width="${r(W * 0.36)}" height="6" rx="1" fill="#23262B"/><rect x="2" y="12" width="${W - 4}" height="4" rx="1" fill="#3E444D"/>`);
  g += s.planeX(x, y + W, z + 22,
    `<rect x="2" y="7.5" width="${L - 4}" height="1.2" fill="#000" opacity=".14"/>` +
    `<rect x="${L * 0.36}" y="0" width=".9" height="13" fill="#000" opacity=".22"/><rect x="${L * 0.64}" y="0" width=".9" height="13" fill="#000" opacity=".22"/>` +
    `<rect x="${L * 0.5}" y="3" width="6" height="1.6" rx=".8" fill="#000" opacity=".28"/>` +
    `<g class="wheel${late}">` + [0.2, 0.8].map((u) => `<circle cx="${L * u}" cy="13" r="10.6" fill="#1F2227"/><circle cx="${L * u}" cy="13" r="8.6" fill="#2A2E35"/><circle cx="${L * u}" cy="13" r="4.2" fill="#C4CAD2"/><circle cx="${L * u}" cy="13" r="1.4" fill="#5B626D"/>`).join('') + `</g>`);
  return g;
}

module.exports = { mv, slab, crate, ICON, pallet, conveyor, tower, cabinet, board, txt, pie, bars, fence, gantry, worker, arm, car };
