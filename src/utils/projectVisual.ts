interface Visual {
  pattern: string;
  from: string;
  to: string;
}

const patternSvg = (pattern: string): string => {
  switch (pattern) {
    case "grid":
      return `<g stroke="#ffffff" stroke-opacity="0.18" stroke-width="1">
        ${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 80}" y1="0" x2="${i * 80}" y2="480" />`).join("")}
        ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${i * 80}" x2="640" y2="${i * 80}" />`).join("")}
      </g>`;
    case "orbit":
      return `<g fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2">
        <circle cx="320" cy="240" r="60" />
        <circle cx="320" cy="240" r="120" />
        <circle cx="320" cy="240" r="180" />
        <circle cx="320" cy="240" r="8" fill="#ffffff" stroke="none" />
        <circle cx="440" cy="240" r="7" fill="#ffffff" stroke="none" />
        <circle cx="320" cy="60" r="6" fill="#ffffff" stroke="none" />
      </g>`;
    case "scan":
      return `<g stroke="#ffffff" stroke-opacity="0.3" stroke-width="2">
        ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 36}" x2="640" y2="${i * 36}" />`).join("")}
      </g>
      <rect x="0" y="180" width="640" height="24" fill="#ffffff" opacity="0.18" />`;
    case "nodes":
      return `<g fill="#ffffff" fill-opacity="0.85">
        <circle cx="120" cy="120" r="6" /><circle cx="300" cy="90" r="6" />
        <circle cx="480" cy="150" r="6" /><circle cx="220" cy="260" r="6" />
        <circle cx="420" cy="320" r="6" /><circle cx="100" cy="340" r="6" />
      </g>
      <g stroke="#ffffff" stroke-opacity="0.25" stroke-width="1.5">
        <line x1="120" y1="120" x2="300" y2="90" /><line x1="300" y1="90" x2="480" y2="150" />
        <line x1="120" y1="120" x2="220" y2="260" /><line x1="220" y1="260" x2="420" y2="320" />
        <line x1="220" y1="260" x2="100" y2="340" /><line x1="480" y1="150" x2="420" y2="320" />
      </g>`;
    case "wave":
    default:
      return `<g fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="3">
        <path d="M0,260 Q80,180 160,260 T320,260 T480,260 T640,260" />
        <path d="M0,320 Q80,260 160,320 T320,320 T480,320 T640,320" stroke-opacity="0.2" />
      </g>`;
  }
};

export const getProjectVisualDataUri = (visual: Visual, title: string): string => {
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${visual.from}" />
        <stop offset="100%" stop-color="${visual.to}" />
      </linearGradient>
    </defs>
    <rect width="640" height="480" fill="url(#g)" />
    ${patternSvg(visual.pattern)}
    <text x="32" y="432" font-family="Arial, sans-serif" font-size="22" fill="#ffffff" fill-opacity="0.55">${safeTitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
