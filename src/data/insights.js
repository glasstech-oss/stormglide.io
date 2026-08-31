// Real, from-scratch articles — no invented client counts, no invented
// products, no unverifiable market stats. Where a real system is used as
// an example, it's one of the products in products.js or a project in
// clientWork.js, described the same way those files describe it.

export const INSIGHTS = [
  {
    slug: 'one-system-instead-of-six-tools',
    title: 'Why Six Disconnected Tools Cost More Than One System',
    dek: "The real cost of a 'good enough' software stack isn't the subscription fees. It's everything that falls through the cracks between them.",
    category: 'Business Systems',
    publishedDate: '2026-08-04',
    readTime: '6 min read',
    content: [
      { type: 'p', text: "Most growing businesses don't choose their software stack — it accumulates. A spreadsheet for inventory because Excel was already there. A booking app because a client asked for online scheduling. WhatsApp for customer service because that's where customers already are. An accounting package because the tax filing needed one. None of it was a bad decision on its own. The problem is what happens between the tools, not inside any one of them." },
      { type: 'h2', text: "The hidden cost isn't the subscriptions" },
      { type: 'p', text: "Add up the monthly fees for five or six tools and the number is rarely large enough to justify a rebuild on its own. The real cost is the labor spent moving information between systems that don't talk to each other — someone re-typing a booking into an invoicing tool, someone reconciling a mobile money statement against a spreadsheet by hand, someone checking three places to answer one customer's question about their order." },
      { type: 'p', text: "That labor is invisible on a budget line, which is exactly why it survives so long. It shows up as slow responses, mismatched numbers, and staff time that never quite adds up to anything you can point to." },
      { type: 'h2', text: "Where the cracks actually show up" },
      { type: 'list', items: [
        "Invoices that don't match what was actually booked or delivered, because the two live in different systems",
        "The same customer entered separately into a booking tool, a WhatsApp chat, and an accounting record — three versions of the truth",
        "No single person or system that owns the current state of stock, so two people sell the same last unit",
        "Reporting that takes a day to assemble by hand from exports out of four different tools",
      ] },
      { type: 'h2', text: "What a connected system actually looks like" },
      { type: 'p', text: "It isn't one giant application that does everything badly. It's a shared data model — one definition of a customer, one definition of an order, one ledger — with the booking, invoicing, inventory, and reporting screens all reading from and writing to that same underlying data. When a booking is confirmed, the invoice reflects it automatically. When stock moves, every screen that shows stock updates. Nobody re-types anything a second time." },
      { type: 'p', text: "This is the same principle whether the business is a logistics operation reconciling shipments and freight costs, a clinic tracking patients across visits, or a retailer managing stock across showrooms — the specific screens differ, the underlying idea doesn't." },
      { type: 'h2', text: "How to tell if you've outgrown your current stack" },
      { type: 'list', items: [
        "You can't get a same-day answer to 'what did we actually sell/book/invoice this week' without someone manually pulling numbers from more than one place",
        "The same customer or item exists as separate, disconnected records in more than one tool",
        "New staff need to be trained on four or five different systems just to do one job",
        "You've built a spreadsheet whose only purpose is to reconcile two other systems against each other",
      ] },
      { type: 'h2', text: "Where to start" },
      { type: 'p', text: "The fix isn't necessarily replacing everything at once. It usually starts with mapping out exactly where information currently has to move by hand between tools, and designing the one connected system around those specific gaps — not around a generic list of features. That mapping exercise is the first real step, before any code gets written." },
    ],
  },
  {
    slug: 'erp-vs-hr-software',
    title: "ERP vs HR Software: What's the Difference, and Which Do You Actually Need?",
    dek: "The two get confused constantly because both promise to 'organize the business.' They solve genuinely different problems.",
    category: 'Software Strategy',
    publishedDate: '2026-08-12',
    readTime: '5 min read',
    content: [
      { type: 'p', text: "\"We need an ERP\" and \"we need HR software\" get used interchangeably by people describing very different problems. Getting this wrong means paying for scope you'll never use, or buying something too narrow to actually fix what's broken." },
      { type: 'h2', text: "What ERP actually covers" },
      { type: 'p', text: "Enterprise resource planning software is built around the operational core of a business that makes or moves physical things — inventory, procurement, production scheduling, and the financial reporting that ties them together. It exists to give one unified view across departments that would otherwise each keep their own records. A manufacturer or distributor with real supply-chain complexity is the typical candidate." },
      { type: 'h2', text: "What HR software actually covers" },
      { type: 'p', text: "HR software is scoped around the employee, not the product or the shipment: payroll, leave and attendance, performance reviews, and the documents and access rules attached to each person. This is the scope we built Nexus HRM around — onboarding, payroll with tax calculations, leave and attendance, performance reviews, and role-based access, in one system rather than four. Any business with employees needs this coverage somewhere, regardless of whether it also needs ERP." },
      { type: 'h2', text: "The real dividing line" },
      { type: 'list', items: [
        "If your hardest problem is tracking inventory, production, or a multi-step supply chain — that's ERP territory",
        "If your hardest problem is payroll accuracy, leave tracking, or performance records — that's HR software territory",
        "Many businesses genuinely need both, but as two connected systems sharing data, not one system stretched to cover both badly",
      ] },
      { type: 'h2', text: "The mistake we see most" },
      { type: 'p', text: "Buying ERP-scale software to solve what's actually a people-management problem, or trying to bolt inventory and production tracking onto HR software that was never designed for it. Both end in the same place: a system nobody trusts, running alongside the spreadsheet everyone actually uses." },
      { type: 'p', text: "The right starting question isn't \"ERP or HR software\" — it's \"where does the actual friction live in how this business runs today.\" That answer determines the scope, not the label." },
    ],
  },
  {
    slug: 'software-that-works-without-internet',
    title: 'Building Software That Works Without Reliable Internet',
    dek: "Connectivity drops out in the field more often than most software is built to handle. 'Offline-first' has to be a real architecture decision, not a loading spinner.",
    category: 'Engineering',
    publishedDate: '2026-08-19',
    readTime: '5 min read',
    content: [
      { type: 'p', text: "A lot of software marketed as 'works offline' just means the screen doesn't crash when the request fails — it shows an error and waits. That's not the same thing as software that keeps working. For a driver on a delivery route, a community health worker in the field, or a warehouse with patchy wifi, the difference between those two is the difference between a tool that helps and one that gets abandoned within a week." },
      { type: 'h2', text: "What 'offline-first' actually means" },
      { type: 'p', text: "It means the app's core actions — recording a delivery, logging a reading, completing a booking step — write to the device first, then sync to the server in the background whenever a connection is available. The user never has to wait for a network round-trip to keep working, and nothing is lost if the connection never comes back that day. Getting this right means designing for sync conflicts and partial data from day one, not bolting it on after the fact." },
      { type: 'h2', text: "Two real examples from systems we've built" },
      { type: 'p', text: "CargoScan's driver-facing apps are built offline-capable specifically because cargo routes don't guarantee signal the whole way — a driver can keep scanning and updating shipment status, and it syncs once connectivity returns, rather than blocking on a live connection at every step." },
      { type: 'p', text: "SANO Health takes it further on the data-capture side: its heart-rate detection runs on-device through the camera, and its basic skin-scan analysis is on-device too, so the core health-monitoring function works on low-end phones without needing a live connection at the moment of use. The clinic-facing side syncs patient records when the connection allows." },
      { type: 'h2', text: "What this costs vs. what it prevents" },
      { type: 'p', text: "Offline-first architecture is genuinely more work than assuming a connection: it means handling conflicting edits from the same record, deciding what happens if two offline changes disagree once they sync, and testing the app in a state most developers never simulate. That cost is worth paying whenever losing a day's field work to a dead zone is the realistic alternative — which, for most field-based operations, it is." },
    ],
  },
  {
    slug: 'payment-integration-ghana',
    title: 'Paystack, MTN MoMo, or Vodafone Cash: Choosing Payment Integration for Your Business',
    dek: "Most customers in Ghana aren't paying by card. Payment integration built around that reality looks different from a default e-commerce checkout.",
    category: 'Payments & Infrastructure',
    publishedDate: '2026-08-25',
    readTime: '5 min read',
    content: [
      { type: 'p', text: "A checkout built the way most e-commerce templates assume — card number, expiry, CVV — misses a large share of customers in Ghana and across West Africa who pay by mobile money, not card. Getting payment integration right starts with matching how people actually pay, not with picking whichever provider has the best documentation." },
      { type: 'h2', text: "The options you'll actually need to think about" },
      { type: 'list', items: [
        "Paystack — an aggregator that handles cards and, depending on configuration, local mobile money rails through one integration and one settlement account",
        "MTN Mobile Money — the dominant mobile money network, often needed as a direct merchant integration for customers who exclusively use it",
        "Vodafone Cash / Telecel Cash — a smaller but real share of customers, worth supporting directly if your customer base skews toward it",
      ] },
      { type: 'h2', text: "Why 'just add Paystack' isn't always the full answer" },
      { type: 'p', text: "An aggregator is the right starting point for most businesses — one integration, one dashboard, cards and mobile money in the same flow. But some customers only trust paying directly through their mobile money app, and some businesses need the reconciliation and settlement timing that only a direct MoMo merchant integration gives them. The right setup depends on transaction volume, customer habits, and how fast you need settled funds to reach an account." },
      { type: 'h2', text: "What actually matters once payments are wired in" },
      { type: 'list', items: [
        "Reconciliation feeding straight into the same invoicing or booking record, not a separate spreadsheet someone checks manually",
        "Proper webhook verification so a payment confirmation can't be spoofed",
        "Clear handling of failed and retried payments, so a customer isn't charged twice or left in limbo",
      ] },
      { type: 'p', text: "Payment integration is a small piece of code and a much larger piece of judgment about how the money should actually flow through the rest of the business's records. That's the part worth getting right before writing any of it." },
    ],
  },
]

export function getInsightPath(slug) {
  return `/insights/${slug}`
}
