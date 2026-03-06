import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import './Welcome.css'
import './Dashboard.css'

const NAV = [
  { to: "/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/diet-goals", icon: "🎯", label: "Diet Goals" },
  { to: "/meals",      icon: "🍽️", label: "Meals" },
  { to: "/recipes",    icon: "📖", label: "Recipes" },
  { to: "/exercise",   icon: "💪", label: "Exercise" },
];

function Sidebar({ onLogout }) {
  const { pathname } = useLocation();
  return (
    <div className="nu-sidebar">
      <div className="nu-sidebar-logo">
        <div className="nu-sidebar-logo-icon">🥗</div>
        <span className="nu-sidebar-logo-text">NutriTrack</span>
      </div>
      <p className="nu-sidebar-nav-label">Menu</p>
      <ul>
        {NAV.map(n => (
          <li key={n.to}>
            <Link to={n.to} className={pathname === n.to ? "active" : ""}>
              <span className="nu-nav-icon">{n.icon}</span>{n.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="nu-sidebar-divider" />
      <button className="nu-logout-btn" onClick={onLogout}>🚪 Logout</button>
    </div>
  );
}

const STARTERS = ["High protein meals?", "Daily calorie needs?", "Best post-workout food?"];

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "Hi! I'm NutriBot 🥦 — your personal AI nutrition coach. Ask me anything about diet, meals, or fitness!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput("");
    setMsgs(p => [...p, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are NutriBot, a friendly expert nutrition and fitness AI inside NutriTrack. Give short practical encouraging advice in 2-4 sentences. Use 1-2 emojis. Be warm and conversational.",
          messages: [{ role: "user", content: q }]
        })
      });
      const data = await res.json();
      const reply = data.content?.map(c => c.text).join("") || "Sorry, try again!";
      setMsgs(p => [...p, { role: "ai", text: reply }]);
    } catch {
      setMsgs(p => [...p, { role: "ai", text: "Something went wrong 🙏 Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button className="nu-chatbot-btn" onClick={() => setOpen(o => !o)}>
        {open ? "✕" : "🤖"}
        {!open && <span className="nu-ping" />}
      </button>

      {open && (
        <div className="nu-chat-win">
          <div className="nu-chat-hdr">
            <div className="nu-chat-av">🥦</div>
            <div>
              <div className="nu-chat-name">NutriBot AI</div>
              <div className="nu-chat-status">
                <span className="nu-chat-dot" /> Online — ready to help
              </div>
            </div>
            <button className="nu-chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="nu-chat-msgs">
            {msgs.map((m, i) =>
              m.role === "ai" ? (
                <div key={i} className="nu-ai-row">
                  <div className="nu-ai-av">🥦</div>
                  <div className="nu-ai-bub">{m.text}</div>
                </div>
              ) : (
                <div key={i} className="nu-user-row">
                  <div className="nu-user-bub">{m.text}</div>
                </div>
              )
            )}
            {loading && (
              <div className="nu-ai-row">
                <div className="nu-ai-av">🥦</div>
                <div className="nu-ai-bub">
                  <div className="nu-typing"><span/><span/><span/></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="nu-starters">
            {STARTERS.map(s => (
              <button key={s} className="nu-start-btn" onClick={() => send(s)}>{s}</button>
            ))}
          </div>

          <div className="nu-chat-inp-row">
            <input className="nu-chat-inp" placeholder="Ask NutriBot anything…"
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()} />
            <button className="nu-send-btn" onClick={() => send()} disabled={loading}>
              {loading ? "…" : "↑"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem("token"); navigate("/"); };

  return (
    <div className="nu-page">
      <Sidebar onLogout={logout} />

      <div className="nu-main">

        {/* NAVBAR */}
        <nav className="nu-navbar">
          <div className="nu-navbar-brand">
            <div className="nu-navbar-icon">🥗</div>
            <span className="nu-navbar-name">NutriTrack</span>
          </div>
          <div className="nu-navbar-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#process">How it Works</a>
            <a href="#pricing">Pricing</a>
          </div>
          <Link to="/dashboard" className="nu-btn nu-btn-green">Dashboard →</Link>
        </nav>

        {/* HERO */}
        <section className="nu-hero">
          <div className="nu-orb nu-orb-1" />
          <div className="nu-orb nu-orb-2" />

          <div className="nu-hero-grid">
            <div className="nu-hero-content">
              <div className="nu-pill">🥗 Your Personal Nutrition AI</div>
              <h1 className="nu-h1">
                Fuel Smarter.<br />
                <span className="nu-grad-text">Live Better.</span>
              </h1>
              <p className="nu-hero-sub">
                NutriTrack combines intelligent meal tracking, AI coaching, and real-time analytics
                to help you reach your health goals — faster, smarter, sustainably.
              </p>
              <div className="nu-hero-btns">
                <Link to="/dashboard" className="nu-btn nu-btn-green nu-btn-lg">Go to Dashboard →</Link>
                <a href="#features" className="nu-btn nu-btn-ghost nu-btn-lg">Explore Features</a>
              </div>
              <div className="nu-hero-stats">
                {[["50K+","Active Users"],["1M+","Meals Logged"],["98%","Success Rate"]].map(([v,l]) => (
                  <div key={l} className="nu-hero-stat">
                    <div className="nu-hero-stat-val">{v}</div>
                    <div className="nu-hero-stat-label">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="nu-hero-visual">
              <div className="nu-hero-emoji">🥗</div>
              {[
                { label:"🔥 Calories",  val:"1,800 kcal",       cls:"nu-float-card nu-fc-1" },
                { label:"💪 Protein",   val:"120g — Goal met!", cls:"nu-float-card nu-fc-2" },
                { label:"⚡ Streak",    val:"14 days 🔥",       cls:"nu-float-card nu-fc-3" },
              ].map((c,i) => (
                <div key={i} className={c.cls}>
                  <div className="nu-fc-label">{c.label}</div>
                  <div className="nu-fc-val">{c.val}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="nu-stats-bar">
          {[["50K+","Happy Users"],["1M+","Meals Logged"],["98%","Goal Success Rate"]].map(([v,l]) => (
            <div key={l} className="nu-stat-item">
              <div className="nu-stat-val">{v}</div>
              <div className="nu-stat-label">{l}</div>
            </div>
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
              { icon:"📊", title:"Smart Dashboard",    desc:"Real-time macros, calories, and daily insights visualized beautifully." },
              { icon:"🎯", title:"Diet Goal Tracking", desc:"Set personalized targets and stay on track with smart daily reminders." },
              { icon:"🍽️", title:"Meal Logging",       desc:"Log any meal in seconds using our extensive food database." },
              { icon:"📖", title:"Recipe Library",     desc:"Hundreds of nutritionist-approved recipes tailored to your goals." },
              { icon:"💪", title:"Exercise Tracker",   desc:"Log workouts and sync them with your daily calorie balance." },
              { icon:"🤖", title:"AI NutriBot",        desc:"Ask anything — meal ideas, macro breakdowns, or just motivation." },
            ].map((f,i) => (
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
              <p className="nu-about-text">
                NutriTrack was built by a passionate team of nutritionists, engineers, and health enthusiasts
                who believed eating well shouldn't be complicated. We set out to create the most intuitive
                nutrition tracker — powered by real science and cutting-edge AI.
              </p>
              <p className="nu-about-text">
                Today, thousands of people use NutriTrack to understand their bodies, make smarter food
                choices, and live healthier lives — one meal at a time.
              </p>
              <div className="nu-tags">
                {[["🧬","Science-backed"],["🔒","Privacy-first"],["🌍","Global community"],["💚","Health-obsessed"]].map(([icon,label]) => (
                  <div key={label} className="nu-tag">{icon} {label}</div>
                ))}
              </div>
            </div>
            <div className="nu-about-cards">
              {[
                { icon:"🥗", title:"50K+ Users",       sub:"and growing" },
                { icon:"🔥", title:"1M+ Meals",        sub:"tracked & analyzed" },
                { icon:"🏆", title:"98% Satisfaction", sub:"from our community" },
                { icon:"🤖", title:"AI-Powered",       sub:"nutrition coaching" },
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
              { num:"01", icon:"🎯", title:"Set Your Goals",  desc:"Tell us your target weight, calories, and macros. We handle all the math." },
              { num:"02", icon:"🍽️", title:"Log Your Meals",  desc:"Quickly add every meal with our smart food search and custom entries." },
              { num:"03", icon:"📊", title:"Track Progress",  desc:"Watch real-time dashboards update as you hit your daily targets." },
              { num:"04", icon:"🚀", title:"Achieve Results", desc:"Follow AI-powered suggestions and reach your goals faster than ever." },
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
              { name:"Sarah K.",  role:"Lost 18 lbs in 3 months", avatar:"👩‍🦰", text:"NutriBot is like having a nutritionist in my pocket. The AI advice is incredibly accurate and keeps me motivated every single day!" },
              { name:"James T.",  role:"Marathon runner",          avatar:"🧔",  text:"The macro tracking is spot on. I PR'd my last marathon after dialing in my nutrition with NutriTrack — total game changer." },
              { name:"Priya M.",  role:"Vegetarian athlete",       avatar:"👩‍🦱", text:"Finally an app that truly understands plant-based diets. The recipe library is absolutely amazing. Highly recommend!" },
            ].map(t => (
              <div key={t.name} className="nu-card">
                <div className="nu-stars">★★★★★</div>
                <p className="nu-testi-text">"{t.text}"</p>
                <div className="nu-testi-author">
                  <div className="nu-testi-avatar">{t.avatar}</div>
                  <div>
                    <div className="nu-testi-name">{t.name}</div>
                    <div className="nu-testi-role">{t.role}</div>
                  </div>
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
              { name:"Free",  price:"$0",  period:"/mo", highlight:false,
                features:["Basic meal logging","3 recipes/day","Calorie tracking","Community access"], cta:"Get Started" },
              { name:"Pro",   price:"$9",  period:"/mo", highlight:true,
                features:["Unlimited logging","AI NutriBot access","Advanced analytics","Custom meal plans","Priority support"], cta:"Start Free Trial" },
              { name:"Elite", price:"$19", period:"/mo", highlight:false,
                features:["Everything in Pro","Personal dietitian chat","DNA-based suggestions","Family accounts (5)","White-glove onboarding"], cta:"Go Elite" },
            ].map(plan => (
              <div key={plan.name} className={`nu-card nu-price-card ${plan.highlight ? "nu-price-popular" : ""}`}>
                {plan.highlight && <div className="nu-price-badge">⭐ Most Popular</div>}
                <h3 className="nu-price-name">{plan.name}</h3>
                <div className="nu-price-amount">
                  <span className={`nu-price-val ${plan.highlight ? "nu-price-val-green" : ""}`}>{plan.price}</span>
                  <span className="nu-price-period">{plan.period}</span>
                </div>
                <ul className="nu-price-features">
                  {plan.features.map(f => (
                    <li key={f}><span className="nu-check">✓</span>{f}</li>
                  ))}
                </ul>
                <button className={`nu-btn nu-price-btn ${plan.highlight ? "nu-btn-green" : "nu-btn-ghost"}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <div className="nu-cta-block">
          <div className="nu-cta-orb" />
          <div className="nu-pill">🚀 Get Started Today</div>
          <h2 className="nu-h2">Ready to transform your health?</h2>
          <p className="nu-sub">Join 50,000+ people already crushing their nutrition goals with NutriTrack.</p>
          <Link to="/dashboard" className="nu-btn nu-btn-green nu-btn-lg" style={{ marginTop: 32 }}>
            Open Dashboard →
          </Link>
        </div>

        {/* FOOTER */}
        <footer className="nu-footer">
          <div className="nu-footer-brand">
            <div className="nu-footer-icon">🥗</div>
            <span className="nu-footer-name">NutriTrack</span>
          </div>
          <span className="nu-footer-copy">© 2025 NutriTrack — Built for your health</span>
          <span className="nu-footer-copy">Made with 💚</span>
        </footer>
      </div>

      <ChatBot />
    </div>
  );
}