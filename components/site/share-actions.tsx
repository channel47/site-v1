"use client";

import { LinkedinLogo, XLogo } from "@phosphor-icons/react";
import { CopyButton } from "./copy-button";
import { taggedShareUrl } from "@/lib/measurement";

export type ShareProps = { mdPath: string; url: string; title: string };

/** Destinations and copy behavior for the article share popover. */
export function ShareActions({ mdPath, url, title, onSelect, onCopied }: ShareProps & {
  onSelect?: () => void;
  onCopied?: () => void;
}) {
  const path = new URL(url).pathname;
  return (
    <div className="share-popover-actions">
      <CopyButton event="link_copy" glyph="link" label="Copy link" title="Copy link" text={url} onCopied={onCopied} />
      <CopyButton event="page_copy" label="Copy page" title="Copy page as Markdown" fetchPath={mdPath} onCopied={onCopied} />
      <a className="icon-btn" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(taggedShareUrl(path, "x"))}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener" title="Share on X" aria-label="Share on X" onClick={onSelect}>
        <XLogo size={18} aria-hidden="true" />Share on X
      </a>
      <a className="icon-btn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(taggedShareUrl(path, "linkedin"))}`} target="_blank" rel="noopener" title="Share on LinkedIn" aria-label="Share on LinkedIn" onClick={onSelect}>
        <LinkedinLogo size={18} aria-hidden="true" />LinkedIn
      </a>
    </div>
  );
}
