import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const notes = (await getCollection('notes', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Build Notes — Channel 47',
    description: 'Skill breakdowns, plugin updates, and build process from managing 25+ ad accounts daily.',
    site: context.site!.toString(),
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.date,
      link: `/notes/${note.id}/`,
      author: 'Jackson Dean',
    })),
    customData: '<language>en-us</language>',
  });
}
