import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

// ─── A volume slider that fights back ───
function BrokenVolumeSlider() {
  const [value, setValue] = useState(100)

  const handleChange = (e) => {
    const target = Number(e.target.value)
    // slider drifts back up toward 100
    if (target < value) {
      setValue(Math.min(100, target + Math.random() * 30))
    } else {
      setValue(target)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => Math.min(100, prev + 2 + Math.random() * 5))
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card">
      <h3>🔊 Volume</h3>
      <input type="range" min="0" max="100" value={value} onChange={handleChange} className="broken-slider" />
      <p className="muted-text">{Math.round(value)}% — {value > 80 ? "why does it keep going back up" : "almost... almost..."}</p>
    </div>
  )
}

// ─── Countdown to absolutely nothing ───
function UselessCountdown() {
  const [seconds, setSeconds] = useState(30)
  const [finished, setFinished] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setFinished(f => f + 1)
          return 30
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const msgs = [
    "Something amazing happens in...",
    "OK wait for real this time...",
    "Third time's the charm...",
    "I swear something happens at 0...",
    "Fine nothing happens. But what if...",
  ]

  return (
    <div className="card countdown-card">
      <p className="countdown-label">{msgs[Math.min(finished, msgs.length - 1)]}</p>
      <p className="countdown-number">{seconds}</p>
      {finished > 0 && <p className="muted-text">Times you've fallen for this: {finished}</p>}
    </div>
  )
}

// ─── Cookie consent that's way too big ───
function CookieBanner({ onAccept }) {
  return (
    <div className="cookie-overlay">
      <div className="cookie-banner">
        <h2>🍪 We Value Your Privacy</h2>
        <p>This website uses cookies, local storage, your patience, your screen time, and probably your last brain cell to deliver the most useless experience possible.</p>
        <p className="cookie-fine-print">By clicking "Accept" you agree to absolutely nothing legally binding but emotionally devastating.</p>
        <div className="cookie-buttons">
          <button className="btn-primary" onClick={onAccept}>Accept All 😔</button>
          <DodgeButton text="Decline" />
          <DodgeButton text="Manage Preferences" />
        </div>
      </div>
    </div>
  )
}

// ─── Skip Ad that restarts ───
function SkipAd({ onFinish }) {
  const [timer, setTimer] = useState(5)
  const [phase, setPhase] = useState(0) // 0: waiting, 1: can skip, 2: restarted

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  const handleSkip = () => {
    if (phase < 2) {
      setPhase(p => p + 1)
      setTimer(5 + phase * 3)
    } else {
      onFinish()
    }
  }

  const labels = [
    "Skip Ad ▶",
    "OK skip for real this time ▶",
    "Fine, enter the website ▶"
  ]

  return (
    <div className="skip-ad-screen">
      <p className="ad-label">📺 Ad {phase + 1} of {phase < 2 ? '???' : '3'}</p>
      <div className="ad-content">
        <p className="ad-text">
          {phase === 0 && "Did you know? This website has zero purpose."}
          {phase === 1 && "Fun fact: You're still here. Voluntarily."}
          {phase === 2 && "Last one, I promise. Probably."}
        </p>
      </div>
      <button
        className={`skip-btn ${timer > 0 ? 'disabled' : ''}`}
        onClick={timer === 0 ? handleSkip : undefined}
      >
        {timer > 0 ? `Skip in ${timer}...` : labels[phase]}
      </button>
    </div>
  )
}

// ─── Dodge button ───
function DodgeButton({ text }) {
  const [pos, setPos] = useState({})

  const dodge = () => {
    setPos({
      position: 'relative',
      left: `${(Math.random() - 0.5) * 100}px`,
      top: `${(Math.random() - 0.5) * 40}px`,
      transform: `rotate(${(Math.random() - 0.5) * 20}deg)`,
    })
  }

  return (
    <button
      className="btn-outline"
      style={pos}
      onMouseEnter={dodge}
      onTouchStart={(e) => { e.preventDefault(); dodge() }}
      onClick={dodge}
    >
      {text}
    </button>
  )
}

// ─── Quiz that's always wrong ───
function ImpossibleQuiz() {
  const [current, setCurrent] = useState(0)
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)

  const questions = [
    { q: "What's 2 + 2?", options: ["4", "4", "4", "4"], correct: -1 },
    { q: "What color is the sky?", options: ["Blue", "Azure", "Cerulean", "Sky blue"], correct: -1 },
    { q: "Pick a number", options: ["1", "2", "3", "4"], correct: -1 },
    { q: "Which one is a fruit?", options: ["Apple", "Mango", "Banana", "All of them"], correct: -1 },
    { q: "Will this quiz ever say 'Correct'?", options: ["Yes", "No", "Maybe", "I give up"], correct: -1 },
  ]

  const wrongs = [
    "WRONG 🗿",
    "Nope. Not even close.",
    "Incorrect. The answer was... actually, nevermind.",
    "So confidently wrong lmao",
    "Have you tried being smarter?",
    "The correct answer was the one you didn't pick. Obviously.",
    "Are you even trying?",
    "Wrong but I respect the confidence",
  ]

  const handleAnswer = () => {
    setResult(wrongs[Math.floor(Math.random() * wrongs.length)])
    setTimeout(() => {
      setResult(null)
      if (current < questions.length - 1) {
        setCurrent(c => c + 1)
      } else {
        setCurrent(0)
      }
    }, 2000)
  }

  const qData = questions[current]

  return (
    <div className="card quiz-card">
      <h3>🧠 Quick Quiz</h3>
      <p className="quiz-score">Score: {score}/{current + (result ? 1 : 0)} (it will always be 0)</p>
      <p className="quiz-question">{qData.q}</p>
      {result ? (
        <p className="quiz-result">{result}</p>
      ) : (
        <div className="quiz-options">
          {qData.options.map((opt, i) => (
            <button key={i} className="quiz-option" onClick={handleAnswer}>{opt}</button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Unsubscribe form that subscribes to more ───
function UnsubscribeForm() {
  const [subs, setSubs] = useState(['Annoying Facts', 'Daily Reminders'])
  const [showMsg, setShowMsg] = useState(null)

  const extras = [
    'Hourly Motivational Quotes',
    'Fun Cactus Facts',
    'Weekly Horoscope (Wrong Zodiac)',
    'Random Wikipedia Articles',
    'Elevator Music Updates',
    'Unsolicited Life Advice',
    'Daily Pictures of Pigeons',
    'Updates About This Website',
  ]

  const handleUnsub = (name) => {
    const newSub = extras[Math.floor(Math.random() * extras.length)]
    setSubs(prev => [...prev.filter(s => s !== name), newSub, extras[Math.floor(Math.random() * extras.length)]].filter((v, i, a) => a.indexOf(v) === i))
    setShowMsg(`Unsubscribed from "${name}". You've been subscribed to "${newSub}" instead.`)
    setTimeout(() => setShowMsg(null), 3000)
  }

  return (
    <div className="card">
      <h3>📧 Your Subscriptions</h3>
      <p className="muted-text">Manage your email preferences below</p>
      <ul className="sub-list">
        {subs.map(s => (
          <li key={s}>
            <span>{s}</span>
            <button className="unsub-btn" onClick={() => handleUnsub(s)}>Unsubscribe</button>
          </li>
        ))}
      </ul>
      {showMsg && <p className="sub-feedback">{showMsg}</p>}
    </div>
  )
}

// ─── Text that slowly tilts ───
function TiltingText({ children }) {
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle(prev => prev + 0.3)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ transform: `rotate(${angle}deg)`, transition: 'transform 0.2s', display: 'inline-block' }}>
      {children}
    </div>
  )
}

// ─── Fake low battery ───
function FakeLowBattery({ onDismiss }) {
  return (
    <div className="battery-overlay" onClick={onDismiss}>
      <div className="battery-popup" onClick={e => e.stopPropagation()}>
        <div className="battery-icon">🪫</div>
        <h3>Low Battery</h3>
        <p>5% remaining. Maybe you should close some tabs. Like this one. Actually don't, I'm lonely here.</p>
        <button className="btn-primary" onClick={onDismiss}>OK</button>
      </div>
    </div>
  )
}

// ─── Terms and conditions wall ───
function TermsWall({ onAccept }) {
  const [scrolled, setScrolled] = useState(false)
  const ref = useRef(null)

  const handleScroll = () => {
    if (!ref.current) return
    const { scrollTop, scrollHeight, clientHeight } = ref.current
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setScrolled(true)
    }
  }

  const terms = [
    "1. By using this website, you acknowledge that you have nothing better to do.",
    "2. The creator of this website assumes no responsibility for lost time, brain cells, or dignity.",
    "3. This website may cause mild irritation, involuntary eye-rolling, and the urge to throw your phone.",
    "4. You agree that the \"close\" button is merely decorative.",
    "5. Any screenshots taken may be used as evidence of your questionable life choices.",
    "6. The creator reserves the right to say \"I told you so.\"",
    "7. Loading bars on this website are not actual indicators of progress. Nothing progresses here.",
    "8. You waive the right to complain. You clicked the link. This is on you.",
    "9. This agreement is legally binding in zero (0) countries, but morally binding in all of them.",
    "10. The quiz section will always mark you wrong. This is not a bug — it's a feature.",
    "11. Unsubscribing will subscribe you to more things. We thought that was funny.",
    "12. The volume slider has a mind of its own. Don't fight it.",
    "13. You agree to read all of this. Yes, all of it. I can see you scrolling fast.",
    "14. HEY. SLOW DOWN. READ THE TERMS.",
    "15. That's better.",
    "16. By reading this far, you confirm you have too much free time.",
    "17. The countdown timer leads to nothing. We're not sorry.",
    "18. If you forward this website to someone, you become an accomplice. Congratulations.",
    "19. This website was made out of pure boredom and slight pettiness. Mostly pettiness.",
    "20. Final clause: lol you actually read all of this 💀",
  ]

  return (
    <div className="terms-overlay">
      <div className="terms-popup">
        <h2>📜 Terms & Conditions</h2>
        <p className="muted-text">Please read carefully before proceeding (yes really)</p>
        <div className="terms-scroll" ref={ref} onScroll={handleScroll}>
          {terms.map((t, i) => <p key={i}>{t}</p>)}
        </div>
        <button className={`btn-primary ${!scrolled ? 'disabled' : ''}`} onClick={scrolled ? onAccept : undefined}>
          {scrolled ? "I Accept My Fate" : "Scroll to bottom to continue ↓"}
        </button>
      </div>
    </div>
  )
}

// ─── Main App ───
function App() {
  const [phase, setPhase] = useState('landing') // landing → skipAd → terms → cookie → main
  const [showBattery, setShowBattery] = useState(false)
  const [pageAngle, setPageAngle] = useState(0)

  // slow page tilt
  useEffect(() => {
    if (phase !== 'main') return
    const interval = setInterval(() => {
      setPageAngle(prev => {
        const next = prev + (Math.random() - 0.5) * 0.8
        return Math.max(-3, Math.min(3, next))
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [phase])

  // fake low battery popup
  useEffect(() => {
    if (phase !== 'main') return
    const timeout = setTimeout(() => setShowBattery(true), 25000)
    return () => clearTimeout(timeout)
  }, [phase])

  // block tab close
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = "Leaving already? That's very on brand for you 💀"
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])

  if (phase === 'landing') {
    return (
      <div className="landing">
        <div className="landing-content">
          <div className="landing-emoji">🗿</div>
          <h1 className="landing-title">Hey 🫵</h1>
          <p className="landing-sub">Someone made you a website</p>
          <p className="landing-warning">(it's definitely not a trap 😇)</p>
          <button className="enter-btn" onClick={() => setPhase('skipAd')}>
            Open it I guess 📦
          </button>
          <p className="fine-print">* no refunds, no take-backs</p>
        </div>
        <div className="landing-bg-text">🗿</div>
      </div>
    )
  }

  if (phase === 'skipAd') {
    return <SkipAd onFinish={() => setPhase('terms')} />
  }

  if (phase === 'terms') {
    return <TermsWall onAccept={() => setPhase('cookie')} />
  }

  if (phase === 'cookie') {
    return <CookieBanner onAccept={() => setPhase('main')} />
  }

  return (
    <div className="main-page" style={{ transform: `rotate(${pageAngle}deg)` }}>
      {showBattery && <FakeLowBattery onDismiss={() => setShowBattery(false)} />}

      <header className="page-header">
        <TiltingText><h1>Welcome to literally nothing 🗿</h1></TiltingText>
        <p className="subtitle">You sat through 3 ads and a terms page for this. Hope it was worth it.</p>
      </header>

      <div className="content-grid">
        <UselessCountdown />
        <ImpossibleQuiz />
        <BrokenVolumeSlider />
        <UnsubscribeForm />

        <div className="card">
          <h3>🚪 Want to leave?</h3>
          <p>Sure! Just click one of these:</p>
          <div className="exit-buttons">
            <DodgeButton text="Exit" />
            <DodgeButton text="Close" />
            <DodgeButton text="Leave" />
          </div>
          <p className="muted-text">Weird how they keep moving 🤔</p>
        </div>

        <div className="card">
          <h3>📊 Site Analytics</h3>
          <ul className="analytics-list">
            <li><span>Time wasted:</span> <span>Too much</span></li>
            <li><span>Productive things done:</span> <span>0</span></li>
            <li><span>Regret level:</span> <span>Rising</span></li>
            <li><span>Exit buttons clicked:</span> <span>Nice try</span></li>
            <li><span>Purpose of this site:</span> <span>None</span></li>
          </ul>
        </div>

        <div className="card">
          <h3>💬 Leave a Review</h3>
          <div className="review-stars">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} className="star-btn" onClick={() => alert(n <= 3 ? "You're not allowed to rate below 4 stars 🗿" : "Thanks! Your review has been discarded 🗑️")}>
                {'⭐'}
              </button>
            ))}
          </div>
          <p className="muted-text">All ratings below 5 stars are automatically deleted</p>
        </div>

        <div className="card faq-card">
          <h3>❓ FAQ</h3>
          <details><summary>Why does this exist?</summary><p>Boredom. Next question.</p></details>
          <details><summary>How do I close this?</summary><p>You don't. That's the point.</p></details>
          <details><summary>Who made this?</summary><p>Someone with too much free time and your link.</p></details>
          <details><summary>Is this a virus?</summary><p>No. It's worse. It's pointless.</p></details>
          <details><summary>Can I sue for wasted time?</summary><p>You can try. Our legal team is a rubber duck.</p></details>
        </div>
      </div>

      <footer className="page-footer">
        <p>© 2026 Absolutely Nobody. No rights reserved.</p>
        <p className="fine-print">Made with boredom and secondhand pettiness</p>
      </footer>
    </div>
  )
}

export default App
