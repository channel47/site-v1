import { GithubLogo, XLogo } from "@phosphor-icons/react/dist/ssr";
import { LINKS } from "@/lib/site-content";
import { UtilityLink } from "./utility-link";

export function SocialLinks() {
  return (
    <nav className="social-links" aria-label="Social profiles">
      <UtilityLink href={LINKS.x} label="Jackson on X">
        <XLogo size={20} aria-hidden="true" />
      </UtilityLink>
      <UtilityLink href={LINKS.github} label="Jackson on GitHub">
        <GithubLogo size={20} aria-hidden="true" />
      </UtilityLink>
    </nav>
  );
}
