import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import {
  buildRouteSchema,
  DEFAULT_SOCIAL_IMAGE,
  getSeoForPath,
  SITE_URL,
} from '../../data/seo'

export default function RouteSEO() {
  const location = useLocation()
  const route = getSeoForPath(location.pathname)
  const privateRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/client')

  if (privateRoute || !route) {
    return (
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>
    )
  }

  const canonical = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{route.title}</title>
      <meta name="description" content={route.description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonical} />

      <meta property="og:locale" content="en_GH" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Stormglide Technologies" />
      <meta property="og:title" content={route.title} />
      <meta property="og:description" content={route.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={DEFAULT_SOCIAL_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Stormglide software products and digital systems" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={route.title} />
      <meta name="twitter:description" content={route.description} />
      <meta name="twitter:image" content={DEFAULT_SOCIAL_IMAGE} />
      <meta name="twitter:image:alt" content="Stormglide software products and digital systems" />

      <script type="application/ld+json">{JSON.stringify(buildRouteSchema(route))}</script>
    </Helmet>
  )
}
