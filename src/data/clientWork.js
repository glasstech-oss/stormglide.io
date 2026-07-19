import { MapPin, Globe2 } from 'lucide-react'

function slugify(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Real client case studies — every field here is genuine (name, category,
// region, year, scope, what was built, stack). No images or numeric metrics
// exist for these yet, so WorkDetail.jsx's "hero visual" is an honest,
// clearly-illustrative panel built from these fields, not a fabricated
// screenshot or invented statistic.
export const CLIENT_WORK = [
  {
    name: 'Lollarod Enterprise',
    category: 'Fine Home & Interior Products',
    url: 'https://lollarodenterprisenew.com',
    // Sends X-Frame-Options: DENY — refuses to render inside our embedded
    // browser, so the live-preview panel falls back to a "open in new tab"
    // card for this one instead of a blank iframe.
    noEmbed: true,
    RegionIcon: MapPin, region: 'Ghana',
    color: 'var(--color-success)',
    year: '2023',
    scope: 'E-commerce platform + full admin backoffice',
    desc: 'A complete digital commerce solution for one of Ghana\'s premium interior product companies — 3 showroom locations, wholesale pricing, and a full operations backoffice built for their team.',
    what: [
      'Custom-designed product catalog with 200+ SKUs',
      'Wholesale & retail pricing tiers',
      'Cart, checkout & Paystack integration',
      'Order and delivery management',
      'Admin dashboard with sales analytics',
      'Staff accounts & inventory tracking',
    ],
    stack: ['React', 'Firebase', 'Paystack', 'Firestore'],
  },
  {
    name: 'Westline Future',
    category: 'Interior Design & Trading',
    url: 'https://westlinedecor.com',
    RegionIcon: Globe2, region: 'West Africa',
    color: 'var(--sg-accent)',
    year: '2023',
    scope: 'Full business management + client portal',
    desc: 'A global interior design firm\'s complete operating system — from the public-facing website and project portfolio to a private admin system used daily by their management team across 3 countries.',
    what: [
      'Company website with project portfolio',
      'Client project management portal',
      'Design vault with payment-gated access',
      'Invoicing & payment tracking',
      'Staff accounts with role-based access',
      'Business analytics dashboard',
    ],
    stack: ['React', 'Firebase', 'Firestore', 'Paystack'],
  },
  {
    name: 'Green Gold Gardens',
    category: 'Nursery, Landscaping & Design',
    url: 'https://greengoldgardensgh.com',
    RegionIcon: MapPin, region: 'Ghana',
    color: 'var(--sg-accent)',
    year: '2025',
    scope: 'E-commerce storefront + payroll + CRM',
    desc: 'A premium plant and landscaping business moved off WhatsApp entirely — a live plant catalog for customers, backed by payroll for garden staff and a CRM tracking every repeat customer and design job.',
    what: [
      'Live plant & product catalog',
      'Design services bookable online',
      'Payroll management for staff',
      'CRM for customers & repeat orders',
      'Admin dashboard for the full operation',
    ],
    stack: ['React', 'Firebase', 'Firestore'],
  },
  {
    name: 'Jaybesin Logistics',
    category: 'Freight, Sourcing & Logistics',
    url: 'https://jaybesinlogistics.com',
    RegionIcon: MapPin, region: 'Ghana',
    color: 'var(--color-accent-blue)',
    year: '2025',
    scope: 'Shipment tracking + live rates + sourcing dashboard',
    desc: 'A freight and sourcing company\'s customers used to call in for every shipment update. Now they trace shipments themselves, check live rates, and browse a built-in sourcing marketplace.',
    what: [
      'Live shipment tracking by tracking ID',
      'Real-time freight rates by mode',
      'Built-in sourcing marketplace',
      'Agent management dashboard',
      'Always-on system status page',
    ],
    stack: ['React', 'Firebase', 'Firestore'],
  },
  {
    name: 'Kyekye Cuisine',
    category: 'Restaurant & Hospitality',
    url: 'https://kyekyecuisine.web.app',
    RegionIcon: MapPin, region: 'Ghana',
    color: 'var(--color-danger)',
    year: '2025',
    scope: 'QR table ordering + kitchen & staff dashboards',
    desc: 'Customers scan a QR code at the table and order straight from their phone — dine-in, delivery, or pickup — while kitchen, waitstaff, supervisors, and admin each get their own live dashboard.',
    what: [
      'Scan-to-order, no app download',
      'Dine-in, delivery & pickup in one flow',
      'Live kitchen & waitstaff order queue',
      'Paystack checkout built in',
      'QR code & analytics management',
    ],
    stack: ['Next.js', 'Firebase', 'Paystack'],
  },
  {
    name: 'BarberManager',
    category: 'Personal Care & Services',
    url: 'https://barberingsalonmanager.web.app',
    RegionIcon: MapPin, region: 'Ghana',
    color: 'var(--color-warning)',
    year: '2025',
    scope: 'Booking system + phone login + staff portal',
    desc: 'A barbershop moved off WhatsApp bookings entirely — clients pick a barber, service, and live time slot, log in with just their phone number, and get an SMS confirmation and reminder. Staff manage the day from their own portal.',
    what: [
      'Book by barber, service & live time slot',
      'Phone number login — no password to remember',
      'SMS confirmation & 90-minute reminder',
      'Staff login & client management portal',
      'Service catalog with pricing',
    ],
    stack: ['React', 'Firebase'],
  },
  {
    name: 'Nexus Dental System',
    category: 'Healthcare',
    url: 'https://nexuspharmasystem.web.app',
    RegionIcon: MapPin, region: 'Ghana',
    color: 'var(--color-success)',
    year: '2025',
    scope: 'Dental practice management platform',
    desc: 'A practice-management system for dental clinics — patient records, appointment scheduling, treatment plans, and day-to-day clinic operations in one connected platform.',
    what: [
      'Patient records & dental history',
      'Appointment scheduling',
      'Treatment plan management',
      'Inventory & operations tracking',
    ],
    stack: ['React', 'Firebase'],
  },
  {
    name: 'Cosmetology & Spa Management System',
    category: 'Beauty & Personal Care',
    url: 'https://cosmetology--cosmetologysystem.us-east4.hosted.app',
    RegionIcon: MapPin, region: 'Ghana',
    color: 'var(--color-accent-violet)',
    year: '2025',
    scope: 'Spa operations platform',
    desc: 'A modern spa and cosmetology management platform handling appointment flow, customer records, service catalogs, and day-to-day operational control.',
    what: [
      'Spa & appointment scheduling',
      'Customer records',
      'Service catalog & workflow',
    ],
    stack: ['Next.js', 'Firebase'],
  },
].map(item => ({ ...item, slug: slugify(item.name) }))

export function getWorkPath(slug) {
  return `/work/${slug}`
}
