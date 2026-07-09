import { useState } from "react";

export function ThemeButton() {
  const [darkMode, setDarkMode] = useState(() => {
    const saveTheme = localStorage.getItem("theme");

    return saveTheme === "dark";
  });

  const toggleTheme = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    document.documentElement.classList.toggle("dark", newMode);

    localStorage.setItem(
        "theme",
        newMode ? "dark" : "light"
    )
  };

  return (
    <button onClick={toggleTheme}>
      {darkMode ? "☀️ Modo claro" : "🌙 Modo oscuro"}
    </button>
  );
}