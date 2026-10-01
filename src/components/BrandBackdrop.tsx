"use client";

/**
 * The Excellers trademark as a full-screen watermark, lit with a soft blue
 * neon glow. Fixed behind every section on every page.
 *
 * The symbol PNG is used as a CSS mask rather than an <img>, so the shape can
 * be filled with the brand gradient and blurred into a halo — a blurred <img>
 * would carry its own colour and muddy the glow.
 *
 * `variant="light"` is the version that sits inside the paper-coloured
 * sections, where the dark watermark would otherwise be invisible.
 */
export default function BrandBackdrop({
  variant = "light",
  className = "",
}: {
  variant?: "light" | "brand";
  className?: string;
}) {
  const mask = {
    WebkitMaskImage: "url(/brand/symbol-white.png)",
    maskImage: "url(/brand/symbol-white.png)",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  } as const;

  const onBrand = variant === "brand";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 grid place-items-center overflow-hidden ${className}`}
    >
      <div className="relative aspect-[1422/1855] h-[86vh] max-w-none animate-[brand-breathe_11s_ease-in-out_infinite]">
        {/* wide halo */}
        <div
          style={mask}
          className={`absolute inset-0 blur-[70px] ${
            onBrand ? "opacity-[0.30]" : "opacity-[0.14]"
          }`}
        >
          <div className="h-full w-full bg-[linear-gradient(170deg,#7fd7ff_0%,#0076b5_45%,#013e8a_100%)]" />
        </div>

        {/* tight neon rim */}
        <div
          style={mask}
          className={`absolute inset-0 blur-[14px] ${
            onBrand ? "opacity-[0.16]" : "opacity-[0.08]"
          }`}
        >
          <div className="h-full w-full bg-[linear-gradient(170deg,#7fd7ff_0%,#00b4d9_50%,#0076b5_100%)]" />
        </div>

        {/* crisp mark */}
        <div
          style={mask}
          className={onBrand ? "absolute inset-0 opacity-[0.07]" : "absolute inset-0 opacity-[0.05]"}
        >
          <div className="h-full w-full bg-[linear-gradient(170deg,#9fe4ff_0%,#00b4d9_55%,#013e8a_100%)]" />
        </div>
      </div>

      {/* vignette keeps the glow from fighting the copy */}
      <div
        className={`absolute inset-0 ${
          onBrand
            ? "bg-[radial-gradient(ellipse_at_center,transparent_14%,rgba(1,62,138,0.80)_66%)]"
            : "bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(255,255,255,0.86)_72%)]"
        }`}
      />
    </div>
  );
}
