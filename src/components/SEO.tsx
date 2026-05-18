import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  type?: string;
}

/**
 * Per-route SEO meta. Sets title, description, canonical, and Open Graph
 * tags. Use on every page so each route has a unique entry in search
 * results and accurate social previews.
 */
export function SEO({ title, description, path, type = "website" }: SEOProps) {
  const fullTitle = title.includes("Cinecraft") ? title : `${title} | Cinecraft`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={path} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={path} />
      <meta property="og:type" content={type} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}