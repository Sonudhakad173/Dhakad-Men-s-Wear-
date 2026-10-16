const ALPHA_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function splitSizes(sizes: string[]) {
  const alpha: string[] = [];
  const numeric: string[] = [];
  const other: string[] = [];

  for (const s of sizes) {
    if (/^\d+$/.test(s)) numeric.push(s);
    else if (/^[A-Za-z]+$/.test(s)) alpha.push(s);
    else other.push(s);
  }

  const alphaOrder = new Map(ALPHA_ORDER.map((s, i) => [s.toLowerCase(), i] as const));
  const sortedAlpha = uniq(alpha).sort((a, b) => {
    const ai = alphaOrder.get(a.toLowerCase());
    const bi = alphaOrder.get(b.toLowerCase());
    if (ai !== undefined && bi !== undefined) return ai - bi;
    if (ai !== undefined) return -1;
    if (bi !== undefined) return 1;
    return a.localeCompare(b);
  });

  const sortedNumeric = uniq(numeric).sort((a, b) => Number(a) - Number(b));
  const sortedOther = uniq(other);

  return { alpha: sortedAlpha, numeric: sortedNumeric, other: sortedOther };
}

export function SizePicker({
  sizes,
  value,
  onChange,
}: {
  sizes: string[];
  value: string | null;
  onChange: (size: string) => void;
}) {
  const { alpha, numeric, other } = splitSizes(sizes);
  const groups = [alpha, numeric, other].filter((g) => g.length > 0);

  return (
    <div className="sizeStack" role="list">
      {groups.map((group, gi) => (
        <div key={gi} className="sizeRow" role="presentation">
          {group.map((s) => (
            <button
              key={s}
              type="button"
              className={["sizePill", value === s && "sizePill--active"]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onChange(s)}
            >
              {s}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
