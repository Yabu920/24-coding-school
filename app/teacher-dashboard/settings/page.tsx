"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    setDark(d => !d);
    document.documentElement.classList.toggle("dark", !dark);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Theme</div>
            <div className="text-sm text-gray-500">Toggle dark / light theme</div>
          </div>
          <button onClick={toggleTheme} className="px-4 py-2 border rounded">{dark ? "Light" : "Dark"}</button>
        </div>
      </div>
    </div>
  );
}
