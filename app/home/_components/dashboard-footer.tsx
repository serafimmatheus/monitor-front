const FOOTER_LINKS = ["Suporte", "Termos de Uso", "Privacidade", "FAQ"];

export function DashboardFooter() {
  return (
    <footer className="mt-auto flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
      <p>© 2024 MonitoraCNPJ. Todos os direitos reservados.</p>
      <nav className="flex flex-wrap items-center gap-4">
        {FOOTER_LINKS.map((link) => (
          <button
            key={link}
            type="button"
            className="transition-colors hover:text-foreground"
          >
            {link}
          </button>
        ))}
      </nav>
    </footer>
  );
}
