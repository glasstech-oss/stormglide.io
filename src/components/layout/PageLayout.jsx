import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFloat from './WhatsAppFloat'
import { useEffect } from 'react'

export default function PageLayout({ children }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
