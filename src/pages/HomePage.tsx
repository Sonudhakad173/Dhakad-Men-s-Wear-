import { Link } from "react-router-dom";
import { useMediaQuery } from "../app/hooks/useMediaQuery";
import { IconArrowRight, IconCheck, IconHeart, IconSearch, IconUser } from "../components/common/Icons";
import { ProductGrid } from "../components/shop/ProductGrid";
import { Carousel } from "../components/ui/Carousel";
import { categoriesInOrder } from "../data/seedProducts";
import { useProducts } from "../store/ProductsStore";

function chunk<T>(arr: T[], size: number) {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}

const categoryCopy: Record<string, string> = {
  Shirts: "Crisp collars, calm colors, clean drape.",
  Jeans: "Sharp washes with a premium, easy fall.",
  Trousers: "Clean lines. Comfortable movement.",
  Others: "Essentials that finish the fit.",
};

export function HomePage() {
  const { products } = useProducts();

  const isSmall = useMediaQuery("(max-width: 520px)");
  const isMobile = useMediaQuery("(max-width: 900px)");
  const isTablet = useMediaQuery("(max-width: 1100px)");

  const best = products.filter((p) => p.isBestSeller);
  const newest = products.filter((p) => p.isNew);

  const groupSize = isSmall ? 1 : isMobile ? 2 : isTablet ? 2 : 3;

  const bestSlides = chunk(best, groupSize).map((group, i) => (
    <div key={i} className="carouselGroup">
      <ProductGrid products={group} compact />
    </div>
  ));

  const newSlides = chunk(newest, groupSize).map((group, i) => (
    <div key={i} className="carouselGroup">
      <ProductGrid products={group} compact />
    </div>
  ));

  return (
    <div>
      <section className="hero">
        <div className="heroBg" aria-hidden="true" />
        <div className="container heroInner">
          <div className="heroCopy fadeInUp">
            <div className="kicker">Indore, India</div>
            <h1 className="h1 heroTitle">Dhakad Mens Wear</h1>
            <p className="heroSub">
              Clean cuts, calm colors, and confident silhouettes for everyday and occasion styling.
            </p>
            <div className="heroCtas">
              <Link to="/shop" className="btn btnPrimary">
                Shop Collection
              </Link>
              <Link to="/wishlist" className="btn" aria-label="Open wishlist">
                <IconHeart size={18} aria-hidden="true" />
                Wishlist
              </Link>
            </div>
          </div>

          <div className="heroCard card fadeInUp" style={{ animationDelay: "90ms" }}>
            <div className="heroCardKicker">Runway calm. Indian ease.</div>
            <div className="heroCardTitle">Premium wardrobe staples, curated for India.</div>
            <div className="heroCardMeta">
              Shirts, Jeans, Trousers, and Essentials with multiple color options inside every style.
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: "28px 0 0" }}>
        <div className="featureGrid">
          <div className="featureCard">
            <div className="featureIcon" aria-hidden="true">
              <IconSearch size={18} />
            </div>
            <div className="featureTitle">Curated drops</div>
            <div className="featureText">Minimal silhouettes with premium colorways across every category.</div>
          </div>
          <div className="featureCard">
            <div className="featureIcon" aria-hidden="true">
              <IconCheck size={18} />
            </div>
            <div className="featureTitle">Quality-first</div>
            <div className="featureText">Fabric-first picks with clean stitching and a confident fall.</div>
          </div>
          <div className="featureCard">
            <div className="featureIcon" aria-hidden="true">
              <IconUser size={18} />
            </div>
            <div className="featureTitle">Easy support</div>
            <div className="featureText">Need help with sizing or tracking? We keep it simple and fast.</div>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: "44px 0 0" }}>
        <div className="sectionHead">
          <div>
            <div className="kicker">Collections</div>
            <div className="h2">Shop by category</div>
          </div>
          <Link to="/shop" className="btn">
            Shop all
          </Link>
        </div>

        <div className="homeCats">
          {categoriesInOrder.map((cat) => (
            <Link
              key={cat}
              to={`/shop?category=${encodeURIComponent(cat)}`}
              className="homeCatCard"
              aria-label={`Shop ${cat}`}
            >
              <div className="homeCatTop">
                <div className="homeCatTitle">{cat}</div>
                <IconArrowRight size={18} aria-hidden="true" />
              </div>
              <div className="homeCatMeta">{categoryCopy[cat] ?? "Explore the collection."}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container" style={{ padding: "44px 0 0" }}>
        <div className="sectionHead">
          <div>
            <div className="kicker">New Arrivals</div>
            <div className="h2">New drops</div>
          </div>
          <Link to="/shop?sort=new" className="btn">
            View all
          </Link>
        </div>
        <Carousel slides={newSlides.length ? newSlides : [<div key="empty" />]} />
      </section>

      <section className="container" style={{ padding: "44px 0 34px" }}>
        <div className="sectionHead">
          <div>
            <div className="kicker">Best Sellers</div>
            <div className="h2">Most loved</div>
          </div>
          <Link to="/shop?sort=featured" className="btn">
            View all
          </Link>
        </div>
        <Carousel slides={bestSlides.length ? bestSlides : [<div key="empty" />]} />
      </section>

      <section className="container" style={{ padding: "0 0 90px" }}>
        <div className="card ctaCard homeCtaCard">
          <div>
            <div className="kicker">Quick access</div>
            <div className="h2 homeCtaTitle">Track your order anytime</div>
            <div className="homeCtaText">Enter your order ID and get clean, step-by-step delivery updates.</div>
          </div>
          <div className="ctaActions">
            <Link to="/track-order" className="btn btnPrimary">
              Track order
            </Link>
            <Link to="/shop" className="btn">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
