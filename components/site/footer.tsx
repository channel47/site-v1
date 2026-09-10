import Link from "next/link";
import { ChatCircle } from "@phosphor-icons/react/dist/ssr";
import { MarkLink } from "./mark-link";
import { UtilityLink } from "./utility-link";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <MarkLink small />
      <nav aria-label="Footer">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <UtilityLink href="/session" label="Work together">
          <ChatCircle size={20} aria-hidden="true" />
        </UtilityLink>
      </nav>
    </footer>
  );
}
