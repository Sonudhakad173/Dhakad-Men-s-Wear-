import React from "react";
import type { ProductVariant, Swatch } from "../../data/types";

function swatchStyle(s: Swatch): React.CSSProperties {
  if (s.type === "gradient") return { background: s.value };
  return { background: s.value };
}

export function SwatchDot({
  swatch,
  selected,
  title,
  onClick,
}: {
  swatch: Swatch;
  selected?: boolean;
  title: string;
  onClick?: () => void;
}) {
  const light = !!swatch.isLight;

  return (
    <button
      type="button"
      className={["swatchDot", selected && "swatchDot--selected", light && "swatchDot--light"]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      aria-label={title}
      title={title}
    >
      <span className="swatchDotFill" style={swatchStyle(swatch)} />
    </button>
  );
}

export function SwatchRow({
  variants,
  selectedId,
  onSelect,
}: {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variantId: string) => void;
}) {
  return (
    <div className="swatchRow" role="list">
      {variants.map((v) => (
        <SwatchDot
          key={v.id}
          swatch={v.swatch}
          selected={v.id === selectedId}
          title={v.colorName}
          onClick={() => onSelect(v.id)}
        />
      ))}
    </div>
  );
}
