import { HardHat, Truck, Package, Briefcase, Stethoscope, Building2 } from 'lucide-react'

// Industry landing pages. Where a real client anchors a vertical, `anchor`
// points at its exact clientWork.js slug — never invented, never a name that
// doesn't exist in that file. Where no real anchor exists yet, `anchor` is
// null and the copy in IndustryLanding.jsx says so honestly (same pattern
// PricingPage.jsx already uses for its own hedged INDUSTRY_EXAMPLES).
export const INDUSTRIES = [
  {
    slug: 'construction-property',
    name: 'Construction & Property',
    icon: HardHat,
    color: 'var(--color-warning)',
    tagline: 'Projects, variations, and payments in one system your client can see into.',
    description: 'Property and interior projects run on approvals, variations, and staged payments — usually tracked across WhatsApp threads, spreadsheets, and whoever remembers what was agreed. A connected system gives your client one place to see progress and gives your team one place to run it.',
    systems: ['Project & milestone tracking', 'Client portals', 'Variations & change orders', 'Staged payments', 'Procurement', 'Site/document reporting'],
    anchor: 'westline-future',
  },
  {
    slug: 'logistics-supply-chain',
    name: 'Logistics & Supply Chain',
    icon: Truck,
    color: 'var(--color-accent-blue)',
    tagline: 'Customers stop calling for updates when they can see the shipment themselves.',
    description: 'Freight, sourcing, and delivery businesses lose hours a day to "where is it" phone calls. A live tracking and rates system, self-serve for customers, turns that into a self-service lookup instead of a staff interruption.',
    systems: ['Shipment tracking', 'Live freight rates', 'Sourcing/procurement dashboards', 'Warehousing & inventory', 'Agent/driver management', 'Customer self-service'],
    anchor: 'jaybesin-logistics',
  },
  {
    slug: 'wholesale-distribution',
    name: 'Wholesale & Distribution',
    icon: Package,
    color: '#B7791F',
    tagline: 'Bulk pricing, stock, and orders that match — not three different numbers.',
    description: 'Wholesale businesses run on tiered pricing and stock levels that need to be right everywhere at once — the storefront, the sales team, and the warehouse. We build the catalog and backoffice as one system, not three that drift apart.',
    systems: ['Wholesale/retail pricing tiers', 'Inventory & stock tracking', 'Order management', 'B2B storefronts', 'Procurement', 'Sales reporting'],
    anchor: 'lollarod-enterprise',
  },
  {
    slug: 'professional-services',
    name: 'Professional Services',
    icon: Briefcase,
    color: 'var(--sg-accent-2)',
    tagline: 'Client work, billing, and documents without the spreadsheet juggling.',
    description: "Consultancies and service firms run on client relationships, project timelines, and invoices that all need to line up. We haven't shipped a flagship professional-services system yet — the systems below are what we'd scope from the same playbook we've used for logistics, retail, and healthcare clients.",
    systems: ['CRM & client management', 'Project tracking', 'Billing & invoicing', 'Document management', 'Client portals', 'Workflow automation'],
    anchor: null,
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    icon: Stethoscope,
    color: 'var(--color-danger)',
    tagline: 'Patient records, scheduling, and billing in one connected system.',
    description: 'Clinics run on appointments, patient history, and billing that need to stay in sync across front desk and back office. We built exactly this for a dental practice — the same pattern extends to clinics, pharmacies, and other patient-facing operations.',
    systems: ['Patient records & history', 'Appointment scheduling', 'Treatment/billing workflows', 'Pharmacy & inventory', 'Staff access control', 'Reporting'],
    anchor: 'nexus-dental-system',
  },
  {
    slug: 'smes',
    name: 'Other SMEs',
    icon: Building2,
    color: 'var(--color-success)',
    tagline: "If your business has a repeated process, we can probably improve it.",
    description: "Most of what we build doesn't fit a single industry label — restaurants, salons, retail shops, and service businesses all run on the same underlying problem: a process that repeats every day, tracked by hand. If that's you, the fastest way to find out what a system would look like is to tell us how the process actually works today.",
    systems: ['Booking & scheduling', 'Point of sale', 'Staff management', 'Customer records', 'Inventory', 'Reporting'],
    anchor: null,
  },
]

export function getIndustryPath(slug) {
  return `/industries/${slug}`
}
