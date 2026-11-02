"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Image placeholder — the wireframe's X-cross box, production-ready.
// Renders a labelled placeholder until `src` (product.imageUrl) is provided,
// then swaps to the real photo automatically. Swap images in bulk by setting
// imageUrl in the DB (or replace with <Image> once assets exist).
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  label?: string;
  src?: string | null;
  alt?: string;
  className?: string; // size the box via className
  rounded?: string;
  icon?: string; // single letter / glyph shown in small tiles
}

export default function ImagePlaceholder({ label, src, alt, className = "", rounded = "rounded-md", icon }: Props) {
  if (src) {
    return <img src={src} alt={alt || label || "Product image"} className={`${className} ${rounded} object-cover`} />;
  }
  return (
    <div
      role="img"
      aria-label={alt || label || "Image placeholder"}
      className={`imgph border border-dashed border-[#ABABA4] flex flex-col items-center justify-center text-center text-[#8B8B83] overflow-hidden ${rounded} ${className}`}
    >
      {icon ? (
        <span className="text-lg font-extrabold text-[#9B9B92]">{icon}</span>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="w-5 h-5 mb-1 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 15l5-5 4 4 3-3 6 6" />
            <circle cx="9" cy="9" r="1.5" />
          </svg>
          {label ? <span className="px-2 leading-tight text-[10.5px]">{label}</span> : null}
        </>
      )}
    </div>
  );
}
