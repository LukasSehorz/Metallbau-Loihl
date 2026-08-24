import type { MetadataRoute } from "next";

// Wird von Next.js automatisch unter /sitemap.xml ausgeliefert.
// Die interne Pruefseite /3d-test steht bewusst NICHT drin — sie ist nur fuer
// Screenshot-Vergleiche am 3D-Modell gedacht.
const BASE = "https://www.loihl-metallbau.de";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const PAGES: Entry[] = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" },
  { path: "/produkte", priority: 0.9, changeFrequency: "monthly" },
  { path: "/konfigurator", priority: 0.9, changeFrequency: "monthly" },
  { path: "/schweisstische", priority: 0.9, changeFrequency: "monthly" },
  { path: "/schweisstische/modell-to", priority: 0.7, changeFrequency: "yearly" },
  { path: "/schweisstische/modell-td", priority: 0.7, changeFrequency: "yearly" },
  { path: "/spanntische", priority: 0.8, changeFrequency: "monthly" },
  { path: "/zubehoer", priority: 0.7, changeFrequency: "monthly" },
  { path: "/ueber-uns", priority: 0.5, changeFrequency: "yearly" },
  { path: "/kontakt", priority: 0.6, changeFrequency: "yearly" },
  { path: "/impressum", priority: 0.2, changeFrequency: "yearly" },
  { path: "/datenschutz", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
