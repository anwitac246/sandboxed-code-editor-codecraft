import { footerLinks } from "@/config/nav";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <a href="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
          <span className="text-gradient-primary">&#60;/&#62;</span>
          <span>CodeCraft</span>
        </a>

        <div className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} CodeCraft. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
