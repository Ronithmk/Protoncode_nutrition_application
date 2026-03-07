import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#080c14; --bg2:#0d1220; --bg3:#111827;
    --surface:#131d2e; --surface2:#1a2640;
    --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
    --text:#e8edf5; --muted:#7a8ba3;
    --accent:#00e5a0; --accent2:#00b8ff;
    --amber:#f59e0b; --rose:#f43f5e; --violet:#8b5cf6;
    --sidebar-w:240px; --radius:16px; --shadow:0 8px 32px rgba(0,0,0,0.4);
  }
  html,body{height:100%;background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;}
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:var(--bg2)} ::-webkit-scrollbar-thumb{background:var(--surface2);border-radius:99px}

  .sidebar{position:fixed;top:0;left:0;bottom:0;width:var(--sidebar-w);background:linear-gradient(180deg,#0b1220 0%,#080c14 100%);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:28px 16px 24px;z-index:100;}
  .sidebar::after{content:'';position:absolute;top:0;right:0;bottom:0;width:1px;background:linear-gradient(180deg,transparent,var(--accent) 40%,var(--accent2) 60%,transparent);opacity:0.3;}
  .sidebar-logo{display:flex;align-items:center;gap:12px;padding:0 8px 28px;border-bottom:1px solid var(--border);margin-bottom:20px;}
  .sidebar-logo-icon{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#00e5a0,#00b8ff);display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 0 20px rgba(0,229,160,0.3);animation:logoPulse 3s ease-in-out infinite;}
  @keyframes logoPulse{0%,100%{box-shadow:0 0 20px rgba(0,229,160,0.3);}50%{box-shadow:0 0 35px rgba(0,229,160,0.6),0 0 60px rgba(0,184,255,0.2);}}
  .sidebar-logo-text{font-family:'Clash Display',sans-serif;font-size:20px;font-weight:700;background:linear-gradient(90deg,#00e5a0,#00b8ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.5px;}
  .sidebar-nav-label{font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--muted);padding:0 10px 10px;margin-top:4px;}
  .sidebar ul{list-style:none;display:flex;flex-direction:column;gap:4px;flex:1;}
  .sidebar ul a{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:12px;color:var(--muted);text-decoration:none;font-size:14px;font-weight:500;transition:all 0.2s ease;position:relative;overflow:hidden;}
  .sidebar ul a::before{content:'';position:absolute;inset:0;border-radius:12px;background:linear-gradient(90deg,rgba(0,229,160,0.08),rgba(0,184,255,0.08));opacity:0;transition:opacity 0.2s;}
  .sidebar ul a:hover{color:var(--text);} .sidebar ul a:hover::before{opacity:1;}
  .sidebar ul a.active{color:var(--accent);background:rgba(0,229,160,0.08);border:1px solid rgba(0,229,160,0.2);}
  .sidebar ul a.active::after{content:'';position:absolute;right:0;top:50%;transform:translateY(-50%);width:3px;height:60%;background:var(--accent);border-radius:3px 0 0 3px;}
  .nav-icon{font-size:18px;width:24px;text-align:center;}
  .sidebar-divider{height:1px;background:var(--border);margin:16px 0;}
  .logout-btn{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:12px;background:transparent;border:1px solid var(--border);color:var(--muted);cursor:pointer;font-size:14px;font-weight:500;transition:all 0.2s;font-family:'DM Sans',sans-serif;width:100%;}
  .logout-btn:hover{border-color:var(--rose);color:var(--rose);background:rgba(244,63,94,0.05);}

  .dashboard{display:flex;min-height:100vh;background:var(--bg);}
  .main{margin-left:var(--sidebar-w);flex:1;padding:32px 36px;display:flex;flex-direction:column;gap:28px;overflow-x:hidden;animation:fadeIn 0.5s ease;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}

  .header{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;}
  .header h1{font-family:'Clash Display',sans-serif;font-size:34px;font-weight:700;letter-spacing:-1px;background:linear-gradient(135deg,#e8edf5 0%,#7a8ba3 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.1;}
  .header-sub{font-size:14px;color:var(--muted);margin-top:4px;}
  .header-right{display:flex;align-items:center;gap:12px;}
  .header-badge{display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:99px;background:var(--surface);border:1px solid var(--border2);font-size:13px;font-weight:500;color:var(--text);}
  .header-badge .dot{width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent);animation:pulse 2s infinite;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
  .header-date{font-size:13px;color:var(--muted);padding:8px 14px;border-radius:99px;border:1px solid var(--border);}

  .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
  .stat-card{position:relative;overflow:hidden;padding:22px;border-radius:var(--radius);background:var(--surface);border:1px solid var(--border);transition:transform 0.3s ease,box-shadow 0.3s ease;cursor:default;animation:cardIn 0.5s ease backwards;}
  .stat-card:nth-child(1){animation-delay:0.05s;} .stat-card:nth-child(2){animation-delay:0.10s;} .stat-card:nth-child(3){animation-delay:0.15s;} .stat-card:nth-child(4){animation-delay:0.20s;}
  @keyframes cardIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:none;}}
  .stat-card:hover{transform:translateY(-4px);box-shadow:var(--shadow);}
  .stat-card::before{content:'';position:absolute;top:-40px;right:-40px;width:120px;height:120px;border-radius:50%;opacity:0.06;transition:opacity 0.3s;}
  .stat-card:hover::before{opacity:0.12;}
  .stat-card.green::before{background:var(--accent);} .stat-card.blue::before{background:var(--accent2);} .stat-card.amber::before{background:var(--amber);} .stat-card.rose::before{background:var(--rose);}
  .stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
  .stat-icon-wrap{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;background:rgba(255,255,255,0.05);}
  .stat-card.green .stat-icon-wrap{background:rgba(0,229,160,0.1);} .stat-card.blue .stat-icon-wrap{background:rgba(0,184,255,0.1);} .stat-card.amber .stat-icon-wrap{background:rgba(245,158,11,0.1);} .stat-card.rose .stat-icon-wrap{background:rgba(244,63,94,0.1);}
  .stat-trend{font-size:11px;font-weight:600;padding:3px 8px;border-radius:99px;background:rgba(0,229,160,0.1);color:var(--accent);}
  .stat-trend.down{background:rgba(244,63,94,0.1);color:var(--rose);}
  .stat-label{font-size:12px;color:var(--muted);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;}
  .stat-value{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:var(--text);line-height:1.1;margin:4px 0 2px;letter-spacing:-1px;}
  .stat-unit{font-size:14px;font-weight:400;color:var(--muted);}
  .stat-sub{font-size:12px;color:var(--muted);margin-top:2px;}
  .progress-bar-wrap{margin-top:14px;height:4px;border-radius:99px;background:rgba(255,255,255,0.06);overflow:hidden;}
  .progress-bar-fill{height:100%;border-radius:99px;transition:width 1.2s cubic-bezier(0.4,0,0.2,1);}
  .green .progress-bar-fill{background:linear-gradient(90deg,var(--accent),#00ff88);} .blue .progress-bar-fill{background:linear-gradient(90deg,var(--accent2),#0088ff);} .amber .progress-bar-fill{background:linear-gradient(90deg,var(--amber),#fbbf24);} .rose .progress-bar-fill{background:linear-gradient(90deg,var(--rose),#fb7185);}

  .section-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
  .section-grid-3{display:grid;grid-template-columns:1.4fr 1fr;gap:20px;}

  .card{background:var(--surface);border-radius:var(--radius);border:1px solid var(--border);padding:24px;transition:border-color 0.2s;}
  .card:hover{border-color:var(--border2);}
  .card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
  .card-title{font-family:'Clash Display',sans-serif;font-size:18px;font-weight:600;color:var(--text);}
  .card-badge{font-size:11px;padding:4px 10px;border-radius:99px;border:1px solid var(--border2);color:var(--muted);}
  .card-link{font-size:12px;color:var(--accent);text-decoration:none;display:flex;align-items:center;gap:4px;transition:gap 0.2s;}
  .card-link:hover{gap:8px;}

  .meal-inputs{display:grid;grid-template-columns:1fr 1fr auto auto;gap:10px;align-items:end;}
  .input-group label{display:block;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:var(--muted);margin-bottom:6px;}
  .input{width:100%;padding:11px 14px;background:var(--bg2);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-size:14px;font-family:'DM Sans',sans-serif;transition:border-color 0.2s,box-shadow 0.2s;outline:none;}
  .input::placeholder{color:var(--muted);}
  .input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,229,160,0.1);}
  .input-select{padding:11px 14px;background:var(--bg2);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-size:14px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer;}
  .btn-primary{padding:11px 20px;border-radius:10px;background:linear-gradient(135deg,var(--accent),#00c8ff);color:#080c14;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;transition:transform 0.15s,box-shadow 0.15s;white-space:nowrap;box-shadow:0 4px 16px rgba(0,229,160,0.3);}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,229,160,0.4);}
  .btn-primary:active{transform:scale(0.97);}

  .meal-list-items{display:flex;flex-direction:column;gap:8px;}
  .meal-item{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:10px;background:var(--bg2);border:1px solid var(--border);transition:all 0.2s;animation:slideIn 0.3s ease backwards;}
  .meal-item:hover{border-color:var(--border2);transform:translateX(4px);}
  @keyframes slideIn{from{opacity:0;transform:translateX(-12px);}to{opacity:1;transform:none;}}
  .meal-item-left{display:flex;align-items:center;gap:12px;}
  .meal-dot{width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));flex-shrink:0;}
  .meal-item-name{font-size:14px;font-weight:500;color:var(--text);}
  .meal-protein-tag{font-size:12px;font-weight:600;padding:4px 10px;border-radius:99px;background:rgba(0,229,160,0.1);color:var(--accent);border:1px solid rgba(0,229,160,0.2);}
  .meal-delete{background:none;border:none;cursor:pointer;color:var(--muted);font-size:14px;padding:4px;border-radius:6px;transition:color 0.2s,background 0.2s;}
  .meal-delete:hover{color:var(--rose);background:rgba(244,63,94,0.1);}
  .empty-state{text-align:center;color:var(--muted);font-size:14px;padding:32px 0;border:2px dashed var(--border);border-radius:12px;line-height:1.8;}

  .chart-wrap{display:flex;align-items:flex-end;gap:8px;height:90px;margin-top:8px;}
  .chart-bar-group{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;}
  .chart-bar{width:100%;border-radius:6px 6px 0 0;background:var(--surface2);transition:all 0.3s ease;cursor:pointer;min-height:6px;}
  .chart-bar:hover{filter:brightness(1.3);}
  .chart-bar.active{background:linear-gradient(0deg,var(--accent),#00b8ff);box-shadow:0 0 12px rgba(0,229,160,0.3);}
  .chart-bar-label{font-size:11px;color:var(--muted);}

  .exercise-section{position:relative;overflow:hidden;}
  .exercise-bg{position:absolute;inset:0;border-radius:var(--radius);background:linear-gradient(135deg,#0d1a2e 0%,#0a1520 50%,#0d1a2e 100%);overflow:hidden;}
  .exercise-bg::before{content:'';position:absolute;top:-50%;right:-20%;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(0,229,160,0.07) 0%,transparent 70%);animation:breathe 4s ease-in-out infinite;}
  .exercise-bg::after{content:'';position:absolute;bottom:-50%;left:-20%;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(0,184,255,0.07) 0%,transparent 70%);animation:breathe 4s ease-in-out infinite reverse;}
  @keyframes breathe{0%,100%{transform:scale(1);}50%{transform:scale(1.15);}}
  .exercise-content{position:relative;z-index:1;padding:24px;}
  .exercise-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px;}
  .exercise-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px;transition:all 0.3s ease;cursor:pointer;position:relative;overflow:hidden;}
  .exercise-card::before{content:'';position:absolute;inset:0;opacity:0;background:linear-gradient(135deg,rgba(0,229,160,0.08),rgba(0,184,255,0.05));transition:opacity 0.3s;border-radius:14px;}
  .exercise-card:hover{transform:translateY(-4px) scale(1.02);border-color:rgba(0,229,160,0.25);}
  .exercise-card:hover::before{opacity:1;}
  .exercise-animation{width:56px;height:56px;border-radius:14px;background:rgba(255,255,255,0.06);margin-bottom:12px;display:flex;align-items:center;justify-content:center;font-size:28px;position:relative;}
  .anim-run{animation:runBounce 0.5s ease-in-out infinite alternate;}
  @keyframes runBounce{from{transform:translateY(0) rotate(-5deg);}to{transform:translateY(-4px) rotate(5deg);}}
  .anim-lift{animation:liftUp 1s ease-in-out infinite;}
  @keyframes liftUp{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px) scale(1.1);}}
  .anim-cycle{animation:spin 1.5s linear infinite;}
  @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  .anim-swim{animation:swim 1.2s ease-in-out infinite;}
  @keyframes swim{0%,100%{transform:translateX(0) rotate(0deg);}50%{transform:translateX(5px) rotate(10deg);}}
  .anim-yoga{animation:yogaStretch 2s ease-in-out infinite;}
  @keyframes yogaStretch{0%,100%{transform:scale(1) rotate(0);}50%{transform:scale(1.08) rotate(5deg);}}
  .anim-hiit{animation:hiitPop 0.4s ease-in-out infinite alternate;}
  @keyframes hiitPop{from{transform:scale(0.9);}to{transform:scale(1.1);}}
  .exercise-ring{position:absolute;top:4px;right:4px;width:16px;height:16px;border-radius:50%;border:2px solid transparent;}
  .ring-green{border-color:var(--accent);box-shadow:0 0 8px var(--accent);animation:ringPulse 1.5s infinite;}
  .ring-blue{border-color:var(--accent2);box-shadow:0 0 8px var(--accent2);animation:ringPulse 1.5s 0.3s infinite;}
  .ring-amber{border-color:var(--amber);}
  @keyframes ringPulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
  .exercise-name{font-size:14px;font-weight:600;color:var(--text);margin-bottom:4px;}
  .exercise-meta{font-size:12px;color:var(--muted);}
  .exercise-calories{margin-top:10px;font-size:13px;font-weight:700;color:var(--accent);display:flex;align-items:center;gap:4px;}

  .rings-wrap{display:flex;justify-content:center;margin:8px 0 16px;}
  .ring-svg{transform:rotate(-90deg);}
  .ring-track{fill:none;}
  .ring-progress{fill:none;stroke-linecap:round;transition:stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1);}
  .rings-legend{display:flex;flex-direction:column;gap:10px;margin-top:8px;}
  .ring-legend-item{display:flex;align-items:center;justify-content:space-between;}
  .ring-legend-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
  .ring-legend-label{font-size:13px;color:var(--muted);flex:1;margin-left:10px;}
  .ring-legend-val{font-size:13px;font-weight:600;color:var(--text);}

  .water-track{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;}
  .water-glass{width:36px;height:48px;border-radius:0 0 8px 8px;border:2px solid rgba(0,184,255,0.3);position:relative;cursor:pointer;overflow:hidden;transition:transform 0.2s;}
  .water-glass:hover{transform:scale(1.1);}
  .water-glass-fill{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(0deg,var(--accent2),rgba(0,184,255,0.5));transition:height 0.4s cubic-bezier(0.4,0,0.2,1);border-radius:0 0 6px 6px;}
  .water-glass.filled{border-color:var(--accent2);}
  .water-glass.filled .water-glass-fill{height:100%;}
  .water-label{font-size:13px;color:var(--muted);margin-top:10px;display:flex;justify-content:space-between;}
  .water-label span:last-child{color:var(--accent2);font-weight:600;}

  .mood-row{display:flex;gap:12px;margin-top:14px;justify-content:center;}
  .mood-btn{width:52px;height:52px;border-radius:50%;background:var(--bg2);border:2px solid var(--border);font-size:24px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;}
  .mood-btn:hover{transform:scale(1.15);border-color:var(--border2);}
  .mood-btn.selected{border-color:var(--accent);box-shadow:0 0 16px rgba(0,229,160,0.3);background:rgba(0,229,160,0.1);transform:scale(1.2);}

  .tips-list{display:flex;flex-direction:column;gap:10px;margin-top:12px;}
  .tip-item{display:flex;gap:12px;padding:12px;background:var(--bg2);border-radius:10px;border-left:3px solid var(--accent);font-size:13px;color:var(--muted);line-height:1.5;transition:transform 0.2s;}
  .tip-item:hover{transform:translateX(4px);}
  .tip-item:nth-child(2){border-left-color:var(--accent2);}
  .tip-item:nth-child(3){border-left-color:var(--amber);}
  .tip-icon{font-size:18px;flex-shrink:0;}

  .streak-wrap{display:flex;align-items:center;gap:16px;margin-top:14px;}
  .streak-num{font-family:'Syne',sans-serif;font-size:48px;font-weight:800;background:linear-gradient(135deg,var(--amber),#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1;letter-spacing:-2px;}
  .streak-info{font-size:13px;color:var(--muted);}
  .streak-info strong{display:block;color:var(--text);font-size:15px;margin-bottom:2px;}
  .streak-days{display:flex;gap:6px;margin-top:14px;}
  .streak-day{flex:1;height:6px;border-radius:99px;background:var(--surface2);transition:background 0.3s;}
  .streak-day.done{background:linear-gradient(90deg,var(--amber),#f97316);}
  .streak-day.today{background:linear-gradient(90deg,var(--accent),var(--accent2));animation:todayPulse 1.5s infinite;}
  @keyframes todayPulse{0%,100%{opacity:1;}50%{opacity:0.5;}}

  .toast-wrap{position:fixed;top:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;}
  .toast{padding:14px 20px;border-radius:12px;background:var(--surface2);border:1px solid var(--border2);box-shadow:var(--shadow);display:flex;align-items:center;gap:10px;font-size:14px;color:var(--text);animation:toastIn 0.3s ease,toastOut 0.3s ease 2.7s forwards;max-width:300px;}
  @keyframes toastIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:none;}}
  @keyframes toastOut{to{opacity:0;transform:translateX(20px);}}

  @media(max-width:1100px){.cards{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:900px){.section-grid,.section-grid-3{grid-template-columns:1fr}}
  @media(max-width:700px){.exercise-grid{grid-template-columns:1fr 1fr}.meal-inputs{grid-template-columns:1fr 1fr}}
  @media(max-width:640px){.cards{grid-template-columns:1fr}.exercise-grid{grid-template-columns:1fr}}
`;

function CircleRing({ r, color, pct, strokeWidth = 8 }) {
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return <circle className="ring-progress" cx={60} cy={60} r={r} stroke={color} strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset} />;
}

const NAV = [
  { to: "/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/diet-goals", icon: "🎯", label: "Diet Goals" },
  { to: "/meals",      icon: "🍽️", label: "Meals" },
  { to: "/recipes",    icon: "📖", label: "Recipes" },
  { to: "/exercise",   icon: "💪", label: "Exercise" },
];

const EXERCISES = [
  { name: "Morning Run",    emoji: "🏃", animClass: "anim-run",   cal: 320, dur: "30 min", ring: "ring-green", tag: "Cardio" },
  { name: "Weight Lifting", emoji: "🏋️", animClass: "anim-lift",  cal: 280, dur: "45 min", ring: "ring-blue",  tag: "Strength" },
  { name: "Cycling",        emoji: "🚴", animClass: "anim-cycle", cal: 410, dur: "60 min", ring: "",           tag: "Cardio" },
  { name: "Swimming",       emoji: "🏊", animClass: "anim-swim",  cal: 350, dur: "40 min", ring: "ring-green", tag: "Full Body" },
  { name: "Yoga Flow",      emoji: "🧘", animClass: "anim-yoga",  cal: 160, dur: "50 min", ring: "ring-amber", tag: "Flexibility" },
  { name: "HIIT Blast",     emoji: "⚡", animClass: "anim-hiit",  cal: 450, dur: "25 min", ring: "ring-blue",  tag: "Intense" },
];

const WEEKLY = [
  { day: "M", kcal: 1750 }, { day: "T", kcal: 1900 }, { day: "W", kcal: 1600 },
  { day: "T", kcal: 2100 }, { day: "F", kcal: 1800 }, { day: "S", kcal: 1550 },
  { day: "S", kcal: 1800, active: true },
];

const TIPS = [
  { icon: "💧", text: "Drink water 30 min before meals to reduce appetite by up to 22%." },
  { icon: "🕐", text: "Eating at consistent times helps regulate your body's hunger hormones." },
  { icon: "🥦", text: "Add one extra serving of vegetables to double your fiber intake today." },
];

function Sidebar({ onLogout }) {
  const { pathname } = useLocation();
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🥗</div>
        <span className="sidebar-logo-text">NutriTrack</span>
      </div>
      <p className="sidebar-nav-label">Menu</p>
      <ul>
        {NAV.map((n) => (
          <li key={n.to}><Link to={n.to} className={pathname === n.to ? "active" : ""}><span className="nav-icon">{n.icon}</span>{n.label}</Link></li>
        ))}
      </ul>
      <div className="sidebar-divider" />
      <button className="logout-btn" onClick={onLogout}><span>🚪</span> Logout</button>
    </div>
  );
}

function Dashboard() {
  const [user,     setUser]     = useState("User");
  const [food,     setFood]     = useState("");
  const [protein,  setProtein]  = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [meals,    setMeals]    = useState([]);
  const [water,    setWater]    = useState(4);
  const [mood,     setMood]     = useState(null);
  const [toast,    setToast]    = useState(null);
  const [animate,  setAnimate]  = useState(false);
  const navigate = useNavigate();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (!token) { navigate("/welcome"); return; }
    if (token.startsWith("demo_")) {
      try { const p = JSON.parse(savedUser); setUser(p.name || p.email || "User"); } catch { navigate("/welcome"); }
      return;
    }
    import("../api/axios").then(({ default: API }) => {
      API.get("/profile").then((res) => setUser(res.data.user)).catch(() => { localStorage.removeItem("token"); navigate("/welcome"); });
    });
  }, []);

  useEffect(() => { setTimeout(() => setAnimate(true), 100); }, []);

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); };

  const addMeal = () => {
    if (!food || !protein) return;
    setMeals((prev) => [{ food, protein: Number(protein), calories: Number(calories) || 0, mealType, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...prev]);
    setFood(""); setProtein(""); setCalories("");
    showToast(`✅ ${food} added to ${mealType}!`);
  };

  const deleteMeal = (i) => setMeals((prev) => prev.filter((_, idx) => idx !== i));

  const totalProtein  = meals.reduce((s, m) => s + m.protein, 0);
  const totalCalMeals = meals.reduce((s, m) => s + m.calories, 0);

  const stats = [
    { label: "Calories", value: (1800 + totalCalMeals).toLocaleString(), unit: "kcal", icon: "🔥", cls: "green", pct: Math.min(((1800+totalCalMeals)/2200)*100,100), trend: "+4%",  sub: "Goal: 2,200 kcal" },
    { label: "Protein",  value: totalProtein || 120, unit: "g",    icon: "💪", cls: "blue",  pct: Math.min(((totalProtein||120)/150)*100,100), trend: "+12%", sub: "Goal: 150g" },
    { label: "Carbs",    value: "200", unit: "g",    icon: "🌾", cls: "amber", pct: 55, trend: "-2%",  sub: "Goal: 250g", trendDown: true },
    { label: "Fat",      value: "60",  unit: "g",    icon: "🥑", cls: "rose",  pct: 40, trend: "±0%", sub: "Goal: 70g" },
  ];

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <>
      <style>{STYLES}</style>
      {toast && <div className="toast-wrap"><div className="toast">{toast}</div></div>}
      <div className="dashboard">
        <Sidebar onLogout={logout} />
        <div className="main">

          <div className="header">
            <div>
              <h1>Dashboard</h1>
              <p className="header-sub">Here's your nutrition summary for today</p>
            </div>
            <div className="header-right">
              <span className="header-date">📅 {today}</span>
              {user && <span className="header-badge"><span className="dot" />👋 {user}</span>}
            </div>
          </div>

          <div className="cards">
            {stats.map((s) => (
              <div key={s.label} className={`stat-card ${s.cls}`}>
                <div className="stat-top">
                  <div className="stat-icon-wrap">{s.icon}</div>
                  <span className={`stat-trend ${s.trendDown ? "down" : ""}`}>{s.trend}</span>
                </div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value} <span className="stat-unit">{s.unit}</span></div>
                <div className="stat-sub">{s.sub}</div>
                <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{ width: animate ? `${s.pct}%` : "0%" }} /></div>
              </div>
            ))}
          </div>

          <div className="section-grid">
            <div className="card">
              <div className="card-header"><span className="card-title">Weekly Calories</span><span className="card-badge">This Week</span></div>
              <div className="chart-wrap">
                {WEEKLY.map((d, i) => {
                  const h = animate ? Math.round((d.kcal / 2200) * 82) : 0;
                  return (
                    <div key={i} className="chart-bar-group">
                      <div className={`chart-bar ${d.active ? "active" : ""}`} style={{ height: `${h}px`, transitionDelay: `${i * 0.06}s` }} title={`${d.kcal} kcal`} />
                      <span className="chart-bar-label">{d.day}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:10 }}>
                <span style={{ fontSize:12, color:"var(--muted)" }}>Avg: 1,786 kcal/day</span>
                <span style={{ fontSize:12, color:"var(--accent)", fontWeight:600 }}>Goal: 2,200</span>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Activity Rings</span><span className="card-badge">Today</span></div>
              <div className="rings-wrap">
                <svg className="ring-svg" width={120} height={120} viewBox="0 0 120 120">
                  <circle className="ring-track" cx={60} cy={60} r={48} stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
                  <circle className="ring-track" cx={60} cy={60} r={37} stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
                  <circle className="ring-track" cx={60} cy={60} r={26} stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
                  {animate && <><CircleRing r={48} color="#00e5a0" pct={72} /><CircleRing r={37} color="#00b8ff" pct={55} /><CircleRing r={26} color="#f59e0b" pct={85} /></>}
                </svg>
              </div>
              <div className="rings-legend">
                {[{ color:"#00e5a0", label:"Move", val:"1,296 / 1,800 cal" }, { color:"#00b8ff", label:"Exercise", val:"28 / 30 min" }, { color:"#f59e0b", label:"Stand", val:"10 / 12 hrs" }].map((r) => (
                  <div key={r.label} className="ring-legend-item">
                    <div className="ring-legend-dot" style={{ background: r.color }} />
                    <span className="ring-legend-label">{r.label}</span>
                    <span className="ring-legend-val">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card exercise-section">
            <div className="exercise-bg" />
            <div className="exercise-content">
              <div className="card-header" style={{ marginBottom: 0 }}>
                <span className="card-title">💪 Exercise Library</span>
                <Link to="/exercise" className="card-link">View all →</Link>
              </div>
              <p style={{ fontSize:13, color:"var(--muted)", marginTop:4 }}>Tap any workout to log your activity</p>
              <div className="exercise-grid">
                {EXERCISES.map((ex, i) => (
                  <div key={i} className="exercise-card" style={{ animationDelay:`${i*0.07}s` }} onClick={() => showToast(`💪 ${ex.name} logged! +${ex.cal} kcal`)}>
                    <div className="exercise-animation">
                      <span className={ex.animClass}>{ex.emoji}</span>
                      {ex.ring && <div className={`exercise-ring ${ex.ring}`} />}
                    </div>
                    <div className="exercise-name">{ex.name}</div>
                    <div className="exercise-meta">{ex.dur} · {ex.tag}</div>
                    <div className="exercise-calories">🔥 {ex.cal} kcal</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="section-grid-3">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Log a Meal</span>
                <select className="input-select" value={mealType} onChange={e => setMealType(e.target.value)}>
                  {["Breakfast","Lunch","Dinner","Snack"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="meal-inputs">
                <div className="input-group"><label>Food Item</label><input className="input" type="text" placeholder="e.g. Grilled Chicken" value={food} onChange={e => setFood(e.target.value)} onKeyDown={e => e.key === "Enter" && addMeal()} /></div>
                <div className="input-group"><label>Protein (g)</label><input className="input" type="number" placeholder="30" value={protein} onChange={e => setProtein(e.target.value)} onKeyDown={e => e.key === "Enter" && addMeal()} /></div>
                <div className="input-group"><label>Calories</label><input className="input" type="number" placeholder="250" value={calories} onChange={e => setCalories(e.target.value)} onKeyDown={e => e.key === "Enter" && addMeal()} /></div>
                <div className="input-group" style={{ display:"flex", flexDirection:"column", justifyContent:"flex-end" }}><button className="btn-primary" onClick={addMeal} style={{ width:"100%" }}>+ Add</button></div>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">🔥 Streak</span><span className="card-badge">Personal best: 21d</span></div>
              <div className="streak-wrap"><span className="streak-num">7</span><div className="streak-info"><strong>Days in a row!</strong>Keep it up — you're on fire</div></div>
              <div className="streak-days">{["M","T","W","T","F","S","S"].map((d, i) => <div key={i} className={`streak-day ${i < 6 ? "done" : "today"}`} title={d} />)}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Today's Meals</span>
              {meals.length > 0 && <span className="card-badge">{meals.length} logged · {totalProtein}g protein</span>}
            </div>
            <div className="meal-list-items">
              {meals.length === 0 ? (
                <div className="empty-state">🍽️ No meals logged yet.<br /><span style={{ fontSize:12, marginTop:4, display:"block" }}>Add your first one above!</span></div>
              ) : meals.map((meal, i) => (
                <div key={i} className="meal-item" style={{ animationDelay:`${i*0.05}s` }}>
                  <div className="meal-item-left"><div className="meal-dot" /><div><div className="meal-item-name">{meal.food}</div><div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{meal.mealType} · {meal.time}</div></div></div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {meal.calories > 0 && <span style={{ fontSize:12, color:"var(--muted)" }}>{meal.calories} kcal</span>}
                    <span className="meal-protein-tag">{meal.protein}g protein</span>
                    <button className="meal-delete" onClick={() => deleteMeal(i)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-grid">
            <div className="card">
              <div className="card-header"><span className="card-title">💧 Water Intake</span><span className="card-badge">Goal: 8 glasses</span></div>
              <div className="water-track">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className={`water-glass ${i < water ? "filled" : ""}`} onClick={() => { setWater(i < water ? i : i + 1); showToast(i < water ? "💧 Removed a glass" : "💧 Stay hydrated!"); }} title={`Glass ${i+1}`}>
                    <div className="water-glass-fill" style={{ height: i < water ? "100%" : "0%" }} />
                  </div>
                ))}
              </div>
              <div className="water-label"><span>{water * 250}ml consumed</span><span>{water}/8 glasses</span></div>
              <div className="progress-bar-wrap" style={{ marginTop:10 }}>
                <div className="progress-bar-fill" style={{ width: animate ? `${(water/8)*100}%` : "0%", background:"linear-gradient(90deg,var(--accent2),#0088ff)", transition:"width 0.5s ease" }} />
              </div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">😊 How are you feeling?</span></div>
              <div className="mood-row">
                {["😫","😕","😐","🙂","😄"].map((m) => (
                  <button key={m} className={`mood-btn ${mood === m ? "selected" : ""}`} onClick={() => { setMood(m); showToast(`Mood logged: ${m}`); }}>{m}</button>
                ))}
              </div>
              <p style={{ fontSize:12, color:"var(--muted)", textAlign:"center", marginTop:14 }}>
                {mood ? `You're feeling ${["terrible","bad","okay","good","great"][["😫","😕","😐","🙂","😄"].indexOf(mood)]} today` : "Tap to log your mood"}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">💡 Nutrition Tips</span><span className="card-badge">Daily picks</span></div>
            <div className="tips-list">
              {TIPS.map((t, i) => <div key={i} className="tip-item"><span className="tip-icon">{t.icon}</span><span>{t.text}</span></div>)}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;
