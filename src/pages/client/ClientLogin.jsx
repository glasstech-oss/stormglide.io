import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Phone, Lock } from 'lucide-react'
import { auth } from '../../firebase/db'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

export default function ClientLogin() {
  const [step, setStep] = useState('phone') // phone or otp
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationResult, setConfirmationResult] = useState(null)
  const navigate = useNavigate()

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      })
    }
  }

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    if (!phone.trim()) {
      setError('Please enter a phone number')
      return
    }

    setLoading(true)
    setError('')

    try {
      setupRecaptcha()
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`
      const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier)
      setConfirmationResult(result)
      setStep('otp')
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Check phone number.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      await confirmationResult.confirm(otp)
      navigate('/client/dashboard')
    } catch {
      setError('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Client Login | StormGlide</title>
      </Helmet>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--bg-soft) 0%, var(--color-background) 100%)',
        padding: '2rem',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '3rem 2rem',
            background: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              background: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}>
              {step === 'phone' ? (
                <Phone size={32} color='var(--sg-accent)' />
              ) : (
                <Lock size={32} color='var(--sg-accent)' />
              )}
            </div>
            <h1 style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: 'var(--color-text-heading)',
            }}>
              {step === 'phone' ? 'Client Login' : 'Enter OTP'}
            </h1>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
            }}>
              {step === 'phone'
                ? 'Sign in with your phone number'
                : 'Enter the 6-digit code sent to your phone'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '1rem',
                background: 'color-mix(in srgb, #ef4444 10%, transparent)',
                border: '1px solid color-mix(in srgb, #ef4444 25%, transparent)',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                color: '#dc2626',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Phone Form */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: 'var(--color-text-heading)',
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+233 XX XXX XXXX"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text-heading)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--sg-accent)',
                  color: 'var(--color-background)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* OTP Form */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: 'var(--color-text-heading)',
                }}>
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '2rem',
                    textAlign: 'center',
                    letterSpacing: '0.5em',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text-heading)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--sg-accent)',
                  color: 'var(--color-background)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
            </form>
          )}

          {/* Back Button */}
          {step === 'otp' && (
            <button
              onClick={() => {
                setStep('phone')
                setOtp('')
                setError('')
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'transparent',
                color: 'var(--sg-accent)',
                border: '1px solid var(--sg-accent)',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          )}

          {/* reCAPTCHA Container */}
          <div id="recaptcha-container" style={{ marginTop: '1rem' }} />

          {/* Footer */}
          <p style={{
            marginTop: '2rem',
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
          }}>
            This portal is for registered clients only.
            <br />
            Contact support if you need assistance.
          </p>
        </motion.div>
      </div>
    </>
  )
}
