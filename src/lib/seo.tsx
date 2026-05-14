import { Helmet } from 'react-helmet-async';

export interface SEOMeta {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'localbusiness';
  structuredData?: Record<string, unknown>;
}

const DEFAULT_IMAGE = 'https://i.postimg.cc/MHqCmSWF/Alphadavis(1).png';
const BASE_URL = 'https://alphadavisrealestate.com';
const SITE_NAME = 'Alphadavis Real Estate Limited';

export const SEO = ({
  title,
  description,
  keywords = ['real estate', 'property', 'land', 'housing', 'Nigeria', 'Enugu', 'investment'],
  image = DEFAULT_IMAGE,
  url = BASE_URL,
  type = 'website',
  structuredData,
}: SEOMeta) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = url || BASE_URL;

    // LocalBusiness structured data
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': SITE_NAME,
      'description': description,
      'image': image,
      'url': BASE_URL,
      'telephone': '08069443282',
      'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'M33 Mabel plaza, Onu Ato, Presidential Road',
      'addressLocality': 'Enugu',
      'addressRegion': 'Enugu State',
      'postalCode': '',
      'addressCountry': 'NG'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '6.4401',
      'longitude': '7.5022'
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      'opens': '08:00',
      'closes': '18:00'
    },
    'priceRange': '₦1,700,000 - ₦3,000,000',
    'areaServed': {
      '@type': 'AdministrativeArea',
      'name': 'Enugu State, Nigeria'
    }
  };

  // WebSite structured data
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': SITE_NAME,
    'url': BASE_URL,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${BASE_URL}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const finalStructuredData = type === 'localbusiness'
    ? localBusinessSchema
    : type === 'article'
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': title,
        'description': description,
        'image': image,
        'author': {
          '@type': 'Organization',
          'name': SITE_NAME
        },
        'publisher': {
          '@type': 'Organization',
          'name': SITE_NAME,
          'logo': {
            '@type': 'ImageObject',
            'url': DEFAULT_IMAGE
          }
        }
      }
    : webSiteSchema;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData || finalStructuredData ? (
        <script type="application/ld+json">
          {JSON.stringify(structuredData || finalStructuredData)}
        </script>
      ) : null}
    </Helmet>
  );
};

export default SEO;
