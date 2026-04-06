export default function ColorDots({
  variants,
  selectedId,
  onSelect,
  size = 14,
  className = "",
}) {
  return (
    <div className={["flex items-center gap-2", className].join(" ")}
      role="list"
      aria-label="Available colors"
    >
      {variants.map((v) => {
        const isSelected = v.id === selectedId;
        const isLight = Boolean(v.swatch?.isLight);
        const style =
          v.swatch?.type === "gradient"
            ? { backgroundImage: v.swatch.value }
            : { backgroundColor: v.swatch?.value ?? "#000" };

        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v.id)}
            className={[
              "relative rounded-full transition",
              isSelected ? "ring-2 ring-emerald ring-offset-2 ring-offset-white dark:ring-offset-black" : "ring-1",
              isSelected ? "ring-emerald" : isLight ? "ring-slate-300 dark:ring-slate-700" : "ring-slate-200/70 dark:ring-slate-800",
              "hover:scale-110",
            ].join(" ")}
            style={{ width: size, height: size, ...style }}
            aria-label={v.colorName}
            title={v.colorName}
          />
        );
      })}
    </div>
  );
}