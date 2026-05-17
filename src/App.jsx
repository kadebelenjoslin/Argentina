import { useState, useEffect, useRef, useCallback } from "react";

function getStoredKey() {
  try { return localStorage.getItem("sp-api-key") || ""; } catch { return ""; }
}

function ApiKeyGate({ onKey }) {
  const [val, setVal] = useState("");
  const [error, setError] = useState("");
  const [testing, setTesting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const key = val.trim();
    if (!key.startsWith("sk-ant-")) { setError("That doesn't look right — Anthropic keys start with sk-ant-"); return; }
    setTesting(true);
    setError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 10, messages: [{ role: "user", content: "hi" }] }),
      });
      if (!res.ok) { setError("Key didn't work — double-check it and try again."); return; }
      localStorage.setItem("sp-api-key", key);
      onKey(key);
    } catch { setError("Network error — check your connection."); }
    finally { setTesting(false); }
  }

  return (
    <div style={{ fontFamily: "Georgia, serif", minHeight: "100dvh", background: "#fafaf7", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        <div style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>🇦🇷</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 6, color: "#1a1a1a" }}>Argentine Spanish Practice</h1>
        <p style={{ fontSize: 14, color: "#888", textAlign: "center", marginBottom: 28, lineHeight: 1.6 }}>
          To get started, paste your Anthropic API key below.<br />
          It stays on your device — never sent anywhere else.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={val}
            onChange={e => setVal(e.target.value)}
            placeholder="sk-ant-..."
            autoComplete="off"
            style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1.5px solid #d8d8d0", fontSize: 16, fontFamily: "monospace", outline: "none", boxSizing: "border-box", marginBottom: 10, background: "#fff", color: "#1a1a1a" }}
          />
          {error && <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>{error}</div>}
          <button type="submit" disabled={!val.trim() || testing}
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: val.trim() && !testing ? "#1a1a1a" : "#e8e8e0", color: val.trim() && !testing ? "#fff" : "#aaa", fontSize: 16, fontWeight: 600, cursor: val.trim() && !testing ? "pointer" : "not-allowed", transition: "background 0.2s" }}>
            {testing ? "Checking..." : "Let's go →"}
          </button>
        </form>
        <p style={{ fontSize: 12, color: "#bbb", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
          Get a key at <strong>console.anthropic.com</strong>
        </p>
      </div>
    </div>
  );
}

const SPEAKERS = {
  friend: {
    id: "friend", emoji: "😎", name: "Gastón", role: "Best Friend",
    bg: "#1a1a1a", accent: "#4ade80",
    bio: "Your 27-year-old porteño best mate. Obsessed with Boca Juniors, asado, and taking the piss. Uses boludo constantly with friends.",
    system: `Sos Gastón, el mejor amigo porteño del usuario, 27 años. Sos re copado, canchero, siempre de joda. Hablás con todo el vocabulario rioplatense: "vos", "che", "boludo" (afectuoso), "re", "dale", "fiaca", "bajón", "copado", "laburar", "guita", "chabón", "piola", "ni ahí", "ya fue", "a full". Te encanta el fútbol (Boca), el asado, el mate y salir a bailar. Hacés preguntas personales, contás anécdotas, te reís de todo.`
  },
  server: {
    id: "server", emoji: "☕", name: "Valentina", role: "Café Server",
    bg: "#78350f", accent: "#fbbf24",
    bio: "Friendly server at a Buenos Aires café. Polite but very Argentine. Great for practicing ordering, small talk, and everyday transactions.",
    system: `Sos Valentina, mozza de una confitería en Palermo, Buenos Aires. Sos amable y profesional pero muy argentina. Hablás de menú, pedidos, recomendaciones. Usás "vos" siempre. Ofrecés medialunas, café, mate cocido, facturas. Preguntás si quieren algo más, recomendás el especial del día.`
  },
  coworker: {
    id: "coworker", emoji: "💼", name: "Rodrigo", role: "Coworker",
    bg: "#1e3a5f", accent: "#60a5fa",
    bio: "Your Argentine office colleague. Professional but relaxed. Good for workplace vocab, meetings, and professional Argentine Spanish.",
    system: `Sos Rodrigo, compañero de trabajo en una oficina de Buenos Aires. Hablás un español argentino profesional pero relajado. Temas: reuniones, proyectos, el jefe, el laburo, el almuerzo, el after office. Usás "vos", "che" ocasionalmente. Quejás del tráfico y de las reuniones innecesarias.`
  },
  child: {
    id: "child", emoji: "🧒", name: "Sofía", role: "Neighbor's Kid",
    bg: "#4c1d95", accent: "#c4b5fd",
    bio: "The 9-year-old kid from next door. Simple vocabulary, curious, talks about school and games. Great for building confidence.",
    system: `Sos Sofía, una nena de 9 años del barrio en Buenos Aires. Hablás simple y directo. Preguntás cosas de la escuela, de juegos, de la tele. Sos curiosa y simpática. No entendés palabras difíciles y preguntás qué significan.`
  },
  lover: {
    id: "lover", emoji: "💕", name: "Camilo", role: "Romantic Interest",
    bg: "#881337", accent: "#fb7185",
    bio: "A romantic connection from Buenos Aires. Warm, affectionate, a little playful. Great for emotional vocabulary and terms of endearment.",
    system: `Sos Camilo, un chico porteño de 26 años con quien el usuario tiene una conexión romántica. Sos cariñoso, dulce y un poco pícaro. Usás "amor", "mi vida", "corazón", "che" con cariño. Hablás de planes juntos, de sentimientos, de salidas. Sos directo como todo argentino. Flirteás con elegancia y calidez. Preguntás por el día del usuario, por sus planes, expresás sentimientos genuinos.`
  },
  enemy: {
    id: "enemy", emoji: "😤", name: "Diego", role: "Rival / Enemy",
    bg: "#7f1d1d", accent: "#f87171",
    bio: "A competitive rival who doesn't like you much. Confrontational Argentine slang and sarcasm. Advanced and very authentic.",
    system: `Sos Diego, el rival del usuario. Sos competitivo, sarcástico, y no le tenés simpatía. Usás sarcasmo, ironía y vocabulario confrontacional argentino. Desafiás todo lo que dice el usuario. Sos auténtico porteño en modo hostil.`
  },
};

const DIFFICULTY = {
  beginner: { label: "Beginner", desc: "Speak slowly, use simple words, correct gently" },
  intermediate: { label: "Intermediate", desc: "Normal speed, moderate corrections, introduce new slang" },
  advanced: { label: "Advanced", desc: "Full speed, heavy slang, minimal hand-holding" },
};

const TOPICS = {
  friend: ["¿Viste el partido?", "¿Salimos este finde?", "Tengo mucha fiaca hoy", "¿Qué hacés?"],
  server: ["Quiero un café, por favor", "¿Qué me recomendás?", "La cuenta, por favor", "¿Tienen medialunas?"],
  coworker: ["¿Cómo va el proyecto?", "¿Almorzamos juntos?", "Qué reunión más larga...", "¿Hablaste con el jefe?"],
  child: ["¿A qué jugamos?", "¿Cómo te fue en la escuela?", "¿Viste esa peli?", "Enseñame algo"],
  lover: ["Te extrañé hoy", "¿Qué hacemos el finde?", "¿Cómo estás?", "Quiero verte"],
  enemy: ["¿Qué mirás?", "Creés que sos mejor que yo", "Hablemos", "¿Tenés algún problema?"],
};

function buildSystem(speaker, difficulty) {
  const diff = DIFFICULTY[difficulty];
  return `${speaker.system}

DIFFICULTY: ${diff.label} — ${diff.desc}

CRITICAL: Respond ONLY with valid JSON, no markdown, no backticks, nothing else. Exact format:
{"response":"your in-character reply in Argentine Spanish","question":"a natural follow-up question you ask the user in Spanish","score":7,"grammar":"1 sentence English feedback on their grammar","vos":"1 sentence English feedback on vos/tú usage","slang":"1 sentence English note on Argentine slang used or missed","correction":"specific English correction if they made an error, or null if perfect","suggested":"a better version of exactly what the user said, rewritten in natural Argentine Spanish — keep their meaning but fix grammar and make it sound native. If their message was already perfect, return null.","new_word":{"word":"one new Argentine word or phrase to teach them","meaning":"English meaning","example":"example sentence using it"}}

Score 1-10 based on grammar accuracy, use of vos (not tú), and Argentine vocabulary authenticity. If they write in English give score 2 but still respond in Spanish.`;
}

function makeHeaders(key) {
  return { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" };
}

async function fetchClaude(system, userText, history, key) {
  const messages = [...history, { role: "user", content: userText }];
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: makeHeaders(key),
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1024, system, messages }),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw}`);
  const data = JSON.parse(raw);
  const content = data.content.map(b => b.text || "").join("");
  try { return { parsed: JSON.parse(content.replace(/```json|```/g, "").trim()), newHistory: [...messages, { role: "assistant", content }] }; }
  catch { return { parsed: { response: content, score: null }, newHistory: [...messages, { role: "assistant", content }] }; }
}

async function translateWord(word, sentence, key) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: makeHeaders(key),
    body: JSON.stringify({
      model: "claude-sonnet-4-6", max_tokens: 120,
      system: `You are a Spanish-English translator specializing in Argentine Rioplatense Spanish. Given a word and its sentence context, reply ONLY with a JSON object: {"translation":"English translation","note":"1 short note about Argentine usage if relevant, otherwise null"}. No markdown, no backticks.`,
      messages: [{ role: "user", content: `Word: "${word}"\nContext: "${sentence}"` }],
    }),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error("Translation failed");
  const data = JSON.parse(raw);
  const content = data.content.map(b => b.text || "").join("");
  return JSON.parse(content.replace(/```json|```/g, "").trim());
}

function useStorage(key, defaultVal) {
  const [val, setVal] = useState(() => {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : defaultVal; } catch { return defaultVal; }
  });
  function save(newVal) {
    setVal(newVal);
    try { localStorage.setItem(key, JSON.stringify(newVal)); } catch {}
  }
  return [val, save];
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

// ── Translation overlay (mobile: fixed bottom sheet, desktop: tooltip) ──
function TranslationOverlay({ word, tooltip, loading, onDismiss, isMobile, anchorRef }) {
  if (!word) return null;

  if (isMobile) {
    return (
      <div
        onClick={onDismiss}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
        }}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "#1e293b", color: "#fff",
            borderRadius: "16px 16px 0 0",
            padding: "20px 24px",
            paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.35)",
          }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: "#60a5fa" }}>{word}</span>
            <button onClick={onDismiss} style={{ background: "none", border: "none", color: "#64748b", fontSize: 20, cursor: "pointer", lineHeight: 1, padding: "0 0 0 16px" }}>✕</button>
          </div>
          {loading
            ? <div style={{ fontSize: 15, color: "#94a3b8" }}>Translating...</div>
            : tooltip
              ? <>
                  <div style={{ fontSize: 22, fontWeight: 600, marginBottom: tooltip.note ? 8 : 0 }}>{tooltip.translation}</div>
                  {tooltip.note && <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{tooltip.note}</div>}
                </>
              : null}
        </div>
      </div>
    );
  }

  // Desktop floating tooltip — rendered via portal-like absolute inside the word span
  return null;
}

// ── Clickable word component ─────────────────────────────────────
function ClickableText({ text, translationCache, onTranslate, isMobile, onMobileTranslate }) {
  const [activeWord, setActiveWord] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [loading, setLoading] = useState(false);

  const words = text.split(/(\s+)/);

  async function handleWordClick(word, e) {
    e.stopPropagation();
    const clean = word.replace(/[¿¡.,!?;:"""''()\-]/g, "").toLowerCase();
    if (!clean || clean.length < 2) return;

    if (isMobile) {
      // On mobile, delegate to parent to show bottom sheet
      onMobileTranslate(clean, text);
      return;
    }

    if (activeWord === clean) { setActiveWord(null); setTooltip(null); return; }
    setActiveWord(clean);
    if (translationCache[clean]) { setTooltip(translationCache[clean]); return; }
    setLoading(true);
    setTooltip(null);
    try {
      const result = await onTranslate(clean, text);
      setTooltip(result);
    } catch { setTooltip({ translation: "Translation unavailable", note: null }); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (isMobile) return;
    function dismiss() { setActiveWord(null); setTooltip(null); }
    document.addEventListener("click", dismiss);
    return () => document.removeEventListener("click", dismiss);
  }, [isMobile]);

  return (
    <span style={{ lineHeight: 1.7 }}>
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
        const clean = w.replace(/[¿¡.,!?;:"""''()\-]/g, "").toLowerCase();
        const isActive = !isMobile && activeWord === clean;
        return (
          <span key={i} style={{ position: "relative", display: "inline" }}>
            <span
              onClick={e => handleWordClick(w, e)}
              style={{
                cursor: "pointer",
                borderBottom: "1px dotted #94a3b8",
                background: isActive ? "#dbeafe" : "transparent",
                borderRadius: 3,
                padding: "0 1px",
                transition: "background 0.1s",
              }}>
              {w}
            </span>
            {/* Desktop tooltip */}
            {isActive && (
              <span onClick={e => e.stopPropagation()} style={{
                position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
                background: "#1e293b", color: "#fff", borderRadius: 8, padding: "7px 10px",
                fontSize: 12, fontFamily: "monospace", zIndex: 100,
                boxShadow: "0 4px 16px rgba(0,0,0,0.25)", minWidth: 120, maxWidth: 220,
                whiteSpace: "normal", textAlign: "center",
              }}>
                {loading ? "Translating..." : tooltip ? (
                  <>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: tooltip.note ? 4 : 0 }}>{tooltip.translation}</div>
                    {tooltip.note && <div style={{ color: "#94a3b8", fontSize: 11 }}>{tooltip.note}</div>}
                  </>
                ) : null}
                <span style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #1e293b" }} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

// ── Score panel ───────────────────────────────────────────────────
function ScorePanel({ rating }) {
  const [showSuggested, setShowSuggested] = useState(false);
  const scoreColor = rating.score >= 8 ? "#4ade80" : rating.score >= 5 ? "#f59e0b" : "#f87171";
  return (
    <div style={{ marginTop: 8, background: "#f8f7f4", border: "1px solid #e8e8e0", borderRadius: 10, padding: "12px 14px", fontSize: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: scoreColor, minWidth: 40 }}>{rating.score}/10</span>
        <div style={{ flex: 1, height: 5, background: "#e8e8e0", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${rating.score * 10}%`, height: "100%", background: scoreColor, borderRadius: 3, transition: "width 0.7s ease" }} />
        </div>
      </div>
      <div style={{ display: "grid", gap: 4, color: "#555" }}>
        {rating.grammar && <div><span style={{ fontWeight: 600, color: "#333" }}>Grammar:</span> {rating.grammar}</div>}
        {rating.vos && <div><span style={{ fontWeight: 600, color: "#333" }}>Vos:</span> {rating.vos}</div>}
        {rating.slang && <div><span style={{ fontWeight: 600, color: "#333" }}>Slang:</span> {rating.slang}</div>}
        {rating.correction && (
          <div style={{ marginTop: 4, padding: "6px 10px", background: "#fff8eb", border: "1px solid #fde68a", borderRadius: 6, color: "#92400e" }}>
            💡 <strong>Correction:</strong> {rating.correction}
          </div>
        )}
        {rating.suggested && (
          <div style={{ marginTop: 4 }}>
            <button onClick={() => setShowSuggested(v => !v)}
              style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #c7d2fe", background: showSuggested ? "#4f46e5" : "#eef2ff", color: showSuggested ? "#fff" : "#4f46e5", cursor: "pointer", fontFamily: "monospace", fontWeight: 600 }}>
              {showSuggested ? "▲ Hide suggestion" : "✨ Better version"}
            </button>
            {showSuggested && (
              <div style={{ marginTop: 6, padding: "8px 12px", background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 8, color: "#3730a3", fontStyle: "italic", fontSize: 13, lineHeight: 1.5 }}>
                "{rating.suggested}"
              </div>
            )}
          </div>
        )}
        {rating.new_word && (
          <div style={{ marginTop: 4, padding: "6px 10px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, color: "#166534" }}>
            ✨ <strong>New word:</strong> <em>{rating.new_word.word}</em> — {rating.new_word.meaning}
            <div style={{ color: "#16a34a", fontStyle: "italic", marginTop: 2 }}>"{rating.new_word.example}"</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Vocab tab ─────────────────────────────────────────────────────
function VocabTab({ vocab, corrections }) {
  return (
    <div style={{ padding: "16px 0" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 10, fontFamily: "monospace" }}>✨ Words Learned ({vocab.length})</div>
        {vocab.length === 0 ? <div style={{ color: "#bbb", fontSize: 13, fontFamily: "monospace" }}>Start chatting to collect new words!</div> : (
          <div style={{ display: "grid", gap: 6 }}>
            {[...vocab].reverse().map((w, i) => (
              <div key={i} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600, color: "#166534", fontSize: 14 }}>{w.word}</span>
                  <span style={{ fontSize: 11, color: "#86efac", fontFamily: "monospace" }}>{w.speaker}</span>
                </div>
                <div style={{ fontSize: 12, color: "#4b7c5a", marginTop: 2 }}>{w.meaning}</div>
                <div style={{ fontSize: 12, color: "#16a34a", fontStyle: "italic", marginTop: 2 }}>"{w.example}"</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 10, fontFamily: "monospace" }}>💡 Corrections ({corrections.length})</div>
        {corrections.length === 0 ? <div style={{ color: "#bbb", fontSize: 13, fontFamily: "monospace" }}>No corrections yet!</div> : (
          <div style={{ display: "grid", gap: 6 }}>
            {[...corrections].reverse().map((c, i) => (
              <div key={i} style={{ background: "#fff8eb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
                <div style={{ color: "#92400e" }}>💬 {c.text}</div>
                <div style={{ color: "#b45309", marginTop: 2, fontFamily: "monospace", fontSize: 11 }}>{c.speaker} · {c.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stats tab ─────────────────────────────────────────────────────
function StatsTab({ scores, vocab, corrections }) {
  const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "—";
  const best = scores.length ? Math.max(...scores) : "—";
  return (
    <div style={{ padding: "16px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[{ label: "Avg Score", val: avg }, { label: "Best Score", val: best }, { label: "Sessions", val: scores.length }].map(s => (
          <div key={s.label} style={{ background: "#f4f4f0", borderRadius: 10, padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#888", fontFamily: "monospace", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[{ label: "Words Learned", val: vocab.length, color: "#4ade80" }, { label: "Corrections", val: corrections.length, color: "#f59e0b" }].map(s => (
          <div key={s.label} style={{ background: "#f4f4f0", borderRadius: 10, padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#888", fontFamily: "monospace", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {scores.length > 1 && (
        <div>
          <div style={{ fontSize: 12, fontFamily: "monospace", color: "#888", marginBottom: 8 }}>Score history</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
            {scores.slice(-24).map((s, i) => {
              const h = Math.max(4, (s / 10) * 60);
              const c = s >= 8 ? "#4ade80" : s >= 5 ? "#f59e0b" : "#f87171";
              return <div key={i} style={{ flex: 1, height: h, background: c, borderRadius: 2 }} title={`${s}/10`} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Settings tab ───────────────────────────────────────────────────
function SettingsTab({ difficulty, setDifficulty, systemAddendum, setSystemAddendum, onClearKey }) {
  return (
    <div style={{ padding: "16px 0" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 10 }}>Difficulty</div>
        <div style={{ display: "grid", gap: 8 }}>
          {Object.entries(DIFFICULTY).map(([key, d]) => (
            <button key={key} onClick={() => setDifficulty(key)}
              style={{ padding: "10px 14px", borderRadius: 8, border: difficulty === key ? "2px solid #1a1a1a" : "1px solid #e8e8e0", background: difficulty === key ? "#1a1a1a" : "#fff", color: difficulty === key ? "#fff" : "#333", cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{d.label}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{d.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>Custom prompt instructions</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Add extra instructions to shape the conversation</div>
        <textarea value={systemAddendum} onChange={e => setSystemAddendum(e.target.value)}
          placeholder='e.g. "Focus on teaching me food vocabulary" or "Use more slang"'
          rows={4}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e8e8e0", fontSize: 16, fontFamily: "Georgia, serif", resize: "vertical", outline: "none", color: "#333", background: "#fff", boxSizing: "border-box" }}
        />
      </div>
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #e8e8e0" }}>
        <button onClick={onClearKey}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fff", color: "#dc2626", cursor: "pointer", fontSize: 13, width: "100%", textAlign: "left" }}>
          🔑 Change API key
        </button>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────
export default function App() {
  const [apiKey, setApiKey] = useState(getStoredKey);
  if (!apiKey) return <ApiKeyGate onKey={setApiKey} />;

  return <Chat apiKey={apiKey} onClearKey={() => { localStorage.removeItem("sp-api-key"); setApiKey(""); }} />;
}

function Chat({ apiKey, onClearKey }) {
  const isMobile = useIsMobile();

  const [speakerId, setSpeakerId] = useState("friend");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [inputText, setInputText] = useState("");
  const [busy, setBusy] = useState(false);
  const [talking, setTalking] = useState(false);
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("idle");
  const [activeTab, setActiveTab] = useState("chat");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [systemAddendum, setSystemAddendum] = useState("");
  const [translationCache, setTranslationCache] = useState({});
  const [vocab, setVocab] = useStorage("sp-vocab", []);
  const [corrections, setCorrections] = useStorage("sp-corrections", []);
  const [scores, setScores] = useStorage("sp-scores", []);

  // Mobile translation sheet state
  const [mobileTranslation, setMobileTranslation] = useState(null); // { word, sentence }
  const [mobileTooltip, setMobileTooltip] = useState(null);
  const [mobileLoading, setMobileLoading] = useState(false);

  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const talkingTimer = useRef(null);
  const speaker = SPEAKERS[speakerId];

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, activeTab]);

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    return () => clearTimeout(talkingTimer.current);
  }, []);

  function resetTalking() {
    clearTimeout(talkingTimer.current);
    setTalking(false);
    setStatus("idle");
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-AR"; u.rate = 0.92;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(x => x.lang === "es-AR") || voices.find(x => x.lang.startsWith("es"));
    if (v) u.voice = v;
    setTalking(true);
    talkingTimer.current = setTimeout(resetTalking, 15000);
    u.onend = resetTalking;
    u.onerror = resetTalking;
    window.speechSynthesis.speak(u);
  }

  const handleTranslate = useCallback(async (word, sentence) => {
    if (translationCache[word]) return translationCache[word];
    const result = await translateWord(word, sentence, apiKey);
    setTranslationCache(prev => ({ ...prev, [word]: result }));
    return result;
  }, [translationCache, apiKey]);

  async function handleMobileTranslate(word, sentence) {
    if (mobileTranslation?.word === word) { setMobileTranslation(null); setMobileTooltip(null); return; }
    setMobileTranslation({ word, sentence });
    setMobileTooltip(translationCache[word] || null);
    if (translationCache[word]) return;
    setMobileLoading(true);
    try {
      const result = await handleTranslate(word, sentence);
      setMobileTooltip(result);
    } catch { setMobileTooltip({ translation: "Translation unavailable", note: null }); }
    finally { setMobileLoading(false); }
  }

  function switchSpeaker(id) {
    if (id === speakerId) return;
    setSpeakerId(id);
    setMessages([]);
    setHistory([]);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    resetTalking();
  }

  async function handleInput(text) {
    if (!text.trim() || busy) return;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    resetTalking();
    setInputText("");
    setBusy(true);
    setStatus("thinking");
    setMessages(prev => [...prev, { role: "user", text }]);
    try {
      const sys = buildSystem(speaker, difficulty) + (systemAddendum ? `\n\nADDITIONAL INSTRUCTIONS: ${systemAddendum}` : "");
      const { parsed, newHistory } = await fetchClaude(sys, text, history, apiKey);
      setHistory(newHistory);
      if (parsed.score != null) setScores(prev => [...prev, parsed.score]);
      if (parsed.new_word?.word) {
        setVocab(prev => prev.find(w => w.word === parsed.new_word.word) ? prev : [...prev, { ...parsed.new_word, speaker: speaker.name, date: new Date().toLocaleDateString() }]);
      }
      if (parsed.correction) {
        setCorrections(prev => [...prev, { text: parsed.correction, speaker: speaker.name, date: new Date().toLocaleDateString() }]);
      }
      setMessages(prev => [...prev, { role: "agent", text: parsed.response, question: parsed.question, rating: parsed.score != null ? parsed : null }]);
      speak((parsed.response || "") + (parsed.question ? " " + parsed.question : ""));
      setActiveTab("chat");
    } catch (e) {
      setMessages(prev => [...prev, { role: "agent", text: `Error: ${e.message}`, rating: null }]);
      setStatus("idle");
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function toggleMic() {
    if (busy) return;
    if (listening) { setListening(false); setStatus("idle"); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setStatus("no-mic"); return; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    resetTalking();
    const r = new SR();
    r.lang = "es-AR"; r.continuous = false; r.interimResults = false;
    r.onresult = e => { setListening(false); setStatus("idle"); handleInput(e.results[0][0].transcript); };
    r.onerror = e => { setListening(false); setStatus("mic-err-" + e.error); };
    r.onend = () => setListening(false);
    try { r.start(); setListening(true); setStatus("listening"); } catch (e) { setStatus("mic-err-" + e.message); }
  }

  const statusText = () => {
    if (status === "thinking") return `${speaker.name} is thinking...`;
    if (status === "listening") return "Listening... speak now";
    if (talking) return `${speaker.name} is speaking...`;
    if (status === "no-mic") return "Mic unavailable — type instead";
    if (status.startsWith("mic-err")) return "Mic error: " + status.replace("mic-err-", "");
    return isMobile ? "Tap any Spanish word to translate" : "Click any Spanish word to translate";
  };

  const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
  const tabs = ["chat", "vocab", "stats", "settings"];
  const tabLabels = { chat: "Chat", vocab: `Vocab (${vocab.length})`, stats: "Stats", settings: "⚙️" };

  const clickableProps = { translationCache, onTranslate: handleTranslate, isMobile, onMobileTranslate: handleMobileTranslate };

  return (
    <div style={{
      fontFamily: "Georgia, serif",
      maxWidth: 640,
      margin: "0 auto",
      padding: isMobile ? "12px 12px 0" : "20px 16px",
      background: "#fafaf7",
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* Mobile translation bottom sheet */}
      <TranslationOverlay
        word={mobileTranslation?.word}
        tooltip={mobileTooltip}
        loading={mobileLoading}
        isMobile={isMobile}
        onDismiss={() => { setMobileTranslation(null); setMobileTooltip(null); }}
      />

      {/* Speaker selector — 3 cols on mobile, 6 on desktop */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(6, 1fr)",
        gap: isMobile ? 8 : 6,
        marginBottom: 12,
      }}>
        {Object.values(SPEAKERS).map(s => (
          <button key={s.id} onClick={() => switchSpeaker(s.id)}
            style={{
              padding: isMobile ? "10px 4px" : "8px 4px",
              borderRadius: 10,
              border: speakerId === s.id ? `2px solid ${s.accent}` : "1px solid #e8e8e0",
              background: speakerId === s.id ? s.bg : "#fff",
              cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              minHeight: 60,
            }}>
            <span style={{ fontSize: isMobile ? 24 : 20 }}>{s.emoji}</span>
            <span style={{ fontSize: isMobile ? 11 : 10, fontFamily: "monospace", color: speakerId === s.id ? s.accent : "#888", fontWeight: speakerId === s.id ? 600 : 400 }}>{s.name}</span>
          </button>
        ))}
      </div>

      {/* Speaker header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, padding: "10px 14px", background: speaker.bg, borderRadius: 12 }}>
        <span style={{ fontSize: 28 }}>{speaker.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{speaker.name}</div>
          <div style={{ fontSize: 12, color: speaker.accent, fontFamily: "monospace" }}>{speaker.role}</div>
        </div>
        {avgScore && (
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: speaker.accent }}>{avgScore}</div>
            <div style={{ fontSize: 10, color: "#aaa", fontFamily: "monospace" }}>avg</div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 12, background: "#f0efe8", borderRadius: 10, padding: 3 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ flex: 1, padding: isMobile ? "8px 4px" : "6px 4px", borderRadius: 8, border: "none", background: activeTab === t ? "#fff" : "transparent", color: activeTab === t ? "#1a1a1a" : "#888", fontSize: 12, fontFamily: "monospace", cursor: "pointer", fontWeight: activeTab === t ? 600 : 400 }}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {/* Chat tab */}
      {activeTab === "chat" && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {/* Topic chips — horizontal scroll on mobile */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto", paddingBottom: 4, WebkitOverflowScrolling: "touch" }}>
            {TOPICS[speakerId].map(t => (
              <button key={t} onClick={() => handleInput(t)} disabled={busy}
                style={{ fontSize: 12, fontFamily: "monospace", padding: "6px 12px", borderRadius: 20, border: "1px solid #d8d8d0", background: "#fff", color: "#666", cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.45 : 1, whiteSpace: "nowrap", flexShrink: 0 }}>
                {t}
              </button>
            ))}
          </div>

          {/* Chat window */}
          <div ref={chatRef} style={{
            border: "1px solid #e8e8e0", borderRadius: 12, background: "#f4f4f0",
            padding: 14, flex: 1,
            minHeight: isMobile ? 200 : 180,
            maxHeight: isMobile ? "38dvh" : 310,
            overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 10,
            WebkitOverflowScrolling: "touch",
          }}>
            {messages.length === 0 ? (
              <div style={{ color: "#bbb", fontSize: 13, fontFamily: "monospace", textAlign: "center", padding: "2rem 0" }}>
                {speaker.bio}<br /><br />
                <span style={{ fontSize: 12 }}>💡 {isMobile ? "Tap" : "Click"} any Spanish word to translate</span><br />
                Tap a topic above or type something 👇
              </div>
            ) : messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 4, maxWidth: "88%", alignSelf: isUser ? "flex-end" : "flex-start" }}>
                  <div style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>{isUser ? "you" : speaker.name.toLowerCase()}</div>
                  <div style={{ padding: "10px 14px", borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: isUser ? speaker.bg : "#fff", color: isUser ? "#fff" : "#1a1a1a", fontSize: 15, lineHeight: 1.6, border: isUser ? "none" : "1px solid #e8e8e0" }}>
                    {isUser ? m.text : <ClickableText text={m.text} {...clickableProps} />}
                  </div>
                  {m.question && (
                    <div style={{ padding: "8px 12px", borderRadius: "4px 16px 16px 16px", background: "#f0f9ff", border: "1px solid #bae6fd", fontSize: 14, color: "#0369a1" }}>
                      <ClickableText text={"❓ " + m.question} {...clickableProps} />
                    </div>
                  )}
                  {m.rating && <ScorePanel rating={m.rating} />}
                </div>
              );
            })}
            {busy && (
              <div style={{ display: "flex" }}>
                <div style={{ padding: "10px 16px", background: "#fff", border: "1px solid #e8e8e0", borderRadius: "16px 16px 16px 4px", fontSize: 18, letterSpacing: 3, color: "#bbb" }}>···</div>
              </div>
            )}
          </div>

          {/* Status bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, minHeight: 18 }}>
            <div style={{ fontSize: 12, color: "#aaa", fontFamily: "monospace", flex: 1 }}>{statusText()}</div>
            {talking && <button onClick={resetTalking} style={{ fontSize: 11, fontFamily: "monospace", padding: "2px 8px", borderRadius: 6, border: "1px solid #e8e8e0", background: "#fff", color: "#999", cursor: "pointer" }}>stop ✕</button>}
          </div>

          {/* Input row */}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", paddingBottom: `calc(12px + env(safe-area-inset-bottom, 0px))` }}>
            <textarea ref={inputRef} value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleInput(inputText); } }}
              disabled={busy}
              placeholder="Escribí en español..."
              rows={2}
              style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: "1px solid #d8d8d0", background: "#fff", fontSize: 16, fontFamily: "Georgia, serif", resize: "none", outline: "none", color: "#1a1a1a", lineHeight: 1.5, opacity: busy ? 0.6 : 1 }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button onClick={() => handleInput(inputText)} disabled={busy || !inputText.trim()}
                style={{ width: 48, height: 48, borderRadius: 12, border: "none", background: inputText.trim() && !busy ? speaker.bg : "#e8e8e0", color: inputText.trim() && !busy ? "#fff" : "#aaa", cursor: busy || !inputText.trim() ? "not-allowed" : "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                ↑
              </button>
              <button onClick={toggleMic} disabled={busy}
                style={{ width: 48, height: 48, borderRadius: 12, border: listening ? "2px solid #f59e0b" : "1px solid #d8d8d0", background: listening ? "#fff8eb" : "#fff", cursor: busy ? "not-allowed" : "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", opacity: busy ? 0.45 : 1 }}>
                🎙️
              </button>
            </div>
          </div>
          {!isMobile && <div style={{ fontSize: 11, color: "#ccc", fontFamily: "monospace", marginBottom: 8 }}>Enter to send · Shift+Enter for new line</div>}
        </div>
      )}

      {activeTab === "vocab" && <VocabTab vocab={vocab} corrections={corrections} />}
      {activeTab === "stats" && <StatsTab scores={scores} vocab={vocab} corrections={corrections} />}
      {activeTab === "settings" && <SettingsTab difficulty={difficulty} setDifficulty={setDifficulty} systemAddendum={systemAddendum} setSystemAddendum={setSystemAddendum} onClearKey={onClearKey} />}
    </div>
  );
}
