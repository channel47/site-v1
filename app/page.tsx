import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { SystemSection } from "@/components/system-section"
import { KitSection } from "@/components/kit-section"
import { BuildSection } from "@/components/build-section"
import { LabSection } from "@/components/lab-section"
import { OutputSection } from "@/components/output-section"
import { CtaSection } from "@/components/cta-section"
import { SideNav } from "@/components/side-nav"

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <SideNav />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10">
        <HeroSection />
        <ProblemSection />
        <SystemSection />
        <KitSection />
        <BuildSection />
        <LabSection />
        <OutputSection />
        <CtaSection />
      </div>
    </main>
  )
}
