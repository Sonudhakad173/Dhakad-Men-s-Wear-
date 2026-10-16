import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import { useToast } from "../store/ToastStore";

export function SignupPage() {
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="container" style={{ padding: "96px 0 90px" }}>
      <div className="auth card">
        <div className="kicker">Account</div>
        <h1 className="h2" style={{ margin: "10px 0 6px" }}>
          Create account
        </h1>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          Demo signup. Your account is stored locally in this browser.
        </p>

        <form
          className="authForm"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !email.trim() || !password.trim()) {
              toast.error("Please fill all fields");
              return;
            }
            const user = auth.signup({ name: name.trim(), email: email.trim(), password });
            toast.success(`Welcome, ${user.name}`);
            navigate(user.role === "admin" ? "/admin" : "/shop");
          }}
        >
          <label className="field">
            <span className="fieldLabel">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </label>
          <label className="field">
            <span className="fieldLabel">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label className="field">
            <span className="fieldLabel">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>

          <button type="submit" className="btn btnPrimary">
            Create account
          </button>
        </form>

        <div className="authAlt">
          Already have an account?{" "}
          <Link className="authLink" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
