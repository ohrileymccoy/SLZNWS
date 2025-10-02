import { useTheme } from "./ThemeProvider";

export default function ThemeTest() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      style={{
        background: "var(--color-bg)",
        color: "var(--color-text)",
        border: "1px solid var(--color-border)",
        padding: "1rem",
        borderRadius: "0.5rem",
        marginTop: "1rem",
      }}
    >
      <p>
        Theme is: <strong>{theme}</strong>
      </p>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        style={{
          background: "var(--color-surface)",
          color: "var(--color-heading)",
          padding: "0.5rem 1rem",
          border: "1px solid var(--color-border-strong)",
          borderRadius: "0.375rem",
          marginTop: "0.5rem",
          cursor: "pointer",
        }}
      >
        Toggle Theme
      </button>
    </div>
  );
}
