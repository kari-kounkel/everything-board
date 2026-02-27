import { useState } from 'react'
import { supabase } from './supabase'

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login') // login | signup | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    onAuth(data.user)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) { setError("Passwords don't match."); return }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return }
    setLoading(true); setError(null)
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user && !data.user.confirmed_at) {
      setMessage("Check your email to confirm your account, then log in.")
      setMode('login')
    } else {
      onAuth(data.user)
    }
    setLoading(false)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    if (err) { setError(err.message); setLoading(false); return }
    setMessage("Password reset link sent. Check your email.")
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '2px solid #E8E3D8', background: '#FDFCF6', fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif", color: '#333', outline: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 40%, #E6E2D8 0%, #D8D3C6 50%, #C5BFB0 100%)',
      fontFamily: "'DM Sans', sans-serif", padding: '20px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;700;800&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; }
        input:focus { border-color: #E8B931 !important; }
      `}</style>

      <div style={{
        background: '#FEFCF6', borderRadius: '24px', maxWidth: '420px', width: '100%',
        padding: '40px 36px', boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
        animation: 'fadeUp 0.6s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔮</div>
          <h1 style={{
            fontSize: '24px', fontWeight: 900, color: '#1A1A1A',
            fontFamily: "'Playfair Display', serif", marginBottom: '4px',
          }}>The Everything Board</h1>
          <p style={{ fontSize: '12px', color: '#888' }}>For people who do everything.</p>
        </div>

        {message && (
          <div style={{
            background: '#5B8C5A18', border: '1px solid #5B8C5A44', borderRadius: '10px',
            padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#5B8C5A', fontWeight: 600,
          }}>✓ {message}</div>
        )}

        {error && (
          <div style={{
            background: '#D4644E12', border: '1px solid #D4644E33', borderRadius: '10px',
            padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#D4644E', fontWeight: 600,
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleReset}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '10px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@example.com" style={{ ...inputStyle, marginTop: '4px' }} />
          </div>

          {mode !== 'reset' && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                minLength={6} style={{ ...inputStyle, marginTop: '4px' }} />
            </div>
          )}

          {mode === 'signup' && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                placeholder="Type it again" minLength={6} style={{ ...inputStyle, marginTop: '4px' }} />
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: loading ? '#999' : '#1A1A1A', color: '#E8B931',
            fontWeight: 800, fontSize: '14px', cursor: loading ? 'default' : 'pointer',
            letterSpacing: '0.5px', marginTop: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}>
            {loading ? '...' : mode === 'login' ? 'Log In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mode === 'login' && (
            <>
              <button onClick={() => { setMode('signup'); setError(null); setMessage(null); }}
                style={{ background: 'none', border: 'none', color: '#4A6FA5', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                Don't have an account? Sign up
              </button>
              <button onClick={() => { setMode('reset'); setError(null); setMessage(null); }}
                style={{ background: 'none', border: 'none', color: '#888', fontSize: '11px', cursor: 'pointer' }}>
                Forgot password?
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button onClick={() => { setMode('login'); setError(null); setMessage(null); }}
              style={{ background: 'none', border: 'none', color: '#4A6FA5', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              Already have an account? Log in
            </button>
          )}
          {mode === 'reset' && (
            <button onClick={() => { setMode('login'); setError(null); setMessage(null); }}
              style={{ background: 'none', border: 'none', color: '#4A6FA5', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              ← Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
