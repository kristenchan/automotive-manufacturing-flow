'use strict';
// Isometric projection helpers. World axes: +x runs down-right (30deg), +y runs down-left (30deg), +z is up.
const K = Math.sqrt(3) / 2;
const r = (n) => Math.round(n * 100) / 100;

const PAL = {
  white: { top: '#FFFFFF', left: '#E4E9EE', right: '#C6CED7' },
  steel: { top: '#EEF1F4', left: '#CDD4DB', right: '#AEB7C2' },
  grey: { top: '#CDD3DA', left: '#AEB5BF', right: '#8F97A3' },
  red: { top: '#E8505A', left: '#D7262F', right: '#A51A22' },
  dark: { top: '#5B626D', left: '#3E444D', right: '#292D34' },
  black: { top: '#2E3238', left: '#23262B', right: '#191B1F' },
  glass: { top: '#EAF6FB', left: '#C3E0EE', right: '#9CC5D8' },
  amber: { top: '#FFD27A', left: '#F5B031', right: '#C98A12' },
  green: { top: '#7BE0A4', left: '#2DB872', right: '#1E8A54' },
};

const GRAD = (name, p) =>
  `<linearGradient id="gc-${name}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${p.left}"/><stop offset=".55" stop-color="${p.left}"/><stop offset="1" stop-color="${p.right}"/></linearGradient>`;

function defs() {
  return Object.keys(PAL).map((k) => GRAD(k, PAL[k])).join('') +
    '<radialGradient id="glow-r"><stop offset="0" stop-color="#FF5A5F" stop-opacity=".9"/><stop offset="1" stop-color="#FF5A5F" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="glow-g"><stop offset="0" stop-color="#3DE08B" stop-opacity=".9"/><stop offset="1" stop-color="#3DE08B" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="glow-a"><stop offset="0" stop-color="#FFC247" stop-opacity=".9"/><stop offset="1" stop-color="#FFC247" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="beam" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#E8505A" stop-opacity=".05"/><stop offset=".5" stop-color="#E8505A" stop-opacity=".45"/><stop offset="1" stop-color="#E8505A" stop-opacity=".05"/></linearGradient>';
}

class Iso {
  constructor(ox, oy) {
    this.ox = ox;
    this.oy = oy;
  }
  p(x, y, z = 0) {
    return [r(this.ox + (x - y) * K), r(this.oy + (x + y) * 0.5 - z)];
  }
  pts(a) {
    return a.map((q) => this.p(q[0], q[1], q[2]).join(',')).join(' ');
  }
  poly(a, fill, o = {}) {
    const st = o.stroke || fill;
    const cls = o.cls ? ` class="${o.cls}"` : '';
    const op = o.op != null ? `;opacity:${o.op}` : '';
    const sw = o.sw != null ? o.sw : 0.5;
    return `<polygon${cls} points="${this.pts(a)}" style="fill:${fill};stroke:${st};stroke-width:${sw}${op}" stroke-linejoin="round"/>`;
  }
  box(x, y, z, w, d, h, pal, o = {}) {
    const P = typeof pal === 'string' ? PAL[pal] : pal;
    const top = [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]];
    const left = [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]];
    const right = [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]];
    const c = o.cls ? ` class="${o.cls}"` : '';
    return `<g${c}>${this.poly(left, P.left)}${this.poly(right, P.right)}${this.poly(top, P.top)}</g>`;
  }
  // Plane facing +y (spans x and z). local u -> +x, v -> down. Anchor = top-left corner.
  planeX(x, y, z, content, extra = '') {
    const [sx, sy] = this.p(x, y, z);
    return `<g transform="matrix(${r(K)} .5 0 1 ${sx} ${sy})"${extra}>${content}</g>`;
  }
  // Plane facing +x (spans y and z). local u -> +y, v -> down. Anchor = top corner at smallest y.
  planeY(x, y, z, content, extra = '') {
    const [sx, sy] = this.p(x, y, z);
    return `<g transform="matrix(${-r(K)} .5 0 1 ${sx} ${sy})"${extra}>${content}</g>`;
  }
  // Horizontal plane. local u -> +x, v -> +y.
  planeT(x, y, z, content, extra = '') {
    const [sx, sy] = this.p(x, y, z);
    return `<g transform="matrix(${r(K)} .5 ${-r(K)} .5 ${sx} ${sy})"${extra}>${content}</g>`;
  }
  cyl(x, y, z, rad, h, pal, o = {}) {
    const P = typeof pal === 'string' ? PAL[pal] : pal;
    const name = typeof pal === 'string' ? pal : null;
    const [cx, cy] = this.p(x, y, z);
    const rx = r(rad * K * Math.SQRT2);
    const ry = r(rad * Math.SQRT1_2);
    const side = name ? `url(#gc-${name})` : P.left;
    const c = o.cls ? ` class="${o.cls}"` : '';
    return `<g${c}><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" style="fill:${side}"/><rect x="${r(cx - rx)}" y="${r(cy - h)}" width="${r(rx * 2)}" height="${h}" style="fill:${side}"/><ellipse cx="${cx}" cy="${r(cy - h)}" rx="${rx}" ry="${ry}" style="fill:${P.top}"/></g>`;
  }
  shadow(x, y, w, d, z = 0, op = 0.14) {
    return this.poly([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]], '#1c2230', { op, sw: 0 });
  }
}

module.exports = { Iso, PAL, K, r, defs };
