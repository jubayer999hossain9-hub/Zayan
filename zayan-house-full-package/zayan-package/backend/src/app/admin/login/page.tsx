"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@zayanhouse.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  }

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 360, margin: "80px auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>Zayan House — Admin Login</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 6 }} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 6 }} />
        {error && <div style={{ color: "#b54545", fontSize: 13 }}>{error}</div>}
        <button type="submit" style={{ padding: 10, background: "#0E3B2E", color: "#fff", border: 0, borderRadius: 6 }}>
          Log in
        </button>
      </form>
      <p style={{ fontSize: 12, color: "#888", marginTop: 16 }}>
        Seed credentials: admin@zayanhouse.com / ChangeMe123! (change immediately after first login)
      </p>
    </main>
  );
}
