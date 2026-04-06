import { Link } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel.jsx";
import { useCatalog } from "../store/catalog-context.js";
import { useRecent } from "../store/recent-context.js";

function FeatureCard({ title, description }) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald/30 hover:shadow-soft-xl dark:border-slate-800 dark:bg-black">
      <div className="text-sm font-extrabold tracking-tight text-slate-900 transition group-hover:text-emerald dark:text-white">
        {title}
      </div>
      <div className="mt-2 text-sm font-semibold leading-relaxed text-slate-600 transition group-hover:text-emerald/80 dark:text-slate-300">
        {description}
      </div>
    </div>
  );
}

function CategoryCard({ title, subtitle, to }) {
  return (
    <Link
      to={to}
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald/30 hover:shadow-soft-xl dark:border-slate-800 dark:bg-black"
    >
      <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 transition group-hover:text-emerald dark:text-slate-400">
        Collection
      </div>
      <div className="mt-1 text-lg font-black tracking-tight text-slate-900 transition group-hover:text-emerald dark:text-white">
        {title}
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-600 transition group-hover:text-emerald/80 dark:text-slate-300">
        {subtitle}
      </div>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-emerald">
        Shop now
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </Link>
  );
}

export default function Home() {
  const { products, getById } = useCatalog();
  const { ids } = useRecent();
  const flaggedNew = products.filter((p) => p.isNew);
  const flaggedBest = products.filter((p) => p.isBestSeller);
  const newArrivals = (flaggedNew.length ? flaggedNew : products).slice(0, 12);
  const bestSellers = (flaggedBest.length ? flaggedBest : products).slice(0, 12);
  const recentlyViewed = ids
    .map((id) => getById(id))
    .filter(Boolean)
    .slice(0, 12);

  const heroProducts = products.slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-white dark:from-black dark:via-black dark:to-black" />
        <div className="absolute -top-24 right-[-18rem] h-[32rem] w-[32rem] rounded-full bg-lux-gradient blur-3xl opacity-50 dark:opacity-25" />

        <div className="relative page-container pt-8 pb-14 sm:pt-12 sm:pb-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-white/70 px-4 py-2 text-xs font-extrabold text-slate-800 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-black/40 dark:text-slate-100">
                <span className="h-2 w-2 rounded-full bg-emerald" />
                Indore crafted | Premium menswear
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Dhakad Mens Wear
              </h1>

              <p className="mt-4 mx-auto max-w-xl text-base font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                Built for comfort, cut for confidence.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to="/shop" className="btn btn-primary">
                  Shop collection
                </Link>
                <Link to="/shop?sort=new" className="btn btn-outline">
                  New arrivals
                </Link>
              </div>

              <div className="mt-9 grid gap-3 sm:grid-cols-3">
                <Link
                  to="/shipping"
                  className="group rounded-2xl border border-slate-200 bg-white/70 p-4 text-center shadow-sm backdrop-blur transition hover:border-emerald/30 hover:bg-emerald/5 dark:border-slate-800 dark:bg-black/40 dark:hover:bg-emerald/10"
                >
                  <div className="text-xs font-bold text-slate-500 transition group-hover:text-emerald dark:text-slate-400">
                    Free shipping
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900 transition group-hover:text-emerald dark:text-white">
                    Over Rs. 1,999
                  </div>
                </Link>
                <Link
                  to="/returns"
                  className="group rounded-2xl border border-slate-200 bg-white/70 p-4 text-center shadow-sm backdrop-blur transition hover:border-emerald/30 hover:bg-emerald/5 dark:border-slate-800 dark:bg-black/40 dark:hover:bg-emerald/10"
                >
                  <div className="text-xs font-bold text-slate-500 transition group-hover:text-emerald dark:text-slate-400">
                    Easy returns
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900 transition group-hover:text-emerald dark:text-white">
                    7 days
                  </div>
                </Link>
                <Link
                  to="/track-order"
                  className="group rounded-2xl border border-slate-200 bg-white/70 p-4 text-center shadow-sm backdrop-blur transition hover:border-emerald/30 hover:bg-emerald/5 dark:border-slate-800 dark:bg-black/40 dark:hover:bg-emerald/10"
                >
                  <div className="text-xs font-bold text-slate-500 transition group-hover:text-emerald dark:text-slate-400">
                    Track orders
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900 transition group-hover:text-emerald dark:text-white">
                    Live timeline
                  </div>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2.5rem] border border-slate-200 bg-white/70 p-3 shadow-soft-xl backdrop-blur dark:border-slate-800 dark:bg-black/40">
                <div className="grid grid-cols-2 gap-3">
                  {heroProducts.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald/30 dark:border-slate-800 dark:bg-black"
                    >
                      <div className="aspect-[4/5] bg-slate-50 dark:bg-slate-950">
                        <img
                          src={p.variants?.[0]?.images?.[0] ?? ""}
                          alt={p.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="truncate text-xs font-extrabold text-white">{p.title}</div>
                        <div className="mt-0.5 text-[11px] font-semibold text-white/85">{p.category}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container pt-6 pb-12 sm:pt-8 sm:pb-14">
        <div className="grid gap-5 md:grid-cols-4">
          <CategoryCard title="Shirts" subtitle="Cotton, linen & prints" to="/shop?cat=Shirts" />
          <CategoryCard title="Jeans" subtitle="Cargo, baggy & straight" to="/shop?cat=Jeans" />
          <CategoryCard title="Trousers" subtitle="Formal to relaxed fits" to="/shop?cat=Trousers" />
          <CategoryCard title="Essentials" subtitle="T-shirt, jogger, shorts" to="/shop?cat=Others" />
        </div>
      </section>

      <div className="page-container pb-12 sm:pb-16">
        <ProductCarousel
          key={`new_${newArrivals.length}`}
          title="New Arrivals"
          subtitle="Fresh drops with clean silhouettes and premium feel."
          items={newArrivals}
        />
      </div>

      <div className="page-container pb-12 sm:pb-16">
        <ProductCarousel
          key={`best_${bestSellers.length}`}
          title="Best Sellers"
          subtitle="Most loved styles - tap a color dot to preview instantly."
          items={bestSellers}
        />
      </div>

      {recentlyViewed.length ? (
        <div className="page-container pb-12 sm:pb-16">
          <ProductCarousel
            key={`recent_${recentlyViewed.length}`}
            title="Recently Viewed"
            subtitle="Continue where you left off."
            items={recentlyViewed}
            autoplayMs={5200}
          />
        </div>
      ) : null}

      <section className="page-container pb-14 sm:pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard title="Luxury Fabrics" description="Soft, breathable materials chosen for daily comfort." />
          <FeatureCard
            title="Tailored Precision"
            description="Clean lines and balanced fits that look sharp without trying." 
          />
          <FeatureCard
            title="Premium Brand Experience"
            description="Fast browsing, smooth cart flow, and effortless wishlist access." 
          />
        </div>
      </section>
    </div>
  );
}


