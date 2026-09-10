"use client";

import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { RecoveryContent } from "@/components/site/recovery-content";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="st-page"><SiteHeader /><RecoveryContent retry={reset} /><SiteFooter /></div>;
}
