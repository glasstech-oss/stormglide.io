# Technical SEO Setup for Ghana Ranking - Copy/Paste Ready

## Part 1: Google Business Profile (GBP) Setup

### Step-by-Step Setup Checklist

**Timeline**: 30 minutes to set up, 14 days for verification, 30 days for full visibility

#### Step 1: Create Google Business Profile
- [ ] Go to https://business.google.com
- [ ] Click "Create account" (or use existing Google account)
- [ ] Enter business name: "StormGlide"
- [ ] Select business type: "Software Company" or "Web Design Company"
- [ ] Enter service area: Ghana (select specific)
- [ ] Enter phone: [Your business phone]
- [ ] Enter website: https://stormglide.vercel.app

#### Step 2: Verify Business
- [ ] Choose verification method (postcard recommended)
- [ ] Google sends postcard to business address
- [ ] Enter verification code from postcard
- [ ] Profile goes live

**Note**: You must have a physical address in Ghana for verification. Use office or principal address.

#### Step 3: Complete Profile
- [ ] Add logo (1200x627px minimum, PNG/JPG)
- [ ] Add hero photo (1920x1280px minimum)
- [ ] Add 3-5 service photos
- [ ] Write business description (750 characters max)
- [ ] Add service categories:
  - [ ] Software Development
  - [ ] Computer Support
  - [ ] IT Consulting
  - [ ] Web Design
  - [ ] App Development
- [ ] Add services with descriptions:
  - [ ] Website Development
  - [ ] Web App Development
  - [ ] Mobile App Development
  - [ ] UI/UX Design
  - [ ] Custom Software Development

#### Step 4: Add Business Hours
- [ ] Set hours (Mon-Fri 9am-6pm, for example)
- [ ] Mark holidays if applicable

#### Step 5: Add Website Links
- [ ] Home page: https://stormglide.vercel.app
- [ ] Services page: https://stormglide.vercel.app/services
- [ ] Contact page: https://stormglide.vercel.app/contact

#### Step 6: Enable Messaging
- [ ] Turn on "Messages" (allows customers to message you)
- [ ] Set up auto-response: "Hi, thanks for reaching out. We'll respond within 24 hours."

#### Step 7: Add Q&A
- [ ] Preemptively add FAQs:
  - Q: "What services do you offer?"
  - A: "Website development, web apps, mobile apps, design, and custom software for Ghanaian businesses."
  
  - Q: "Do you work with offline-first apps?"
  - A: "Yes, all our apps include offline capability for areas with poor connectivity."
  
  - Q: "Where are you located?"
  - A: "Accra, Ghana. We serve clients across West Africa."

#### Step 8: Post Updates
- [ ] Post a "Announcing Services" update
- [ ] Post monthly project highlights
- [ ] Post team updates

#### Step 9: Monitor Reviews
- [ ] Set up review notifications
- [ ] Respond to all reviews (positive and negative) within 48 hours
- [ ] Encourage happy clients to leave reviews

---

## Part 2: Schema Markup Setup

### Copy/Paste: LocalBusiness Schema

Add this to your base HTML `<head>` or React Helmet (already in components, verify it's there):

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "StormGlide",
  "image": "https://stormglide.vercel.app/logo.svg",
  "description": "SaaS software company and custom software development for African businesses. We build operational software, web apps, mobile apps, and UI/UX design.",
  "url": "https://stormglide.vercel.app",
  "telephone": "+233-XXX-XXX-XXXX",
  "email": "contact@stormglide.io",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Your street address]",
    "addressLocality": "Accra",
    "addressRegion": "Greater Accra",
    "postalCode": "[Your postal code]",
    "addressCountry": "GH"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": [latitude],
    "longitude": [longitude]
  },
  "priceRange": "GHS 10,000 - 500,000+",
  "sameAs": [
    "https://www.linkedin.com/company/stormglide",
    "https://twitter.com/stormglide",
    "https://www.facebook.com/stormglide"
  ],
  "service": [
    {
      "@type": "Service",
      "name": "Website Development",
      "description": "Custom website development for Ghanaian businesses",
      "areaServed": "GH"
    },
    {
      "@type": "Service",
      "name": "Web App Development",
      "description": "Custom web applications and business software",
      "areaServed": "GH"
    },
    {
      "@type": "Service",
      "name": "Mobile App Development",
      "description": "Native iOS and Android app development",
      "areaServed": "GH"
    },
    {
      "@type": "Service",
      "name": "UI/UX Design",
      "description": "User experience and user interface design",
      "areaServed": "GH"
    }
  ]
}
```

### Copy/Paste: Service Schema

Add to each service landing page (already in components, verify):

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "[Service Name]",
  "description": "[Service description]",
  "provider": {
    "@type": "Organization",
    "name": "StormGlide",
    "url": "https://stormglide.vercel.app"
  },
  "areaServed": "GH",
  "serviceType": "[Service category]",
  "priceRange": "GHS [price range]"
}
```

### Copy/Paste: Organization Schema

Add to home page:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "StormGlide",
  "url": "https://stormglide.vercel.app",
  "logo": "https://stormglide.vercel.app/logo.svg",
  "description": "SaaS software company and custom software development for African businesses",
  "founder": "[Founder Name]",
  "foundingDate": "[Founding year]",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "GH"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "telephone": "+233-XXX-XXX-XXXX",
    "email": "contact@stormglide.io"
  },
  "sameAs": [
    "https://www.linkedin.com/company/stormglide",
    "https://twitter.com/stormglide",
    "https://www.facebook.com/stormglide"
  ]
}
```

### Copy/Paste: Article Schema (for blog posts)

Add to each blog post:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Article title]",
  "description": "[Article meta description]",
  "image": "[Featured image URL]",
  "datePublished": "[Publication date YYYY-MM-DD]",
  "dateModified": "[Last updated date YYYY-MM-DD]",
  "author": {
    "@type": "Organization",
    "name": "StormGlide",
    "url": "https://stormglide.vercel.app"
  },
  "publisher": {
    "@type": "Organization",
    "name": "StormGlide",
    "logo": "https://stormglide.vercel.app/logo.svg"
  }
}
```

---

## Part 3: Ghana Business Directory Submissions

### Tier 1: Essential Ghana Directories (Submit immediately)

1. **Ghana Pages** - https://www.ghaniapages.com
   - Category: Web Design / Software Development
   - Listing time: 2-3 days
   - Backlink: Yes (high quality)

2. **Business Directory Ghana** - https://www.businessdirectoryghana.com
   - Category: Information Technology
   - Listing time: 1-2 days
   - Backlink: Yes

3. **Ghana Trade Directory** - https://www.ghanatrade.com
   - Category: Business Services
   - Listing time: 2-3 days
   - Backlink: Yes

4. **Accra Business Directory** - https://accra-business-directory.com
   - Category: Software / IT Services
   - Listing time: 3-5 days
   - Backlink: Yes

5. **Ghana Yellow Pages** - https://www.ghanaroadyellowpages.com
   - Category: Information Technology
   - Listing time: 2-3 days
   - Backlink: Yes

6. **iHub Ghana** - https://ihubghana.com
   - Category: Tech Company
   - Listing time: 1-2 days
   - Backlink: Yes

7. **Ghana Startup List** - https://ghanastartupslist.com
   - Category: SaaS / Software
   - Listing time: 2-3 days
   - Backlink: Yes

8. **Local.com Ghana** - https://local.com/gh
   - Category: Software Development
   - Listing time: Automated
   - Backlink: Maybe

### Standard Submission Information

```
Business Name: StormGlide
Address: [Your Accra address]
Phone: [Business phone]
Email: contact@stormglide.io
Website: https://stormglide.vercel.app
Services: 
- Website Development
- Web App Development
- Mobile App Development
- UI/UX Design
- Custom Software Development

Description (100-150 words):
StormGlide builds SaaS software products and custom applications for Ghanaian and African businesses. We specialize in operational software including HR systems (Nexus HRM), logistics tracking (CargoScan), ecommerce platforms, and custom business software. All our applications include offline capability, local payment integrations (Paystack, MTN MoMo), and are optimized for African markets. We've served 100+ companies with products ranging from startup MVPs to enterprise operations systems.

Categories:
- Software Development
- Web Design
- App Development
- IT Consulting
- Custom Software
```

### Tier 2: Additional Directories (If time permits)

- Google My Business (already done separately)
- LinkedIn Company Page
- Crunchbase (if fundraising)
- AngelList (if fundraising)
- Clutch.co (for agency visibility)
- GoodFirms.co (for software development firms)
- Facebook Business Page
- Twitter Company Account
- GitHub Organization

---

## Part 4: Meta Tags Template

### For Homepage

```html
<meta name="title" content="StormGlide | SaaS Software & Custom Development Ghana">
<meta name="description" content="SaaS software company building operational products for African businesses. Website development, web apps, mobile apps, design. Free consultation.">
<meta name="keywords" content="software development Ghana, SaaS Ghana, web development, mobile app development, business software">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://stormglide.vercel.app/">
<meta property="og:title" content="StormGlide | SaaS Software & Custom Development">
<meta property="og:description" content="Build or launch your next software product with StormGlide.">
<meta property="og:image" content="https://stormglide.vercel.app/og-image.png">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://stormglide.vercel.app/">
<meta name="twitter:title" content="StormGlide | SaaS Software & Custom Development">
<meta name="twitter:description" content="Build or launch your next software product with StormGlide.">
<meta name="twitter:image" content="https://stormglide.vercel.app/og-image.png">

<!-- Canonical -->
<link rel="canonical" href="https://stormglide.vercel.app/">
```

### For Service Pages

**Pattern**: Each service page should have:
- Unique title with primary keyword (e.g., "Website Development Ghana | StormGlide")
- Meta description with secondary keywords and CTA
- Canonical tag pointing to service page
- Schema markup (already in components)

---

## Part 5: Sitemap & Robots.txt

### Verify Sitemap

File: `public/sitemap.xml`

Should include:
- `/` (homepage)
- `/about`
- `/services`
- `/work` (or case studies)
- `/contact`
- `/services/website-development-ghana`
- `/services/web-app-development-ghana`
- `/services/mobile-app-development-ghana`
- `/services/design-services-ghana`
- `/services/prototyping-ghana`
- All blog posts (once created)
- All case studies (once created)

**Generate automatically** with:
```bash
npm install next-sitemap --save-dev
```

### Verify Robots.txt

File: `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /*.json$

Sitemap: https://stormglide.vercel.app/sitemap.xml
```

---

## Part 6: Analytics Setup

### Google Analytics

- [ ] Create Google Analytics 4 property
- [ ] Add GA tracking code to website (in index.html or App.jsx)
- [ ] Set up goals:
  - Contact form submission
  - Service page visit
  - Case study view
  - Demo request
  - Blog post read (3+ minutes)

- [ ] Create custom segments:
  - Ghana traffic
  - Service page visitors
  - Case study viewers
  - Contact form submitters

### Google Search Console

- [ ] Verify site ownership (add to GSC)
- [ ] Submit sitemap
- [ ] Monitor search performance:
  - Which keywords drive traffic
  - Click-through rate (CTR) by keyword
  - Average position
  - Geographic performance
- [ ] Fix indexing issues
- [ ] Monitor Core Web Vitals

---

## Part 7: Monthly SEO Checklist

### Week 1 of Month
- [ ] Review Google Search Console search performance
- [ ] Check GA traffic trends
- [ ] Monitor keyword rankings (use free tool like Ubersuggest or SE Ranking)
- [ ] Check for 404 errors

### Week 2 of Month
- [ ] Review blog post performance (GA)
- [ ] Identify top performers for promotion
- [ ] Plan next month's content
- [ ] Reach out for link building (1-2 per week)

### Week 3 of Month
- [ ] Monitor backlinks (use Ahrefs free backlink checker or similar)
- [ ] Verify all internal links working
- [ ] Check competitors' keyword rankings
- [ ] Update any outdated blog posts

### Week 4 of Month
- [ ] Review GBP analytics (Google Business Profile)
- [ ] Respond to all reviews
- [ ] Plan upcoming content/promotions
- [ ] Prepare monthly SEO report

---

## Part 8: Verification Checklist

Before launching SEO campaign, verify:

- [ ] Homepage has correct meta tags
- [ ] All service pages have unique titles/descriptions
- [ ] Schema markup is on homepage (verify with https://schema.org/validator/)
- [ ] Google Business Profile is verified and complete
- [ ] All directories submitted (Tier 1 at minimum)
- [ ] Sitemap submitted to Google Search Console
- [ ] Analytics tracking code installed and working
- [ ] All internal links working (no 404s)
- [ ] Mobile responsive design tested
- [ ] Page speed optimized (target >90 on Lighthouse)
- [ ] SSL certificate installed (https working)
- [ ] Robots.txt allows crawling
- [ ] All CTAs linking to /contact form
- [ ] Contact form working and connected to email

---

## Summary of Implementation Steps

**Day 1**: Create GBP, submit directories
**Day 2**: Add schema markup (verify already there), verify meta tags
**Day 3**: Setup Google Analytics & Search Console
**Days 4-14**: Verify GBP, wait for directory approvals
**Ongoing**: Monitor rankings, build links, publish content, monitor analytics

**Timeline**: 2 weeks before content/link building can fully take effect
**Cost**: Free (all tools used are free)
**Effort**: 10-15 hours initial setup, 5 hours/month ongoing

