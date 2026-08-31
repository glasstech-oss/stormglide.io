import { testimonials } from './testimonials.js'
import { INDUSTRIES } from './industries.js'
import { INSIGHTS } from './insights.js'

export const SITE_URL = 'https://stormglide.io'
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/og-image.jpg`

const reviewSchemas = testimonials.map(t => ({
  '@type': 'Review',
  reviewRating: { '@type': 'Rating', ratingValue: t.rating, bestRating: 5 },
  author: { '@type': 'Person', name: t.author },
  reviewBody: t.quote,
  itemReviewed: { '@id': `${SITE_URL}/#organization` },
}))

const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length

export const organizationSchema = {
  '@type': 'Organization',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: averageRating,
    bestRating: 5,
    reviewCount: testimonials.length,
  },
  review: reviewSchemas,
  '@id': `${SITE_URL}/#organization`,
  name: 'Stormglide Technologies Ltd.',
  alternateName: 'Stormglide',
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/favicon.png`,
  },
  image: DEFAULT_SOCIAL_IMAGE,
  description: 'Business systems studio in Accra, Ghana — building customer portals, inventory systems, booking systems, and business management software that replace WhatsApp, Excel, and paper.',
  email: 'john@stormglide.io',
  telephone: '+233547738678',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Accra',
    addressCountry: 'GH',
  },
  location: {
    '@type': 'Place',
    name: 'Stormglide Technologies, Accra',
    hasMap: 'https://www.google.com/maps?cid=16771153269117902667',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Accra',
      addressCountry: 'GH',
    },
  },
  areaServed: 'Worldwide',
  sameAs: [
    'https://www.linkedin.com/company/stormglide-io/',
    'https://www.tiktok.com/@stormglide.io',
  ],
  knowsAbout: [
    'Website development',
    'Custom software development',
    'Web application development',
    'Mobile application development',
    'SaaS product development',
    'Business process automation',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'john@stormglide.io',
    telephone: '+233547738678',
    areaServed: 'Worldwide',
    availableLanguage: ['English'],
  },
}

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: 'Stormglide Technologies',
  alternateName: ['Stormglide', 'Stormglide.io'],
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en',
}

export const seoRoutes = [
  {
    path: '/',
    title: 'One System Instead of Six Tools | Custom Business Software | Stormglide',
    description: 'Your business runs on too many disconnected tools. We design, build, and operate the one system that replaces them — customers, staff, inventory, payments, and reporting in a single dashboard. Built in Accra, deployed worldwide.',
    h1: 'One system instead of six tools.',
    kicker: 'Business Systems Studio — live in production today',
    summary: 'Spreadsheets, chat groups, paper files, and three apps that don\'t talk to each other. We design, build, and run the single system that replaces all of it — customers, staff, inventory, payments, and reporting in one dashboard your team will actually use.',
    topics: ['Ready-to-use systems for HR, dental, freight, and beauty booking', 'Custom web and business applications built around your process', 'Mobile apps, e-commerce, and product design'],
    schemaType: 'WebPage',
  },
  {
    path: '/services',
    title: 'Custom Software Development: Portals, Inventory & Booking Systems | Stormglide',
    description: 'We build the system behind your website — customer portals, inventory and operations dashboards, booking systems, and full business management software. Planned, designed, built, and supported by our team in Accra for clients in any time zone.',
    h1: 'Custom systems for how your business actually runs',
    kicker: 'Business systems, not just websites',
    summary: 'Off-the-shelf tools force your business to change shape to fit the software. We do the opposite. We plan, design, build, and support production software shaped around your real process — from the first call to the live system, and every day after that.',
    topics: ['Website development', 'Web and SaaS applications', 'Mobile apps and product design'],
    schemaType: 'CollectionPage',
  },
  {
    path: '/services/software-development',
    title: 'Custom Software Development Company | Build Scalable Software | Stormglide',
    description: 'Expert custom software development services. Web applications, SaaS platforms, business systems, and enterprise software. From MVP to scale.',
    h1: 'Build Reliable Software That Scales',
    kicker: 'Custom software development',
    summary: 'We design, build, and operate custom software products that grow with your business. From web applications to SaaS platforms.',
    topics: ['Web applications', 'SaaS platforms', 'Business systems and enterprise software'],
    schemaType: 'Service',
    serviceType: 'Custom software development',
  },
  {
    path: '/services/saas-development',
    title: 'SaaS Product Development | Multi-Tenant Platform Development | Stormglide',
    description: 'Build and launch SaaS products faster. Multi-tenant architecture, subscription management, analytics dashboards. From idea to profitable SaaS.',
    h1: 'Launch Your SaaS Product Faster',
    kicker: 'SaaS product development',
    summary: 'We build multi-tenant SaaS platforms designed for scale. From idea to market launch, we handle architecture, billing, and compliance.',
    topics: ['Multi-tenant architecture', 'Subscription management', 'SaaS analytics and growth'],
    schemaType: 'Service',
    serviceType: 'SaaS product development',
  },
  {
    path: '/services/website-development',
    title: 'Website Development Company | Custom Websites | Stormglide',
    description: 'Professional website design and development. Fast, SEO-optimized, conversion-focused websites. Corporate, e-commerce, and custom projects.',
    h1: 'Professional Websites Built for Results',
    kicker: 'Website development',
    summary: 'Custom-designed, fast-loading websites that convert visitors into customers. E-commerce, corporate, portfolios — all optimized for growth.',
    topics: ['Corporate websites', 'E-commerce development', 'SEO-ready responsive websites'],
    schemaType: 'Service',
    serviceType: 'Website design and development',
  },
  {
    path: '/services/web-app-development',
    title: 'Web App Development Company | Custom Web Applications | Stormglide',
    description: 'Custom web application and business software development. Secure, scalable platforms for complex workflows and enterprise operations.',
    h1: 'Custom Web Applications for Your Business',
    kicker: 'Web app development',
    summary: 'We turn complex workflows into secure, scalable software that fits how your teams already operate.',
    topics: ['Business process automation', 'SaaS and internal platforms', 'Enterprise web applications'],
    schemaType: 'Service',
    serviceType: 'Web application development',
  },
  {
    path: '/services/mobile-app-development',
    title: 'Mobile App Development Company | iOS & Android Apps | Stormglide',
    description: 'Custom iOS and Android app development. Fast, reliable mobile applications with offline support and backend integration.',
    h1: 'Mobile Apps Built to Perform',
    kicker: 'Mobile app development',
    summary: 'We design and build dependable mobile applications for customers, field teams, and growing digital businesses.',
    topics: ['iOS and Android apps', 'Offline-first mobile products', 'Mobile app backend integration'],
    schemaType: 'Service',
    serviceType: 'Mobile application development',
  },
  {
    path: '/services/design-services',
    title: 'UI UX Product Design Services | Interface Design Company | Stormglide',
    description: 'Professional UI, UX, and product design services for websites, apps, and SaaS platforms. Design systems, user research, and brand experiences.',
    h1: 'Product and Interface Design That Works',
    kicker: 'UI and UX design',
    summary: 'Stormglide creates practical digital identities and interfaces that make complex products easier to understand and use.',
    topics: ['UI and UX design', 'Product design systems', 'Brand and interface direction'],
    schemaType: 'Service',
    serviceType: 'UI, UX, and product design',
  },
  {
    path: '/services/prototyping',
    title: 'MVP Development & Rapid Prototyping | Product Validation | Stormglide',
    description: 'MVP development and rapid prototyping services. Validate your product idea with a working prototype designed for real users and investors.',
    h1: 'Move from Idea to a Working MVP',
    kicker: 'MVP development',
    summary: 'We scope the essential product, design the experience, and build a credible first release without unnecessary complexity.',
    topics: ['MVP development', 'Product prototyping', 'Startup software development'],
    schemaType: 'Service',
    serviceType: 'MVP development and rapid prototyping',
  },
  {
    path: '/services/website-development-ghana',
    title: 'Website Development Company in Ghana | Stormglide',
    description: 'Professional website design and development in Accra, Ghana. Stormglide builds fast corporate websites, e-commerce stores, and conversion-focused business websites.',
    h1: 'Professional websites for Ghanaian businesses',
    kicker: 'Website development in Ghana',
    summary: 'Custom-designed, mobile-first websites built for speed, search visibility, local payments, and measurable business results.',
    topics: ['Corporate websites', 'E-commerce development', 'SEO-ready responsive websites'],
    schemaType: 'Service',
    serviceType: 'Website design and development in Ghana',
  },
  {
    path: '/services/web-app-development-ghana',
    title: 'Web App Development Company Ghana | Stormglide',
    description: 'Custom web application and business software development in Ghana. Build secure HR, inventory, logistics, CRM, ERP, and SaaS systems with Stormglide.',
    h1: 'Custom web applications for Ghanaian businesses',
    kicker: 'Web app development in Ghana',
    summary: 'We turn complex workflows into secure, scalable software that fits how your teams already operate.',
    topics: ['Business process automation', 'SaaS and internal platforms', 'Offline-capable web applications'],
    schemaType: 'Service',
    serviceType: 'Custom web application development',
  },
  {
    path: '/services/mobile-app-development-ghana',
    title: 'Mobile App Development Company Ghana | Stormglide',
    description: 'Custom iOS and Android app development in Ghana. Stormglide builds fast, offline-capable mobile products with local payment and business-system integrations.',
    h1: 'Mobile apps built for Ghana and Africa',
    kicker: 'Mobile app development in Ghana',
    summary: 'We design and build dependable mobile applications for customers, field teams, and growing digital businesses.',
    topics: ['iOS and Android apps', 'Offline-first mobile products', 'Payments and backend integration'],
    schemaType: 'Service',
    serviceType: 'Mobile application development',
  },
  {
    path: '/services/design-services-ghana',
    title: 'UI UX and Product Design Services Ghana | Stormglide',
    description: 'UI, UX, product, and brand design services in Ghana for websites, mobile apps, SaaS platforms, and digital businesses that need clear, professional experiences.',
    h1: 'Product and interface design that earns trust',
    kicker: 'UI and UX design in Ghana',
    summary: 'Stormglide creates practical digital identities and interfaces that make complex products easier to understand and use.',
    topics: ['UI and UX design', 'Product design systems', 'Brand and interface direction'],
    schemaType: 'Service',
    serviceType: 'UI, UX, and product design',
  },
  {
    path: '/services/prototyping-ghana',
    title: 'MVP Development and Prototyping Ghana | Stormglide',
    description: 'MVP development and rapid prototyping in Ghana for startups and companies. Validate your idea with a focused, working product designed for real users and investors.',
    h1: 'Move from idea to a working MVP',
    kicker: 'MVP development in Ghana',
    summary: 'We scope the essential product, design the experience, and build a credible first release without unnecessary complexity.',
    topics: ['MVP development', 'Product prototyping', 'Startup software development'],
    schemaType: 'Service',
    serviceType: 'MVP development and rapid prototyping',
  },
  {
    path: '/products',
    title: 'Business Software for HR, Dental, Freight & Booking | Stormglide',
    description: 'Software already running real businesses every day — HR and payroll, dental practice management, freight and shipment tracking, health monitoring, and spa booking. Not prototypes. Live systems handling real money and real customers.',
    h1: 'Software already running real businesses today',
    kicker: 'Stormglide products',
    summary: 'Not prototypes. Nexus HRM runs payroll and staff records. Nexus Dental runs clinics. CargoScan tracks freight from origin to delivery. Every product started as a real problem for a real client, then became software anyone can use.',
    topics: ['Nexus HRM and Nexus Dental', 'CargoScan and SANO Health', 'LOÙ Beauty Hub and Glasstech'],
    schemaType: 'CollectionPage',
  },
  {
    path: '/nexus-hrm',
    title: 'HRM Management App & Payroll Software | Nexus HRM',
    description: 'Nexus HRM is a comprehensive HRM management app covering employee records, payroll, leave, attendance, performance, and compliance for growing companies.',
    h1: 'HRM management app and payroll in one system',
    kicker: 'Nexus HRM',
    summary: 'Manage the entire employee lifecycle with a production HRM management app built for real-world business requirements.',
    topics: ['Employee records and onboarding', 'Payroll, leave, and attendance', 'Performance and compliance reporting'],
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/cargoscan',
    title: 'Freight Cost Calculator & GPS Cargo Tracking | CargoScan',
    description: 'CargoScan pairs instant CBM and freight-cost calculation with GPS fleet tracking, so freight and logistics teams can quote and track shipments in one platform.',
    h1: 'Faster cargo calculations and shipment workflows',
    kicker: 'CargoScan logistics software',
    summary: 'A focused logistics platform for freight teams — instant cost estimation, plus GPS tracking once cargo is moving.',
    topics: ['CBM and freight cost calculation', 'GPS shipment and fleet tracking', 'Shipment reports and history'],
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/sano-health',
    title: 'Health Monitoring & Clinic Management Platform | SANO Health',
    description: 'SANO Health pairs an offline-first mobile health-monitoring tool for patients and community health workers with a practice-management module for clinics.',
    h1: 'Digital health tools designed for African care',
    kicker: 'SANO Health',
    summary: 'One platform, two sides: mobile health monitoring for communities, and patient/appointment management for clinics.',
    topics: ['Mobile health monitoring', 'Community health worker tools', 'Patient and appointment management for clinics'],
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/nexus-dental',
    title: 'Dental Management System for Clinics in Ghana | Nexus Dental',
    description: 'Nexus Dental is a complete dental practice management system — patient records, appointment scheduling, treatment plans, pharmacy, and billing in one platform. Built for clinics in Ghana and across Africa.',
    h1: 'Dental practice management, all in one system',
    kicker: 'Nexus Dental',
    summary: 'A dental management system covering patient records, scheduling, treatment planning, and billing for growing clinics.',
    topics: ['Patient records and dental history', 'Appointment scheduling', 'Treatment planning and billing'],
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/products/cosmetology-booking',
    title: 'Spa & Cosmetology Booking Software Africa | LOÙ Beauty Hub',
    description: 'LOÙ Beauty Hub is a guided booking and studio management system for spas and cosmetology businesses — service catalog, scheduling, customer records, and staff management in one system.',
    h1: 'Booking and studio management for spas',
    kicker: 'LOÙ Beauty Hub',
    summary: 'A guided, multi-step booking flow for spa and cosmetology services, backed by a full studio management system for staff and appointments.',
    topics: ['Guided service booking', 'Appointment scheduling', 'Staff and studio management'],
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/products/glasstech',
    title: 'Product Catalogue and Quote Software | Glasstech',
    description: 'Glasstech is a product catalogue and quote-request platform for glass, aluminium, cabinet, contractor, and building-material businesses.',
    h1: 'A clearer way to present products and capture quotes',
    kicker: 'Glasstech',
    summary: 'A responsive catalogue experience that connects detailed product information to qualified customer enquiries.',
    topics: ['Digital product catalogue', 'Specifications and categories', 'Quote requests and lead capture'],
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/work',
    title: 'Case Studies: Client Portals, Shipment Tracking & QR Ordering | Stormglide',
    description: 'Live client portals with OTP login, real-time shipment tracking, QR restaurant ordering, multi-branch inventory. Systems in daily use, handling real money and real customers.',
    h1: 'Real software, not concept work',
    kicker: 'Case studies and live systems',
    summary: 'Client portals with OTP login. Live shipment tracking. QR ordering for restaurants. Multi-branch inventory. These are systems in daily use, handling real money and real customers.',
    topics: ['Barbershop and salon booking systems', 'QR restaurant ordering systems', 'Logistics and shipment tracking systems'],
    schemaType: 'CollectionPage',
  },
  {
    path: '/price-estimator',
    title: 'Price Estimator | Stormglide',
    description: 'Get an instant price estimate for your website, e-commerce store, booking system, or SaaS MVP — or describe a custom app and get a fixed-price quote back within 48 hours.',
    h1: 'Get a real estimate in under a minute',
    kicker: 'Price estimator',
    summary: 'Pick a project type, adjust it to your needs, and see a price range instantly — or describe a custom app for a fixed-price quote.',
    topics: ['Instant project estimates', 'Add-ons and complexity adjustment', 'Custom app development requests'],
    schemaType: 'WebPage',
  },
  {
    path: '/systems-audit',
    title: 'Request a Business Systems Audit | Stormglide',
    description: 'Five short questions about how your business actually runs today. We come back with specific ideas for your operation, not a generic pitch — no obligation.',
    h1: "Let's look at how your business works.",
    kicker: 'Systems audit',
    summary: 'Tell us your business type, team size, biggest friction, and how things run today — we come back within 24 hours with specific ideas, not a sales pitch.',
    topics: ['Business systems diagnosis', 'Operational friction assessment', 'Custom software scoping'],
    schemaType: 'WebPage',
  },
  {
    path: '/pricing',
    title: 'Custom Business System Pricing Ghana | Stormglide',
    description: 'Clear pricing for customer portals, booking systems, inventory & operations dashboards, and full business management systems built by Stormglide in Accra, Ghana.',
    h1: 'Clear paths from idea to production software',
    kicker: 'Project pricing',
    summary: 'Choose a focused launch, a custom build, or a longer-term engineering partnership based on your product and operational needs.',
    topics: ['Website and product launches', 'Custom software projects', 'Enterprise engineering partnerships'],
    schemaType: 'WebPage',
  },
  {
    path: '/contact',
    title: 'Contact Stormglide | Start a Software Project',
    description: 'Tell us what\'s slowing your business down. Share the problem, the users, and the outcome you want — you\'ll get a practical next step, not a sales sequence. Based in Accra (GMT), working across time zones.',
    h1: 'Tell us what\'s slowing your business down',
    kicker: 'About Stormglide',
    summary: 'Share the problem, who will use the system, and what a good outcome looks like. You\'ll get a practical next step — not a sales sequence. We\'re based in Accra (GMT) and work with clients across time zones.',
    topics: ['Website project enquiries', 'Custom software consultations', 'SaaS and mobile product development', 'Company background, team, and data security'],
    schemaType: 'ContactPage',
  },
  {
    path: '/industries',
    title: 'Industries We Build For | Business Systems by Stormglide',
    description: 'Construction, logistics, wholesale, professional services, healthcare — real systems and real capabilities for growing businesses, organized by how each industry actually operates.',
    h1: 'We understand how businesses operate.',
    kicker: 'Industries',
    summary: 'Every industry runs on its own repeated processes. See what we\'ve built and what we\'d build for construction, logistics, wholesale, professional services, and healthcare.',
    topics: ['Construction & property systems', 'Logistics & supply chain systems', 'Wholesale & distribution systems', 'Healthcare systems'],
    schemaType: 'CollectionPage',
  },
  // One entry per industry, generated from src/data/industries.js so this
  // list can't drift from the actual pages — each gets full meta/schema and
  // (unlike /work/:slug case studies, deliberately excluded from the
  // sitemap) IS included, since these are meant to be used directly in
  // outbound campaigns and need to be indexable.
  ...INDUSTRIES.map(industry => ({
    path: `/industries/${industry.slug}`,
    title: `${industry.name} Software & Business Systems | Stormglide`,
    description: `${industry.tagline} ${industry.description}`.slice(0, 300),
    h1: industry.tagline,
    kicker: industry.name,
    summary: industry.description,
    topics: industry.systems,
    schemaType: 'Service',
    serviceType: `${industry.name} business systems`,
  })),
  {
    path: '/insights',
    title: 'Insights — Notes on Business Systems | Stormglide',
    description: 'What we\'ve actually learned scoping and building business systems for growing companies — disconnected tools, offline-first architecture, payment integration, and more.',
    h1: 'Notes from building business systems.',
    kicker: 'Insights',
    summary: 'Practical notes from real systems work — not generic advice, just what shows up repeatedly when scoping and building software for growing businesses.',
    topics: INSIGHTS.map(a => a.category),
    schemaType: 'CollectionPage',
  },
  // One entry per article, generated from src/data/insights.js for the same
  // reason as the industries entries above — can't drift from the real
  // content, and each article needs its own indexable page.
  ...INSIGHTS.map(article => ({
    path: `/insights/${article.slug}`,
    title: `${article.title} | Stormglide`,
    description: article.dek.slice(0, 300),
    h1: article.title,
    kicker: article.category,
    summary: article.dek,
    topics: [article.category],
    schemaType: 'Article',
  })),
]

const routeMap = new Map(seoRoutes.map(route => [route.path, route]))

export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '') || '/'
}

export function getSeoForPath(pathname) {
  return routeMap.get(normalizePath(pathname)) || null
}

function breadcrumbName(segment) {
  const route = routeMap.get(`/${segment}`)
  if (route) return route.kicker
  return segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export function buildBreadcrumbSchema(route) {
  if (route.path === '/') return null
  const segments = route.path.split('/').filter(Boolean)
  const itemListElement = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` }]

  segments.forEach((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`
    itemListElement.push({
      '@type': 'ListItem',
      position: index + 2,
      name: index === segments.length - 1 ? route.kicker : breadcrumbName(segment),
      item: `${SITE_URL}${path}`,
    })
  })

  return { '@type': 'BreadcrumbList', '@id': `${SITE_URL}${route.path}#breadcrumb`, itemListElement }
}

export function buildRouteSchema(route) {
  const canonical = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`
  const graph = []

  if (route.path === '/') graph.push(organizationSchema, websiteSchema)

  const page = {
    '@type': route.schemaType === 'Service' || route.schemaType === 'SoftwareApplication' ? 'WebPage' : route.schemaType,
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: route.title,
    description: route.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en',
  }
  graph.push(page)

  if (route.schemaType === 'Service') {
    graph.push({
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: route.serviceType,
      description: route.description,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: 'Worldwide',
      url: canonical,
    })
  }

  if (route.schemaType === 'SoftwareApplication') {
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${canonical}#software`,
      name: route.kicker,
      description: route.description,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: canonical,
      author: { '@id': `${SITE_URL}/#organization` },
    })
  }

  const breadcrumb = buildBreadcrumbSchema(route)
  if (breadcrumb) graph.push(breadcrumb)

  return { '@context': 'https://schema.org', '@graph': graph }
}
