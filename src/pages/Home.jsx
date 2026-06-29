import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import Hero from '../components/home/Hero'
import ProofRail from '../components/home/ProofRail'
import ProductShowcase from '../components/home/ProductShowcase'
import OperationsFlow from '../components/home/OperationsFlow'
import TrustBand from '../components/home/TrustBand'
import '../styles/home.css'

export default function Home() {
  return (
    <>

      <Navbar />
      <main className="sg-home">
        <Hero />
        <ProofRail />
        <ProductShowcase />
        <OperationsFlow />
        <TrustBand />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
