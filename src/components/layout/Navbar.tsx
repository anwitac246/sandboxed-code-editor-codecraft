'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAccessToken, clearTokens } from "@/lib/tokens";
import { logout } from "@/service/auth.service";
import { navLinks } from "@/config/nav";
import { Button } from "@/components/ui/buttons";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for token on client-side
    const token = getAccessToken();
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
          <span className="text-gradient-primary">&#60;/&#62;</span>
          <span>CodeCraft</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard/projects"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:text-foreground"
              >
                Dashboard
              </Link>
              <Button variant="secondary" size="md" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <a
              href="/auth/login"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary"
            >
              Get Started
            </a>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-foreground transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-foreground transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {isLoggedIn ? (
              <div className="flex flex-col gap-4">
                <Link
                  href="/dashboard/projects"
                  className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Button variant="secondary" size="md" onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </div>
            ) : (
              <a
                href="/auth/login"
                className="mt-2 rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
              >
                Get Started
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
