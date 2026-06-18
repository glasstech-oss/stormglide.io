import { Helmet } from 'react-helmet-async'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'

// Homepage sections
import Hero from '../components/home/Hero'
import ProblemRecognition from '../components/home/ProblemRecognition'
import SolutionSection from '../components/home/SolutionSection'
import Services from '../components/home/Services'
import FeaturedWork from '../components/home/FeaturedWork'
import Industries from '../components/home/Industries'
import Process from '../components/home/Process'
import TechStack from '../components/home/TechStack'
import FinalCTA from '../components/home/FinalCTA'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>StormGlide Technologies — Practical Software for African Businesses</title>
        <meta name="description" content="We build practical software for ambitious African businesses. Custom business systems, SaaS platforms, automation tools, and high-performance websites." />
        <meta property="og:title" content="StormGlide Technologies" />
        <meta property="og:description" content="Practical software for ambitious African businesses." />
        <meta property="og:image" content="https://stormglide.vercel.app/og-image.svg" />
        <meta property="og:url" content="https://stormglide.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://stormglide.vercel.app/og-image.svg" />
        <link rel="canonical" href="https://stormglide.vercel.app" />
      </Helmet>

      <Navbar />

      <Hero />

      <ProblemRecognition />

      <SolutionSection />

      <Services />

      <FeaturedWork />

      <Industries />

      <Process />

      <TechStack />

      <FinalCTA />

      <Footer />

      <WhatsAppFloat />
    </>
  )
}

