import { MessageCircle } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function WhatsAppFloat() {
  const { theme } = useTheme()
  return (
    <a
      href={`https://wa.me/${theme.contactWhatsapp.replace(/[^0-9]/g, '').replace(/^0/, '233')}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        backgroundColor: '#25D366',
        color: 'white',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        zIndex: 1000,
        transition: 'transform 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <MessageCircle size={32} />
    </a>
  )
}
