import { splitArticleAtGallery, type Note } from '@/lib/content';
import { ToolGallery } from './tool-gallery';

export function ArticleProse({ html, entry }: { html: string; entry: Note }) {
  const { beforeGallery, afterGallery, placed } = splitArticleAtGallery({ ...entry, html });
  const gallery = placed ? entry.gallery : undefined;
  return <>
    {beforeGallery ? <div className="st-prose piece-prose" dangerouslySetInnerHTML={{ __html: beforeGallery }} /> : null}
    {gallery ? <section className="article-gallery" id={gallery.id} aria-labelledby={`${gallery.id}-title`}>
      <h2 id={`${gallery.id}-title`}>{gallery.title}</h2>
      <p className="article-gallery-intro">{gallery.description}</p>
      <ToolGallery id={gallery.id} name={gallery.title} previews={gallery.images} initialIndex={gallery.initial ?? 0} />
      <noscript><p>Open the individual images:</p><ol>{gallery.images.map(image => <li key={image.src}><a href={image.src}>{image.label}</a> — {image.caption}</li>)}</ol></noscript>
    </section> : null}
    {afterGallery ? <div className="st-prose piece-prose" dangerouslySetInnerHTML={{ __html: afterGallery }} /> : null}
  </>;
}
