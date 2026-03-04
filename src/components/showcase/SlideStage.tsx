import { useState, useCallback } from 'react';
import type { ToolEntry } from './tool-data';

function getSlideBackground(tool: ToolEntry): React.CSSProperties {
  const { accentHue: h, saturation: s, pattern, gradientAngle: angle } = tool;
  const base = `hsl(${h}, ${s}%, 6%)`;
  const mid = `hsl(${h}, ${s * 0.5}%, 3%)`;
  // Pumped-up opacities — 3-5x the original values
  const line = `hsla(${h}, ${s}%, 55%, 0.35)`;
  const lineLight = `hsla(${h}, ${s}%, 55%, 0.18)`;
  const glow = `hsla(${h}, ${s}%, 50%, 0.25)`;
  const glowStrong = `hsla(${h}, ${s}%, 50%, 0.35)`;
  const transparent = `hsla(${h}, ${s}%, 50%, 0)`;

  switch (pattern) {
    case 'grid':
      return {
        background: [
          `repeating-linear-gradient(0deg, ${line} 0px, ${line} 1px, transparent 1px, transparent 50px)`,
          `repeating-linear-gradient(90deg, ${line} 0px, ${line} 1px, transparent 1px, transparent 50px)`,
          `radial-gradient(ellipse at 25% 75%, ${glow} 0%, transparent 60%)`,
          `linear-gradient(${angle}deg, ${base} 0%, ${mid} 100%)`,
        ].join(', '),
      };

    case 'circuit':
      return {
        background: [
          `repeating-linear-gradient(0deg, ${lineLight} 0px, ${lineLight} 1px, transparent 1px, transparent 35px)`,
          `repeating-linear-gradient(90deg, ${line} 0px, ${line} 1px, transparent 1px, transparent 70px)`,
          `radial-gradient(circle at 80% 20%, ${glowStrong} 0%, transparent 45%)`,
          `radial-gradient(circle at 20% 80%, ${glow} 0%, transparent 50%)`,
          `linear-gradient(${angle}deg, ${base} 0%, ${mid} 100%)`,
        ].join(', '),
      };

    case 'wave':
      return {
        background: [
          `radial-gradient(ellipse 120% 80% at 25% 40%, ${glowStrong} 0%, transparent 60%)`,
          `radial-gradient(ellipse 100% 60% at 75% 60%, ${glow} 0%, transparent 55%)`,
          `radial-gradient(ellipse 80% 100% at 50% 90%, ${glowStrong} 0%, transparent 40%)`,
          `radial-gradient(ellipse 60% 40% at 60% 20%, ${glow} 0%, transparent 50%)`,
          `linear-gradient(${angle}deg, ${base} 0%, ${mid} 100%)`,
        ].join(', '),
      };

    case 'radial':
      return {
        background: [
          `radial-gradient(circle at 50% 50%, ${glowStrong} 0%, transparent 45%)`,
          `radial-gradient(circle at 25% 70%, ${glow} 0%, transparent 40%)`,
          `radial-gradient(circle at 75% 30%, ${glow} 0%, transparent 35%)`,
          `conic-gradient(from ${angle}deg at 50% 50%, ${transparent} 0deg, ${glow} 60deg, ${transparent} 120deg, ${glow} 180deg, ${transparent} 240deg, ${glow} 300deg, ${transparent} 360deg)`,
          `linear-gradient(180deg, ${base} 0%, ${mid} 100%)`,
        ].join(', '),
      };

    case 'diagonal':
      return {
        background: [
          `repeating-linear-gradient(${angle}deg, ${line} 0px, ${line} 1px, transparent 1px, transparent 24px)`,
          `repeating-linear-gradient(${angle + 90}deg, ${lineLight} 0px, ${lineLight} 1px, transparent 1px, transparent 48px)`,
          `radial-gradient(ellipse at 70% 30%, ${glow} 0%, transparent 55%)`,
          `linear-gradient(${angle}deg, ${base} 0%, ${mid} 100%)`,
        ].join(', '),
      };

    default:
      return { background: base };
  }
}

/** Inline SVG noise filter — rendered once per slide as a texture overlay */
function NoiseOverlay({ hue, opacity = 0.4 }: { hue: number; opacity?: number }) {
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity,
        mixBlendMode: 'soft-light',
      }}
      aria-hidden="true"
    >
      <filter id={`noise-${hue}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#noise-${hue})`} />
    </svg>
  );
}

/** Bottom gradient vignette to keep text readable over busy backgrounds */
function Vignette() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}

interface SlideStageProps {
  tool: ToolEntry;
  index: number;
  total: number;
  isActive: boolean;
}

export default function SlideStage({ tool, index, total, isActive }: SlideStageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!tool.installCommand) return;
    navigator.clipboard.writeText(tool.installCommand).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [tool.installCommand]);

  const bgStyle = getSlideBackground(tool);
  const number = String(index + 1).padStart(2, '0');

  return (
    <div className="showcase-slide" role="tabpanel" aria-label={tool.name}>
      <div className="showcase-slide__bg" style={bgStyle}>
        <NoiseOverlay hue={tool.accentHue} />
      </div>
      <Vignette />
      <div className={`showcase-slide__content${isActive ? ' is-active' : ''}`}>
        <div className="showcase-slide__number">
          {number} / {String(total).padStart(2, '0')}
        </div>
        <h2 className="showcase-slide__name">{tool.name}</h2>
        <div className="showcase-slide__meta">
          <span className="showcase-slide__badge showcase-slide__badge--type">
            {tool.type}
          </span>
          <span
            className={`showcase-slide__badge showcase-slide__badge--${tool.status}`}
          >
            {tool.status}
          </span>
        </div>
        <p className="showcase-slide__oneliner">{tool.oneliner}</p>
        <div className="showcase-slide__actions">
          {tool.installCommand && (
            <button
              className="showcase-slide__install"
              onClick={handleCopy}
              aria-label={`Copy install command: ${tool.installCommand}`}
            >
              <code>{tool.installCommand}</code>
              {copied ? (
                <span className="showcase-slide__install-copied">copied</span>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', flexShrink: 0 }}>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
          )}
          {tool.detailUrl && (
            <a
              href={tool.detailUrl}
              className="showcase-slide__detail-link"
            >
              View details
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', flexShrink: 0 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
