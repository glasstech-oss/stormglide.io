import Footer from './Footer'

export default function PageLayout({ children }) {
  return (
    <>
      <main style={{ paddingTop: '68px' }}>
        {children}
      </main>
      <Footer />
    </>
  )
}
