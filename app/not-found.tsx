import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { RecoveryContent } from "@/components/site/recovery-content";

export default function NotFound() {
  return <div className="st-page"><SiteHeader /><RecoveryContent notFound /><SiteFooter /></div>;
}
