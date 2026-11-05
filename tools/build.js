'use strict';
// Generates the static index.html (inline SVG scenes) -> run: node tools/build.js
const fs = require('fs');
const path = require('path');
const { defs } = require('./iso');
const { scenes } = require('./scenes');

const steps = [
  { name: 'Design', text: 'Define the vehicle platform, features, safety requirements and BOM', tags: ['Product', 'Design Engineer'] },
  { name: 'Plan &amp; Source', text: 'Plan demand, capacity and materials; source batteries, chips, tires, glass and seats', tags: ['Supply Chain', 'Production Planner'] },
  { name: 'Make', text: 'Stamp body panels, weld the body, paint and complete final assembly', tags: ['Production Manager', 'Frontline Operator'] },
  { name: 'Quality', text: 'Inspect welds and paint; test alignment, functions and safety', tags: ['Quality Engineer', 'Quality Manager'] },
  { name: 'Maintain', text: 'Keep robots, conveyors, paint systems and torque tools available', tags: ['Maintenance', 'Reliability Engineer'] },
  { name: 'Deliver', text: 'Move finished vehicles from the factory to distribution centers and dealers', tags: ['Logistics', 'Fulfillment Planner'] },
  { name: 'Serve', text: 'Diagnose issues, complete repairs, manage warranties, recalls and software updates', tags: ['Field Service Technician', 'Service Manager'] },
  { name: 'Learn &amp; Improve', text: 'Feed field failures, defects and customer feedback back to engineering and production', tags: ['Engineering + Quality + Operations'] },
];

const pad = (n) => String(n).padStart(2, '0');
const plain = (s) => s.replace(/&amp;/g, '&');

const stations = steps.map((st, i) => `
      <section class="station" id="step-${i + 1}" data-name="${plain(st.name)}" aria-labelledby="h-${i + 1}">
        <div class="node" aria-hidden="true"><span>${pad(i + 1)}</span></div>
        <div class="scene" data-scene>${scenes[i]}</div>
        <div class="copy reveal">
          <p class="eyebrow">Step ${pad(i + 1)} <span>/ 08</span></p>
          <h2 id="h-${i + 1}">${st.name}</h2>
          <p class="lead">${st.text}</p>
          <ul class="tags">${st.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
          ${i === steps.length - 1 ? '<a class="loop-link" href="#step-1">&#8635; Back to Design</a>' : `<a class="next-link" href="#step-${i + 2}">Next: ${plain(steps[i + 1].name)} &darr;</a>`}
        </div>
      </section>`).join('\n');

const nav = steps.map((st, i) => `<a href="#step-${i + 1}" data-i="${i}" aria-label="Step ${i + 1}: ${plain(st.name)}"><span class="lbl">${plain(st.name)}</span><i></i></a>`).join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Automotive Manufacturing Flow â€” from Design to Learn &amp; Improve</title>
  <meta name="description" content="An isometric, scroll-driven tour of the automotive manufacturing flow: Design, Plan &amp; Source, Make, Quality, Maintain, Deliver, Serve, Learn &amp; Improve.">
  <meta name="theme-color" content="#23262B">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23D7262F'/%3E%3Cpath d='M6 20h20v-4l-4-5H11l-5 5z' fill='%23fff'/%3E%3C/svg%3E">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${defs()}</defs></svg>

  <header class="hero">
    <div class="hero-inner">
      <p class="eyebrow light">Automotive &middot; Manufacturing</p>
      <h1>Follow a vehicle through the manufacturing value chain</h1>
      <p class="sub">Explore the journey from design and production through delivery and service.</p>
    </div>
    <div class="hero-belt" aria-hidden="true"><span></span></div>
    <a class="scroll-cue" href="#step-1" aria-label="Scroll to the first step"><span></span></a>
  </header>

  <nav class="dots" aria-label="Steps">${nav}</nav>

  <main class="flow">
    <div class="rail" aria-hidden="true"><b></b></div>
${stations}
  </main>

  <footer class="foot" aria-hidden="true"></footer>
  <script src="js/main.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '..', 'index.html'), html);
console.log('index.html written (' + Math.round(html.length / 1024) + ' KB)');
