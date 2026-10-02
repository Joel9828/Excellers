import { capabilities } from "@/lib/content";

type Icon = (typeof capabilities)[number]["icon"];

/**
 * A capability icon, drawn to the EXCELLERS icon system: outlined strokes on
 * the hex-mesh angles (0°, 60°, 90°, 120°), solid dots at the junctions, and
 * exactly one Pacific Cyan "manifest" dot where the idea becomes real.
 *
 * Stroke is 2px on the 24px master grid and scales with the box, per the
 * guideline's size ladder. Colour comes from `currentColor` so the icon
 * inherits its context — only the manifest dot is pinned to Signal.
 */
export default function CapabilityIcon({
  icon,
  size = 32,
  className = "",
}: {
  icon: Icon;
  size?: number;
  className?: string;
}) {
  // the guideline's ladder: 1.5 at 16, 2 at 24, 2.5 at 32, 3 at 48
  const stroke = size <= 16 ? 1.5 : size <= 24 ? 2 : size <= 32 ? 2.5 : 3;
  const r = stroke * 1.2; // dots are 1.2x the stroke radius

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: icon.paths }}
      />
      {icon.dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="currentColor" />
      ))}
      <circle
        className="cap-dot"
        cx={icon.manifest[0]}
        cy={icon.manifest[1]}
        r={r}
        fill="var(--color-signal)"
      />
    </svg>
  );
}
