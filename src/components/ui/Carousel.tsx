import React, { useEffect, useMemo, useRef, useState } from "react";
import { IconArrowLeft, IconArrowRight } from "../common/Icons";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Carousel({
  slides,
  autoplayMs = 3800,
  className,
}: {
  slides: React.ReactNode[];
  autoplayMs?: number;
  className?: string;
}) {
  const n = slides.length;
  const trackSlides = useMemo(() => {
    if (n === 0) return [];
    if (n === 1) return [slides[0]];
    return [slides[n - 1], ...slides, slides[0]];
  }, [slides, n]);

  const [index, setIndex] = useState(n <= 1 ? 0 : 1);
  const [anim, setAnim] = useState(true);
  const [paused, setPaused] = useState(false);

  const pointer = useRef<{ down: boolean; x: number; dx: number }>({
    down: false,
    x: 0,
    dx: 0,
  });

  const realIndex = useMemo(() => {
    if (n <= 1) return 0;
    const i = index - 1;
    if (i < 0) return n - 1;
    if (i >= n) return 0;
    return i;
  }, [index, n]);

  function next() {
    if (n <= 1) return;
    setAnim(true);
    setIndex((i) => i + 1);
  }

  function prev() {
    if (n <= 1) return;
    setAnim(true);
    setIndex((i) => i - 1);
  }

  useEffect(() => {
    if (n <= 1) return;
    if (paused) return;
    const t = window.setInterval(() => next(), autoplayMs);
    return () => window.clearInterval(t);
  }, [paused, autoplayMs, n]);

  function onTransitionEnd() {
    if (n <= 1) return;
    if (index === n + 1) {
      // jumped past last -> snap to first
      setAnim(false);
      setIndex(1);
    }
    if (index === 0) {
      // jumped before first -> snap to last
      setAnim(false);
      setIndex(n);
    }
  }

  function goTo(i: number) {
    if (n <= 1) return;
    setAnim(true);
    setIndex(i + 1);
  }

  return (
    <div
      className={cx("carousel", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={(e) => {
        pointer.current = { down: true, x: e.clientX, dx: 0 };
      }}
      onPointerMove={(e) => {
        if (!pointer.current.down) return;
        pointer.current.dx = e.clientX - pointer.current.x;
      }}
      onPointerUp={() => {
        if (!pointer.current.down) return;
        const dx = pointer.current.dx;
        pointer.current.down = false;
        pointer.current.dx = 0;
        if (Math.abs(dx) > 40) {
          if (dx < 0) next();
          else prev();
        }
      }}
      onPointerCancel={() => {
        pointer.current.down = false;
        pointer.current.dx = 0;
      }}
    >
      <div
        className={cx("carouselTrack", anim && "carouselTrack--anim")}
        style={{ transform: `translateX(${-index * 100}%)` }}
        onTransitionEnd={onTransitionEnd}
      >
        {trackSlides.map((s, i) => (
          <div key={i} className="carouselSlide">
            {s}
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <button type="button" className="carouselArrow carouselArrow--left" onClick={prev} aria-label="Previous">
            <IconArrowLeft size={18} />
          </button>
          <button type="button" className="carouselArrow carouselArrow--right" onClick={next} aria-label="Next">
            <IconArrowRight size={18} />
          </button>

          <div className="carouselDots" role="tablist" aria-label="Carousel">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={cx("carouselDot", i === realIndex && "carouselDot--active")}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-selected={i === realIndex}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
