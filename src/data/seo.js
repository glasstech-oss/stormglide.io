export const SITE_URL = 'https://stormglide.io'
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/og-image.jpg`

export const organizationSchema = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Stormglide Technologies Ltd.',
  alternateName: 'Stormglide',
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/favicon.png`,
  },
  image: DEFAULT_SOCIAL_IMAGE,
  description: 'Software company in Accra, Ghana building websites, web apps, mobile apps, SaaS products, and business systems for African organizations.',
  email: 'hello@stormglide.io',
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
  areaServed: ['Ghana', 'West Africa', 'Africa'],
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
    email: 'hello@stormglide.io',
    telephone: '+233547738678',
    areaServed: ['GH', 'Africa'],
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
    title: 'Custom Software & Website Development Company | Stormglide',
    description: 'Build websites, web apps, SaaS products, and business systems. Expert software development company. Based in Accra, Ghana. Serving Africa and global clients.',
    h1: 'Software that runs African operations.',
    kicker: 'Software company in Accra, Ghana',
    summary: 'We design, build, and operate reliable digital products around how African teams, customers, payments, and infrastructure work.',
    topics: ['Custom websites and e-commerce', 'Web apps and business systems', 'Mobile apps and SaaS products'],
    schemaType: 'WebPage',
  },
  {
    path: '/services',
    title: 'Software Development Services | Web, Mobile, SaaS | Stormglide',
    description: 'Custom software development services for websites, web apps, mobile apps, SaaS platforms, and business systems. Expert team. Global and Africa-based clients.',
    h1: 'Custom software development for African businesses',
    kicker: 'Software development services',
    summary: 'Stormglide plans, designs, builds, and supports production software for organizations in Ghana and across Africa.',
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
    title: 'Business Software and SaaS Products Africa | Stormglide',
    description: 'Explore Stormglide software products for HR, payroll, logistics, healthcare, manufacturing, and commerce, designed around African business operations.',
    h1: 'Software products built for African operations',
    kicker: 'Stormglide products',
    summary: 'Our products solve practical operational problems across people, freight, health, manufacturing, and digital commerce.',
    topics: ['Nexus HRM', 'CargoScan and SANO Health', 'Nexus MFG and Glasstech'],
    schemaType: 'CollectionPage',
  },
  {
    path: '/nexus-hrm',
    title: 'HR and Payroll Software for African Companies | Nexus HRM',
    description: 'Nexus HRM is employee, payroll, leave, attendance, performance, and compliance software designed for growing African companies.',
    h1: 'HR and payroll operations in one system',
    kicker: 'Nexus HRM',
    summary: 'Manage the employee lifecycle with a production HR platform built around African business requirements.',
    topics: ['Employee records and onboarding', 'Payroll, leave, and attendance', 'Performance and compliance reporting'],
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/cargoscan',
    title: 'Cargo and Logistics Software for Africa | CargoScan',
    description: 'CargoScan helps freight and logistics teams calculate CBM, estimate shipment costs, track cargo, and generate shareable reports for African trade routes.',
    h1: 'Faster cargo calculations and shipment workflows',
    kicker: 'CargoScan logistics software',
    summary: 'A focused logistics platform for freight teams that need accurate calculations and clearer shipment information.',
    topics: ['CBM calculation', 'Freight cost estimation', 'Shipment reports and tracking'],
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/sano-health',
    title: 'Digital Health Platform for African Clinics | SANO Health',
    description: 'SANO Health supports patient, appointment, treatment, and health-monitoring workflows for clinics and communities across Africa.',
    h1: 'Digital health tools designed for African care',
    kicker: 'SANO Health',
    summary: 'A mobile health platform designed for accessible care, practical clinic workflows, and variable connectivity.',
    topics: ['Patient and appointment management', 'Treatment and outcome tracking', 'Mobile health monitoring'],
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/products/nexus-mfg',
    title: 'Manufacturing Operations Software Africa | Nexus MFG',
    description: 'Nexus MFG helps African manufacturers manage production orders, materials, machines, quality control, shifts, output, and waste in one system.',
    h1: 'Production visibility for growing manufacturers',
    kicker: 'Nexus MFG',
    summary: 'Track what is being made, which resources are being used, and where production performance can improve.',
    topics: ['Production orders', 'Materials and machine scheduling', 'Quality, output, and waste reporting'],
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
    title: 'Software Case Studies and Live Products | Stormglide',
    description: 'See websites, SaaS products, mobile apps, and business systems Stormglide has built for HR, logistics, health, manufacturing, commerce, and African operations.',
    h1: 'Real software, not concept work',
    kicker: 'Case studies and live systems',
    summary: 'Explore selected products and client platforms built by Stormglide for practical business use.',
    topics: ['Web and commerce platforms', 'Business and operations software', 'Mobile and SaaS products'],
    schemaType: 'CollectionPage',
  },
  {
    path: '/pricing',
    title: 'Software and Website Development Pricing Ghana | Stormglide',
    description: 'Clear pricing paths for websites, custom software, mobile apps, SaaS products, and enterprise systems built by Stormglide in Accra, Ghana.',
    h1: 'Clear paths from idea to production software',
    kicker: 'Project pricing',
    summary: 'Choose a focused launch, a custom build, or a longer-term engineering partnership based on your product and operational needs.',
    topics: ['Website and product launches', 'Custom software projects', 'Enterprise engineering partnerships'],
    schemaType: 'WebPage',
  },
  {
    path: '/about',
    title: 'About Stormglide | Software Company in Accra, Ghana',
    description: 'Stormglide is a software company in Accra building enterprise systems, SaaS products, mobile apps, websites, and AI-enabled tools for African businesses.',
    h1: 'A Ghanaian software company built for African scale',
    kicker: 'About Stormglide',
    summary: 'We are engineers, designers, and product builders creating dependable software from Accra for organizations across Africa.',
    topics: ['Based in Accra, Ghana', 'Africa-first product engineering', 'Web, mobile, SaaS, and business systems'],
    schemaType: 'AboutPage',
  },
  {
    path: '/contact',
    title: 'Contact a Software Company in Ghana | Stormglide',
    description: 'Talk to Stormglide about your website, mobile app, SaaS product, automation, or custom software project. Based in Accra and working across Africa.',
    h1: 'Tell us what your business needs to build',
    kicker: 'Contact Stormglide',
    summary: 'Share the problem, users, and outcome you are working toward. Our team will respond with the next practical step.',
    topics: ['Website project enquiries', 'Custom software consultations', 'SaaS and mobile product development'],
    schemaType: 'ContactPage',
  },
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
      areaServed: ['Ghana', 'West Africa', 'Africa'],
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
