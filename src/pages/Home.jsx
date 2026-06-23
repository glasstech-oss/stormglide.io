import { Helmet } from 'react-helmet-async'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'

// Homepage sections
import Hero from '../components/home/Hero'
import VisualProblems from '../components/home/VisualProblems'
import SolutionSection from '../components/home/SolutionSection'
import VisualServices from '../components/home/VisualServices'
import FeaturedWork from '../components/home/FeaturedWork'
import Industries from '../components/home/Industries'
import VisualProcess from '../components/home/VisualProcess'
import TechStack from '../components/home/TechStack'
import FinalCTA from '../components/home/FinalCTA'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>StormGlide: SaaS Software Company for African Businesses</title>
        <meta name="description" content="StormGlide builds and operates SaaS products (Nexus HRM, CargoScan, SANO Health) serving 100+ African companies. We also develop custom business software, ERP systems, and automation tools. Production-grade platforms built for African operations." />
        <meta name="keywords" content="SaaS software Africa, custom software development, ERP software, HR management system, logistics software, African tech, business software" />
        <meta name="author" content="StormGlide Technologies" />
        <meta property="og:title" content="StormGlide — SaaS Software Company" />
        <meta property="og:description" content="Build or launch your next software platform. We own and operate SaaS products serving African businesses." />
        <meta property="og:image" content="https://stormglide.vercel.app/og-image.svg" />
        <meta property="og:url" content="https://stormglide.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://stormglide.vercel.app/og-image.svg" />
        <link rel="canonical" href="https://stormglide.vercel.app" />

        {/* Schema.org Organization markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "StormGlide Technologies",
            "url": "https://stormglide.vercel.app",
            "logo": "https://stormglide.vercel.app/logo.svg",
            "description": "SaaS software company building and operating enterprise platforms for African businesses",
            "foundingDate": "2021",
            "founders": [{ "@type": "Person", "name": "StormGlide Team" }],
            "areaServed": "Africa",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Service",
              "email": "hello@stormglide.io"
            },
            "sameAs": [
              "https://linkedin.com/company/stormglide",
              "https://github.com/glasstech-oss"
            ]
          })}
        </script>

        {/* Schema.org WebPage markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "StormGlide — SaaS Software Company",
            "description": "Build or launch your next software platform. SaaS products and custom development for African businesses.",
            "url": "https://stormglide.vercel.app",
            "isPartOf": { "@id": "https://stormglide.vercel.app" }
          })}
        </script>
      </Helmet>

      <Navbar />

      <Hero />

      <VisualProblems />

      <SolutionSection />

      <VisualServices />

      <FeaturedWork />

      <Industries />

      <VisualProcess />

      <TechStack />

      <FinalCTA />

      <Footer />

      <WhatsAppFloat />
    </>
  )
}

