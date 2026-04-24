"use client"

import { useTheme } from "../providers/theme"
import { FiSun, FiMoon } from "react-icons/fi"

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg transition-colors"
      style={{ border: "1px solid var(--border)" }}
      title="Toggle theme"
    >
      {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
    </button>
  )
}
