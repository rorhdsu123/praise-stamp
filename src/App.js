/* eslint-disable */
import { useState, useEffect } from “react”;
import { ref, onValue, set } from “firebase/database”;
import { db } from “./firebase”;

const TOTAL_STAMPS = 10;

const rewards = [
{ range: [1, 2], label: “기분 좋아요”, tag: “달콤한 미소”, icon: “🩷”, color: “#FFB6C1” },
{ range: [3, 4], label: “정말 감동이에요”, tag: “심쿵 지수 +10”, icon: “💗”, color: “#FF85A1” },
{ range: [5, 6], label: “완전 감동!”, tag: “사랑 지수 +20”, icon: “💖”, color: “#FF5C8A” },
{ range: [7, 9], label: “최고의 남자친구”, tag: “신뢰 지수 +30”, icon: “🎁”, color: “#FF3370” },
{ range: [10, 10], label: “소원권 GET”, tag: “소원 1개 실행”, icon: “🎟️”, color: “#FF1A5E” },
];

const quotes = [
“오늘도 날 설레게 해줘서 고마워 💗”,
“네가 옆에 있어서 매일이 행복해 🌸”,
“세상에서 제일 소중한 사람이야 💝”,
“오늘 하루도 고생 많았어, 사랑해 🫶”,
“너랑 함께라면 뭐든 할 수 있어 ✨”,
];

function HeartStamp({ filled, index, isNew }) {
return (
<div style={{
width: “100%”, aspectRatio: “1”, borderRadius: “50%”,
border: filled ? “2px solid #FFB6C1” : “2px dashed #E0D0D8”,
background: filled ? “linear-gradient(135deg, #FFF0F5, #FFE4EE)” : “#FAF5F7”,
display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”,
boxShadow: filled ? “0 4px 12px rgba(255,150,180,0.35)” : “none”,
animation: isNew ? “stampPop 0.5s cubic-bezier(0.36,0.07,0.19,0.97)” : “none”,
transition: “all 0.3s ease”,
}}>
<span style={{ fontSize: 10, color: filled ? “#FF85A1” : “#CDB8C2”, fontWeight: 700, lineHeight: 1 }}>
{index + 1}
</span>
{filled
? <span style={{ fontSize: 24, lineHeight: 1.1 }}>💗</span>
: <span style={{ fontSize: 22, opacity: 0.25 }}>🤍</span>
}
</div>
);
}

function RewardStep({ reward, active }) {
return (
<div style={{ display: “flex”, flexDirection: “column”, alignItems: “center”, gap: 4, minWidth: 60 }}>
<div style={{
width: 48, height: 48, borderRadius: “50%”,
background: active ? `linear-gradient(135deg, ${reward.color}33, ${reward.color}66)` : “#F5EEF1”,
border: active ? `2px solid ${reward.color}` : “2px solid #E8D8E0”,
display: “flex”, alignItems: “center”, justifyContent: “center”, fontSize: 22,
transition: “all 0.3s”,
boxShadow: active ? `0 4px 14px ${reward.color}55` : “none”,
}}>
{reward.icon}
</div>
<span style={{ fontSize: 10, color: “#A08090”, textAlign: “center”, lineHeight: 1.3 }}>
{reward.range[0] === reward.range[1] ? `${reward.range[0]}개` : `${reward.range[0]}~${reward.range[1]}개`}
</span>
<span style={{ fontSize: 10, color: “#7A5868”, fontWeight: 600, textAlign: “center”, lineHeight: 1.3 }}>
{reward.label}
</span>
<span style={{
background: active ? reward.color : “#E8D8E0”,
color: active ? “white” : “#A09098”,
fontSize: 9, padding: “2px 6px”, borderRadius: 10, fontWeight: 700,
transition: “all 0.3s”, whiteSpace: “nowrap”,
}}>
{reward.tag}
</span>
</div>
);
}

export default function App() {
const [stamps, setStamps] = useState(0);
const [newStamp, setNewStamp] = useState(null);
const [quoteIdx, setQuoteIdx] = useState(0);
const [showCelebration, setShowCelebration] = useState(false);
const [particles, setParticles] = useState([]);
const [showShareToast, setShowShareToast] = useState(false);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

const isViewMode = new URLSearchParams(window.location.search).get(“view”) === “true”;

// Firebase에서 실시간으로 스탬프 데이터 불러오기
useEffect(() => {
const stampRef = ref(db, “stamps/count”);
const unsubscribe = onValue(stampRef, (snapshot) => {
const val = snapshot.val();
setStamps(val !== null ? val : 0);
setLoading(false);
});
return () => unsubscribe();
}, []);

const saveStamps = async (count) => {
setSaving(true);
try {
await set(ref(db, “stamps/count”), count);
} catch (e) {
console.error(“저장 실패”, e);
} finally {
setSaving(false);
}
};

const handleShare = () => {
const shareUrl = window.location.origin + “?view=true”;
navigator.clipboard.writeText(shareUrl).catch(() => {});
setShowShareToast(true);
setTimeout(() => setShowShareToast(false), 2500);
};

const handleStamp = async () => {
if (saving) return;
const next = stamps >= TOTAL_STAMPS ? 0 : stamps + 1;
if (next > 0) setNewStamp(next - 1);
if (next === TOTAL_STAMPS) {
setShowCelebration(true);
launchParticles();
setTimeout(() => setShowCelebration(false), 2500);
}
setTimeout(() => setNewStamp(null), 600);
await saveStamps(next);
};

const launchParticles = () => {
const p = Array.from({ length: 20 }, (_, i) => ({
id: i, x: Math.random() * 100,
emoji: [“💗”, “🌸”, “✨”, “💕”, “🎀”][Math.floor(Math.random() * 5)],
duration: 1.5 + Math.random(), delay: Math.random() * 0.5,
}));
setParticles(p);
setTimeout(() => setParticles([]), 3000);
};

return (
<div style={{
minHeight: “100vh”,
background: “linear-gradient(160deg, #FFF5F8 0%, #FDE8F0 50%, #FFF0F5 100%)”,
fontFamily: “‘Noto Sans KR’, ‘Apple SD Gothic Neo’, sans-serif”,
display: “flex”, justifyContent: “center”, padding: “0 0 120px”,
}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;900&display=swap'); @keyframes stampPop { 0% { transform: scale(0) rotate(-15deg); opacity: 0; } 60% { transform: scale(1.25) rotate(5deg); } 80% { transform: scale(0.9) rotate(-2deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } } @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } } @keyframes particleFly { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-200px) scale(0.5); opacity: 0; } } @keyframes celebration { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } } * { box-sizing: border-box; } .stamp-btn:active { transform: scale(0.95) !important; }`}</style>

```
  {loading && (
    <div style={{ position: "fixed", inset: 0, background: "#FFF5F8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 300, gap: 16 }}>
      <div style={{ fontSize: 48 }}>🩷</div>
      <div style={{ color: "#FF85A1", fontWeight: 700, fontSize: 15 }}>스탬프 불러오는 중...</div>
    </div>
  )}

  <div style={{ width: "100%", maxWidth: 400, position: "relative", paddingBottom: 100 }}>

    {/* Header */}
    <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px 0", alignItems: "center" }}>
      <div style={{ width: 40 }} />
      {!isViewMode ? (
        <button onClick={handleShare} style={{ background: "linear-gradient(135deg, #FFB6C1, #FF85A1)", border: "none", borderRadius: 20, padding: "8px 16px", fontSize: 12, fontWeight: 700, color: "white", cursor: "pointer", boxShadow: "0 2px 8px rgba(255,150,180,0.3)" }}>
          💌 링크 공유
        </button>
      ) : (
        <div style={{ background: "#FFF0F5", border: "1.5px solid #FFD6E7", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#FF85A1" }}>
          👀 보기 전용
        </div>
      )}
      <div style={{ width: 40 }} />
    </div>

    {/* Title */}
    <div style={{ textAlign: "center", padding: "20px 20px 0" }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: "#3D1F2A", margin: 0, letterSpacing: -0.5 }}>
        내 마음을 녹인 순간들 🩷
      </h1>
      <p style={{ color: "#C08090", fontSize: 13, marginTop: 6 }}>감동받을 때마다 스탬프를 찍어줄게 💌</p>
    </div>

    {/* Main Card */}
    <div style={{ margin: "20px 20px 0", position: "relative" }}>
      <div style={{ textAlign: "center", fontSize: 36, lineHeight: 1, marginBottom: -10, position: "relative", zIndex: 2 }}>🎀</div>
      <div style={{ background: "white", borderRadius: 28, padding: "24px 20px", boxShadow: "0 8px 32px rgba(255,120,160,0.12)", border: "1.5px solid #FFE4EE" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div>
            <div style={{ color: "#C08090", fontSize: 12, fontWeight: 600 }}>스탬프 현황</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: "#FF5C8A", lineHeight: 1.1 }}>
              {stamps}<span style={{ fontSize: 18, color: "#D09090", fontWeight: 600 }}> / {TOTAL_STAMPS}</span>
            </div>
            <div style={{ fontSize: 12, color: "#C08090", marginTop: 2 }}>10개 모으면 소원권 1장! 🩷</div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #FFB6C1, #FF85A1)", borderRadius: 16, padding: "14px 20px", textAlign: "center", boxShadow: "0 4px 14px rgba(255,120,160,0.35)" }}>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600 }}>다음 보상</div>
            <div style={{ color: "white", fontSize: 15, fontWeight: 800, marginTop: 2 }}>소원권 1장</div>
          </div>
        </div>

        <div style={{ margin: "16px 0 20px", background: "#FFE8EF", borderRadius: 10, height: 8 }}>
          <div style={{ height: "100%", width: `${(stamps / TOTAL_STAMPS) * 100}%`, background: "linear-gradient(90deg, #FFB6C1, #FF5C8A)", borderRadius: 10, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, width: "100%" }}>
          {Array.from({ length: TOTAL_STAMPS }).map((_, i) => (
            <HeartStamp key={i} filled={i < stamps} index={i} isNew={newStamp === i} />
          ))}
        </div>

        {saving && <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#FFB6C1", fontWeight: 600 }}>저장 중... 💾</div>}
      </div>
    </div>

    {/* Reward Progression */}
    <div style={{ margin: "24px 20px 0" }}>
      <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#C08090", marginBottom: 16 }}>
        🩷 감동 레벨 업! 보상 시스템 🩷
      </div>
      <div style={{ background: "white", borderRadius: 20, padding: "20px 12px", boxShadow: "0 4px 20px rgba(255,120,160,0.1)", border: "1.5px solid #FFE4EE" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div style={{ position: "absolute", top: 23, left: "10%", right: "10%", height: 2, background: "linear-gradient(90deg, #FFB6C1, #FF85A1)", zIndex: 0 }} />
          {rewards.map((r, i) => (
            <div key={i} style={{ zIndex: 1 }}><RewardStep reward={r} active={stamps >= r.range[0]} /></div>
          ))}
        </div>
      </div>
    </div>

    {/* Quote */}
    <div style={{ margin: "20px 20px 0", background: "white", borderRadius: 20, padding: "16px 20px", boxShadow: "0 4px 16px rgba(255,120,160,0.08)", border: "1.5px solid #FFE4EE" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: "#FF85A1", fontWeight: 700, fontSize: 13 }}>🩷 오늘의 한마디</span>
        <button onClick={() => setQuoteIdx((q) => (q + 1) % quotes.length)} style={{ background: "none", border: "none", color: "#C08090", fontSize: 12, cursor: "pointer" }}>
          다른 한마디 보기 🔄
        </button>
      </div>
      <p style={{ margin: 0, color: "#5A3040", fontWeight: 600, fontSize: 14, lineHeight: 1.6, textAlign: "center" }}>
        "{quotes[quoteIdx]}"
      </p>
    </div>

    {/* Celebration */}
    {showCelebration && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(255,200,220,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, animation: "celebration 0.4s ease" }}>
        <div style={{ background: "white", borderRadius: 28, padding: "40px 48px", textAlign: "center", boxShadow: "0 20px 60px rgba(255,100,150,0.3)" }}>
          <div style={{ fontSize: 60, animation: "float 1s infinite" }}>🎟️</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#FF3370", marginTop: 16 }}>소원권 획득!</div>
          <div style={{ color: "#C08090", fontSize: 14, marginTop: 8 }}>소원 1개를 이루어 드릴게요 💗</div>
        </div>
      </div>
    )}

    {/* Particles */}
    {particles.map((p) => (
      <div key={p.id} style={{ position: "fixed", left: `${p.x}%`, bottom: "20%", fontSize: 24, animation: `particleFly ${p.duration}s ${p.delay}s forwards`, pointerEvents: "none", zIndex: 99 }}>
        {p.emoji}
      </div>
    ))}

    {/* Share Toast */}
    {showShareToast && (
      <div style={{ position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", background: "#3D1F2A", color: "white", borderRadius: 20, padding: "10px 20px", fontSize: 13, fontWeight: 600, zIndex: 200, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
        💌 링크가 복사됐어요!
      </div>
    )}

    {/* Stamp Button */}
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 400, padding: "12px 20px 24px", background: "white", borderTop: "1px solid #FFE4EE", boxShadow: "0 -4px 20px rgba(255,120,160,0.1)", zIndex: 50 }}>
      {isViewMode ? (
        <div style={{ width: "100%", padding: "18px", borderRadius: 50, textAlign: "center", background: "#F5EEF1", color: "#C0A0B0", fontSize: 15, fontWeight: 700 }}>
          🔒 스탬프는 주인만 찍을 수 있어요
        </div>
      ) : (
        <button className="stamp-btn" onClick={handleStamp} disabled={saving} style={{
          width: "100%", padding: "18px", borderRadius: 50, border: "none",
          background: stamps >= TOTAL_STAMPS ? "linear-gradient(135deg, #A8E6CF, #7BC8A4)" : "linear-gradient(135deg, #FFB6C1, #FF5C8A, #FF3370)",
          color: "white", fontSize: 17, fontWeight: 800,
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1,
          boxShadow: "0 8px 28px rgba(255,100,150,0.4)",
          transition: "transform 0.1s, opacity 0.2s", letterSpacing: 0.5,
        }}>
          {saving ? "저장 중... 💾" : stamps >= TOTAL_STAMPS ? "🎉 초기화하기" : "🩷 스탬프 찍기 ✦"}
        </button>
      )}
    </div>
  </div>
</div>
```

);
}
