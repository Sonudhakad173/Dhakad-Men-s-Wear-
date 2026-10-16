import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard.jsx";

function chunk(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

function itemsPerPageForWidth(width) {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

function ArrowIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      {direction === "left" ? <path d="M15 18 9 12l6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

export default function ProductCarousel({ title, subtitle, items, autoplayMs = 3800 }) {
  const [itemsPerPage, setItemsPerPage] = useState(() =>
    typeof window === "undefined" ? 3 : itemsPerPageForWidth(window.innerWidth),
  );

  useEffect(() => {
    const onResize = () => setItemsPerPage(itemsPerPageForWidth(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pages = useMemo(() => chunk(items, itemsPerPage), [items, itemsPerPage]);
  const looping = pages.length > 1;

  const extendedPages = useMemo(() => {
    if (!looping) return pages;
    return [pages[pages.length - 1], ...pages, pages[0]];
  }, [pages, looping]);

  const [index, setIndex] = useState(() => (looping ? 1 : 0));
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  const pointer = useRef({ active: false, x: 0 });

  useEffect(() => {
    let id2;

    const id1 = window.setTimeout(() => {
      setIndex(pages.length > 1 ? 1 : 0);
      setAnimate(false);
      id2 = window.setTimeout(() => setAnimate(true), 0);
    }, 0);

    return () => {
      window.clearTimeout(id1);
      if (id2) window.clearTimeout(id2);
    };
  }, [pages.length]);

  useEffect(() => {
    if (!looping) return;
    if (paused) return;

    const id = window.setInterval(() => {
      setIndex((v) => v + 1);
    }, autoplayMs);

    return () => window.clearInterval(id);
  }, [looping, paused, autoplayMs]);

  function goNext() {
    if (!looping) return;
    setIndex((v) => v + 1);
  }

  function goPrev() {
    if (!looping) return;
    setIndex((v) => v - 1);
  }

  function jumpToPage(pageIndex) {
    if (!looping) return;
    setIndex(pageIndex + 1);
  }

  const dotIndex = looping ? (index - 1 + pages.length) % pages.length : 0;

  return (
    <section
      className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald/30 hover:shadow-soft-xl dark:border-slate-800 dark:bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={!looping}
            className="btn btn-outline px-3 disabled:opacity-50"
            aria-label="Previous"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!looping}
            className="btn btn-outline px-3 disabled:opacity-50"
            aria-label="Next"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>

      <div
        className="mt-6 overflow-hidden"
        onPointerDown={(e) => {
          if (!looping) return;
          pointer.current = { active: true, x: e.clientX };
        }}
        onPointerUp={(e) => {
          if (!looping) return;
          const state = pointer.current;
          if (!state.active) return;
          pointer.current.active = false;

          const dx = e.clientX - state.x;
          if (Math.abs(dx) < 40) return;
          if (dx < 0) goNext();
          else goPrev();
        }}
        onPointerCancel={() => {
          pointer.current.active = false;
        }}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: animate ? "transform 520ms cubic-bezier(.2,.85,.2,1)" : "none",
          }}
          onTransitionEnd={() => {
            if (!looping) return;

            if (index === 0) {
              setAnimate(false);
              setIndex(pages.length);
              window.setTimeout(() => setAnimate(true), 0);
            }

            if (index === pages.length + 1) {
              setAnimate(false);
              setIndex(1);
              window.setTimeout(() => setAnimate(true), 0);
            }
          }}
        >
          {extendedPages.map((page, i) => (
            <div key={i} className="w-full shrink-0">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {page.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {pages.length > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => jumpToPage(i)}
              className={[
                "h-2.5 w-2.5 rounded-full transition",
                i === dotIndex
                  ? "bg-emerald"
                  : "bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600",
              ].join(" ")}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
