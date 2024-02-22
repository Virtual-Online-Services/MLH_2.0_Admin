import { useEffect, useState } from "react";
import "./switch.scss";

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

type Theme = "dark" | "light";

export const Switch = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Retrieve theme preference from local storage or default to "light"
    const storedTheme = localStorage.getItem("theme");
    return (storedTheme as Theme) || "light";
  });

  const handleChange = (e: ChangeEvent) => {
    const newTheme = e.target.checked ? "dark" : "light";
    setTheme(newTheme);
    // Store theme preference in local storage
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    // Set the theme attribute on the body
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="container-switch">
      <label className="switch">
        <input
          type="checkbox"
          onChange={handleChange}
          checked={theme === "dark"}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};
