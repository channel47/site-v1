import Link from "next/link";
import { MarkLink } from "./mark-link";
import { ThemeSwitcher } from "./theme-switcher";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <MarkLink small />
      <nav className="footer-legal" aria-label="Legal">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
      <ThemeSwitcher />
    </footer>
  );
}
