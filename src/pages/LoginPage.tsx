import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import { useToast } from "../store/ToastStore";

export function LoginPage() {
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="container" style={{ padding: "96px 0 90px" }}>
      <div className="auth card">
        <div className="kicker">Account</div>
        <h1 className="h1 pageTitle" style={{ margin: "10px 0 6px" }}>
          Login
        </h1>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          Demo login. Use <span className="mono">admin@dhakadmenswear.com</span> to see the admin panel.
        </p>

        <form
          className="authForm"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim() || !password.trim()) {
              toast.error("Enter email and password");
              return;
            }
            const user = auth.login({ email: email.trim(), password });
            toast.success(`Welcome, ${user.name}`);
            navigate(user.role === "admin" ? "/admin" : "/shop");
          }}
        >
          <label className="field">
            <span className="fieldLabel">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label className="field">
            <span className="fieldLabel">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button type="submit" className="btn btnPrimary">
            Login
          </button>
        </form>

        <div className="authAlt">
          New here?{" "}
          <Link className="authLink" to="/signup">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

