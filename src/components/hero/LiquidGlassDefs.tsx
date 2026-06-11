export function LiquidGlassDefs() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden">
      <defs>
        <filter id="liquid-glass-nav" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.02" numOctaves="3" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2.4" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>
      </defs>
    </svg>
  );
}
