import Link from "next/link";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { MeasuredLink } from "@/components/site/measured-link";
import { ToolGallery } from "@/components/site/tool-gallery";
import { DirectionCue } from "@/components/site/direction-cue";
import { pageMetadata } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";

export const metadata = pageMetadata({
  title: "Tools",
  description: "Tools that grew out of my own experiments. Explore what they do, read how they came about, and see what you might make with them.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="st-page">
      <SiteHeader />
      <main id="main-content" className="st-shell tools-page">
        <header className="st-head tools-heading">
          <h1 className="st-h1">Tools</h1>
          <p>Tools that grew out of my own experiments. Explore what they do, read how they came about, and see what you might make with them.</p>
        </header>
        <div className="tools-list">
          {TOOLS.map((tool, index) => (
            <article className="tool-feature" key={tool.id} aria-labelledby={`${tool.id}-title`}>
              <header className="tool-identity">
                <h2 id={`${tool.id}-title`} className="tool-name">
                  {tool.logo ? <>
                    <span className="sr-only">{tool.name}</span>
                    {/* Original outlined brand assets; never typeset the logo. */}
                    <img className="tool-logo-light" src={tool.logo.light} width={tool.logo.width} height={tool.logo.height} alt="" />
                    <img className="tool-logo-dark" src={tool.logo.dark} width={tool.logo.width} height={tool.logo.height} alt="" />
                  </> : tool.name}
                </h2>
                <p className="tool-meta">
                  <span>{tool.category}</span>
                  {tool.status && <span>{tool.status}</span>}
                </p>
              </header>
              <ToolGallery id={tool.id} name={tool.name} previews={tool.previews} preload={index === 0} />
              <div className="tool-details">
                <p className="tool-description">{tool.description}</p>
                <div className="tool-actions">
                  {tool.hostedUrl && (
                    <a className="tool-action tool-action-primary" href={tool.hostedUrl}>
                      Visit {tool.name}
                      <DirectionCue />
                    </a>
                  )}
                  {tool.repositoryUrl && (
                    <MeasuredLink className="tool-action" href={tool.repositoryUrl} event="repository_click">
                      View source<span className="sr-only"> for {tool.name} on GitHub</span>
                    </MeasuredLink>
                  )}
                  {tool.storyPath && (
                    <Link className="tool-story" href={tool.storyPath}>
                      Read the build story<span className="sr-only"> for {tool.name}</span>
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
