import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export function RecoveryContent({ notFound = false, retry }: { notFound?: boolean; retry?: () => void }) {
  return (
    <main id="main-content" className="st-shell recovery-page">
      <header className="st-head">
        <p className="utility-label">{notFound ? "404" : "Something went wrong"}</p>
        <h1 className="st-h1">{notFound ? "Page not found." : "This page couldn’t load."}</h1>
      </header>
      <div className="st-prose">
        <p>{notFound ? "That address doesn’t lead to a page. You can find the latest work in the collection." : "Please try again, or return to the collection."}</p>
      </div>
      <div className="recovery-actions">
        {retry ? <button type="button" className="ea-btn" onClick={retry}>Try again</button> : null}
        <a href="/" className="browse-return"><ArrowLeft size={20} aria-hidden="true" /><span>Back to collection</span></a>
      </div>
    </main>
  );
}
