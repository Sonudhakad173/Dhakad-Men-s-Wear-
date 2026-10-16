import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="container" style={{ padding: "96px 0" }}>
      <div className="kicker">404</div>
      <h1 className="h1" style={{ margin: "10px 0 10px" }}>
        Page not found
      </h1>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btnPrimary">
        Go home
      </Link>
    </div>
  );
}
