import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildRouteSchema,
  DEFAULT_SOCIAL_IMAGE,
  seoRoutes,
  SITE_URL,
} from '../src/data/seo.js'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(projectRoot, 'dist')
const template = await readFile(join(distDir, 'index.html'), 'utf8')

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function jsonForHtml(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c')
}

function metadataFor(route) {
  const canonical = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`
  const title = escapeHtml(route.title)
  const description = escapeHtml(route.description)

  return `<!-- SG-SEO-START -->
    <title data-sg-static-seo>${title}</title>
    <meta data-sg-static-seo name="description" content="${description}" />
    <meta data-sg-static-seo name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link data-sg-static-seo rel="canonical" href="${canonical}" />
    <meta data-sg-static-seo property="og:locale" content="en_GH" />
    <meta data-sg-static-seo property="og:type" content="website" />
    <meta data-sg-static-seo property="og:site_name" content="Stormglide Technologies" />
    <meta data-sg-static-seo property="og:title" content="${title}" />
    <meta data-sg-static-seo property="og:description" content="${description}" />
    <meta data-sg-static-seo property="og:image" content="${DEFAULT_SOCIAL_IMAGE}" />
    <meta data-sg-static-seo property="og:image:width" content="1200" />
    <meta data-sg-static-seo property="og:image:height" content="630" />
    <meta data-sg-static-seo property="og:image:alt" content="Stormglide software products and digital systems" />
    <meta data-sg-static-seo property="og:url" content="${canonical}" />
    <meta data-sg-static-seo name="twitter:card" content="summary_large_image" />
    <meta data-sg-static-seo name="twitter:title" content="${title}" />
    <meta data-sg-static-seo name="twitter:description" content="${description}" />
    <meta data-sg-static-seo name="twitter:image" content="${DEFAULT_SOCIAL_IMAGE}" />
    <script data-sg-static-seo type="application/ld+json">${jsonForHtml(buildRouteSchema(route))}</script>
    <!-- SG-SEO-END -->`
}

function staticShellFor(route) {
  const topics = route.topics.map(topic => `<li>${escapeHtml(topic)}</li>`).join('')
  return `<!-- SG-STATIC-START -->
      <main class="sg-static-shell">
        <nav aria-label="Primary navigation">
          <a class="sg-static-brand" href="/" aria-label="Stormglide home"><i aria-hidden="true"></i><span>stormglide<em>.io</em></span></a>
          <span>
            <a href="/services">Services</a>
            <a href="/products">Products</a>
            <a href="/work">Work</a>
            <a href="/contact">Contact</a>
          </span>
        </nav>
        <article>
          <p class="sg-static-kicker">${escapeHtml(route.kicker)}</p>
          <h1>${escapeHtml(route.h1)}</h1>
          <p>${escapeHtml(route.summary)}</p>
          <ul>${topics}</ul>
          <a class="sg-static-cta" href="/contact">Discuss a project</a>
        </article>
      </main>
      <!-- SG-STATIC-END -->`
}

const seoPattern = /<!-- SG-SEO-START -->[\s\S]*?<!-- SG-SEO-END -->/
const staticPattern = /<!-- SG-STATIC-START -->[\s\S]*?<!-- SG-STATIC-END -->/

for (const route of seoRoutes) {
  const html = template
    .replace(seoPattern, metadataFor(route))
    .replace(staticPattern, staticShellFor(route))

  const outputPath = route.path === '/'
    ? join(distDir, 'index.html')
    : join(distDir, `${route.path.slice(1)}.html`)

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html)
}

console.log(`Generated static search HTML for ${seoRoutes.length} public routes.`)
