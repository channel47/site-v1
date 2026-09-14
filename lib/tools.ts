export interface ToolPreview {
  label: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

/** Tools people can use. Build stories remain in content/projects/. */
export interface Tool {
  id: string;
  name: string;
  category: string;
  status?: string;
  description: string;
  hostedUrl?: string;
  repositoryUrl?: string;
  storyPath?: string;
  logo?: { light: string; dark: string; width: number; height: number };
  previews: readonly [ToolPreview, ...ToolPreview[]];
}

export const TOOLS: readonly Tool[] = [
  {
    id: "vellum",
    name: "Vellum",
    category: "Image workspace",
    status: "Private beta",
    description:
      "Generate and edit images, keep your references together, and work through ideas with an agent in the same workspace.",
    hostedUrl: "https://vellum.gallery/",
    storyPath: "/projects/vellum",
    logo: {
      light: "/tools/vellum/logo-ink.svg",
      dark: "/tools/vellum/logo-ivory.svg",
      width: 408,
      height: 100,
    },
    previews: [
      {
        label: "Image board",
        src: "/posts/vellum/x-all-grid.webp",
        alt: "Vellum’s image workspace showing a grid of blue X-All product-image studies and the prompt composer.",
        width: 3840,
        height: 2160,
      },
      {
        label: "With an agent",
        src: "/posts/vellum/x-all-agent.webp",
        alt: "An agent working beside the X-All image board in Vellum, discussing a batch of product images.",
        width: 3840,
        height: 2160,
      },
    ],
  },
];
