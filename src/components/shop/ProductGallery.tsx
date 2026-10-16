import React, { useMemo, useState } from "react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const imgs = useMemo(() => (images.length > 0 ? images : []), [images]);
  const [active, setActive] = useState(0);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(false);

  const src = imgs[active] ?? imgs[0] ?? "";

  return (
    <div className="gallery">
      <div className="galleryThumbs" aria-label="Product images">
        {imgs.map((s, i) => (
          <button
            key={s + i}
            type="button"
            className={["thumb", i === active && "thumb--active"].filter(Boolean).join(" ")}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
          >
            <img src={s} alt="" loading="lazy" />
          </button>
        ))}
      </div>

      <div
        className={["galleryMain", zoom && "galleryMain--zoom"].filter(Boolean).join(" ")}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setOrigin({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
        }}
      >
        <img
          src={src}
          alt={alt}
          className="galleryImg"
          style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
        />
      </div>
    </div>
  );
}
