/**
 * The E-Principle glyph: a seven-position honeycomb cluster, one per stage.
 *
 * Unlit positions are hollow ghosts — possibilities. Each stage connects more
 * of them, from a single dot to a full network, and the dots *added* by that
 * stage are Pacific Cyan. Reserved for the E-Principle; it is not an icon.
 */

/** centre, then six vertices at 60° intervals */
const RING = 13;
const pos = (k: number): [number, number] =>
  k === 0
    ? [32, 32]
    : [
        32 + RING * Math.cos((Math.PI / 3) * (k - 1)),
        32 + RING * Math.sin((Math.PI / 3) * (k - 1)),
      ];

/** `dots` = lit positions, `added` = the ones this stage lights, `links` = edges */
const STAGES: { dots: number[]; added: number[]; links: [number, number][] }[] = [
  { dots: [0], added: [0], links: [] },
  { dots: [0, 1], added: [1], links: [[0, 1]] },
  { dots: [0, 1, 4], added: [4], links: [[0, 1], [0, 4]] },
  {
    dots: [0, 1, 4, 2, 5],
    added: [2, 5],
    links: [[0, 1], [0, 4], [0, 2], [0, 5]],
  },
  {
    dots: [0, 1, 2, 3, 4, 5, 6],
    added: [3, 6],
    links: [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
      [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1],
    ],
  },
];

export default function StageGlyph({
  index,
  size = 30,
  className = "",
  onBrand = false,
}: {
  index: number;
  size?: number;
  className?: string;
  /** on a solid Marian block the lit dots have to lighten, not darken */
  onBrand?: boolean;
}) {
  const s = STAGES[index] ?? STAGES[0];
  const lit = onBrand ? "#ffffff" : "var(--color-marian)";
  const ghost = onBrand ? "rgba(255,255,255,0.35)" : "var(--color-mist)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      {/* unlit positions: the possibilities not yet connected */}
      {[0, 1, 2, 3, 4, 5, 6]
        .filter((k) => !s.dots.includes(k))
        .map((k) => {
          const [x, y] = pos(k);
          return (
            <circle
              key={`g${k}`}
              cx={x}
              cy={y}
              r={2.6}
              fill="none"
              stroke={ghost}
              strokeWidth={1.3}
            />
          );
        })}

      {s.links.map(([a, b]) => {
        const A = pos(a);
        const B = pos(b);
        return (
          <line
            key={`l${a}-${b}`}
            x1={A[0]}
            y1={A[1]}
            x2={B[0]}
            y2={B[1]}
            stroke={lit}
            strokeWidth={3.4}
            strokeLinecap="round"
          />
        );
      })}

      {s.dots.map((k) => {
        const [x, y] = pos(k);
        return (
          <circle
            key={`d${k}`}
            cx={x}
            cy={y}
            r={5.2}
            fill={s.added.includes(k) ? "var(--color-signal)" : lit}
          />
        );
      })}
    </svg>
  );
}
