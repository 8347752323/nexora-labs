const fs = require('fs');

// We will construct the exact origami star SVG
function buildNexoraMarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%" fill="none">
  <defs>
    <!-- Petal 1: Top (Blue / Azure) -->
    <linearGradient id="p1_a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <linearGradient id="p1_b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#1E3A8A"/>
    </linearGradient>

    <!-- Petal 2: Top-Right (Lavender / Violet) -->
    <linearGradient id="p2_a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A78BFA"/>
      <stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
    <linearGradient id="p2_b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#5B21B6"/>
    </linearGradient>

    <!-- Petal 3: Bottom-Right (Magenta / Fuchsia) -->
    <linearGradient id="p3_a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F472B6"/>
      <stop offset="100%" stop-color="#D946EF"/>
    </linearGradient>
    <linearGradient id="p3_b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C026D3"/>
      <stop offset="100%" stop-color="#86198F"/>
    </linearGradient>

    <!-- Petal 4: Bottom-Left (Electric Cyan / Azure) -->
    <linearGradient id="p4_a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F5FF"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <linearGradient id="p4_b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#075985"/>
    </linearGradient>

    <!-- Petal 5: Left (Bright Turquoise / Sky) -->
    <linearGradient id="p5_a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#00F5FF"/>
    </linearGradient>
    <linearGradient id="p5_b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#0369A1"/>
    </linearGradient>
  </defs>

  <g transform="translate(250, 250)">
    <!-- Petal 1 (Top: -54 deg) -->
    <g transform="rotate(-54)">
      <polygon points="0,-165 62,-80 0,-18" fill="url(#p1_a)"/>
      <polygon points="0,-165 0,-18 -58,-85" fill="url(#p1_b)"/>
    </g>

    <!-- Petal 2 (Top-Right: 18 deg) -->
    <g transform="rotate(18)">
      <polygon points="0,-165 62,-80 0,-18" fill="url(#p2_a)"/>
      <polygon points="0,-165 0,-18 -58,-85" fill="url(#p2_b)"/>
    </g>

    <!-- Petal 3 (Bottom-Right: 90 deg) -->
    <g transform="rotate(90)">
      <polygon points="0,-165 62,-80 0,-18" fill="url(#p3_a)"/>
      <polygon points="0,-165 0,-18 -58,-85" fill="url(#p3_b)"/>
    </g>

    <!-- Petal 4 (Bottom-Left: 162 deg) -->
    <g transform="rotate(162)">
      <polygon points="0,-165 62,-80 0,-18" fill="url(#p4_a)"/>
      <polygon points="0,-165 0,-18 -58,-85" fill="url(#p4_b)"/>
    </g>

    <!-- Petal 5 (Left: 234 deg) -->
    <g transform="rotate(234)">
      <polygon points="0,-165 62,-80 0,-18" fill="url(#p5_a)"/>
      <polygon points="0,-165 0,-18 -58,-85" fill="url(#p5_b)"/>
    </g>
  </g>
</svg>`;
}

fs.writeFileSync('assets/nexora-mark.svg', buildNexoraMarkSVG());
console.log('Updated assets/nexora-mark.svg');
