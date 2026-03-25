import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Welcome.css'

function LoginModal({ onClose, onSuccess }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handle = (e) => {
    e.preventDefault();
    setErr("");
    if (!form.email || !form.password) { setErr("Please fill all fields."); return; }
    if (tab === "register" && !form.name) { setErr("Please enter your name."); return; }
    const userData = { name: form.name || form.email.split("@")[0], email: form.email };
    localStorage.setItem("token", "demo_" + Date.now());
    localStorage.setItem("user", JSON.stringify(userData));
    setTimeout(() => onSuccess(), 50);
  };

  return (
    <div className="nu-modal-overlay" onClick={onClose}>
      <div className="nu-modal" onClick={e => e.stopPropagation()}>
        <button className="nu-modal-close" onClick={onClose}>✕</button>
        <div className="nu-modal-logo">🥗</div>
        <h2 className="nu-modal-title">Welcome to NutriTrack</h2>
        <div className="nu-modal-tabs">
          <button className={tab === "login" ? "active" : ""} onClick={() => setTab("login")}>Login</button>
          <button className={tab === "register" ? "active" : ""} onClick={() => setTab("register")}>Register</button>
        </div>
        <form onSubmit={handle} className="nu-modal-form">
          {tab === "register" && <input placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />}
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          {err && <div className="nu-modal-err">{err}</div>}
          <button type="submit" className="nu-btn nu-btn-green" style={{ width: "100%", justifyContent: "center" }}>
            {tab === "login" ? "Login →" : "Create Account →"}
          </button>
        </form>
        <p className="nu-modal-hint">
          {tab === "login" ? "No account? " : "Already have one? "}
          <span onClick={() => setTab(tab === "login" ? "register" : "login")}>
            {tab === "login" ? "Register free" : "Login"}
          </span>
        </p>
        <p style={{ textAlign: "center", marginTop: "12px", fontSize: "12px", color: "rgba(100,100,100,0.6)" }}>
          <span
            onClick={() => { onClose(); navigate("/login"); }}
            style={{ cursor: "pointer", color: "#7c3aed", fontWeight: 600, transition: "opacity 0.2s" }}
            onMouseEnter={e => e.target.style.opacity = "0.7"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >
            🛡️ Admin Login
          </span>
        </p>
      </div>
    </div>
  );
}

function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // ✅ Safe display name — falls back to email prefix if name is missing
  const displayName = user.name || user.email?.split("@")[0] || "User";
  const displayInitial = displayName[0].toUpperCase();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="nu-profile-wrap" ref={ref}>
      <button className="nu-profile-btn" onClick={() => setOpen(o => !o)}>
        <div className="nu-profile-av">{displayInitial}</div>
        <span className="nu-profile-name">{displayName}</span>
        <span style={{ fontSize: 10, opacity: .6 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="nu-profile-drop">
          <div className="nu-drop-header">
            <div className="nu-drop-av">{displayInitial}</div>
            <div>
              <div className="nu-drop-name">{displayName}</div>
              <div className="nu-drop-email">{user.email}</div>
            </div>
          </div>
          <div className="nu-drop-divider" />
          <Link to="/dashboard"  className="nu-drop-item" onClick={() => setOpen(false)}>📊 Dashboard</Link>
          <Link to="/diet-goals" className="nu-drop-item" onClick={() => setOpen(false)}>🎯 Diet Goals</Link>
          <Link to="/meals"      className="nu-drop-item" onClick={() => setOpen(false)}>🍽️ Meals</Link>
          <Link to="/exercise"   className="nu-drop-item" onClick={() => setOpen(false)}>💪 Exercise</Link>
          <div className="nu-drop-divider" />
          <button className="nu-drop-item nu-drop-logout" onClick={onLogout}>🚪 Logout</button>
        </div>
      )}
    </div>
  );
}

function ContactModal({ onClose }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  return (
    <div className="nu-modal-overlay" onClick={onClose}>
      <div className="nu-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <button className="nu-modal-close" onClick={onClose}>✕</button>
        {sent ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>💚</div>
            <h2 className="nu-modal-title">Message Sent!</h2>
            <p style={{ color: "var(--text2)", marginTop: 8 }}>We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <>
            <h2 className="nu-modal-title">Contact Us</h2>
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="nu-modal-form">
              <input placeholder="Your Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              <textarea placeholder="Your message..." rows={4} value={form.msg} onChange={e => setForm(f => ({ ...f, msg: e.target.value }))} required style={{ resize: "vertical", minHeight: 100 }} />
              <button type="submit" className="nu-btn nu-btn-green" style={{ width: "100%", justifyContent: "center" }}>Send Message 🚀</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function TopNav({ dark, toggleDark, user, onDashboardClick, onContactClick, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`nu-topnav ${scrolled ? "nu-topnav-scrolled" : ""}`}>
      <div className="nu-topnav-inner">
        <div className="nu-topnav-logo">
          <span>🥗</span>
          <span className="nu-topnav-logo-text">NutriTrack</span>
        </div>
        <div className="nu-topnav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#process">How it Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <button className="nu-topnav-link-btn" onClick={onContactClick}>Contact Us</button>
        </div>
        <div className="nu-topnav-right">
          <button className="nu-theme-btn" onClick={toggleDark}>{dark ? "☀️" : "🌙"}</button>
          {user
            ? <ProfileMenu user={user} onLogout={onLogout} />
            : <button className="nu-btn nu-btn-green" onClick={onDashboardClick}>Dashboard →</button>
          }
          <button className="nu-hamburger" onClick={() => setMenuOpen(o => !o)}>{menuOpen ? "✕" : "☰"}</button>
        </div>
      </div>
      {menuOpen && (
        <div className="nu-mobile-menu">
          <a href="#features" onClick={() => setMenuOpen(false)}>✨ Features</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>👋 About</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>⚙️ How it Works</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)}>💳 Pricing</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>❓ FAQ</a>
          <button className="nu-topnav-link-btn" onClick={() => { setMenuOpen(false); onContactClick(); }}>📬 Contact Us</button>
          {!user && <button className="nu-btn nu-btn-green" style={{ margin: "8px 16px", justifyContent: "center" }} onClick={() => { setMenuOpen(false); onDashboardClick(); }}>Dashboard →</button>}
        </div>
      )}
    </nav>
  );
}

const STARTERS = ["High protein meals?", "Daily calorie needs?", "Best post-workout food?"];
function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "ai", text: "Hi! I'm NutriBot 🥦 Ask me anything about diet, meals, or fitness!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  const send = async (text) => {
    const q = text || input.trim(); if (!q) return;
    setInput(""); setMsgs(p => [...p, { role: "user", text: q }]); setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: "You are NutriBot, a friendly nutrition AI. Give short practical advice in 2-4 sentences. Use 1-2 emojis.",
          messages: [{ role: "user", content: q }] })
      });
      const data = await res.json();
      setMsgs(p => [...p, { role: "ai", text: data.content?.map(c => c.text).join("") || "Sorry, try again!" }]);
    } catch { setMsgs(p => [...p, { role: "ai", text: "Something went wrong 🙏" }]); }
    setLoading(false);
  };
  return (
    <>
      <button className="nu-chatbot-btn" onClick={() => setOpen(o => !o)}>
        {open ? "✕" : "🤖"}{!open && <span className="nu-ping" />}
      </button>
      {open && (
        <div className="nu-chat-win">
          <div className="nu-chat-hdr">
            <span style={{ fontSize: 22 }}>🥦</span>
            <div><div className="nu-chat-name">NutriBot AI</div><div className="nu-chat-status"><span className="nu-chat-dot" /> Online</div></div>
            <button className="nu-chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="nu-chat-msgs">
            {msgs.map((m, i) => m.role === "ai"
              ? <div key={i} className="nu-ai-row"><span style={{ fontSize: 18 }}>🥦</span><div className="nu-ai-bub">{m.text}</div></div>
              : <div key={i} className="nu-user-row"><div className="nu-user-bub">{m.text}</div></div>
            )}
            {loading && <div className="nu-ai-row"><span style={{ fontSize: 18 }}>🥦</span><div className="nu-ai-bub"><div className="nu-typing"><span /><span /><span /></div></div></div>}
            <div ref={bottomRef} />
          </div>
          <div className="nu-starters">{STARTERS.map(s => <button key={s} className="nu-start-btn" onClick={() => send(s)}>{s}</button>)}</div>
          <div className="nu-chat-inp-row">
            <input className="nu-chat-inp" placeholder="Ask NutriBot anything…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
            <button className="nu-send-btn" onClick={() => send()} disabled={loading}>{loading ? "…" : "↑"}</button>
          </div>
        </div>
      )}
    </>
  );
}

const FAQS = [
  { q: "Is NutriTrack free to use?", a: "Yes! Our Free plan gives you basic meal logging, calorie tracking, and 3 recipes per day — no credit card required." },
  { q: "Can I sync my workouts?", a: "Absolutely. The Exercise Tracker logs workouts and syncs with your daily calorie balance." },
  { q: "How does the AI NutriBot work?", a: "NutriBot is powered by Claude AI. Ask anything — meal ideas, macro breakdowns, or motivation." },
  { q: "Is my data private?", a: "Your data is encrypted and never sold. You own it and can export or delete it anytime." },
  { q: "Can I use NutriTrack for a plant-based diet?", a: "Definitely! Hundreds of plant-based recipes and NutriBot understands vegan nutrition deeply." },
];
function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="nu-section" id="faq">
      <div className="nu-section-head">
        <div className="nu-pill">❓ FAQ</div>
        <h2 className="nu-h2">Frequently Asked Questions</h2>
        <p className="nu-sub">Got questions? We've got answers.</p>
      </div>
      <div className="nu-faq-list">
        {FAQS.map((f, i) => (
          <div key={i} className="nu-faq-item">
            <button className="nu-faq-q" onClick={() => setOpen(open === i ? null : i)}>
              {f.q}<span className="nu-faq-icon">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <div className="nu-faq-a">{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // ✅ Safely parse user — rejects malformed objects missing email
  const [user, setUser] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      if (!u || !u.email) return null;
      return u;
    } catch { return null; }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.style.setProperty("--bg", "#0d1a0d"); root.style.setProperty("--bg2", "#162016");
      root.style.setProperty("--bg3", "#1e2e1e"); root.style.setProperty("--text", "#e8f5e1");
      root.style.setProperty("--text2", "#9dcc8a"); root.style.setProperty("--border", "#2a4a2a");
      root.style.setProperty("--green", "#4caf50"); root.style.setProperty("--green2", "#388e3c");
      root.style.setProperty("--accent", "#1a2e1a"); root.style.setProperty("--card-bg", "#162016");
      root.style.setProperty("--nav-bg", "rgba(13,26,13,.93)");
    } else {
      root.style.setProperty("--bg", "#f8faf5"); root.style.setProperty("--bg2", "#ffffff");
      root.style.setProperty("--bg3", "#eef4e8"); root.style.setProperty("--text", "#1a2e14");
      root.style.setProperty("--text2", "#4a6741"); root.style.setProperty("--border", "#d4e8cc");
      root.style.setProperty("--green", "#3a8f3a"); root.style.setProperty("--green2", "#2d7a2d");
      root.style.setProperty("--accent", "#e8f5e1"); root.style.setProperty("--card-bg", "#ffffff");
      root.style.setProperty("--nav-bg", "rgba(248,250,245,.92)");
    }
  }, [dark]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");  // ✅ also clear role on logout
    setUser(null);
    navigate("/");
  };

  const onLoginSuccess = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      if (u && u.email) setUser(u);
    } catch {}
    setShowLogin(false);
    setTimeout(() => navigate("/dashboard"), 50);
  };

  return (
    <div className="nu-page">
      <TopNav dark={dark} toggleDark={() => setDark(d => !d)} user={user}
        onDashboardClick={() => setShowLogin(true)}
        onContactClick={() => setShowContact(true)}
        onLogout={logout} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={onLoginSuccess} />}
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}

      <div className="nu-main">

        {/* HERO */}
        <section className="nu-hero">
          <div className="nu-orb nu-orb-1" /><div className="nu-orb nu-orb-2" />
          <div className="nu-hero-grid">
            <div>
              <div className="nu-pill">🥗 Your Personal Nutrition AI</div>
              <h1 className="nu-h1">Fuel Smarter.<br /><span className="nu-grad-text">Live Better.</span></h1>
              <p className="nu-hero-sub">NutriTrack combines intelligent meal tracking, AI coaching, and real-time analytics to help you reach your health goals — faster, smarter, sustainably.</p>
              <div className="nu-hero-btns">
                {user
                  ? <Link to="/dashboard" className="nu-btn nu-btn-green nu-btn-lg">Go to Dashboard →</Link>
                  : <button className="nu-btn nu-btn-green nu-btn-lg" onClick={() => setShowLogin(true)}>Get Started Free →</button>
                }
                <a href="#features" className="nu-btn nu-btn-ghost nu-btn-lg">Explore Features</a>
              </div>
              <div className="nu-hero-stats">
                {[["50K+", "Active Users"], ["1M+", "Meals Logged"], ["98%", "Success Rate"]].map(([v, l]) => (
                  <div key={l}><div className="nu-hero-stat-val">{v}</div><div className="nu-hero-stat-label">{l}</div></div>
                ))}
              </div>
            </div>
            <div className="nu-hero-visual">
              <div className="nu-hero-emoji">🥗</div>
              {[
                { label: "🔥 Calories", val: "1,800 kcal", cls: "nu-float-card nu-fc-1" },
                { label: "💪 Protein", val: "120g — Goal met!", cls: "nu-float-card nu-fc-2" },
                { label: "⚡ Streak", val: "14 days 🔥", cls: "nu-float-card nu-fc-3" },
              ].map((c, i) => <div key={i} className={c.cls}><div className="nu-fc-label">{c.label}</div><div className="nu-fc-val">{c.val}</div></div>)}
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="nu-stats-bar">
          {[["50K+", "Happy Users"], ["1M+", "Meals Logged"], ["98%", "Goal Success Rate"]].map(([v, l]) => (
            <div key={l} className="nu-stat-item"><div className="nu-stat-val">{v}</div><div className="nu-stat-label">{l}</div></div>
          ))}
        </div>

        <div className="nu-divider" />

        {/* FEATURES */}
        <section className="nu-section" id="features">
          <div className="nu-section-head">
            <div className="nu-pill">✨ Features</div>
            <h2 className="nu-h2">Everything you need to thrive</h2>
            <p className="nu-sub">Powerful tools designed around your nutrition goals</p>
          </div>
          <div className="nu-feat-grid">
            {[
              { icon: "📊", title: "Smart Dashboard", desc: "Real-time macros, calories, and daily insights visualized beautifully." },
              { icon: "🎯", title: "Diet Goal Tracking", desc: "Set personalized targets and stay on track with smart daily reminders." },
              { icon: "🍽️", title: "Meal Logging", desc: "Log any meal in seconds using our extensive food database." },
              { icon: "📖", title: "Recipe Library", desc: "Hundreds of nutritionist-approved recipes tailored to your goals." },
              { icon: "💪", title: "Exercise Tracker", desc: "Log workouts and sync them with your daily calorie balance." },
              { icon: "🤖", title: "AI NutriBot", desc: "Ask anything — meal ideas, macro breakdowns, or just motivation." },
            ].map(f => (
              <div key={f.title} className="nu-card">
                <div className="nu-feat-icon">{f.icon}</div>
                <h3 className="nu-h3">{f.title}</h3>
                <p className="nu-card-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="nu-divider" />

        {/* ABOUT */}
        <section className="nu-section" id="about">
          <div className="nu-about-grid">
            <div>
              <div className="nu-pill">👋 About Us</div>
              <h2 className="nu-h2 nu-left">Who We Are</h2>
              <p className="nu-about-text">NutriTrack was built by a passionate team of nutritionists, engineers, and health enthusiasts who believed eating well shouldn't be complicated.</p>
              <p className="nu-about-text">Today, thousands of people use NutriTrack to understand their bodies, make smarter food choices, and live healthier lives — one meal at a time.</p>
              <div className="nu-tags">
                {[["🧬", "Science-backed"], ["🔒", "Privacy-first"], ["🌍", "Global community"], ["💚", "Health-obsessed"]].map(([icon, label]) => (
                  <div key={label} className="nu-tag">{icon} {label}</div>
                ))}
              </div>
            </div>
            <div className="nu-about-cards">
              {[
                { icon: "🥗", title: "50K+ Users", sub: "and growing" },
                { icon: "🔥", title: "1M+ Meals", sub: "tracked & analyzed" },
                { icon: "🏆", title: "98% Satisfaction", sub: "from our community" },
                { icon: "🤖", title: "AI-Powered", sub: "nutrition coaching" },
              ].map(v => (
                <div key={v.title} className="nu-card nu-about-card">
                  <div className="nu-about-card-icon">{v.icon}</div>
                  <div className="nu-about-card-title">{v.title}</div>
                  <div className="nu-about-card-sub">{v.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="nu-divider" />

        {/* HOW IT WORKS */}
        <section className="nu-section" id="process">
          <div className="nu-section-head">
            <div className="nu-pill">⚙️ Process</div>
            <h2 className="nu-h2">How NutriTrack Works</h2>
            <p className="nu-sub">Four simple steps to a healthier you</p>
          </div>
          <div className="nu-steps-grid">
            {[
              { num: "01", icon: "🎯", title: "Set Your Goals", desc: "Tell us your target weight, calories, and macros. We handle all the math." },
              { num: "02", icon: "🍽️", title: "Log Your Meals", desc: "Quickly add every meal with our smart food search and custom entries." },
              { num: "03", icon: "📊", title: "Track Progress", desc: "Watch real-time dashboards update as you hit your daily targets." },
              { num: "04", icon: "🚀", title: "Achieve Results", desc: "Follow AI-powered suggestions and reach your goals faster than ever." },
            ].map(s => (
              <div key={s.num} className="nu-card">
                <div className="nu-step-num">{s.num}</div>
                <div className="nu-step-icon">{s.icon}</div>
                <h3 className="nu-h3">{s.title}</h3>
                <p className="nu-card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="nu-divider" />

        {/* TESTIMONIALS */}
        <section className="nu-section">
          <div className="nu-section-head">
            <div className="nu-pill">💬 Testimonials</div>
            <h2 className="nu-h2">Loved by thousands</h2>
          </div>
          <div className="nu-testi-grid">
            {[
              { name: "Sarah K.", role: "Lost 18 lbs in 3 months", avatar: "👩‍🦰", text: "NutriBot is like having a nutritionist in my pocket. Incredibly accurate and keeps me motivated every day!" },
              { name: "James T.", role: "Marathon runner", avatar: "🧔", text: "The macro tracking is spot on. I PR'd my last marathon after dialing in my nutrition with NutriTrack." },
              { name: "Priya M.", role: "Vegetarian athlete", avatar: "👩‍🦱", text: "Finally an app that truly understands plant-based diets. The recipe library is absolutely amazing!" },
            ].map(t => (
              <div key={t.name} className="nu-card">
                <div className="nu-stars">★★★★★</div>
                <p className="nu-testi-text">"{t.text}"</p>
                <div className="nu-testi-author">
                  <div className="nu-testi-avatar">{t.avatar}</div>
                  <div><div className="nu-testi-name">{t.name}</div><div className="nu-testi-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="nu-divider" />

        {/* PRICING */}
        <section className="nu-section" id="pricing">
          <div className="nu-section-head">
            <div className="nu-pill">💳 Pricing</div>
            <h2 className="nu-h2">Simple, transparent pricing</h2>
            <p className="nu-sub">Start free. Upgrade whenever you're ready.</p>
          </div>
          <div className="nu-price-grid">
            {[
              { name: "Free", price: "$0", period: "/mo", highlight: false, features: ["Basic meal logging", "3 recipes/day", "Calorie tracking", "Community access"], cta: "Get Started" },
              { name: "Pro", price: "$9", period: "/mo", highlight: true, features: ["Unlimited logging", "AI NutriBot access", "Advanced analytics", "Custom meal plans", "Priority support"], cta: "Start Free Trial" },
              { name: "Elite", price: "$19", period: "/mo", highlight: false, features: ["Everything in Pro", "Personal dietitian chat", "DNA-based suggestions", "Family accounts (5)", "White-glove onboarding"], cta: "Go Elite" },
            ].map(plan => (
              <div key={plan.name} className={`nu-card nu-price-card ${plan.highlight ? "nu-price-popular" : ""}`}>
                {plan.highlight && <div className="nu-price-badge">⭐ Most Popular</div>}
                <h3 className="nu-price-name">{plan.name}</h3>
                <div className="nu-price-amount">
                  <span className={`nu-price-val ${plan.highlight ? "nu-price-val-green" : ""}`}>{plan.price}</span>
                  <span className="nu-price-period">{plan.period}</span>
                </div>
                <ul className="nu-price-features">
                  {plan.features.map(f => <li key={f}><span className="nu-check">✓</span>{f}</li>)}
                </ul>
                <button className={`nu-btn nu-price-btn ${plan.highlight ? "nu-btn-green" : "nu-btn-ghost"}`}
                  onClick={() => !user && setShowLogin(true)}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </section>

        <div className="nu-divider" />

        <FAQ />

        <div className="nu-divider" />

        {/* CTA */}
        <div className="nu-cta-block">
          <div className="nu-cta-orb" />
          <div className="nu-cta-inner">
            <div className="nu-pill">🚀 Get Started Today</div>
            <h2 className="nu-h2">Ready to transform your health?</h2>
            <p className="nu-sub">Join 50,000+ people already crushing their nutrition goals.</p>
            <button className="nu-btn nu-btn-green nu-btn-lg" style={{ marginTop: 32 }}
              onClick={() => user ? navigate("/dashboard") : setShowLogin(true)}>
              {user ? "Open Dashboard →" : "Start for Free →"}
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="nu-footer">
          <div className="nu-footer-brand"><span style={{ fontSize: 22 }}>🥗</span><span className="nu-footer-name">NutriTrack</span></div>
          <span className="nu-footer-copy">© 2025 NutriTrack — Built for your health</span>
          <button className="nu-btn nu-btn-ghost" style={{ padding: "6px 14px", fontSize: 13 }} onClick={() => setShowContact(true)}>📬 Contact Us</button>
          <span className="nu-footer-copy">Made with 💚</span>
        </footer>
      </div>

      <ChatBot />
    </div>
  );
}