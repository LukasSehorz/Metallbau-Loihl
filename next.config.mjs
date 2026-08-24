/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  async redirects() {
    // Die Routen hiessen urspruenglich /schweißtische und /zubehör. Umlaute im
    // Ordnernamen liessen sich unter Windows nicht zuverlaessig aufloesen — die
    // Seiten lieferten 404. Die Ordner heissen jetzt ASCII; alte Adressen
    // werden dauerhaft (301) umgeleitet, damit vorhandene Links und
    // Suchmaschinen-Eintraege nicht ins Leere laufen.
    return [
      { source: "/schwei%C3%9Ftische", destination: "/schweisstische", permanent: true },
      { source: "/schwei%C3%9Ftische/:slug", destination: "/schweisstische/:slug", permanent: true },
      { source: "/zubeh%C3%B6r", destination: "/zubehoer", permanent: true },
      // Beide Adressen gab es nie als eigene Route, waren aber verlinkt.
      { source: "/katalog", destination: "/produkte", permanent: true },
      { source: "/manufaktur", destination: "/ueber-uns", permanent: true },
    ];
  },
};

export default nextConfig;
