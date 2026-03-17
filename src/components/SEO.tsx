import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://vkmflowers.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/social-share.png`;

type SEOProps = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
};

const buildUrl = (path: string) => `${BASE_URL}${path}`;

export const SEO: React.FC<SEOProps> = ({ title, description, path, ogImage, structuredData }) => {
  const canonicalUrl = buildUrl(path);
  const image = ogImage || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="VKM Flowers" />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export const SEO_BASE_URL = BASE_URL;
