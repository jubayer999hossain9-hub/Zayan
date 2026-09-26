"use client";
import { useState } from "react";

type Setting = { key: string; value: unknown };

export default function SettingsForm({ settings }: { settings: Setting[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(settings.map((s) => [s.key, String(s.value)]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function save(key: string) {
    setSaving(key);
    setSaved(null);
    let value: unknown = values[key];
    if (value === "true" || value === "false") value = value === "true";
    else if (!isNaN(Number(value)) && value !== "") value = Number(value);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSaving(null);
    setSaved(key);
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {settings.map((s) => (
        <div key={s.key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ width: 220, fontSize: 12.5, color: "#555" }}>{s.key}</label>
          <input
            value={values[s.key] ?? ""}
            onChange={(e) => setValues({ ...values, [s.key]: e.target.value })}
            style={{ flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}
          />
          <button
            onClick={() => save(s.key)}
            disabled={saving === s.key}
            style={{ padding: "8px 14px", background: "#0E3B2E", color: "#fff", border: 0, borderRadius: 6, fontSize: 12.5 }}
          >
            {saving === s.key ? "Saving..." : saved === s.key ? "Saved ✓" : "Save"}
          </button>
        </div>
      ))}
      <p style={{ fontSize: 12, color: "#888" }}>
        This writes directly to the <code>site_settings</code> table via <code>PUT /api/admin/settings</code>.
        Open the homepage in another tab and refresh after saving — the change is live immediately.
      </p>
    </div>
  );
}
