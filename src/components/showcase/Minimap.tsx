import { useEffect, useRef } from 'react';
import type { ToolEntry } from './tool-data';

interface MinimapProps {
  tools: ToolEntry[];
  activeIndex: number;
  onSelect: (index: number) => void;
  hasSignup: boolean;
}

export default function Minimap({ tools, activeIndex, onSelect, hasSignup }: MinimapProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Auto-scroll active item into view
  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el && listRef.current) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex]);

  const totalSlides = tools.length + (hasSignup ? 1 : 0);

  return (
    <div className="showcase-minimap" ref={listRef} role="tablist" aria-label="Tool navigation" style={{ paddingTop: 68 }}>
      {tools.map((tool, i) => {
        const isActive = i === activeIndex;
        const dotColor = `hsl(${tool.accentHue}, ${tool.saturation}%, 50%)`;
        return (
          <button
            key={tool.id}
            ref={(el) => { itemRefs.current[i] = el; }}
            className={`showcase-minimap__item${isActive ? ' showcase-minimap__item--active' : ''}`}
            onClick={() => onSelect(i)}
            role="tab"
            aria-selected={isActive}
            aria-label={`${tool.name} — ${tool.type}`}
            style={isActive ? { borderLeftColor: dotColor } : undefined}
          >
            <span
              className="showcase-minimap__dot"
              style={{ background: dotColor, color: dotColor }}
              aria-hidden="true"
            />
            <span className="showcase-minimap__idx">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="showcase-minimap__name">{tool.name}</span>
            <span className="showcase-minimap__type">{tool.type}</span>
          </button>
        );
      })}
      {hasSignup && (
        <button
          ref={(el) => { itemRefs.current[tools.length] = el; }}
          className={`showcase-minimap__item${activeIndex === tools.length ? ' showcase-minimap__item--active' : ''}`}
          onClick={() => onSelect(tools.length)}
          role="tab"
          aria-selected={activeIndex === tools.length}
          aria-label="Subscribe"
          style={activeIndex === tools.length ? { borderLeftColor: 'var(--color-signal)' } : undefined}
        >
          <span
            className="showcase-minimap__dot"
            style={{ background: 'var(--color-signal)', color: 'var(--color-signal)' }}
            aria-hidden="true"
          />
          <span className="showcase-minimap__idx">
            {String(totalSlides).padStart(2, '0')}
          </span>
          <span className="showcase-minimap__name">Subscribe</span>
          <span className="showcase-minimap__type">cta</span>
        </button>
      )}
    </div>
  );
}
