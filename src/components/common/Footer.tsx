import { Link } from "react-router-dom";

const INDORE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Indore%2C%20India";

export function Footer() {
  return (
    <footer className="siteFooter">
      <div className="container footerInner">
        <div className="footerTop">
          <div>
            <div className="kicker">Dhakad Mens Wear</div>
            <div className="footerBrand">Sharp essentials, Indian roots, runway restraint.</div>
          </div>

          <div className="footerCols">
            <div className="footerCol">
              <div className="footerTitle">Customer Support</div>
              <a className="footerLink" href="#shipping" onClick={(e) => e.preventDefault()}>
                Shipping & Delivery
              </a>
              <a className="footerLink" href="#returns" onClick={(e) => e.preventDefault()}>
                Returns & Exchange
              </a>
              <Link className="footerLink" to="/track-order">
                Track Your Order
              </Link>
            </div>

            <div className="footerCol">
              <div className="footerTitle">Explore</div>
              <Link className="footerLink" to="/shop">
                Shop
              </Link>
              <Link className="footerLink" to="/wishlist">
                Wishlist
              </Link>
              <Link className="footerLink" to="/compare">
                Compare
              </Link>
            </div>

            <div className="footerCol">
              <div className="footerTitle">Contact</div>
              <a className="footerMeta footerLink" href={INDORE_MAPS_URL} target="_blank" rel="noreferrer">
                Indore, India
              </a>
              <a className="footerLink" href="mailto:support@dhakadmenswear.com">
                support@dhakadmenswear.com
              </a>
              <a className="footerLink" href="tel:+919876543210">
                +91 98765 43210
              </a>
            </div>
          </div>
        </div>

        <div className="footerBottom">
          <div className="footerBottomLeft">
            <span>© {new Date().getFullYear()} Dhakad Mens Wear</span>
            <span className="footerDot" aria-hidden="true">
              •
            </span>
            <a className="footerLink" href={INDORE_MAPS_URL} target="_blank" rel="noreferrer">
              Indore, India
            </a>
          </div>
          <div className="footerBottomRight">
            <a className="footerLink" href="#privacy" onClick={(e) => e.preventDefault()}>
              Privacy
            </a>
            <a className="footerLink" href="#terms" onClick={(e) => e.preventDefault()}>
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
