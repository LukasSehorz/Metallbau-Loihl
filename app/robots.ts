import type { MetadataRoute } from "next";

// Wird von Next.js automatisch unter /robots.txt ausgeliefert.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Interne Pruefseite fuer Screenshot-Vergleiche am 3D-Modell und die
      // Formular-Route — beides gehoert nicht in den Suchindex.
      disallow: ["/3d-test", "/api/"],
    },
    sitemap: "https://www.loihl-metallbau.de/sitemap.xml",
    host: "https://www.loihl-metallbau.de",
  };
}
