export function Footer() {
  return (
    <footer className="text-center py-6 text-sm" style={{ color: "var(--muted)" }}>
      Made by{" "}
      <a
        href="https://marban.is-a.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-70 transition-opacity"
        style={{ color: "var(--foreground)" }}
      >
        marban
      </a>
      {" ^.^"}
    </footer>
  )
}
