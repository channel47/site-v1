import type { Note, Project } from "@/lib/content";
import { AUTHOR_NAME, SITE_URL } from "@/lib/seo";

function frontmatter(fields: Record<string, string | undefined>): string {
  const lines = Object.entries(fields)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
  return ["---", ...lines, "---", ""].join("\n");
}

export function noteTwin(
  note: Note | Project,
  section: "notes" | "projects" = "notes",
): string {
  return (
    frontmatter({
      title: note.title,
      slug: note.slug,
      type: section === "projects" ? "project" : "note",
      group: section,
      status: "status" in note ? note.status : undefined,
      description: note.description,
      author: AUTHOR_NAME,
      publishedAt: note.date,
      storyDate: note.storyDate,
      updatedAt: note.updated ?? note.date,
      canonical: `${SITE_URL}/${section}/${note.slug}`,
      repo: "repo" in note ? note.repo : undefined,
      install: "install" in note ? note.install : undefined,
      package: "package" in note ? note.package : undefined,
      video: note.video?.src,
      videoPoster: note.video?.poster,
      videoCaptions: note.video?.captions,
      videoDuration: note.video?.duration,
      videoCaption: note.video?.caption,
    }) + `\n# ${note.title}\n\n${note.markdown}\n`
  );
}
