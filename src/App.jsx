import { useState, useEffect, useCallback, useRef } from "react";
import {
  Home, PlusCircle, BarChart3, Bell, ThumbsUp, MessageCircle,
  MapPin, Target, Hand, Circle, Clock, Trophy, Flame, ChevronRight,
  MoreHorizontal, Camera, X, Check, ChevronDown, Search, Star,
  Award, Moon, Mountain, Palette, Sun, Crown, Users, Image as ImageIcon,
  Wine, User, Zap, Play, Square, ArrowLeft, Share2, Filter
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";

// ─── DATA ──────────────────────────────────────────────────────

const COLORS = {
  primary: "#FC4C02",
  bg: "#FFFFFF",
  bgGrey: "#F7F7F7",
  text: "#242428",
  textSec: "#6D6D78",
  textTer: "#9B9BA1",
  border: "#E8E8ED",
  metricBg: "#F0F0F5",
  green: "#00B84D",
  red: "#E03E36",
  kudosOff: "#9B9BA1",
  kudosOn: "#FC4C02",
};

const TERRENYS = [
  "Boulodrom del Poble Sec",
  "Club Petanca El Gato · Gràcia",
  "Parc de la Ciutadella",
  "Jardins de Montjuïc",
  "Platja de la Barceloneta",
  "Club Petanca La Bola d'Or · Eixample",
  "Boulodrom Municipal de Sants",
  "Can Dragó · Nou Barris",
];

const USER = {
  nom: "Marcel Riera",
  username: "marcelriera",
  avatar: "MR",
  ciutat: "Barcelona, Catalunya",
  rol: "Punter",
  ma: "Dreta",
  boles: "Obut Match 115",
  elo: 1342,
  partides: 247,
  victories: 156,
  ratxa: 5,
  membreDesde: "Mar 2023",
};

const PHOTOS = [
  "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=600&h=300&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=300&fit=crop",
];

const INITIAL_PARTIDES = [
  {
    id: 1,
    jugador: { nom: "Joan Martí", avatar: "JM" },
    titol: "Doublette al sol de tarda 🌅",
    descripcio: "Bona sessió amb el Manel. 3 carreaux seguits al final!",
    modalitat: "Doublette",
    resultat: { equipA: 13, equipB: 8 },
    guanyador: "A",
    equips: { A: ["Joan Martí", "Manel Puig"], B: ["Paco Fernández", "Lola García"] },
    durada: 47,
    mans: 11,
    precisioPuntera: 68,
    carreaux: 3,
    terreny: "Boulodrom del Poble Sec",
    foto: 0,
    kudos: 12,
    comentaris: 3,
    temps: "fa 2 hores",
    liked: false,
    kudosNoms: ["Pilar", "Montse", "Àngel"],
  },
  {
    id: 2,
    jugador: { nom: "Marcel Riera", avatar: "MR" },
    titol: "Revenja contra el Paco — 13 a 8! 💪",
    descripcio: "Avui sí que sí. Puntera fina i el Paco no podia fer res.",
    modalitat: "Tête-à-tête",
    resultat: { equipA: 13, equipB: 8 },
    guanyador: "A",
    equips: { A: ["Marcel Riera"], B: ["Paco Fernández"] },
    durada: 38,
    mans: 14,
    precisioPuntera: 74,
    carreaux: 2,
    terreny: "Jardins de Montjuïc",
    foto: null,
    kudos: 24,
    comentaris: 7,
    temps: "fa 5 hores",
    liked: true,
    kudosNoms: ["Joan", "Lola", "Enric"],
  },
  {
    id: 3,
    jugador: { nom: "Pilar Soler", avatar: "PS" },
    titol: "Triplette dominguera al Parc de la Ciutadella 🌳",
    descripcio: "Quin equip! La Rosa i l'Enric van estar increïbles.",
    modalitat: "Triplette",
    resultat: { equipA: 13, equipB: 11 },
    guanyador: "A",
    equips: { A: ["Pilar Soler", "Rosa Camps", "Enric Batlle"], B: ["Jordi Navarro", "Teresa Ruiz", "Carmen Delgado"] },
    durada: 62,
    mans: 16,
    precisioPuntera: 61,
    carreaux: 1,
    terreny: "Parc de la Ciutadella",
    foto: 1,
    kudos: 18,
    comentaris: 5,
    temps: "ahir",
    liked: false,
    kudosNoms: ["Marcel", "Joan", "Paco"],
  },
  {
    id: 4,
    jugador: { nom: "Paco Fernández", avatar: "PF" },
    titol: "Fanny! No vull parlar-ne 😅",
    descripcio: "13-0. La pitjor partida de la meva vida. El Lluís és un monstre.",
    modalitat: "Tête-à-tête",
    resultat: { equipA: 0, equipB: 13 },
    guanyador: "B",
    equips: { A: ["Paco Fernández"], B: ["Lluís Ferrer"] },
    durada: 22,
    mans: 7,
    precisioPuntera: 31,
    carreaux: 0,
    terreny: "Club Petanca El Gato · Gràcia",
    foto: null,
    kudos: 45,
    comentaris: 12,
    temps: "ahir",
    liked: false,
    kudosNoms: ["Montse", "Àngel", "Neus"],
    fanny: true,
  },
  {
    id: 5,
    jugador: { nom: "Montse Vidal", avatar: "MV" },
    titol: "3 carreaux seguits, estic ON FIRE 🔥",
    descripcio: "La millor ratxa que he tingut mai. El terreny de Sants porta sort!",
    modalitat: "Doublette",
    resultat: { equipA: 13, equipB: 5 },
    guanyador: "A",
    equips: { A: ["Montse Vidal", "Neus Pujol"], B: ["Oriol Serra", "Teresa Ruiz"] },
    durada: 34,
    mans: 9,
    precisioPuntera: 82,
    carreaux: 5,
    terreny: "Boulodrom Municipal de Sants",
    foto: 2,
    kudos: 31,
    comentaris: 8,
    temps: "fa 2 dies",
    liked: false,
    kudosNoms: ["Marcel", "Pilar", "Joan"],
  },
  {
    id: 6,
    jugador: { nom: "Àngel Torres", avatar: "AT" },
    titol: "Tête-à-tête de dimecres amb el Joan ☕",
    descripcio: "Partideta tranquil·la al bar. Cerveseta post-partida inclosa.",
    modalitat: "Tête-à-tête",
    resultat: { equipA: 11, equipB: 13 },
    guanyador: "B",
    equips: { A: ["Àngel Torres"], B: ["Joan Martí"] },
    durada: 41,
    mans: 13,
    precisioPuntera: 55,
    carreaux: 1,
    terreny: "Club Petanca La Bola d'Or · Eixample",
    foto: null,
    kudos: 8,
    comentaris: 2,
    temps: "fa 3 dies",
    liked: false,
    kudosNoms: ["Lola", "Paco"],
  },
  {
    id: 7,
    jugador: { nom: "Enric Batlle", avatar: "EB" },
    titol: "Nocturna a la Barceloneta 🌙",
    descripcio: "Partida improvisada amb llum de farola. Ambient increïble.",
    modalitat: "Doublette",
    resultat: { equipA: 13, equipB: 12 },
    guanyador: "A",
    equips: { A: ["Enric Batlle", "Rosa Camps"], B: ["Carmen Delgado", "Jordi Navarro"] },
    durada: 58,
    mans: 15,
    precisioPuntera: 59,
    carreaux: 2,
    terreny: "Platja de la Barceloneta",
    foto: null,
    kudos: 22,
    comentaris: 6,
    temps: "fa 4 dies",
    liked: false,
    kudosNoms: ["Marcel", "Montse", "Pilar"],
  },
  {
    id: 99,
    jugador: { nom: "Lluís Ferrer", avatar: "LF" },
    titol: "Triplette en directe — ara mateix! 🔴",
    descripcio: "",
    modalitat: "Triplette",
    resultat: { equipA: 7, equipB: 9 },
    guanyador: null,
    equips: { A: ["Lluís Ferrer", "Oriol Serra", "Neus Pujol"], B: ["Marcel Riera", "Pilar Soler", "Àngel Torres"] },
    durada: null,
    mans: 10,
    precisioPuntera: null,
    carreaux: null,
    terreny: "Can Dragó · Nou Barris",
    foto: null,
    kudos: 6,
    comentaris: 1,
    temps: "ara",
    liked: false,
    live: true,
    kudosNoms: ["Joan", "Paco"],
  },
];

const NOTIFICATIONS = [
  { id: 1, avatar: "MR", text: <>Marcel Riera ha dit <b>Tirada!</b> a la teva partida</>, time: "fa 5m", read: false },
  { id: 2, avatar: "PF", text: <>Paco Fernández et desafia a una <b>Doublette!</b></>, time: "fa 1h", read: false },
  { id: 3, avatar: "MV", text: <>Montse Vidal ha comentat: <b>"Quina puntera! 🎯"</b></>, time: "fa 2h", read: false },
  { id: 4, avatar: "🏆", text: <>Has aconseguit la insígnia <b>"En Ratxa"!</b></>, time: "ahir", read: true },
  { id: 5, avatar: "JM", text: <>Joan Martí ha publicat una nova partida</>, time: "ahir", read: true },
  { id: 6, avatar: "🏟️", text: <>Club Petanca Poble Sec: <b>Torneig dissabte!</b></>, time: "fa 2d", read: true },
  { id: 7, avatar: "PS", text: <>Pilar Soler et vol afegir com a companya de <b>Doublette</b></>, time: "fa 3d", read: true },
  { id: 8, avatar: "AT", text: <>Àngel Torres ha dit <b>Tirada!</b> a la teva partida</>, time: "fa 4d", read: true },
];

const ELO_DATA = [
  { g: 1, elo: 1200 }, { g: 3, elo: 1215 }, { g: 5, elo: 1198 },
  { g: 7, elo: 1230 }, { g: 9, elo: 1255 }, { g: 11, elo: 1240 },
  { g: 13, elo: 1270 }, { g: 15, elo: 1285 }, { g: 17, elo: 1260 },
  { g: 19, elo: 1300 }, { g: 21, elo: 1310 }, { g: 23, elo: 1295 },
  { g: 25, elo: 1325 }, { g: 27, elo: 1340 }, { g: 29, elo: 1342 },
];

const HISTORIAL = [
  { data: "24 Feb", res: [13, 8], rival: "Paco F.", terreny: "Jardins de Montjuïc", mod: "Tête-à-tête", dur: 38, win: true },
  { data: "23 Feb", res: [13, 11], rival: "Club El Gato", terreny: "Club Petanca El Gato", mod: "Triplette", dur: 55, win: true },
  { data: "21 Feb", res: [7, 13], rival: "Montse V.", terreny: "Boulodrom del Poble Sec", mod: "Tête-à-tête", dur: 35, win: false },
  { data: "20 Feb", res: [13, 5], rival: "Àngel T.", terreny: "Boulodrom Municipal de Sants", mod: "Doublette", dur: 29, win: true },
  { data: "18 Feb", res: [13, 9], rival: "Rosa C.", terreny: "Parc de la Ciutadella", mod: "Doublette", dur: 44, win: true },
  { data: "16 Feb", res: [13, 12], rival: "Joan M.", terreny: "Club Petanca La Bola d'Or", mod: "Tête-à-tête", dur: 51, win: true },
  { data: "14 Feb", res: [10, 13], rival: "Lluís F.", terreny: "Can Dragó · Nou Barris", mod: "Triplette", dur: 48, win: false },
  { data: "12 Feb", res: [13, 6], rival: "Carmen D.", terreny: "Platja de la Barceloneta", mod: "Doublette", dur: 33, win: true },
  { data: "10 Feb", res: [8, 13], rival: "Enric B.", terreny: "Jardins de Montjuïc", mod: "Tête-à-tête", dur: 40, win: false },
  { data: "8 Feb", res: [13, 4], rival: "Neus P.", terreny: "Boulodrom del Poble Sec", mod: "Doublette", dur: 26, win: true },
];

const INSIGNIES = [
  { icon: "🎯", nom: "Primer Cochonnet", desc: "Registra la 1a partida", got: true },
  { icon: "🔥", nom: "En Ratxa", desc: "5 victòries seguides", got: true },
  { icon: "💋", nom: "Fanny!", desc: "Guanya o perd 13-0", got: true },
  { icon: "💎", nom: "Carreau Master", desc: "10 carreaux en una setmana", got: true },
  { icon: "🗺️", nom: "Explorador", desc: "Juga en 10 terrenys", got: false, prog: "7/10" },
  { icon: "🌙", nom: "Noctàmbul", desc: "10 partides nocturnes", got: false, prog: "6/10" },
  { icon: "🏔️", nom: "ELO 1500", desc: "Arriba a 1500 ELO", got: false, prog: "1342/1500" },
  { icon: "🎭", nom: "Polivalent", desc: "Guanya en les 3 modalitats", got: true },
  { icon: "☀️", nom: "Estiu Etern", desc: "30 dies seguits jugant", got: false, prog: "18/30" },
  { icon: "👑", nom: "Rei del Boulodrom", desc: "Més victòries en un terreny", got: true },
  { icon: "🤝", nom: "Biberon", desc: "100 tirs que toquen cochonnet", got: false, prog: "67/100" },
  { icon: "📸", nom: "Fotògraf", desc: "Fotos en 20 partides", got: false, prog: "11/20" },
  { icon: "🍷", nom: "Pastís!", desc: "Guanya sense que marquin punt", got: true },
  { icon: "🧓", nom: "Veterà", desc: "500 partides jugades", got: false, prog: "247/500" },
];

// ─── HEATMAP DATA ──────────────────────────────────────────────
function generateHeatmap() {
  const data = [];
  const today = new Date();
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const rnd = Math.random();
    let count = 0;
    if (rnd > 0.55) count = 1;
    if (rnd > 0.82) count = 2;
    if (rnd > 0.94) count = 3;
    data.push({ date: d.toISOString().slice(0, 10), count });
  }
  return data;
}
const HEATMAP = generateHeatmap();

// ─── HELPERS ───────────────────────────────────────────────────

function Avatar({ initials, size = 40, color }) {
  const bg = color || (initials === "MR" ? "#FC4C02" : initials === "JM" ? "#3B82F6" : initials === "PS" ? "#8B5CF6" : initials === "PF" ? "#EF4444" : initials === "MV" ? "#10B981" : initials === "AT" ? "#F59E0B" : initials === "EB" ? "#6366F1" : initials === "LF" ? "#EC4899" : "#6D6D78");
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 700, fontSize: size * 0.35, flexShrink: 0,
        letterSpacing: 0.5,
      }}
    >
      {initials}
    </div>
  );
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── MAIN APP ──────────────────────────────────────────────────

export default function PetancApp() {
  const [tab, setTab] = useState(0);
  const [partides, setPartides] = useState(INITIAL_PARTIDES);
  const [likedMap, setLikedMap] = useState(() => {
    const m = {};
    INITIAL_PARTIDES.forEach((p) => (m[p.id] = p.liked));
    return m;
  });
  const [kudosCounts, setKudosCounts] = useState(() => {
    const m = {};
    INITIAL_PARTIDES.forEach((p) => (m[p.id] = p.kudos));
    return m;
  });

  // ── Registrar state
  const [regStep, setRegStep] = useState(0); // 0=config, 1=live, 2=summary
  const [regConfig, setRegConfig] = useState({
    modalitat: "Doublette",
    punts: 13,
    terreny: TERRENYS[0],
    equipA: ["Marcel Riera", "Pilar Soler"],
    equipB: ["Paco Fernández", "Montse Vidal"],
  });
  const [liveScore, setLiveScore] = useState({ a: 0, b: 0 });
  const [liveHistory, setLiveHistory] = useState([]);
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [liveRunning, setLiveRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postNotes, setPostNotes] = useState("");

  // ── Profile state
  const [profileTab, setProfileTab] = useState(0);
  const [histFilter, setHistFilter] = useState("Totes");

  // Timer
  useEffect(() => {
    let interval;
    if (liveRunning && !gameOver) {
      interval = setInterval(() => setLiveSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [liveRunning, gameOver]);

  // Toggle kudos
  const toggleKudos = useCallback((id) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    setKudosCounts((prev) => ({
      ...prev,
      [id]: prev[id] + (likedMap[id] ? -1 : 1),
    }));
  }, [likedMap]);

  // Add points in live game
  const addPoints = useCallback((team, pts) => {
    if (gameOver) return;
    setLiveScore((prev) => {
      const newScore = { ...prev };
      if (team === "a") newScore.a = Math.min(prev.a + pts, regConfig.punts);
      else newScore.b = Math.min(prev.b + pts, regConfig.punts);
      const entry = {
        ma: liveHistory.length + 1,
        team: team === "a" ? "Equip A" : "Equip B",
        pts,
        scoreA: newScore.a,
        scoreB: newScore.b,
      };
      setLiveHistory((h) => [entry, ...h]);
      if (newScore.a >= regConfig.punts || newScore.b >= regConfig.punts) {
        setGameOver(true);
        setLiveRunning(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      return newScore;
    });
  }, [gameOver, liveHistory.length, regConfig.punts]);

  // Start game
  const startGame = () => {
    setRegStep(1);
    setLiveScore({ a: 0, b: 0 });
    setLiveHistory([]);
    setLiveSeconds(0);
    setGameOver(false);
    setLiveRunning(true);
  };

  // Publish to feed
  const publishGame = () => {
    const isFanny = (liveScore.a === regConfig.punts && liveScore.b === 0) || (liveScore.b === regConfig.punts && liveScore.a === 0);
    const newPartida = {
      id: Date.now(),
      jugador: { nom: USER.nom, avatar: USER.avatar },
      titol: postTitle || `${regConfig.modalitat} al ${regConfig.terreny.split("·")[0].trim()}`,
      descripcio: postNotes,
      modalitat: regConfig.modalitat,
      resultat: { equipA: liveScore.a, equipB: liveScore.b },
      guanyador: liveScore.a > liveScore.b ? "A" : "B",
      equips: { A: regConfig.equipA, B: regConfig.equipB },
      durada: Math.floor(liveSeconds / 60),
      mans: liveHistory.length,
      precisioPuntera: Math.floor(Math.random() * 30 + 50),
      carreaux: Math.floor(Math.random() * 4),
      terreny: regConfig.terreny,
      foto: null,
      kudos: 0,
      comentaris: 0,
      temps: "ara",
      liked: false,
      kudosNoms: [],
      fanny: isFanny,
    };
    setPartides((prev) => [newPartida, ...prev]);
    setLikedMap((prev) => ({ ...prev, [newPartida.id]: false }));
    setKudosCounts((prev) => ({ ...prev, [newPartida.id]: 0 }));
    setRegStep(0);
    setPostTitle("");
    setPostNotes("");
    setTab(0);
  };

  // Reset registrar when tab changes
  useEffect(() => {
    if (tab !== 1) {
      // don't reset if game is running
    }
  }, [tab]);

  const notifCount = NOTIFICATIONS.filter((n) => !n.read).length;

  // ── CSS-in-JS style objects
  const styles = {
    app: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif",
      maxWidth: 430, margin: "0 auto", background: COLORS.bg, minHeight: "100vh",
      position: "relative", color: COLORS.text, overflowX: "hidden",
      boxShadow: "0 0 60px rgba(0,0,0,0.08)",
    },
    header: {
      position: "sticky", top: 0, zIndex: 50, background: COLORS.bg,
      borderBottom: `1px solid ${COLORS.border}`, padding: "12px 16px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    },
    logo: { fontSize: 20, fontWeight: 800, color: COLORS.primary, letterSpacing: -0.5 },
    tabBar: {
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, background: COLORS.bg,
      borderTop: `1px solid ${COLORS.border}`, display: "flex",
      padding: "6px 0 env(safe-area-inset-bottom, 8px)", zIndex: 50,
      boxShadow: "0 -2px 12px rgba(0,0,0,0.04)",
    },
    tabItem: (active) => ({
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
      gap: 2, padding: "6px 0", cursor: "pointer", position: "relative",
      color: active ? COLORS.primary : COLORS.textTer, fontSize: 10, fontWeight: 500,
      background: "none", border: "none", transition: "color 0.15s",
    }),
    content: { paddingBottom: 80, minHeight: "100vh" },
  };

  // ─── FEED ────────────────────────────────────────────────────

  function FeedCard({ p }) {
    const isLive = p.live;
    const scoreA = p.resultat.equipA;
    const scoreB = p.resultat.equipB;
    const aWins = p.guanyador === "A";
    const bWins = p.guanyador === "B";

    return (
      <div style={{ background: COLORS.bg, borderBottom: `8px solid ${COLORS.bgGrey}` }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", padding: "14px 16px 0", gap: 10 }}>
          <Avatar initials={p.jugador.avatar} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{p.jugador.nom}</span>
              <span style={{ color: COLORS.textTer, fontSize: 12 }}>· {p.temps}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: COLORS.textSec, fontSize: 12, marginTop: 1 }}>
              <Target size={12} />
              <span>{p.modalitat}</span>
              <span style={{ color: COLORS.textTer }}>·</span>
              <MapPin size={11} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.terreny}</span>
            </div>
          </div>
          <button style={{ background: "none", border: "none", padding: 4, color: COLORS.textTer, cursor: "pointer" }}>
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Title & description */}
        <div style={{ padding: "8px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isLive && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11,
                fontWeight: 700, color: COLORS.green, background: "#E6F9EE", padding: "2px 8px",
                borderRadius: 10, textTransform: "uppercase", letterSpacing: 0.5,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", background: COLORS.green,
                  animation: "pulse 1.5s ease-in-out infinite",
                }} />
                En directe
              </span>
            )}
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{p.titol}</h3>
          </div>
          {p.descripcio && (
            <p style={{ fontSize: 14, color: COLORS.textSec, margin: "4px 0 0", lineHeight: 1.4 }}>{p.descripcio}</p>
          )}
        </div>

        {/* Metrics */}
        <div style={{ margin: "12px 16px", background: COLORS.metricBg, borderRadius: 10, overflow: "hidden" }}>
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            <MetricCell
              value={
                <span>
                  <span style={{ color: aWins ? COLORS.green : isLive ? COLORS.text : COLORS.red }}>{scoreA}</span>
                  <span style={{ color: COLORS.textTer, margin: "0 4px" }}>-</span>
                  <span style={{ color: bWins ? COLORS.green : isLive ? COLORS.text : COLORS.red }}>{scoreB}</span>
                </span>
              }
              label="RESULTAT"
              first
            />
            <MetricCell value={p.durada != null ? `${p.durada} min` : "—"} label="DURADA" />
            <MetricCell value={p.mans} label="MANS" />
          </div>
          <div style={{ height: 1, background: COLORS.border }} />
          {/* Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            <MetricCell value={p.modalitat} label="MODALITAT" first small />
            <MetricCell value={p.precisioPuntera != null ? `${p.precisioPuntera}%` : "—"} label="PUNTERA" small />
            <MetricCell value={p.carreaux != null ? p.carreaux : "—"} label="CARREAUX" small />
          </div>
        </div>

        {/* Fanny badge */}
        {p.fanny && (
          <div style={{
            margin: "0 16px 8px", padding: "8px 12px", background: "#FFF0E6",
            borderRadius: 8, display: "flex", alignItems: "center", gap: 8,
            border: `1px solid ${COLORS.primary}22`,
          }}>
            <span style={{ fontSize: 24 }}>🍑</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.primary }}>FANNY!</div>
              <div style={{ fontSize: 12, color: COLORS.textSec }}>13-0 · Partida sense pietat</div>
            </div>
          </div>
        )}

        {/* Photo */}
        {p.foto !== null && p.foto !== undefined && (
          <div style={{ margin: "0 16px 12px" }}>
            <div style={{
              width: "100%", height: 200, borderRadius: 10, overflow: "hidden",
              background: `linear-gradient(135deg, #E8E8ED 0%, #D1D1D8 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: COLORS.textTer, fontSize: 13,
            }}>
              <div style={{ textAlign: "center" }}>
                <Camera size={28} style={{ opacity: 0.4 }} />
                <div style={{ marginTop: 4, opacity: 0.5 }}>📸 {p.terreny}</div>
              </div>
            </div>
          </div>
        )}

        {/* Kudos line */}
        {(kudosCounts[p.id] > 0 || p.kudosNoms?.length > 0) && (
          <div style={{ padding: "0 16px 4px", fontSize: 12, color: COLORS.textSec, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex" }}>
              {(p.kudosNoms || []).slice(0, 3).map((_, i) => (
                <div key={i} style={{
                  width: 18, height: 18, borderRadius: "50%", background: COLORS.primary,
                  border: `2px solid ${COLORS.bg}`, marginLeft: i > 0 ? -6 : 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 7, fontWeight: 700,
                }}>
                  {(p.kudosNoms[i] || "?")[0]}
                </div>
              ))}
            </div>
            <span>
              {(p.kudosNoms || []).slice(0, 2).join(", ")}
              {(kudosCounts[p.id] || 0) > 2 && ` i ${(kudosCounts[p.id] || 0) - 2} més`} han dit Tirada!
            </span>
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", gap: 20, padding: "10px 16px 14px",
          borderTop: `1px solid ${COLORS.border}`, margin: "4px 16px 0", paddingLeft: 0, paddingRight: 0,
        }}>
          <button
            onClick={() => toggleKudos(p.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
              cursor: "pointer", color: likedMap[p.id] ? COLORS.kudosOn : COLORS.kudosOff,
              fontWeight: likedMap[p.id] ? 600 : 400, fontSize: 13, padding: 0,
              transition: "all 0.2s",
            }}
          >
            <ThumbsUp size={18} fill={likedMap[p.id] ? COLORS.kudosOn : "none"} />
            <span>{kudosCounts[p.id] || 0} Tirada!</span>
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
            cursor: "pointer", color: COLORS.textTer, fontSize: 13, padding: 0,
          }}>
            <MessageCircle size={18} />
            <span>{p.comentaris}</span>
          </button>
          <div style={{ flex: 1 }} />
          <button style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textTer, padding: 0 }}>
            <Share2 size={18} />
          </button>
        </div>
      </div>
    );
  }

  function MetricCell({ value, label, first, small }) {
    return (
      <div style={{
        padding: small ? "10px 8px" : "14px 8px", textAlign: "center",
        borderLeft: first ? "none" : `1px solid ${COLORS.border}`,
      }}>
        <div style={{ fontSize: small ? 16 : 22, fontWeight: 700, color: COLORS.text, lineHeight: 1.2 }}>
          {value}
        </div>
        <div style={{
          fontSize: 10, fontWeight: 500, color: COLORS.textSec, textTransform: "uppercase",
          letterSpacing: 0.8, marginTop: 3,
        }}>
          {label}
        </div>
      </div>
    );
  }

  function Feed() {
    return (
      <div>
        {partides.map((p) => (
          <FeedCard key={p.id} p={p} />
        ))}
      </div>
    );
  }

  // ─── REGISTRAR ───────────────────────────────────────────────

  function Registrar() {
    if (regStep === 0) return <RegConfig />;
    if (regStep === 1) return <RegLive />;
    if (regStep === 2) return <RegSummary />;
  }

  function PillSelect({ options, value, onChange }) {
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
              border: value === opt ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
              background: value === opt ? `${COLORS.primary}10` : COLORS.bg,
              color: value === opt ? COLORS.primary : COLORS.text,
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

  function RegConfig() {
    return (
      <div style={{ padding: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 24px", textAlign: "center" }}>Nova Partida</h2>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>Modalitat</label>
          <PillSelect options={["Tête-à-tête", "Doublette", "Triplette"]} value={regConfig.modalitat} onChange={(v) => setRegConfig((c) => ({ ...c, modalitat: v }))} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>Punts objectiu</label>
          <PillSelect options={["11", "13", "15"]} value={String(regConfig.punts)} onChange={(v) => setRegConfig((c) => ({ ...c, punts: parseInt(v) }))} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>Terreny</label>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "12px 14px",
            border: `1px solid ${COLORS.border}`, borderRadius: 10, background: COLORS.bg,
          }}>
            <MapPin size={16} color={COLORS.primary} />
            <select
              value={regConfig.terreny}
              onChange={(e) => setRegConfig((c) => ({ ...c, terreny: e.target.value }))}
              style={{
                flex: 1, border: "none", outline: "none", fontSize: 14, color: COLORS.text,
                background: "transparent", fontFamily: "inherit",
              }}
            >
              {TERRENYS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {["A", "B"].map((team) => (
          <div key={team} style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
              Equip {team}
            </label>
            {regConfig[`equip${team}`].map((name, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
                border: `1px solid ${COLORS.border}`, borderRadius: 10, marginBottom: 6,
                background: COLORS.bgGrey,
              }}>
                <User size={16} color={COLORS.textSec} />
                <span style={{ fontSize: 14 }}>{name}</span>
              </div>
            ))}
          </div>
        ))}

        <button
          onClick={startGame}
          style={{
            width: "100%", padding: "14px 0", background: COLORS.primary, color: "#fff",
            border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer",
            marginTop: 8, letterSpacing: 0.3,
          }}
        >
          Començar Partida
        </button>
      </div>
    );
  }

  function RegLive() {
    const currentMa = liveHistory.length + 1;
    const isFanny = gameOver && (liveScore.a === 0 || liveScore.b === 0);

    return (
      <div style={{ padding: "0 16px 20px" }}>
        {/* Confetti */}
        {showConfetti && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
            pointerEvents: "none", overflow: "hidden",
          }}>
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${Math.random() * 100}%`,
                  top: -20,
                  width: 8 + Math.random() * 8,
                  height: 8 + Math.random() * 8,
                  background: ["#FC4C02", "#00B84D", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"][i % 6],
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                  animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-in forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Live indicator */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 0 8px",
        }}>
          {!gameOver ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", background: COLORS.green,
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.green, textTransform: "uppercase", letterSpacing: 0.8 }}>En directe</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Trophy size={16} color={COLORS.primary} />
              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.primary, textTransform: "uppercase" }}>Partida acabada!</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.textSec }}>
            <Clock size={14} />
            <span style={{ fontSize: 15, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              {formatTime(liveSeconds)}
            </span>
          </div>
        </div>

        <div style={{ fontSize: 12, color: COLORS.textSec, marginBottom: 16 }}>
          {regConfig.terreny} · {regConfig.modalitat}
        </div>

        {/* Scoreboard */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center",
          marginBottom: 20,
        }}>
          <ScorePanel team="Equip A" score={liveScore.a} players={regConfig.equipA} isWinner={gameOver && liveScore.a > liveScore.b} color="#3B82F6" />
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.textTer, textAlign: "center" }}>VS</div>
          <ScorePanel team="Equip B" score={liveScore.b} players={regConfig.equipB} isWinner={gameOver && liveScore.b > liveScore.a} color="#EF4444" />
        </div>

        {/* Fanny! */}
        {isFanny && (
          <div style={{
            textAlign: "center", padding: 16, background: "#FFF0E6", borderRadius: 12,
            marginBottom: 16, border: `2px solid ${COLORS.primary}`,
          }}>
            <div style={{ fontSize: 40 }}>🍑</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.primary }}>FANNY!</div>
            <div style={{ fontSize: 13, color: COLORS.textSec }}>Quin destrossa!</div>
          </div>
        )}

        {/* Point buttons */}
        {!gameOver && (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textSec, marginBottom: 10, textAlign: "center" }}>
              Mà #{currentMa} — Qui guanya aquesta mà?
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <PointButtons team="a" label="Equip A" color="#3B82F6" onAdd={addPoints} />
              <PointButtons team="b" label="Equip B" color="#EF4444" onAdd={addPoints} />
            </div>
          </>
        )}

        {/* History */}
        {liveHistory.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
              Historial de mans
            </div>
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              {liveHistory.map((h, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 12px", background: i % 2 === 0 ? COLORS.bgGrey : COLORS.bg,
                  borderRadius: 6, marginBottom: 2, fontSize: 13,
                }}>
                  <span style={{ color: COLORS.textSec }}>Mà {h.ma}</span>
                  <span style={{ fontWeight: 600 }}>{h.team} +{h.pts}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums", color: COLORS.textSec }}>({h.scoreA}-{h.scoreB})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {gameOver ? (
          <button
            onClick={() => setRegStep(2)}
            style={{
              width: "100%", padding: "14px 0", background: COLORS.primary, color: "#fff",
              border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer",
            }}
          >
            Continuar →
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { setGameOver(true); setLiveRunning(false); }}
              style={{
                flex: 1, padding: "12px 0", background: COLORS.bgGrey, color: COLORS.text,
                border: `1px solid ${COLORS.border}`, borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              🏁 Acabar Partida
            </button>
            <button
              onClick={() => { setRegStep(0); setLiveRunning(false); }}
              style={{
                padding: "12px 16px", background: "none", color: COLORS.red,
                border: `1px solid ${COLORS.red}33`, borderRadius: 10, fontSize: 14,
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>
        )}
      </div>
    );
  }

  function ScorePanel({ team, score, players, isWinner, color }) {
    return (
      <div style={{
        background: COLORS.bgGrey, borderRadius: 14, padding: "16px 10px", textAlign: "center",
        border: isWinner ? `2px solid ${COLORS.green}` : `1px solid ${COLORS.border}`,
        position: "relative",
      }}>
        {isWinner && (
          <div style={{
            position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
            background: COLORS.green, color: "#fff", fontSize: 10, fontWeight: 700,
            padding: "2px 10px", borderRadius: 8, textTransform: "uppercase",
          }}>
            Guanyador
          </div>
        )}
        <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
          {team}
        </div>
        <div style={{ fontSize: 56, fontWeight: 800, color: isWinner ? COLORS.green : COLORS.text, lineHeight: 1 }}>
          {score}
        </div>
        <div style={{ marginTop: 8 }}>
          {players.map((p, i) => (
            <div key={i} style={{ fontSize: 12, color: COLORS.textSec }}>{p}</div>
          ))}
        </div>
      </div>
    );
  }

  function PointButtons({ team, label, color, onAdd }) {
    return (
      <div style={{ background: COLORS.bgGrey, borderRadius: 12, padding: 12, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
          {label}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {[1, 2, 3, 4].map((pts) => (
            <button
              key={pts}
              onClick={() => onAdd(team, pts)}
              style={{
                padding: "12px 0", borderRadius: 8, border: `1px solid ${color}33`,
                background: COLORS.bg, fontSize: 16, fontWeight: 700, color,
                cursor: "pointer", transition: "all 0.1s",
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              +{pts}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function RegSummary() {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 32 }}>🏆</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: "8px 0 4px" }}>Partida Acabada!</h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center",
          background: COLORS.bgGrey, borderRadius: 12, padding: "20px 16px", marginBottom: 20,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: liveScore.a > liveScore.b ? COLORS.green : COLORS.red }}>
              {liveScore.a}
            </div>
            <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 4 }}>
              {regConfig.equipA.map((n, i) => <div key={i}>{n}</div>)}
            </div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.textTer }}>—</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: liveScore.b > liveScore.a ? COLORS.green : COLORS.red }}>
              {liveScore.b}
            </div>
            <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 4 }}>
              {regConfig.equipB.map((n, i) => <div key={i}>{n}</div>)}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 13, color: COLORS.textSec, marginBottom: 24 }}>
          <span>⏱ {Math.floor(liveSeconds / 60)} min</span>
          <span>· {liveHistory.length} mans</span>
          <span>· {regConfig.modalitat}</span>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>
            Títol de la partida
          </label>
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Ex: Doublette épica al Poble Sec!"
            style={{
              width: "100%", padding: "12px 14px", border: `1px solid ${COLORS.border}`,
              borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>
            Notes (opcional)
          </label>
          <textarea
            value={postNotes}
            onChange={(e) => setPostNotes(e.target.value)}
            placeholder="Com ha anat la partida..."
            rows={3}
            style={{
              width: "100%", padding: "12px 14px", border: `1px solid ${COLORS.border}`,
              borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit",
              resize: "vertical", boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={publishGame}
          style={{
            width: "100%", padding: "14px 0", background: COLORS.primary, color: "#fff",
            border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer",
          }}
        >
          Publicar al Feed
        </button>
      </div>
    );
  }

  // ─── PROFILE ─────────────────────────────────────────────────

  function Profile() {
    return (
      <div>
        {/* Header */}
        <div style={{ padding: "20px 16px", textAlign: "center", borderBottom: `1px solid ${COLORS.border}` }}>
          <Avatar initials={USER.avatar} size={80} color={COLORS.primary} />
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "12px 0 2px" }}>{USER.nom}</h2>
          <div style={{ fontSize: 13, color: COLORS.textSec }}>@{USER.username}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 8, fontSize: 12, color: COLORS.textSec, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin size={12} /> {USER.ciutat}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Target size={12} /> {USER.rol} · Ma {USER.ma}</span>
          </div>
          <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 4 }}>
            🔴 {USER.boles}
          </div>

          <button style={{
            marginTop: 12, padding: "8px 24px", border: `1px solid ${COLORS.border}`,
            borderRadius: 20, background: "none", fontSize: 13, fontWeight: 600,
            color: COLORS.text, cursor: "pointer",
          }}>
            Editar perfil
          </button>

          {/* Stats row */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0,
            marginTop: 16, borderTop: `1px solid ${COLORS.border}`, paddingTop: 16,
          }}>
            {[
              [USER.partides, "Partides"],
              [USER.victories, "Victòries"],
              [USER.elo, "ELO"],
            ].map(([val, lab], i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{val}</div>
                <div style={{ fontSize: 11, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: 0.5 }}>{lab}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile tabs */}
        <div style={{
          display: "flex", borderBottom: `1px solid ${COLORS.border}`,
          position: "sticky", top: 48, background: COLORS.bg, zIndex: 10,
        }}>
          {["Resum", "Estadístiques", "Historial", "Insígnies"].map((t, i) => (
            <button
              key={t}
              onClick={() => setProfileTab(i)}
              style={{
                flex: 1, padding: "12px 4px", fontSize: 12, fontWeight: 600,
                background: "none", border: "none", borderBottom: profileTab === i ? `2px solid ${COLORS.primary}` : "2px solid transparent",
                color: profileTab === i ? COLORS.primary : COLORS.textSec,
                cursor: "pointer", transition: "all 0.15s", letterSpacing: 0.3,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ padding: 16 }}>
          {profileTab === 0 && <ProfileResum />}
          {profileTab === 1 && <ProfileStats />}
          {profileTab === 2 && <ProfileHistorial />}
          {profileTab === 3 && <ProfileInsignies />}
        </div>
      </div>
    );
  }

  function ProfileResum() {
    return (
      <div>
        {/* Heatmap */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Activitat</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {HEATMAP.map((d, i) => (
              <div
                key={i}
                title={`${d.date}: ${d.count} partides`}
                style={{
                  width: 10, height: 10, borderRadius: 2,
                  background: d.count === 0 ? "#EBEDF0" : d.count === 1 ? "#FDCFB0" : d.count === 2 ? "#FC8C52" : COLORS.primary,
                  cursor: "default",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6, fontSize: 10, color: COLORS.textTer, alignItems: "center" }}>
            <span>Menys</span>
            {[0, 1, 2, 3].map((v) => (
              <div key={v} style={{
                width: 10, height: 10, borderRadius: 2,
                background: v === 0 ? "#EBEDF0" : v === 1 ? "#FDCFB0" : v === 2 ? "#FC8C52" : COLORS.primary,
              }} />
            ))}
            <span>Més</span>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Aquest mes</div>
          <div style={{ background: COLORS.metricBg, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              <MetricCell value="12" label="Partides" first />
              <MetricCell value="8" label="Victòries" />
              <MetricCell value="67%" label="% Victòria" />
            </div>
            <div style={{ height: 1, background: COLORS.border }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              <MetricCell value="9h 45m" label="Temps jugat" first small />
              <MetricCell value="72%" label="Precisió punt." small />
              <MetricCell value="7" label="Carreaux" small />
            </div>
          </div>
        </div>

        {/* Streak */}
        <div style={{
          padding: "12px 16px", background: `${COLORS.primary}08`, borderRadius: 10,
          border: `1px solid ${COLORS.primary}20`, marginBottom: 24,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Flame size={20} color={COLORS.primary} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>5 victòries consecutives</div>
            <div style={{ fontSize: 12, color: COLORS.textSec }}>Millor ratxa personal!</div>
          </div>
        </div>

        {/* Recent games */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Últimes partides</div>
          {HISTORIAL.slice(0, 5).map((h, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
              borderBottom: `1px solid ${COLORS.border}`,
            }}>
              <span style={{
                fontSize: 16, width: 24, textAlign: "center",
                color: h.win ? COLORS.green : COLORS.red,
              }}>
                {h.win ? "✅" : "❌"}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  <span style={{ color: h.win ? COLORS.green : COLORS.red }}>{h.res[0]}-{h.res[1]}</span> vs {h.rival}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textSec }}>{h.mod} · {h.data}</div>
              </div>
              <ChevronRight size={16} color={COLORS.textTer} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function ProfileStats() {
    const modData = [
      { name: "Tête-à-tête", pct: 78, games: 45 },
      { name: "Doublette", pct: 62, games: 89 },
      { name: "Triplette", pct: 85, games: 34 },
    ];

    return (
      <div>
        {/* ELO Chart */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Evolució ELO</div>
          <div style={{ background: COLORS.bgGrey, borderRadius: 12, padding: "16px 8px 8px" }}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={ELO_DATA}>
                <XAxis dataKey="g" tick={{ fontSize: 10, fill: COLORS.textTer }} axisLine={false} tickLine={false} />
                <YAxis domain={["dataMin - 30", "dataMax + 20"]} tick={{ fontSize: 10, fill: COLORS.textTer }} axisLine={false} tickLine={false} width={35} />
                <Tooltip
                  contentStyle={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${v}`, "ELO"]}
                  labelFormatter={(l) => `Partida ${l}`}
                />
                <Line
                  type="monotone" dataKey="elo" stroke={COLORS.primary}
                  strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: COLORS.primary }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ textAlign: "center", fontSize: 12, color: COLORS.textSec, marginTop: 4 }}>
              ELO actual: <span style={{ fontWeight: 700, color: COLORS.primary }}>{USER.elo}</span>
            </div>
          </div>
        </div>

        {/* Performance by modality */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Rendiment per modalitat</div>
          {modData.map((m) => (
            <div key={m.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{m.name}</span>
                <span style={{ color: COLORS.textSec }}>{m.pct}% ({m.games} partides)</span>
              </div>
              <div style={{ height: 8, background: COLORS.metricBg, borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${m.pct}%`, background: COLORS.primary,
                  borderRadius: 4, transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Puntera vs Tir */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Precisió</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: COLORS.bgGrey, borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.primary }}>68%</div>
              <div style={{ fontSize: 11, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}>Puntera</div>
              <div style={{ fontSize: 11, color: COLORS.green, marginTop: 4 }}>Millor que el 72% dels jugadors</div>
            </div>
            <div style={{ background: COLORS.bgGrey, borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.text }}>45%</div>
              <div style={{ fontSize: 11, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}>Tir</div>
              <div style={{ fontSize: 11, color: COLORS.textSec, marginTop: 4 }}>3.2 carreaux/mes</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ProfileHistorial() {
    const filters = ["Totes", "Victòries", "Derrotes", "Tête-à-tête", "Doublette", "Triplette"];
    const filtered = HISTORIAL.filter((h) => {
      if (histFilter === "Totes") return true;
      if (histFilter === "Victòries") return h.win;
      if (histFilter === "Derrotes") return !h.win;
      return h.mod === histFilter;
    });

    return (
      <div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setHistFilter(f)}
              style={{
                padding: "6px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600,
                border: histFilter === f ? `1.5px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
                background: histFilter === f ? `${COLORS.primary}10` : COLORS.bg,
                color: histFilter === f ? COLORS.primary : COLORS.textSec,
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.map((h, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", padding: "12px 0",
            borderBottom: `1px solid ${COLORS.border}`, gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              background: h.win ? `${COLORS.green}15` : `${COLORS.red}15`,
              color: h.win ? COLORS.green : COLORS.red, fontWeight: 800, fontSize: 13,
            }}>
              {h.win ? "V" : "D"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                <span style={{ color: h.win ? COLORS.green : COLORS.red }}>{h.res[0]}-{h.res[1]}</span> vs {h.rival}
              </div>
              <div style={{ fontSize: 12, color: COLORS.textSec, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {h.mod} · {h.terreny} · {h.dur} min
              </div>
            </div>
            <div style={{ fontSize: 12, color: COLORS.textTer, flexShrink: 0 }}>{h.data}</div>
          </div>
        ))}
      </div>
    );
  }

  function ProfileInsignies() {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {INSIGNIES.map((ins, i) => (
          <div
            key={i}
            style={{
              background: COLORS.bgGrey, borderRadius: 12, padding: "16px 8px", textAlign: "center",
              opacity: ins.got ? 1 : 0.45, position: "relative",
              border: ins.got ? `1px solid ${COLORS.primary}30` : `1px solid ${COLORS.border}`,
            }}
          >
            {ins.got && (
              <div style={{
                position: "absolute", top: 6, right: 6, width: 16, height: 16, borderRadius: "50%",
                background: COLORS.green, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Check size={10} color="#fff" strokeWidth={3} />
              </div>
            )}
            <div style={{ fontSize: 28, marginBottom: 6 }}>{ins.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 2, lineHeight: 1.2 }}>{ins.nom}</div>
            <div style={{ fontSize: 10, color: COLORS.textSec, lineHeight: 1.2 }}>{ins.desc}</div>
            {!ins.got && ins.prog && (
              <div style={{ fontSize: 10, color: COLORS.primary, fontWeight: 600, marginTop: 4 }}>{ins.prog}</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ─── NOTIFICATIONS ───────────────────────────────────────────

  function Notificacions() {
    return (
      <div>
        <div style={{ padding: "16px 16px 8px", fontSize: 13, fontWeight: 700, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Notificacions
        </div>
        {NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            style={{
              display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px",
              background: n.read ? COLORS.bg : "#FFF8F5",
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            {n.avatar.length <= 3 ? (
              <Avatar initials={n.avatar} size={36} />
            ) : (
              <div style={{
                width: 36, height: 36, borderRadius: "50%", background: COLORS.metricBg,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
              }}>
                {n.avatar}
              </div>
            )}
            <div style={{ flex: 1, fontSize: 13, lineHeight: 1.4 }}>
              {n.text}
            </div>
            <div style={{ fontSize: 11, color: COLORS.textTer, flexShrink: 0, whiteSpace: "nowrap" }}>
              {n.time}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── RENDER ──────────────────────────────────────────────────

  const tabs = [
    { icon: Home, label: "Feed" },
    { icon: PlusCircle, label: "Registrar" },
    { icon: BarChart3, label: "Perfil" },
    { icon: Bell, label: "Notificacions" },
  ];

  return (
    <div style={{ background: "#E8E8ED", minHeight: "100vh" }}>
      {/* CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: #E8E8ED; }
        ::-webkit-scrollbar { width: 0; }
        input, textarea, select { font-family: inherit; }
      `}</style>

      <div style={styles.app}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>PetancApp</div>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ background: "none", border: "none", color: COLORS.textSec, cursor: "pointer", padding: 4 }}>
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {tab === 0 && <Feed />}
          {tab === 1 && <Registrar />}
          {tab === 2 && <Profile />}
          {tab === 3 && <Notificacions />}
        </div>

        {/* Tab bar */}
        <div style={styles.tabBar}>
          {tabs.map((t, i) => {
            const Icon = t.icon;
            const active = tab === i;
            return (
              <button key={i} style={styles.tabItem(active)} onClick={() => setTab(i)}>
                <div style={{ position: "relative" }}>
                  <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                  {i === 3 && notifCount > 0 && (
                    <div style={{
                      position: "absolute", top: -4, right: -8, width: 16, height: 16,
                      borderRadius: "50%", background: COLORS.red, color: "#fff",
                      fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {notifCount}
                    </div>
                  )}
                </div>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
