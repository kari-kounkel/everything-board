import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { supabase } from "./supabase";
import { useUniverses, useCards, useUserSettings } from "./useSupabase";

// ============================================================
// DATA: The Everything Board v3.3 — Sellable Edition
// ============================================================
const BINDER_TABS = [
  { id: "dashboard", num: "0", title: "Dashboard", emoji: "📊", color: "#2D2D2D" },
  { id: "projects", num: "1", title: "Projects", emoji: "🚀", color: "#C7366B" },
  { id: "writing", num: "2", title: "Writing", emoji: "📚", color: "#9B2335" },
  { id: "content", num: "3", title: "Content", emoji: "🎬", color: "#D4644E" },
  { id: "clients", num: "4", title: "Clients", emoji: "🤝", color: "#4A6FA5" },
  { id: "business", num: "5", title: "Business", emoji: "💼", color: "#5B8C5A" },
  { id: "planning", num: "6", title: "Planning", emoji: "🗺️", color: "#2D6A9F" },
  { id: "ideas", num: "7", title: "Ideas", emoji: "💡", color: "#E07B39" },
  { id: "systems", num: "8", title: "Systems", emoji: "⚙️", color: "#3A7D7B" },
  { id: "learning", num: "9", title: "Learning", emoji: "🧠", color: "#6B5B8A" },
  { id: "money", num: "10", title: "Money", emoji: "💰", color: "#8B6D3F" },
  { id: "people", num: "11", title: "People", emoji: "👥", color: "#C7548E" },
  { id: "archive", num: "12", title: "Archive", emoji: "🗃️", color: "#7B6E8A" },
  { id: "compost", num: "∞", title: "Compost", emoji: "🪱", color: "#8B7355" },
  { id: "mastertodo", num: "★", title: "Master To-Do", emoji: "👑", color: "#E8B931" },
];

const STATUS_LISTS = [
  { id: "focus", title: "✨ This Week's Focus", color: "#E8B931" },
  { id: "inprogress", title: "🛠 In Progress", color: "#E07B39" },
  { id: "brainstorm", title: "🧠 Brainstorm", color: "#6B5B8A" },
  { id: "onice", title: "🧊 On Ice", color: "#7B8FB2" },
  { id: "complete", title: "✅ Complete", color: "#5B8C5A" },
];

const TODO_DAYS = [
  { id: "monday", title: "Monday" },
  { id: "tuesday", title: "Tuesday" },
  { id: "wednesday", title: "Wednesday" },
  { id: "thursday", title: "Thursday" },
  { id: "friday", title: "Friday" },
  { id: "weekend", title: "Weekend" },
  { id: "icebox", title: "🧊 Icebox" },
  { id: "done", title: "✅ Done" },
];

const LABELS = [
  { id: "urgent", name: "Urgent", color: "#D4644E" },
  { id: "inprog", name: "In Progress", color: "#E8B931" },
  { id: "review", name: "Ready for Review", color: "#5B8C5A" },
  { id: "scheduled", name: "Scheduled", color: "#4A6FA5" },
  { id: "needsinput", name: "Needs Input", color: "#6B5B8A" },
  { id: "waiting", name: "Waiting On", color: "#E07B39" },
  { id: "backlog", name: "Backlog", color: "#999" },
  { id: "writing", name: "Writing", color: "#9B2335" },
  { id: "editing", name: "Editing", color: "#C7548E" },
  { id: "design", name: "Design", color: "#3A7D7B" },
  { id: "published", name: "Published", color: "#2D6A9F" },
];

const LINK_TYPES = [
  { id: "depends", label: "Depends on", icon: "⛓️", reverse: "Blocks" },
  { id: "feeds", label: "Feeds into", icon: "➡️", reverse: "Fed by" },
  { id: "partof", label: "Part of", icon: "📦", reverse: "Contains" },
  { id: "related", label: "Related to", icon: "🔗", reverse: "Related to" },
];

// ============================================================
// ============================================================
// STRIPE PAYMENT LINKS
// ============================================================
const STRIPE_MONTHLY = "https://buy.stripe.com/28E00j8RpdlU8n18ew18c01";
const STRIPE_ANNUAL  = "https://buy.stripe.com/aFa5kD2t195E32H52k18c02";

// ============================================================
// UPGRADE MODAL
// ============================================================
function UpgradeModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#FEFCF6", borderRadius: "24px", maxWidth: "480px", width: "100%", padding: "40px 36px", boxShadow: "0 24px 80px rgba(0,0,0,0.3)", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "20px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#aaa" }}>×</button>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔮</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 900, color: "#1A1A1A", margin: "0 0 8px" }}>Unlock Everything</h2>
          <p style={{ color: "#888", fontSize: "0.9rem", margin: 0 }}>You're on the free plan. Here's what you're missing:</p>
        </div>
        <div style={{ background: "#FAF8F3", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
          {[
            ["🔮", "Up to 13 universes (you have 3 now)"],
            ["☁️", "Cloud sync across all your devices"],
            ["📤", "CSV export of all your projects"],
            ["🏛️", "Empire Command Center — track every app you've built"],
            ["💳", "Subscription tracker — know what you're paying"],
          ].map(([emoji, text]) => (
            <div key={text} style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "18px" }}>{emoji}</span>
              <span style={{ fontSize: "0.88rem", color: "#333", fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <a href={STRIPE_ANNUAL} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: "#1A1A1A", color: "#E8B931", padding: "16px", borderRadius: "12px", fontWeight: 800, fontSize: "1rem", textDecoration: "none", letterSpacing: "0.3px" }}>
            ✨ Go Pro — $79/year <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#aaa" }}>(best value)</span>
          </a>
          <a href={STRIPE_MONTHLY} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: "#F5F0E8", color: "#333", padding: "13px", borderRadius: "12px", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", border: "1.5px solid #E0D8C8" }}>
            Try monthly — $9/month
          </a>
        </div>
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#aaa", marginTop: "16px" }}>After payment, refresh the app. Your Pro features will be waiting.</p>
      </div>
    </div>
  );
}

// ============================================================
// LOCKED TAB OVERLAY
// ============================================================
function LockedFeature({ title, emoji, onUpgrade }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'DM Sans', sans-serif", padding: "40px" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.4 }}>{emoji}</div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#1A1A1A", marginBottom: "8px" }}>{title}</h3>
      <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "24px", textAlign: "center", maxWidth: "320px" }}>This feature is part of The Everything Board Pro. Upgrade to unlock it.</p>
      <button onClick={onUpgrade} style={{ background: "#1A1A1A", color: "#E8B931", border: "none", padding: "14px 28px", borderRadius: "12px", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer" }}>
        🔮 Upgrade to Pro
      </button>
    </div>
  );
}

// UNIVERSES — user-created, 3–13 cap, persisted in localStorage
// ============================================================
const STARTER_UNIVERSES = [
  { id: "main", name: "Main", color: "#E8B931", glow: "#E8B93155", emoji: "⭐" },
  { id: "work", name: "Work", color: "#4A6FA5", glow: "#4A6FA555", emoji: "💼" },
  { id: "personal", name: "Personal", color: "#5B8C5A", glow: "#5B8C5A55", emoji: "🌿" },
];

const UNIVERSE_MIN = 3;
const UNIVERSE_MAX = 13;

// Color palette for universe creation
const UNIVERSE_COLORS = [
  "#E8B931", "#C7366B", "#4A6FA5", "#3A7D7B", "#D4644E",
  "#6B5B8A", "#8B6D3F", "#5B8C5A", "#9B2335", "#E07B39",
  "#2D6A9F", "#C7548E", "#7B6E8A",
];

// Emoji palette for universe creation
const UNIVERSE_EMOJIS = [
  "⭐", "👑", "🔮", "🏢", "📊", "🕊️", "🏪", "🌿", "🎭", "📚",
  "🚀", "💡", "🎨", "🔥", "🌊", "🪐", "🦋", "🐝", "🍯", "🪴",
  "🏔️", "🎯", "💎", "🧭", "🪶", "🚪", "🌙", "☀️", "🎪", "🧩",
];

// Persistence for universes
const UNIVERSE_KEY = "everything-board-universes-v1";
const loadUniverses = () => {
  try {
    const r = localStorage.getItem(UNIVERSE_KEY);
    if (r) {
      const parsed = JSON.parse(r);
      if (Array.isArray(parsed) && parsed.length >= UNIVERSE_MIN) return parsed;
    }
  } catch {}
  return STARTER_UNIVERSES;
};
const saveUniverses = (u) => { try { localStorage.setItem(UNIVERSE_KEY, JSON.stringify(u)); } catch {} };

// Helper: build glow from color
const makeGlow = (color) => color + "55";

// Dynamic maps — rebuilt from universes state
const buildUniverseMaps = (universes) => {
  const nameToId = {};
  const idToName = {};
  universes.forEach(u => { nameToId[u.name] = u.id; idToName[u.id] = u.name; });
  return { nameToId, idToName };
};

// Map CSV status → board list
const STATUS_TO_LIST = {
  "ACTIVE NOW": "focus",
  "NEXT UP": "inprogress",
  "PLANTED": "brainstorm",
  "SOMEDAY": "onice",
  "DONE": "complete",
};

// Reverse map: list → CSV status
const LIST_TO_STATUS = {};
Object.entries(STATUS_TO_LIST).forEach(([csv, list]) => { LIST_TO_STATUS[list] = csv; });

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

// Helper: normalize universe field — old cards may have string, new ones have array
const getUniverses = (card) => {
  if (Array.isArray(card.universes)) return card.universes;
  if (card.universe) return [card.universe];
  return [];
};

// ============================================================
// PERSISTENCE — clean start, no seed data
// ============================================================
const STORAGE_KEY = "everything-board-cards-v1";
const ONBOARDING_KEY = "everything-board-onboarded";
const loadCards = () => { try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {} return []; };
const saveCards = (c) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch {} };
const hasOnboarded = () => { try { return localStorage.getItem(ONBOARDING_KEY) === "true"; } catch { return false; } };
const setOnboarded = () => { try { localStorage.setItem(ONBOARDING_KEY, "true"); } catch {} };

// View mode toggle persistence
const VIEW_KEY = "everything-board-view";
const loadView = () => { try { return localStorage.getItem(VIEW_KEY) || "circles"; } catch { return "circles"; } };
const saveView = (v) => { try { localStorage.setItem(VIEW_KEY, v); } catch {} };

// ============================================================
// DYNAMIC UNIVERSE STATS — calculated from actual card data
// ============================================================
function calcUniverseCounts(cards, universes) {
  const counts = {};
  universes.forEach(u => { counts[u.id] = { total: 0, active: 0, planted: 0, next: 0, done: 0, someday: 0 }; });
  cards.forEach(c => {
    const us = getUniverses(c);
    us.forEach(uid => {
      if (!counts[uid]) counts[uid] = { total: 0, active: 0, planted: 0, next: 0, done: 0, someday: 0 };
      counts[uid].total++;
      if (c.list === "focus" || c.list === "inprogress") counts[uid].active++;
      else if (c.list === "brainstorm") counts[uid].planted++;
      else if (c.list === "complete" || c.list === "done") counts[uid].done++;
      else if (c.list === "onice") counts[uid].someday++;
    });
  });
  return counts;
}

// ============================================================
// CSV EXPORT / IMPORT HELPERS
// ============================================================
const CSV_HEADERS = ["Title", "Description", "Board", "Status", "Universes", "Labels", "Due Date", "Checklist", "Notes"];

function escapeCSV(str) {
  if (!str) return "";
  const s = String(str);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function cardsToCSV(cards, universes) {
  const { idToName } = buildUniverseMaps(universes);
  const rows = [CSV_HEADERS.join(",")];
  cards.forEach(c => {
    const tab = BINDER_TABS.find(t => t.id === c.tab);
    const listObj = [...STATUS_LISTS, ...TODO_DAYS].find(l => l.id === c.list);
    const universeNames = getUniverses(c).map(uid => idToName[uid] || uid).join(" + ");
    const labelNames = (c.labels || []).map(lid => {
      const l = LABELS.find(lb => lb.id === lid);
      return l ? l.name : lid;
    }).join(", ");
    const checklistText = (c.checklist || []).map(item =>
      `${item.done ? "[x]" : "[ ]"} ${item.text}`
    ).join(" | ");
    const statusName = LIST_TO_STATUS[c.list] || listObj?.title || c.list;
    rows.push([
      escapeCSV(c.title),
      escapeCSV(c.description),
      escapeCSV(tab ? `${tab.num}. ${tab.title}` : c.tab),
      escapeCSV(statusName),
      escapeCSV(universeNames),
      escapeCSV(labelNames),
      escapeCSV(c.dueDate || ""),
      escapeCSV(checklistText),
      escapeCSV(c.completedAt ? `Completed ${new Date(c.completedAt).toLocaleDateString()}` : ""),
    ].join(","));
  });
  return rows.join("\n");
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generateTemplate(universes) {
  const header = CSV_HEADERS.join(",");
  const example = [
    escapeCSV("My Amazing Project"),
    escapeCSV("A one-liner about what this is"),
    escapeCSV("6. Brain Dumps"),
    escapeCSV("PLANTED"),
    escapeCSV(universes[0]?.name || "Main"),
    escapeCSV("Writing, Design"),
    escapeCSV("2026-12-31"),
    escapeCSV("[ ] First step | [ ] Second step"),
    escapeCSV(""),
  ].join(",");
  const boards = BINDER_TABS.filter(t => t.id !== "dashboard").map(t => `${t.num}. ${t.title}`).join(", ");
  const statuses = Object.keys(STATUS_TO_LIST).join(", ");
  const universeList = universes.map(u => u.name).join(", ");
  const labelList = LABELS.map(l => l.name).join(", ");
  const notes = [
    "",
    "# THE EVERYTHING BOARD — CSV IMPORT TEMPLATE",
    `# Boards: ${boards}`,
    `# Statuses: ${statuses}`,
    `# Universes: ${universeList}`,
    `# Labels: ${labelList}`,
    "# Multiple universes: separate with ' + ' (e.g. 'Work + Personal')",
    "# Multiple labels: separate with ', ' (e.g. 'Writing, Design')",
    "# Checklist items: separate with ' | ' and prefix with '[ ]' or '[x]'",
    "# Due dates: use YYYY-MM-DD format",
  ].join("\n");
  return header + "\n" + example + "\n" + notes;
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

function parseImportCSV(text, universes) {
  const { nameToId } = buildUniverseMaps(universes);
  const lines = text.split("\n").filter(l => l.trim() && !l.trim().startsWith("#"));
  if (lines.length < 2) return [];

  const headerLine = parseCSVLine(lines[0]);
  const titleIdx = headerLine.findIndex(h => h.toLowerCase().includes("title"));
  const descIdx = headerLine.findIndex(h => h.toLowerCase().includes("description"));
  const boardIdx = headerLine.findIndex(h => h.toLowerCase().includes("board"));
  const statusIdx = headerLine.findIndex(h => h.toLowerCase().includes("status"));
  const universeIdx = headerLine.findIndex(h => h.toLowerCase().includes("universe"));
  const labelIdx = headerLine.findIndex(h => h.toLowerCase().includes("label"));
  const dateIdx = headerLine.findIndex(h => h.toLowerCase().includes("due"));
  const checkIdx = headerLine.findIndex(h => h.toLowerCase().includes("checklist"));

  const cards = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const title = cols[titleIdx] || "";
    if (!title) continue;

    // Parse board
    let tab = "braindumps";
    if (boardIdx >= 0 && cols[boardIdx]) {
      const boardStr = cols[boardIdx].toLowerCase();
      const found = BINDER_TABS.find(t =>
        boardStr.includes(t.title.toLowerCase()) || boardStr.includes(t.id)
      );
      if (found) tab = found.id;
    }

    // Parse status
    let list = "brainstorm";
    if (statusIdx >= 0 && cols[statusIdx]) {
      const statusStr = cols[statusIdx].toUpperCase().trim();
      if (STATUS_TO_LIST[statusStr]) {
        list = STATUS_TO_LIST[statusStr];
      } else {
        // Try fuzzy match
        const allLists = [...STATUS_LISTS, ...TODO_DAYS];
        const found = allLists.find(l => l.title.toLowerCase().includes(cols[statusIdx].toLowerCase()));
        if (found) list = found.id;
      }
    }

    // Parse universes
    let cardUniverses = [];
    if (universeIdx >= 0 && cols[universeIdx]) {
      const parts = cols[universeIdx].split("+").map(s => s.trim());
      parts.forEach(p => {
        const mapped = nameToId[p];
        if (mapped) cardUniverses.push(mapped);
        else {
          // Try partial match
          const found = universes.find(u => u.name.toLowerCase().includes(p.toLowerCase()));
          if (found) cardUniverses.push(found.id);
        }
      });
    }
    if (cardUniverses.length === 0) cardUniverses = [universes[0]?.id || "main"];

    // Parse labels
    let labels = [];
    if (labelIdx >= 0 && cols[labelIdx]) {
      const parts = cols[labelIdx].split(",").map(s => s.trim());
      parts.forEach(p => {
        const found = LABELS.find(l => l.name.toLowerCase() === p.toLowerCase() || l.id === p.toLowerCase());
        if (found) labels.push(found.id);
      });
    }

    // Parse checklist
    let checklist = [];
    if (checkIdx >= 0 && cols[checkIdx]) {
      const items = cols[checkIdx].split("|").map(s => s.trim()).filter(Boolean);
      checklist = items.map(item => {
        const done = item.startsWith("[x]") || item.startsWith("[X]");
        const text = item.replace(/^\[[ xX]\]\s*/, "");
        return { id: uid(), text, done };
      });
    }

    cards.push({
      id: uid(),
      title,
      description: descIdx >= 0 ? (cols[descIdx] || "") : "",
      tab,
      list,
      labels,
      universes: cardUniverses,
      dueDate: dateIdx >= 0 && cols[dateIdx] && cols[dateIdx].match(/^\d{4}-\d{2}-\d{2}$/) ? cols[dateIdx] : "",
      checklist,
      created: now(),
      moved: now(),
      completedAt: list === "complete" || list === "done" ? now() : null,
    });
  }
  return cards;
}

// ============================================================
// COMPONENTS
// ============================================================

function ChecklistWidget({ items, onChange }) {
  const total = items.length;
  const done = items.filter(i => i.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const toggle = (cid) => onChange(items.map(i => i.id === cid ? { ...i, done: !i.done } : i));
  const addItem = () => onChange([...items, { id: uid(), text: "", done: false }]);
  const updateText = (cid, text) => onChange(items.map(i => i.id === cid ? { ...i, text } : i));
  const removeItem = (cid) => onChange(items.filter(i => i.id !== cid));

  return (
    <div style={{ marginTop: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: "10px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif" }}>
          Checklist {total > 0 ? `(${done}/${total})` : ""}
        </span>
        <div style={{ flex: 1, height: "4px", background: "#E5E0D0", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "#5B8C5A" : "#E8B931", transition: "width 0.3s ease", borderRadius: "2px" }} />
        </div>
      </div>
      {items.map(item => (
        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)}
            style={{ accentColor: "#E8B931", width: "16px", height: "16px", cursor: "pointer" }} />
          <input value={item.text} onChange={e => updateText(item.id, e.target.value)}
            placeholder="Checklist item..."
            style={{ flex: 1, border: "none", borderBottom: "1px solid #E5E0D0", padding: "4px 0", fontSize: "12px", background: "transparent", outline: "none", textDecoration: item.done ? "line-through" : "none", color: item.done ? "#aaa" : "#333", fontFamily: "'DM Sans', sans-serif" }} />
          <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "14px", padding: "0 4px" }}>×</button>
        </div>
      ))}
      <button onClick={addItem} style={{ marginTop: "6px", background: "none", border: "1px dashed #ccc", borderRadius: "6px", padding: "4px 12px", fontSize: "11px", color: "#999", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>+ Add item</button>
    </div>
  );
}

function CardEditor({ card, onSave, onDelete, onClose, currentTab, allCards, universes }) {
  const [form, setForm] = useState({ ...card, checklist: card.checklist || [], universes: getUniverses(card), links: card.links || [] });
  const [linkSearch, setLinkSearch] = useState("");
  const [linkType, setLinkType] = useState("related");
  const [showLinkSearch, setShowLinkSearch] = useState(false);
  const titleRef = useRef(null);
  useEffect(() => { titleRef.current?.focus(); }, []);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleLabel = (lid) => { const ls = form.labels || []; set("labels", ls.includes(lid) ? ls.filter(l => l !== lid) : [...ls, lid]); };
  const toggleUniverse = (uid) => { const us = form.universes || []; set("universes", us.includes(uid) ? us.filter(u => u !== uid) : [...us, uid]); };
  const tabObj = BINDER_TABS.find(t => t.id === (form.tab || currentTab));
  const lists = currentTab === "mastertodo" ? TODO_DAYS : STATUS_LISTS;

  const addLink = (targetId) => {
    if ((form.links || []).some(l => l.cardId === targetId)) return;
    set("links", [...(form.links || []), { cardId: targetId, type: linkType }]);
    setLinkSearch(""); setShowLinkSearch(false);
  };
  const removeLink = (targetId) => set("links", (form.links || []).filter(l => l.cardId !== targetId));
  const changeLinkType = (targetId, newType) => set("links", (form.links || []).map(l => l.cardId === targetId ? { ...l, type: newType } : l));
  const reverseLinks = card.id ? (allCards || []).filter(c => c.id !== card.id && (c.links || []).some(l => l.cardId === card.id)) : [];
  const linkResults = linkSearch.length >= 2 ? (allCards || []).filter(c => c.id !== card.id && c.id !== form.id && c.title.toLowerCase().includes(linkSearch.toLowerCase())).slice(0, 8) : [];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(20,18,15,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#FEFCF6", borderRadius: "4px 20px 20px 4px", borderLeft: `6px solid ${tabObj?.color || "#E8B931"}`,
        width: "100%", maxWidth: "560px", maxHeight: "88vh", overflowY: "auto", padding: "28px 28px 20px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <span style={{ fontSize: "11px", color: "#999", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>{tabObj?.emoji} {tabObj?.title || "Card"}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#bbb", lineHeight: 1 }}>×</button>
        </div>
        <input ref={titleRef} value={form.title} onChange={e => set("title", e.target.value)} placeholder="What needs doing?"
          style={{ width: "100%", border: "none", borderBottom: "2px solid #E8B931", fontSize: "20px", fontWeight: 700, padding: "8px 0", marginBottom: "14px", background: "transparent", fontFamily: "'Playfair Display', serif", outline: "none", color: "#1A1A1A" }} />
        <textarea value={form.description || ""} onChange={e => set("description", e.target.value)} placeholder="Details, links, brain sparks..." rows={3}
          style={{ width: "100%", border: "1px solid #E8E3D8", borderRadius: "10px", padding: "12px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", background: "#FDFCF6", resize: "vertical", outline: "none", marginBottom: "16px", color: "#333" }} />
        {/* STATUS */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "10px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>Status</label>
          <div style={{ display: "flex", gap: "5px", marginTop: "6px", flexWrap: "wrap" }}>
            {lists.map(l => (<button key={l.id} onClick={() => set("list", l.id)} style={{ padding: "5px 12px", borderRadius: "8px", border: "2px solid", borderColor: form.list === l.id ? (l.color || "#E8B931") : "transparent", background: form.list === l.id ? (l.color || "#E8B931") + "18" : "#F0EDE4", fontSize: "11px", fontWeight: 600, cursor: "pointer", color: "#333" }}>{l.title}</button>))}
          </div>
        </div>
        {/* BOARD */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "10px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>Board</label>
          <select value={form.tab} onChange={e => set("tab", e.target.value)} style={{ display: "block", marginTop: "6px", padding: "7px 10px", borderRadius: "8px", border: "1px solid #E8E3D8", background: "#FDFCF6", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: "#333", outline: "none", width: "100%" }}>
            {BINDER_TABS.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.num}. {t.title}</option>)}
          </select>
        </div>
        {/* UNIVERSES */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "10px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>Universes <span style={{ fontWeight: 400, fontStyle: "italic", textTransform: "none", letterSpacing: "0" }}> — pick all that apply</span></label>
          <div style={{ display: "flex", gap: "5px", marginTop: "6px", flexWrap: "wrap" }}>
            {universes.map(u => { const active = (form.universes || []).includes(u.id); return (
              <button key={u.id} onClick={() => toggleUniverse(u.id)} style={{ padding: "5px 12px", borderRadius: "20px", border: "2px solid", borderColor: active ? u.color : "transparent", background: active ? `radial-gradient(circle at 30% 30%, ${u.color}44, ${u.color}CC)` : "#F0EDE4", color: active ? "#fff" : "#888", fontSize: "10px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.3px", boxShadow: active ? `0 2px 8px ${u.color}44` : "none", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "4px" }}><span style={{ fontSize: "12px" }}>{u.emoji}</span>{u.name}</button>
            ); })}
          </div>
          {(form.universes || []).length > 1 && <div style={{ fontSize: "9px", color: "#B0A890", fontStyle: "italic", marginTop: "4px" }}>This card lives in {(form.universes || []).length} universes — it's a Venn diagram kind of card.</div>}
        </div>
        {/* LABELS */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "10px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>Labels</label>
          <div style={{ display: "flex", gap: "4px", marginTop: "6px", flexWrap: "wrap" }}>
            {LABELS.map(l => (<button key={l.id} onClick={() => toggleLabel(l.id)} style={{ padding: "4px 10px", borderRadius: "5px", background: (form.labels || []).includes(l.id) ? l.color : "#F0EDE4", color: (form.labels || []).includes(l.id) ? "#fff" : "#777", border: "none", fontSize: "10px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px" }}>{l.name}</button>))}
          </div>
        </div>
        {/* DUE DATE */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "10px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>Due Date</label>
          <input type="date" value={form.dueDate || ""} onChange={e => set("dueDate", e.target.value)} style={{ display: "block", marginTop: "6px", padding: "7px 10px", border: "1px solid #E8E3D8", borderRadius: "8px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", background: "#FDFCF6", color: "#333" }} />
        </div>
        {/* LINKED CARDS */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "10px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>🔗 Linked Cards</label>
          {(form.links || []).length > 0 && <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {(form.links || []).map(link => { const target = (allCards || []).find(c => c.id === link.cardId); const lt = LINK_TYPES.find(t => t.id === link.type) || LINK_TYPES[3]; if (!target) return null; const tTab = BINDER_TABS.find(t => t.id === target.tab); return (
              <div key={link.cardId} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", background: "#F8F6F0", borderRadius: "8px", borderLeft: `3px solid ${tTab?.color || "#ccc"}` }}>
                <span style={{ fontSize: "12px" }}>{lt.icon}</span>
                <select value={link.type} onChange={e => changeLinkType(link.cardId, e.target.value)} style={{ border: "none", background: "transparent", fontSize: "9px", fontWeight: 700, color: "#999", textTransform: "uppercase", cursor: "pointer", outline: "none", fontFamily: "'DM Sans', sans-serif" }}>
                  {LINK_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                <span style={{ flex: 1, fontSize: "12px", fontWeight: 600, color: "#333", fontFamily: "'Playfair Display', serif" }}>{target.title}</span>
                <button onClick={() => removeLink(link.cardId)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "14px", padding: "0 2px" }}>×</button>
              </div>); })}
          </div>}
          {reverseLinks.length > 0 && <div style={{ marginTop: "8px" }}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#B0A890", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Linked from other cards:</div>
            {reverseLinks.map(rc => { const theirLink = (rc.links || []).find(l => l.cardId === card.id); const lt = LINK_TYPES.find(t => t.id === theirLink?.type) || LINK_TYPES[3]; const rcTab = BINDER_TABS.find(t => t.id === rc.tab); return (
              <div key={rc.id} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", background: "#F4F2EC", borderRadius: "8px", borderLeft: `3px solid ${rcTab?.color || "#ccc"}`, marginBottom: "3px", opacity: 0.75 }}>
                <span style={{ fontSize: "10px" }}>↩️</span>
                <span style={{ fontSize: "9px", fontWeight: 700, color: "#999", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>{lt.reverse}</span>
                <span style={{ flex: 1, fontSize: "11px", fontWeight: 600, color: "#555", fontFamily: "'Playfair Display', serif" }}>{rc.title}</span>
              </div>); })}
          </div>}
          {!showLinkSearch ? (
            <button onClick={() => setShowLinkSearch(true)} style={{ marginTop: "8px", background: "none", border: "1px dashed #ccc", borderRadius: "8px", padding: "6px 14px", fontSize: "11px", color: "#999", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "6px" }}>🔗 Link a card</button>
          ) : (
            <div style={{ marginTop: "8px" }}>
              <div style={{ display: "flex", gap: "6px", marginBottom: "6px", alignItems: "center" }}>
                <select value={linkType} onChange={e => setLinkType(e.target.value)} style={{ padding: "5px 8px", borderRadius: "6px", border: "1px solid #E8E3D8", background: "#FDFCF6", fontSize: "10px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", color: "#666", outline: "none" }}>
                  {LINK_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                </select>
                <input value={linkSearch} onChange={e => setLinkSearch(e.target.value)} placeholder="Search cards to link..." autoFocus
                  style={{ flex: 1, padding: "6px 10px", borderRadius: "6px", border: "1px solid #E8E3D8", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", background: "#FDFCF6", color: "#333", outline: "none" }} />
                <button onClick={() => { setShowLinkSearch(false); setLinkSearch(""); }} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "16px" }}>×</button>
              </div>
              {linkResults.length > 0 && <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "8px", maxHeight: "160px", overflowY: "auto", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                {linkResults.map(c => { const cTab = BINDER_TABS.find(t => t.id === c.tab); const already = (form.links || []).some(l => l.cardId === c.id); return (
                  <button key={c.id} onClick={() => !already && addLink(c.id)} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "8px 12px", border: "none", borderBottom: "1px solid #F0EDE4", background: already ? "#F0EDE4" : "transparent", cursor: already ? "default" : "pointer", textAlign: "left", opacity: already ? 0.5 : 1 }}>
                    <span style={{ fontSize: "10px" }}>{cTab?.emoji}</span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#333", fontFamily: "'Playfair Display', serif", flex: 1 }}>{c.title}</span>
                    {already && <span style={{ fontSize: "9px", color: "#999" }}>linked</span>}
                  </button>); })}
              </div>}
              {linkSearch.length >= 2 && linkResults.length === 0 && <div style={{ fontSize: "11px", color: "#B0A890", fontStyle: "italic", padding: "8px" }}>No cards match "{linkSearch}" — but give it a minute, you'll probably create one.</div>}
            </div>
          )}
        </div>
        <ChecklistWidget items={form.checklist || []} onChange={v => set("checklist", v)} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #E8E3D8" }}>
          {card.id && (<button onClick={() => { onDelete(card.id); onClose(); }} style={{ padding: "8px 16px", borderRadius: "10px", border: "none", background: "#D4644E15", color: "#D4644E", fontWeight: 700, cursor: "pointer", fontSize: "12px" }}>🗑 Delete</button>)}
          <button onClick={() => { if (form.title.trim()) { onSave(form); onClose(); } }} style={{ padding: "10px 28px", borderRadius: "10px", border: "none", background: "#1A1A1A", color: "#E8B931", fontWeight: 800, cursor: "pointer", fontSize: "13px", marginLeft: "auto", letterSpacing: "0.5px" }}>Save Card</button>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ card, onEdit, isDragging, onDragStart, onDragEnd, tabColor, universes }) {
  const labelObjs = LABELS.filter(l => (card.labels || []).includes(l.id));
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date() && card.list !== "complete" && card.list !== "done";
  const checkTotal = (card.checklist || []).length;
  const checkDone = (card.checklist || []).filter(i => i.done).length;
  const cardUniverses = getUniverses(card);
  const universeObjs = (universes || []).filter(u => cardUniverses.includes(u.id));

  return (
    <div draggable onDragStart={e => { e.dataTransfer.setData("text/plain", card.id); onDragStart(card.id); }} onDragEnd={onDragEnd}
      onClick={() => onEdit(card)}
      style={{
        background: "#FEFCF6", borderRadius: "3px 12px 12px 3px", borderLeft: `4px solid ${tabColor || "#ccc"}`,
        boxShadow: isDragging ? "0 10px 35px rgba(0,0,0,0.22), 0 0 0 2px #E8B931" : "0 1px 6px rgba(0,0,0,0.08)",
        padding: "12px 14px 10px", marginBottom: "8px", cursor: "grab",
        opacity: isDragging ? 0.5 : 1, transform: isDragging ? "rotate(-1.5deg) scale(1.03)" : "none",
        transition: "all 0.15s ease", position: "relative", fontFamily: "'DM Sans', sans-serif",
      }}>
      <div style={{ position: "absolute", top: "-1px", right: "14px", width: "22px", height: "8px", borderRadius: "0 0 5px 5px", background: tabColor || "#ccc", opacity: 0.6 }} />
      {labelObjs.length > 0 && (
        <div style={{ display: "flex", gap: "3px", flexWrap: "wrap", marginBottom: "6px" }}>
          {labelObjs.slice(0, 3).map(l => (
            <span key={l.id} style={{ background: l.color, color: "#fff", fontSize: "8px", fontWeight: 800, padding: "1px 6px", borderRadius: "3px", letterSpacing: "0.5px", textTransform: "uppercase" }}>{l.name}</span>
          ))}
        </div>
      )}
      <div style={{ fontSize: "13px", fontWeight: 700, lineHeight: 1.35, color: "#1A1A1A", marginBottom: "4px", fontFamily: "'Playfair Display', serif" }}>{card.title}</div>
      {card.description && (
        <div style={{ fontSize: "11px", color: "#888", lineHeight: 1.35, maxHeight: "28px", overflow: "hidden", marginBottom: "4px" }}>{card.description}</div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "#aaa", marginTop: "4px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {checkTotal > 0 && <span style={{ color: checkDone === checkTotal ? "#5B8C5A" : "#999" }}>☑ {checkDone}/{checkTotal}</span>}
          {(card.links || []).length > 0 && <span style={{ color: "#6B5B8A" }} title={(card.links || []).length + " linked cards"}>🔗 {(card.links || []).length}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {/* Universe dots */}
          {universeObjs.length > 0 && (
            <div style={{ display: "flex", gap: "2px", marginRight: "4px" }} title={universeObjs.map(u => u.name).join(" + ")}>
              {universeObjs.map(u => (
                <div key={u.id} style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: `radial-gradient(circle at 30% 30%, ${u.color}88, ${u.color})`,
                  boxShadow: `0 0 3px ${u.color}66`,
                  border: "1px solid rgba(255,255,255,0.4)",
                }} />
              ))}
            </div>
          )}
          {card.dueDate && (
            <span style={{ color: isOverdue ? "#D4644E" : "#888", fontWeight: isOverdue ? 700 : 400 }}>
              {isOverdue ? "⚠️ " : ""}{new Date(card.dueDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
      </div>
      {card.list === "complete" && card.completedAt && (
        <div style={{ position: "absolute", top: "8px", right: "8px", transform: "rotate(-12deg)", fontSize: "9px", fontWeight: 900, color: "#5B8C5A", opacity: 0.35, letterSpacing: "1px" }}>DONE</div>
      )}
    </div>
  );
}

function ListColumn({ list, cards, onEdit, onDelete, onDrop, draggingId, onDragStart, onDragEnd, onAddCard, tabColor, universes }) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); onDrop(e.dataTransfer.getData("text/plain"), list.id); }}
      style={{
        flex: "0 0 260px", width: "260px", background: dragOver ? (list.color || "#E8B931") + "12" : "#EDEAE2",
        borderRadius: "14px", border: dragOver ? `2px dashed ${list.color || "#E8B931"}` : "2px solid transparent",
        transition: "all 0.15s ease", display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 170px)",
      }}>
      <div style={{ padding: "12px 14px 8px", borderBottom: `3px solid ${list.color || "#ccc"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>{list.title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, color: list.color || "#999", background: (list.color || "#999") + "22", padding: "1px 6px", borderRadius: "8px" }}>{cards.length}</span>
          <button onClick={() => onAddCard(list.id)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: list.color || "#999", lineHeight: 1 }}>+</button>
        </div>
      </div>
      <div style={{ padding: "10px 8px", overflowY: "auto", flex: 1, scrollbarWidth: "thin" }}>
        {cards.map(c => <MiniCard key={c.id} card={c} onEdit={onEdit} isDragging={draggingId === c.id} onDragStart={onDragStart} onDragEnd={onDragEnd} tabColor={tabColor} universes={universes} />)}
        {cards.length === 0 && <div style={{ textAlign: "center", padding: "24px 8px", color: "#C0B89A", fontSize: "11px", fontStyle: "italic", fontFamily: "'DM Sans', sans-serif" }}>
          {list.id === "complete" ? "Nothing done yet. That's not shade — that's potential." : list.id === "onice" ? "Empty freezer. Suspicious." : "Drop cards here — they won't bite."}
        </div>}
      </div>
    </div>
  );
}

function AutoToast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: "fixed", bottom: "20px", right: "20px", zIndex: 999, background: "#1A1A1A", color: "#E8B931",
      padding: "12px 22px", borderRadius: "12px", fontSize: "12px", fontWeight: 700,
      fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
      animation: "toastIn 0.3s ease",
    }}>⚡ {message}</div>
  );
}

// ============================================================
// VIEW TOGGLE
// ============================================================
function ViewToggle({ view, onToggle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "9px", color: view === "tabs" ? "#E8B931" : "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", transition: "color 0.2s" }}>Tabs</span>
      <button onClick={onToggle} style={{
        width: "44px", height: "22px", borderRadius: "11px", border: "none", cursor: "pointer",
        background: view === "circles" ? "#E8B931" : "#555", position: "relative", transition: "background 0.3s ease",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
      }}>
        <div style={{
          width: "18px", height: "18px", borderRadius: "50%", background: "#FEFCF6",
          position: "absolute", top: "2px", transition: "left 0.3s ease",
          left: view === "circles" ? "24px" : "2px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }} />
      </button>
      <span style={{ fontSize: "9px", color: view === "circles" ? "#E8B931" : "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", transition: "color 0.2s" }}>Marbles</span>
    </div>
  );
}

// ============================================================
// CSV TOOLBAR (Export, Import, Template)
// ============================================================
function CSVToolbar({ cards, onImport, onToast, universes, isPro, onUpgrade }) {
  const fileRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = () => {
    if (!isPro) { onUpgrade(); return; }
    const csv = cardsToCSV(cards, universes);
    const date = new Date().toISOString().slice(0, 10);
    downloadCSV(csv, `everything-board-export-${date}.csv`);
    onToast(`Exported ${cards.length} cards. That's a whole lot of beautiful chaos.`);
    setShowMenu(false);
  };

  const handleTemplate = () => {
    const csv = generateTemplate(universes);
    downloadCSV(csv, "everything-board-template.csv");
    onToast("Template downloaded. Fill it up — the board's hungry.");
    setShowMenu(false);
  };

  const handleFileChange = (e) => {
    if (!isPro) { onUpgrade(); return; }
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === "string") {
        const newCards = parseImportCSV(text, universes);
        if (newCards.length > 0) {
          onImport(newCards);
          onToast(`Imported ${newCards.length} card${newCards.length > 1 ? "s" : ""}. The board grows.`);
        } else {
          onToast("No cards found in that file. Check the format?");
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
    setShowMenu(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setShowMenu(!showMenu)} style={{
        padding: "6px 12px", borderRadius: "8px", border: "1px solid #444", background: "#333",
        color: "#E6E2D8", fontWeight: 700, cursor: "pointer", fontSize: "11px",
        fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "5px",
      }}>
        📁 CSV
      </button>
      {showMenu && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 998 }} onClick={() => setShowMenu(false)} />
          <div style={{
            position: "absolute", top: "100%", right: 0, marginTop: "6px", zIndex: 999,
            background: "#2A2520", borderRadius: "12px", border: "1px solid #444",
            boxShadow: "0 12px 40px rgba(0,0,0,0.4)", overflow: "hidden", minWidth: "220px",
          }}>
            <button onClick={handleExport} style={{
              display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "12px 16px",
              border: "none", borderBottom: "1px solid #3A3530", background: "transparent",
              color: "#E6E2D8", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, textAlign: "left",
            }}>
              <span style={{ fontSize: "16px" }}>📤</span>
              <div>
                <div>Export All Cards</div>
                <div style={{ fontSize: "9px", color: "#888", marginTop: "2px" }}>Download your board as CSV</div>
              </div>
            </button>
            <button onClick={() => fileRef.current?.click()} style={{
              display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "12px 16px",
              border: "none", borderBottom: "1px solid #3A3530", background: "transparent",
              color: "#E6E2D8", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, textAlign: "left",
            }}>
              <span style={{ fontSize: "16px" }}>📥</span>
              <div>
                <div>Import Cards</div>
                <div style={{ fontSize: "9px", color: "#888", marginTop: "2px" }}>Add cards from a CSV file</div>
              </div>
            </button>
            <button onClick={handleTemplate} style={{
              display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "12px 16px",
              border: "none", background: "transparent",
              color: "#E6E2D8", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, textAlign: "left",
            }}>
              <span style={{ fontSize: "16px" }}>📋</span>
              <div>
                <div>Download Template</div>
                <div style={{ fontSize: "9px", color: "#888", marginTop: "2px" }}>Blank CSV with instructions</div>
              </div>
            </button>
          </div>
        </>
      )}
      <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" onChange={handleFileChange} style={{ display: "none" }} />
    </div>
  );
}

// ============================================================
// UNIVERSE FILTERED VIEW — shows ALL cards in a universe across ALL boards
// ============================================================
function UniverseView({ universe, cards, onEdit, onDelete, onDrop, draggingId, onDragStart, onDragEnd, onBack, universes }) {
  const u = universes.find(uv => uv.id === universe);
  const uCards = cards.filter(c => getUniverses(c).includes(universe));

  // Group by status
  const grouped = STATUS_LISTS.map(list => ({
    ...list,
    cards: uCards.filter(c => c.list === list.id),
  }));

  // Stats
  const totalHere = uCards.length;
  const activeHere = uCards.filter(c => c.list === "focus" || c.list === "inprogress").length;
  const doneHere = uCards.filter(c => c.list === "complete").length;

  // Which boards are represented?
  const boardIds = [...new Set(uCards.map(c => c.tab))];
  const boardObjs = boardIds.map(bid => BINDER_TABS.find(t => t.id === bid)).filter(Boolean);

  return (
    <div style={{ minHeight: "calc(100vh - 60px)" }}>
      {/* Universe Header */}
      <div style={{
        background: `linear-gradient(135deg, ${u.color}22 0%, ${u.color}08 100%)`,
        borderBottom: `3px solid ${u.color}44`,
        padding: "20px 24px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <button onClick={onBack} style={{
            background: "none", border: "1px solid #ccc", borderRadius: "8px", padding: "4px 10px",
            fontSize: "11px", color: "#888", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
          }}>← Back</button>
          <span style={{ fontSize: "28px" }}>{u.emoji}</span>
          <div>
            <div style={{ fontSize: "22px", fontWeight: 900, color: u.color, fontFamily: "'Playfair Display', serif" }}>{u.name}</div>
            <div style={{ fontSize: "11px", color: "#888", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>
              {totalHere} card{totalHere !== 1 ? "s" : ""} across {boardObjs.length} board{boardObjs.length !== 1 ? "s" : ""}
              {activeHere > 0 ? ` · ${activeHere} cooking` : ""}
              {doneHere > 0 ? ` · ${doneHere} conquered` : ""}
            </div>
          </div>
        </div>
        {/* Board pills */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
          {boardObjs.map(b => {
            const count = uCards.filter(c => c.tab === b.id).length;
            return (
              <span key={b.id} style={{
                fontSize: "9px", fontWeight: 700, color: b.color, background: b.color + "18",
                padding: "3px 10px", borderRadius: "10px", fontFamily: "'DM Sans', sans-serif",
                border: `1px solid ${b.color}33`,
              }}>
                {b.emoji} {b.title} ({count})
              </span>
            );
          })}
        </div>
      </div>

      {/* Cards by status — Kanban columns */}
      <div style={{ display: "flex", gap: "12px", padding: "16px 16px", overflowX: "auto", alignItems: "flex-start" }}>
        {grouped.map(list => (
          <div key={list.id}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); onDrop(e.dataTransfer.getData("text/plain"), list.id); }}
            style={{
              flex: "0 0 260px", width: "260px", background: "#EDEAE2",
              borderRadius: "14px", border: "2px solid transparent",
              display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 250px)",
            }}>
            <div style={{ padding: "12px 14px 8px", borderBottom: `3px solid ${list.color || "#ccc"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#1A1A1A", fontFamily: "'DM Sans', sans-serif" }}>{list.title}</span>
              <span style={{ fontSize: "10px", fontWeight: 800, color: list.color || "#999", background: (list.color || "#999") + "22", padding: "1px 6px", borderRadius: "8px" }}>{list.cards.length}</span>
            </div>
            <div style={{ padding: "10px 8px", overflowY: "auto", flex: 1, scrollbarWidth: "thin" }}>
              {list.cards.map(c => {
                const tab = BINDER_TABS.find(t => t.id === c.tab);
                return <MiniCard key={c.id} card={c} onEdit={onEdit} isDragging={draggingId === c.id} onDragStart={onDragStart} onDragEnd={() => {}} tabColor={tab?.color} universes={universes} />;
              })}
              {list.cards.length === 0 && <div style={{ textAlign: "center", padding: "20px 8px", color: "#C0B89A", fontSize: "11px", fontStyle: "italic", fontFamily: "'DM Sans', sans-serif" }}>
                Nothing here for {u.name}. Yet.
              </div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// CIRCLE / VENN DASHBOARD
// ============================================================
function CircleDashboard({ cards, onSelectUniverse, onSwitchTab, universes, onManageUniverses }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [animPhase, setAnimPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimPhase(1), 100);
    const t2 = setTimeout(() => setAnimPhase(2), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Dynamic universe counts from actual card data
  const UNIVERSE_COUNTS = useMemo(() => calcUniverseCounts(cards, universes), [cards, universes]);

  // Calculate overlap strength between universe pairs from actual card data
  const overlapMap = useMemo(() => {
    const map = {};
    cards.forEach(c => {
      const us = getUniverses(c);
      if (us.length < 2) return;
      for (let i = 0; i < us.length; i++) {
        for (let j = i + 1; j < us.length; j++) {
          const key = [us[i], us[j]].sort().join("|");
          map[key] = (map[key] || 0) + 1;
        }
      }
    });
    return map;
  }, [cards]);

  // Calculate circle sizes from real data
  const circleData = useMemo(() => {
    const minR = 48;
    const maxR = 140;
    const maxCount = Math.max(1, ...universes.map(u => UNIVERSE_COUNTS[u.id]?.total || 1));
    const minCount = Math.min(...universes.map(u => UNIVERSE_COUNTS[u.id]?.total || 1));

    return universes.map(u => {
      const counts = UNIVERSE_COUNTS[u.id] || { total: 1, active: 0 };
      const t = minCount === maxCount ? 0.5 : (counts.total - minCount) / (maxCount - minCount);
      const r = minR + t * (maxR - minR);
      return { ...u, ...counts, radius: r };
    });
  }, [universes, UNIVERSE_COUNTS]);

  // Position circles — largest in center, others orbit with overlap-based pull
  const positions = useMemo(() => {
    const cx = 50;
    const cy = 48;
    // Find the largest universe by card count to place in center
    const sorted = [...circleData].sort((a, b) => (b.total || 0) - (a.total || 0));
    const center = sorted[0];
    const others = sorted.slice(1);
    const baseOrbitR = others.length <= 3 ? 20 : others.length <= 6 ? 24 : 28;

    const placed = [{ ...center, x: cx, y: cy }];

    others.forEach((c, i) => {
      const angle = (i / others.length) * Math.PI * 2 - Math.PI / 2;
      // Calculate pull toward center based on overlap with center
      const overlapWithCenter = overlapMap[[c.id, center.id].sort().join("|")] || 0;
      const overlapPull = Math.min(overlapWithCenter * 0.03, 0.25);
      const basePull = 0.15 + (c.radius / 200);
      const totalPull = basePull + overlapPull;
      const x = cx + Math.cos(angle) * baseOrbitR * (1 - totalPull);
      const y = cy + Math.sin(angle) * baseOrbitR * (1 - totalPull);
      placed.push({ ...c, x, y });
    });

    // Second pass: nudge non-kco circles toward each other if they share cards
    for (let i = 1; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        const key = [placed[i].id, placed[j].id].sort().join("|");
        const shared = overlapMap[key] || 0;
        if (shared > 0) {
          const nudge = Math.min(shared * 0.4, 2.5); // percentage points
          const dx = placed[j].x - placed[i].x;
          const dy = placed[j].y - placed[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          placed[i].x += (dx / dist) * nudge;
          placed[i].y += (dy / dist) * nudge;
          placed[j].x -= (dx / dist) * nudge;
          placed[j].y -= (dy / dist) * nudge;
        }
      }
    }

    return placed;
  }, [circleData, overlapMap]);

  const totalProjects = Object.values(UNIVERSE_COUNTS).reduce((a, b) => a + b.total, 0);
  const totalActive = Object.values(UNIVERSE_COUNTS).reduce((a, b) => a + b.active, 0);
  const totalOverlap = Object.values(overlapMap).reduce((a, b) => a + b, 0);

  return (
    <div style={{
      padding: "20px", minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column", alignItems: "center",
      background: "radial-gradient(ellipse at 50% 40%, #E6E2D8 0%, #D8D3C6 50%, #C5BFB0 100%)",
    }}>
      {/* Title */}
      <div style={{
        textAlign: "center", marginBottom: "8px",
        opacity: animPhase >= 1 ? 1 : 0, transform: animPhase >= 1 ? "translateY(0)" : "translateY(-20px)",
        transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <div style={{ fontSize: "11px", fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "3px", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>
          The Marble Bag
        </div>
        <div style={{ fontSize: "13px", color: "#888", fontFamily: "'DM Sans', sans-serif" }}>
          {totalProjects} projects · {totalActive} on fire · {totalOverlap > 0 ? `${totalOverlap} overlaps · ` : ""}{universes.length} universe{universes.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Circle Container */}
      <div style={{
        position: "relative", width: "100%", maxWidth: "700px", aspectRatio: "1.2",
        opacity: animPhase >= 1 ? 1 : 0, transition: "opacity 0.8s ease 0.2s",
      }}>
        {positions.map((circle, i) => {
          const isHovered = hoveredId === circle.id;
          const isCenter = i === 0;
          const delay = isCenter ? 0 : (i * 0.08 + 0.1);
          const visible = animPhase >= 2 || (isCenter && animPhase >= 1);

          return (
            <button
              key={circle.id}
              onClick={() => onSelectUniverse(circle.id)}
              onMouseEnter={() => setHoveredId(circle.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                position: "absolute",
                left: `calc(${circle.x}% - ${circle.radius}px)`,
                top: `calc(${circle.y}% - ${circle.radius}px)`,
                width: `${circle.radius * 2}px`,
                height: `${circle.radius * 2}px`,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: `radial-gradient(circle at 35% 30%, ${circle.color}55, ${circle.color}DD 60%, ${circle.color} 100%)`,
                boxShadow: isHovered
                  ? `0 0 40px ${circle.glow}, 0 0 80px ${circle.glow}, 0 12px 40px rgba(0,0,0,0.25), inset 0 -4px 12px rgba(0,0,0,0.15)`
                  : `0 4px 20px rgba(0,0,0,0.15), inset 0 -3px 8px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.2)`,
                transform: visible
                  ? (isHovered ? "scale(1.08)" : "scale(1)")
                  : "scale(0)",
                opacity: visible ? (isHovered ? 1 : 0.88) : 0,
                transition: `transform ${isCenter ? "0.8s" : "0.6s"} cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s, opacity 0.5s ease ${delay}s, box-shadow 0.3s ease`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "12px",
                zIndex: isCenter ? 1 : (isHovered ? 10 : 2),
                overflow: "hidden",
              }}
            >
              {/* Glass highlight */}
              <div style={{
                position: "absolute", top: "8%", left: "18%", width: "35%", height: "25%",
                borderRadius: "50%", background: "rgba(255,255,255,0.25)", filter: "blur(6px)",
                transform: "rotate(-20deg)", pointerEvents: "none",
              }} />

              <span style={{ fontSize: isCenter ? "28px" : "20px", marginBottom: "2px", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}>{circle.emoji}</span>
              <span style={{
                fontSize: isCenter ? "13px" : "10px", fontWeight: 900, color: "#fff", textAlign: "center",
                fontFamily: "'Playfair Display', serif", lineHeight: 1.2, textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                maxWidth: "90%",
              }}>{circle.name}</span>
              <span style={{
                fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.8)", marginTop: "3px",
                fontFamily: "'DM Sans', sans-serif", textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}>
                {circle.total} projects
              </span>
              {circle.active > 0 && (
                <span style={{
                  fontSize: "8px", fontWeight: 800, color: "#fff", marginTop: "2px",
                  background: "rgba(0,0,0,0.25)", padding: "1px 8px", borderRadius: "8px",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {circle.active} active
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Hover Detail Panel */}
      <div style={{
        maxWidth: "700px", width: "100%", minHeight: "60px", marginTop: "4px",
        opacity: hoveredId ? 1 : 0, transition: "opacity 0.2s ease",
        textAlign: "center", padding: "10px",
      }}>
        {hoveredId && (() => {
          const u = universes.find(u => u.id === hoveredId);
          const counts = UNIVERSE_COUNTS[hoveredId];
          // Find overlapping universes
          const overlaps = [];
          universes.forEach(other => {
            if (other.id === hoveredId) return;
            const key = [hoveredId, other.id].sort().join("|");
            const shared = overlapMap[key];
            if (shared > 0) overlaps.push({ ...other, shared });
          });
          return (
            <div>
              <div style={{ fontSize: "16px", fontWeight: 900, color: u.color, fontFamily: "'Playfair Display', serif" }}>
                {u.emoji} {u.name}
              </div>
              <div style={{ fontSize: "11px", color: "#888", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>
                {counts.active > 0 ? `${counts.active} on fire` : ""}{counts.active > 0 && counts.planted > 0 ? " · " : ""}{counts.planted > 0 ? `${counts.planted} planted` : ""}{(counts.active > 0 || counts.planted > 0) && counts.someday > 0 ? " · " : ""}{counts.someday > 0 ? `${counts.someday} in the someday pile` : ""}
                {counts.done > 0 ? ` · ${counts.done} conquered` : ""}
              </div>
              {overlaps.length > 0 && (
                <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "6px", flexWrap: "wrap" }}>
                  {overlaps.map(o => (
                    <span key={o.id} style={{
                      fontSize: "9px", fontWeight: 700, color: o.color, background: o.color + "18",
                      padding: "2px 8px", borderRadius: "10px", fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {o.emoji} {o.shared} shared with {o.name}
                    </span>
                  ))}
                </div>
              )}
              <div style={{ fontSize: "10px", color: "#aaa", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", marginTop: "4px" }}>
                Click to dive in →
              </div>
            </div>
          );
        })()}
        {!hoveredId && (
          <div style={{ fontSize: "11px", color: "#B0A890", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>
            Hover a marble to peek inside. Click to enter.
          </div>
        )}
      </div>

      {/* Quick-access to Master To-Do and all boards */}
      <div style={{ display: "flex", gap: "10px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => onSwitchTab("mastertodo")} style={{
          padding: "8px 18px", borderRadius: "10px", border: "2px solid #E8B931",
          background: "#E8B93118", color: "#E8B931", fontWeight: 800, fontSize: "11px", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.5px",
        }}>👑 Master To-Do</button>
        <button onClick={() => onSwitchTab("compost")} style={{
          padding: "8px 18px", borderRadius: "10px", border: "2px solid #8B7355",
          background: "#8B735518", color: "#8B7355", fontWeight: 800, fontSize: "11px", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.5px",
        }}>🪱 Compost</button>
        <button onClick={onManageUniverses} style={{
          padding: "8px 18px", borderRadius: "10px", border: "2px solid #6B5B8A",
          background: "#6B5B8A18", color: "#6B5B8A", fontWeight: 800, fontSize: "11px", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.5px",
        }}>🔮 Manage Universes ({universes.length}/{UNIVERSE_MAX})</button>
      </div>
    </div>
  );
}

// ============================================================
// CLASSIC DASHBOARD (tab-grid version)
// ============================================================
function ClassicDashboard({ cards, onSwitchTab }) {
  const tabStats = BINDER_TABS.filter(t => t.id !== "dashboard" && t.id !== "mastertodo").map(tab => {
    const tabCards = cards.filter(c => c.tab === tab.id);
    const done = tabCards.filter(c => c.list === "complete").length;
    const overdue = tabCards.filter(c => c.dueDate && new Date(c.dueDate) < new Date() && c.list !== "complete").length;
    return { ...tab, total: tabCards.length, done, overdue, active: tabCards.length - done };
  });
  const totalCards = cards.filter(c => c.tab !== "mastertodo").length;
  const totalDone = cards.filter(c => c.list === "complete" || c.list === "done").length;
  const totalOverdue = cards.filter(c => c.dueDate && new Date(c.dueDate) < new Date() && c.list !== "complete" && c.list !== "done").length;
  const focusCards = cards.filter(c => c.list === "focus" && c.tab !== "mastertodo").slice(0, 5);

  return (
    <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
        {[
          { label: "Total Cards", value: totalCards, color: "#1A1A1A" },
          { label: "Complete", value: totalDone, color: "#5B8C5A" },
          { label: "Overdue", value: totalOverdue, color: totalOverdue > 0 ? "#D4644E" : "#999" },
          { label: "In Focus", value: focusCards.length, color: "#E8B931" },
        ].map(s => (
          <div key={s.label} style={{ background: "#FEFCF6", borderRadius: "14px", padding: "18px 24px", flex: "1 1 140px", minWidth: "140px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "28px", fontWeight: 900, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "1px", marginTop: "2px", fontFamily: "'DM Sans', sans-serif" }}>{s.label}</div>
          </div>
        ))}
      </div>
      {focusCards.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "#E8B931", marginBottom: "12px", fontFamily: "'DM Sans', sans-serif" }}>✨ This Week's Focus</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
            {focusCards.map(c => {
              const tab = BINDER_TABS.find(t => t.id === c.tab);
              return (
                <div key={c.id} style={{ background: "#FEFCF6", borderLeft: `4px solid ${tab?.color || "#ccc"}`, borderRadius: "3px 12px 12px 3px", padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: tab?.color || "#999", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>{tab?.emoji} {tab?.title}</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A1A", fontFamily: "'Playfair Display', serif" }}>{c.title}</div>
                  {c.dueDate && <div style={{ fontSize: "10px", color: "#999", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>📅 {new Date(c.dueDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <h3 style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "#1A1A1A", marginBottom: "12px", fontFamily: "'DM Sans', sans-serif" }}>📁 Your Boards</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
        {tabStats.map(t => (
          <button key={t.id} onClick={() => onSwitchTab(t.id)} style={{
            background: "#FEFCF6", border: "none", borderLeft: `4px solid ${t.color}`, borderRadius: "3px 12px 12px 3px",
            padding: "14px 16px", cursor: "pointer", textAlign: "left", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: "20px", marginBottom: "4px" }}>{t.emoji}</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A", fontFamily: "'Playfair Display', serif" }}>{t.title}</div>
            <div style={{ fontSize: "10px", color: "#999", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>
              {t.active} active{t.overdue > 0 ? ` · ${t.overdue} overdue ⚠️` : ""}{t.done > 0 ? ` · ${t.done} done` : ""}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// FLOATING HOME MARBLE
// ============================================================
function HomeMarble({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed", bottom: "24px", left: "24px", zIndex: 900,
        width: "52px", height: "52px", borderRadius: "50%", border: "none", cursor: "pointer",
        background: hovered
          ? "radial-gradient(circle at 35% 30%, #FFE08855, #E8B931 60%, #C99A18)"
          : "radial-gradient(circle at 35% 30%, #E8B93155, #E8B931 60%, #C99A18)",
        boxShadow: hovered
          ? "0 0 24px #E8B93166, 0 8px 24px rgba(0,0,0,0.3), inset 0 -2px 6px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.25)"
          : "0 4px 16px rgba(0,0,0,0.2), inset 0 -2px 6px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.2)",
        transform: hovered ? "scale(1.12)" : "scale(1)",
        transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "22px",
      }}
      title="Back to The Marble Bag"
    >
      <span style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}>🔮</span>
      {/* Glass highlight */}
      <div style={{
        position: "absolute", top: "6px", left: "10px", width: "16px", height: "10px",
        borderRadius: "50%", background: "rgba(255,255,255,0.3)", filter: "blur(3px)",
        transform: "rotate(-20deg)", pointerEvents: "none",
      }} />
    </button>
  );
}

// ============================================================
// ONBOARDING — first-time user welcome
// ============================================================
function WelcomeScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [universeDrafts, setUniverseDrafts] = useState([
    { name: "", color: UNIVERSE_COLORS[0], emoji: "⭐" },
    { name: "", color: UNIVERSE_COLORS[2], emoji: "💼" },
    { name: "", color: UNIVERSE_COLORS[5], emoji: "🌿" },
  ]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);

  const updateDraft = (idx, field, value) => {
    setUniverseDrafts(prev => prev.map((d, i) => i === idx ? { ...d, [field]: value } : d));
  };

  const addDraft = () => {
    if (universeDrafts.length >= UNIVERSE_MAX) return;
    const nextColor = UNIVERSE_COLORS[universeDrafts.length % UNIVERSE_COLORS.length];
    setUniverseDrafts(prev => [...prev, { name: "", color: nextColor, emoji: UNIVERSE_EMOJIS[prev.length % UNIVERSE_EMOJIS.length] }]);
  };

  const removeDraft = (idx) => {
    if (universeDrafts.length <= UNIVERSE_MIN) return;
    setUniverseDrafts(prev => prev.filter((_, i) => i !== idx));
  };

  const canFinish = universeDrafts.filter(d => d.name.trim()).length >= UNIVERSE_MIN;

  const handleFinish = () => {
    const universes = universeDrafts
      .filter(d => d.name.trim())
      .map(d => ({
        id: uid(),
        name: d.name.trim(),
        color: d.color,
        glow: makeGlow(d.color),
        emoji: d.emoji,
      }));
    // Ensure minimum
    while (universes.length < UNIVERSE_MIN) {
      const fallback = STARTER_UNIVERSES[universes.length];
      universes.push({ ...fallback, id: uid() });
    }
    onComplete(universes);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "radial-gradient(ellipse at 50% 40%, #E6E2D8 0%, #D8D3C6 50%, #C5BFB0 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;700;800&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes marblePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        * { box-sizing: border-box; margin: 0; }
      `}</style>

      <div style={{
        background: "#FEFCF6", borderRadius: "24px", maxWidth: "560px", width: "100%",
        padding: "40px 36px", boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
        animation: "fadeUp 0.6s ease",
      }}>
        {step === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px", animation: "marblePulse 3s ease infinite" }}>🔮</div>
            <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#1A1A1A", fontFamily: "'Playfair Display', serif", marginBottom: "8px" }}>
              The Everything Board
            </h1>
            <p style={{ fontSize: "14px", color: "#888", marginBottom: "24px", lineHeight: 1.6 }}>
              For people who do everything.
            </p>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "32px", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto 32px" }}>
              Your projects live in <strong>universes</strong> — the big buckets of your life.
              A business, a creative pursuit, a side hustle, a calling. You can have between 3 and 13.
              Let's name yours.
            </p>
            <button onClick={() => setStep(1)} style={{
              padding: "14px 36px", borderRadius: "12px", border: "none", background: "#1A1A1A",
              color: "#E8B931", fontWeight: 800, fontSize: "14px", cursor: "pointer",
              letterSpacing: "0.5px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}>Let's Go →</button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#1A1A1A", fontFamily: "'Playfair Display', serif", marginBottom: "6px" }}>
              Name Your Universes
            </h2>
            <p style={{ fontSize: "11px", color: "#888", marginBottom: "20px" }}>
              Minimum {UNIVERSE_MIN}. Maximum {UNIVERSE_MAX}. You can always change these later.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
              {universeDrafts.map((d, idx) => (
                <div key={idx} style={{
                  display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
                  background: "#F8F6F0", borderRadius: "12px", border: "2px solid #E8E3D8",
                }}>
                  <div style={{ position: "relative" }}>
                    <button onClick={() => setShowEmojiPicker(showEmojiPicker === idx ? null : idx)} style={{
                      width: "36px", height: "36px", borderRadius: "50%", border: "none", cursor: "pointer",
                      background: `radial-gradient(circle at 35% 30%, ${d.color}55, ${d.color}DD 60%, ${d.color})`,
                      boxShadow: `0 2px 8px ${d.color}44, inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 3px rgba(255,255,255,0.2)`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
                    }}>{d.emoji}</button>
                    {showEmojiPicker === idx && (
                      <div style={{
                        position: "absolute", top: "42px", left: 0, zIndex: 10, background: "#fff",
                        border: "1px solid #E8E3D8", borderRadius: "12px", padding: "8px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "grid",
                        gridTemplateColumns: "repeat(6, 1fr)", gap: "4px", width: "200px",
                      }}>
                        {UNIVERSE_EMOJIS.map(e => (
                          <button key={e} onClick={() => { updateDraft(idx, "emoji", e); setShowEmojiPicker(null); }}
                            style={{
                              width: "28px", height: "28px", border: "none", borderRadius: "6px", cursor: "pointer",
                              background: d.emoji === e ? d.color + "22" : "transparent", fontSize: "16px",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>{e}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input value={d.name} onChange={e => updateDraft(idx, "name", e.target.value)}
                    placeholder={idx === 0 ? "e.g. My Business" : idx === 1 ? "e.g. Creative Projects" : idx === 2 ? "e.g. Personal" : "Universe name..."}
                    style={{
                      flex: 1, border: "none", borderBottom: `2px solid ${d.color}`, background: "transparent",
                      fontSize: "14px", fontWeight: 600, padding: "4px 0", outline: "none",
                      fontFamily: "'DM Sans', sans-serif", color: "#333",
                    }} />
                  <div style={{ display: "flex", gap: "3px" }}>
                    {UNIVERSE_COLORS.slice(0, 6).map(c => (
                      <button key={c} onClick={() => updateDraft(idx, "color", c)} style={{
                        width: "14px", height: "14px", borderRadius: "50%",
                        border: d.color === c ? "2px solid #1A1A1A" : "2px solid transparent",
                        background: c, cursor: "pointer",
                      }} />
                    ))}
                  </div>
                  {universeDrafts.length > UNIVERSE_MIN && (
                    <button onClick={() => removeDraft(idx)} style={{
                      background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "16px",
                    }}>×</button>
                  )}
                </div>
              ))}
            </div>

            {universeDrafts.length < UNIVERSE_MAX && (
              <button onClick={addDraft} style={{
                width: "100%", padding: "10px", border: "2px dashed #C0B89A", borderRadius: "12px",
                background: "transparent", color: "#999", fontSize: "12px", fontWeight: 600,
                cursor: "pointer", marginBottom: "24px",
              }}>+ Add Another Universe ({universeDrafts.length}/{UNIVERSE_MAX})</button>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid #E8E3D8" }}>
              <button onClick={() => setStep(0)} style={{
                padding: "10px 20px", borderRadius: "10px", border: "1px solid #ccc",
                background: "transparent", color: "#888", fontWeight: 600, cursor: "pointer", fontSize: "12px",
              }}>← Back</button>
              <button onClick={handleFinish} disabled={!canFinish} style={{
                padding: "12px 32px", borderRadius: "12px", border: "none",
                background: canFinish ? "#1A1A1A" : "#ccc", color: canFinish ? "#E8B931" : "#999",
                fontWeight: 800, cursor: canFinish ? "pointer" : "default", fontSize: "14px",
                letterSpacing: "0.5px",
              }}>Launch My Board 🚀</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// UNIVERSE MANAGER — create, edit, delete universes (3–13 cap)
// ============================================================
function UniverseManager({ universes, onSave, onClose, cards }) {
  const [draft, setDraft] = useState(universes.map(u => ({ ...u })));
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(UNIVERSE_COLORS[0]);
  const [newEmoji, setNewEmoji] = useState("⭐");
  const [showEmojiPicker, setShowEmojiPicker] = useState(null); // null or universe id or "new"
  const [confirmDelete, setConfirmDelete] = useState(null);

  const counts = useMemo(() => calcUniverseCounts(cards, draft), [cards, draft]);
  const canAdd = draft.length < UNIVERSE_MAX;
  const canRemove = draft.length > UNIVERSE_MIN;

  const addUniverse = () => {
    if (!newName.trim() || !canAdd) return;
    const id = uid();
    setDraft(prev => [...prev, { id, name: newName.trim(), color: newColor, glow: makeGlow(newColor), emoji: newEmoji }]);
    setNewName("");
    setNewEmoji("⭐");
    setNewColor(UNIVERSE_COLORS[(draft.length) % UNIVERSE_COLORS.length]);
  };

  const removeUniverse = (id) => {
    if (!canRemove) return;
    setDraft(prev => prev.filter(u => u.id !== id));
    setConfirmDelete(null);
  };

  const updateUniverse = (id, field, value) => {
    setDraft(prev => prev.map(u => {
      if (u.id !== id) return u;
      const updated = { ...u, [field]: value };
      if (field === "color") updated.glow = makeGlow(value);
      return updated;
    }));
  };

  const handleSave = () => {
    if (draft.length < UNIVERSE_MIN || draft.length > UNIVERSE_MAX) return;
    if (draft.some(u => !u.name.trim())) return;
    onSave(draft);
    onClose();
  };

  // Determine which universe IDs were removed
  const removedIds = universes.filter(u => !draft.find(d => d.id === u.id)).map(u => u.id);
  const orphanedCards = removedIds.length > 0 ? cards.filter(c => {
    const us = getUniverses(c);
    return us.some(uid => removedIds.includes(uid));
  }).length : 0;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(20,18,15,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#FEFCF6", borderRadius: "4px 20px 20px 4px", borderLeft: "6px solid #6B5B8A",
        width: "100%", maxWidth: "620px", maxHeight: "88vh", overflowY: "auto", padding: "28px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 900, color: "#1A1A1A", fontFamily: "'Playfair Display', serif" }}>🔮 Universe Manager</div>
            <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
              {draft.length} of {UNIVERSE_MAX} universes · minimum {UNIVERSE_MIN}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#bbb" }}>×</button>
        </div>

        {/* Capacity bar */}
        <div style={{ height: "6px", background: "#E5E0D0", borderRadius: "3px", marginBottom: "20px", overflow: "hidden" }}>
          <div style={{
            width: `${(draft.length / UNIVERSE_MAX) * 100}%`, height: "100%",
            background: draft.length >= UNIVERSE_MAX ? "#D4644E" : draft.length >= 10 ? "#E8B931" : "#5B8C5A",
            borderRadius: "3px", transition: "width 0.3s ease",
          }} />
        </div>

        {/* Universe List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
          {draft.map((u, idx) => {
            const cardCount = counts[u.id]?.total || 0;
            const isEditing = editingId === u.id;
            return (
              <div key={u.id} style={{
                display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px",
                background: isEditing ? "#F8F6F0" : "#FDFCF6", borderRadius: "12px",
                border: `2px solid ${isEditing ? u.color : "#E8E3D8"}`,
                transition: "all 0.15s ease",
              }}>
                {/* Emoji picker toggle */}
                <div style={{ position: "relative" }}>
                  <button onClick={() => setShowEmojiPicker(showEmojiPicker === u.id ? null : u.id)} style={{
                    width: "36px", height: "36px", borderRadius: "50%", border: "none", cursor: "pointer",
                    background: `radial-gradient(circle at 35% 30%, ${u.color}55, ${u.color}DD 60%, ${u.color})`,
                    boxShadow: `0 2px 8px ${u.color}44, inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 3px rgba(255,255,255,0.2)`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
                  }}>{u.emoji}</button>
                  {showEmojiPicker === u.id && (
                    <div style={{
                      position: "absolute", top: "42px", left: 0, zIndex: 10, background: "#fff",
                      border: "1px solid #E8E3D8", borderRadius: "12px", padding: "8px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "grid",
                      gridTemplateColumns: "repeat(6, 1fr)", gap: "4px", width: "200px",
                    }}>
                      {UNIVERSE_EMOJIS.map(e => (
                        <button key={e} onClick={() => { updateUniverse(u.id, "emoji", e); setShowEmojiPicker(null); }}
                          style={{
                            width: "28px", height: "28px", border: "none", borderRadius: "6px", cursor: "pointer",
                            background: u.emoji === e ? u.color + "22" : "transparent", fontSize: "16px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>{e}</button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div style={{ flex: 1 }}>
                  {isEditing ? (
                    <input value={u.name} onChange={e => updateUniverse(u.id, "name", e.target.value)} autoFocus
                      onKeyDown={e => { if (e.key === "Enter") setEditingId(null); }}
                      style={{
                        width: "100%", border: "none", borderBottom: `2px solid ${u.color}`, background: "transparent",
                        fontSize: "14px", fontWeight: 700, padding: "2px 0", outline: "none",
                        fontFamily: "'Playfair Display', serif", color: "#1A1A1A",
                      }} />
                  ) : (
                    <div onClick={() => setEditingId(u.id)} style={{ cursor: "pointer" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A1A", fontFamily: "'Playfair Display', serif" }}>{u.name}</div>
                      <div style={{ fontSize: "10px", color: "#999" }}>{cardCount} card{cardCount !== 1 ? "s" : ""}</div>
                    </div>
                  )}
                </div>

                {/* Color picker */}
                {isEditing && (
                  <div style={{ display: "flex", gap: "3px", flexWrap: "wrap", maxWidth: "120px" }}>
                    {UNIVERSE_COLORS.map(c => (
                      <button key={c} onClick={() => updateUniverse(u.id, "color", c)} style={{
                        width: "16px", height: "16px", borderRadius: "50%", border: u.color === c ? "2px solid #1A1A1A" : "2px solid transparent",
                        background: c, cursor: "pointer",
                      }} />
                    ))}
                  </div>
                )}

                {/* Edit / Delete */}
                <div style={{ display: "flex", gap: "4px" }}>
                  <button onClick={() => setEditingId(isEditing ? null : u.id)} style={{
                    background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#999", padding: "4px",
                  }}>{isEditing ? "✓" : "✏️"}</button>
                  {canRemove && (
                    confirmDelete === u.id ? (
                      <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                        <button onClick={() => removeUniverse(u.id)} style={{
                          background: "#D4644E", color: "#fff", border: "none", borderRadius: "6px",
                          padding: "2px 8px", fontSize: "9px", fontWeight: 700, cursor: "pointer",
                        }}>Delete{cardCount > 0 ? ` (${cardCount} cards affected)` : ""}</button>
                        <button onClick={() => setConfirmDelete(null)} style={{
                          background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: "12px",
                        }}>×</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(u.id)} style={{
                        background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#ccc", padding: "4px",
                      }}>🗑</button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Universe */}
        {canAdd && (
          <div style={{
            border: "2px dashed #C0B89A", borderRadius: "12px", padding: "14px",
            display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px",
          }}>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowEmojiPicker(showEmojiPicker === "new" ? null : "new")} style={{
                width: "36px", height: "36px", borderRadius: "50%", border: "none", cursor: "pointer",
                background: `radial-gradient(circle at 35% 30%, ${newColor}55, ${newColor}DD 60%, ${newColor})`,
                boxShadow: `0 2px 8px ${newColor}44`, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "16px",
              }}>{newEmoji}</button>
              {showEmojiPicker === "new" && (
                <div style={{
                  position: "absolute", top: "42px", left: 0, zIndex: 10, background: "#fff",
                  border: "1px solid #E8E3D8", borderRadius: "12px", padding: "8px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)", gap: "4px", width: "200px",
                }}>
                  {UNIVERSE_EMOJIS.map(e => (
                    <button key={e} onClick={() => { setNewEmoji(e); setShowEmojiPicker(null); }}
                      style={{
                        width: "28px", height: "28px", border: "none", borderRadius: "6px", cursor: "pointer",
                        background: newEmoji === e ? newColor + "22" : "transparent", fontSize: "16px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{e}</button>
                  ))}
                </div>
              )}
            </div>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New universe name..."
              onKeyDown={e => { if (e.key === "Enter") addUniverse(); }}
              style={{
                flex: 1, border: "none", borderBottom: `2px solid ${newColor}`, background: "transparent",
                fontSize: "14px", fontWeight: 600, padding: "4px 0", outline: "none",
                fontFamily: "'DM Sans', sans-serif", color: "#333",
              }} />
            <div style={{ display: "flex", gap: "3px", flexWrap: "wrap", maxWidth: "100px" }}>
              {UNIVERSE_COLORS.slice(0, 7).map(c => (
                <button key={c} onClick={() => setNewColor(c)} style={{
                  width: "14px", height: "14px", borderRadius: "50%", border: newColor === c ? "2px solid #1A1A1A" : "2px solid transparent",
                  background: c, cursor: "pointer",
                }} />
              ))}
            </div>
            <button onClick={addUniverse} disabled={!newName.trim()} style={{
              padding: "6px 14px", borderRadius: "8px", border: "none",
              background: newName.trim() ? "#1A1A1A" : "#ccc", color: newName.trim() ? "#E8B931" : "#999",
              fontWeight: 800, cursor: newName.trim() ? "pointer" : "default", fontSize: "11px",
            }}>+ Add</button>
          </div>
        )}
        {!canAdd && (
          <div style={{ textAlign: "center", padding: "10px", fontSize: "11px", color: "#D4644E", fontWeight: 700, fontStyle: "italic", marginBottom: "16px" }}>
            13 is the limit. You know why.
          </div>
        )}

        {/* Warnings */}
        {orphanedCards > 0 && (
          <div style={{
            background: "#D4644E12", border: "1px solid #D4644E33", borderRadius: "10px",
            padding: "10px 14px", marginBottom: "16px", fontSize: "11px", color: "#D4644E", fontWeight: 600,
          }}>
            ⚠️ {orphanedCards} card{orphanedCards > 1 ? "s" : ""} reference{orphanedCards === 1 ? "s" : ""} removed universe{removedIds.length > 1 ? "s" : ""}. Those cards will keep their data but the universe tag will become orphaned.
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid #E8E3D8" }}>
          <button onClick={onClose} style={{
            padding: "8px 18px", borderRadius: "10px", border: "1px solid #ccc", background: "transparent",
            color: "#888", fontWeight: 600, cursor: "pointer", fontSize: "12px",
          }}>Cancel</button>
          <button onClick={handleSave} style={{
            padding: "10px 28px", borderRadius: "10px", border: "none", background: "#1A1A1A",
            color: "#E8B931", fontWeight: 800, cursor: "pointer", fontSize: "13px", letterSpacing: "0.5px",
          }}>Save Universes</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function TheEverythingBoard({ user }) {
  const { universes, setUniverses: saveUniversesToDb, loading: universesLoading } = useUniverses(user.id);
  const { cards, saveCard: saveCardToDb, deleteCard: deleteCardFromDb, bulkSave, loading: cardsLoading } = useCards(user.id);
  const { settings, updateSettings, loading: settingsLoading } = useUserSettings(user.id);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [editing, setEditing] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("circles");
  const [universeView, setUniverseView] = useState(null);
  const [showUniverseManager, setShowUniverseManager] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const isPro = settings.subscription_tier === 'pro';

  // Check for Stripe success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') === 'true') {
      updateSettings({ subscription_tier: 'pro' });
      setToast("🎉 Welcome to Pro! All 13 universes are yours.");
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => { if (settings.view_mode) setViewMode(settings.view_mode); }, [settings.view_mode]);

  const dataLoading = universesLoading || cardsLoading || settingsLoading;

  const handleOnboardComplete = useCallback(async (newUniverses) => {
    await saveUniversesToDb(newUniverses);
    await updateSettings({ onboarded: true });
    setToast("Welcome to The Everything Board. Your marbles are in the bag.");
  }, [saveUniversesToDb, updateSettings]);

  if (dataLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#E6E2D8", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;700;800&display=swap');`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔮</div>
          <div style={{ fontSize: "12px", color: "#888", fontWeight: 600 }}>Loading your board...</div>
        </div>
      </div>
    );
  }

  if (!settings.onboarded) {
    return <WelcomeScreen onComplete={handleOnboardComplete} />;
  }

  const tabObj = BINDER_TABS.find(t => t.id === activeTab);
  const isTodo = activeTab === "mastertodo";
  const lists = isTodo ? TODO_DAYS : STATUS_LISTS;
  const isDashboard = activeTab === "dashboard";

  const addCard = (listId) => {
    setEditing({
      id: "", title: "", description: "", tab: activeTab === "dashboard" ? "braindumps" : activeTab,
      list: listId, labels: [], universes: universeView ? [universeView] : [], dueDate: "", checklist: [], created: now(), moved: now(), completedAt: null,
    });
  };

  const saveCard = async (data) => {
    const card = data.id ? { ...data, moved: now() } : { ...data, id: uid(), created: now(), moved: now() };
    await saveCardToDb(card);
  };

  const deleteCard = async (id) => { await deleteCardFromDb(id); };

  const dropCard = async (cardId, newList) => {
    const updated = cards.map(c => {
      if (c.id !== cardId) return c;
      if (c.list === newList) return c;
      const u = { ...c, list: newList, moved: now() };
      if ((newList === "complete" || newList === "done") && c.list !== "complete" && c.list !== "done") {
        u.completedAt = now();
        const linkCount = (c.links || []).length;
        setToast(linkCount > 0
          ? `"${c.title}" — done. ${linkCount} linked card${linkCount > 1 ? "s" : ""} just lost ${linkCount > 1 ? "their" : "its"} excuse.`
          : `"${c.title}" — marked complete. Timestamped.`);
      }
      if (newList === "onice") setToast(`"${c.title}" put on ice. It'll keep.`);
      if (newList === "icebox") setToast(`"${c.title}" iced. Not forgotten — just chilling.`);
      if ((c.list === "complete" || c.list === "done") && newList !== "complete" && newList !== "done") {
        u.completedAt = null; setToast(`"${c.title}" reopened — back in play.`);
      }
      return u;
    });
    await bulkSave(updated);
    setDraggingId(null);
  };

  const handleSelectUniverse = (universeId) => { setUniverseView(universeId); setActiveTab("dashboard"); setSearchTerm(""); };
  const handleGoHome = () => { setActiveTab("dashboard"); setUniverseView(null); setSearchTerm(""); };
  const handleImport = async (newCards) => { await bulkSave([...cards, ...newCards]); setToast(`Imported ${newCards.length} card${newCards.length !== 1 ? "s" : ""}. The board grows.`); };
  const handleLogout = async () => { await supabase.auth.signOut(); };

  const tabCards = cards.filter(c => {
    if (c.tab !== activeTab) return false;
    if (searchTerm && !c.title.toLowerCase().includes(searchTerm.toLowerCase()) && !(c.description || "").toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const toggleView = () => { const next = viewMode === "circles" ? "tabs" : "circles"; setViewMode(next); updateSettings({ view_mode: next }); };
  const showUniverseView = universeView && isDashboard;

  return (
    <div style={{ minHeight: "100vh", background: "#E6E2D8", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;700;800&display=swap');
        @keyframes toastIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: #C0B89A; border-radius: 3px; }
        button:hover { opacity: 0.85; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#1A1A1A", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button onClick={handleGoHome} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px", fontWeight: 900, color: "#E8B931", fontFamily: "'Playfair Display', serif", letterSpacing: "-0.5px" }}>The Everything Board</span>
          </button>
          <span style={{ fontSize: "10px", color: "#888", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>For people who do everything</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <CSVToolbar cards={cards} onImport={handleImport} onToast={setToast} universes={universes} isPro={isPro} onUpgrade={() => setShowUpgrade(true)} />
          <ViewToggle view={viewMode} onToggle={toggleView} />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="🔍 Search..."
            style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #333", background: "#2A2A2A", color: "#E6E2D8", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "160px" }} />
          {!isDashboard && !showUniverseView && (
            <button onClick={() => addCard(lists[0]?.id)} style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: "#E8B931", color: "#1A1A1A", fontWeight: 800, cursor: "pointer", fontSize: "11px" }}>+ New Card</button>
          )}
          <button onClick={handleLogout} title="Sign out" style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #444", background: "#333", color: "#888", fontWeight: 600, cursor: "pointer", fontSize: "10px", fontFamily: "'DM Sans', sans-serif" }}>Sign Out</button>
          {isPro
            ? <span style={{ padding: "4px 10px", borderRadius: "8px", background: "#E8B93122", color: "#E8B931", fontSize: "9px", fontWeight: 800, letterSpacing: "1px", border: "1px solid #E8B93144" }}>PRO</span>
            : <button onClick={() => setShowUpgrade(true)} style={{ padding: "6px 12px", borderRadius: "8px", border: "none", background: "#E8B931", color: "#1A1A1A", fontWeight: 800, cursor: "pointer", fontSize: "10px" }}>✨ Upgrade</button>
          }
        </div>
      </div>

      {!showUniverseView && (viewMode === "tabs" || !isDashboard) && (
        <div style={{ background: "#2A2520", padding: "0 12px", overflowX: "auto", display: "flex", alignItems: "stretch", scrollbarWidth: "none" }}>
          {BINDER_TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const count = cards.filter(c => c.tab === tab.id).length;
            return (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setUniverseView(null); setSearchTerm(""); }}
                style={{ padding: "10px 14px 8px", background: isActive ? "#E6E2D8" : "transparent", border: "none",
                  borderTop: isActive ? `3px solid ${tab.color}` : "3px solid transparent",
                  borderBottom: isActive ? "none" : "1px solid #1A1A1A33",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                  borderRadius: isActive ? "8px 8px 0 0" : "0", transition: "all 0.15s ease", whiteSpace: "nowrap", flexShrink: 0 }}>
                <span style={{ fontSize: "14px" }}>{tab.emoji}</span>
                <span style={{ fontSize: "10px", fontWeight: isActive ? 800 : 500, color: isActive ? "#1A1A1A" : "#999", textTransform: "uppercase", letterSpacing: "0.8px" }}>{tab.title}</span>
                {count > 0 && <span style={{ fontSize: "9px", fontWeight: 800, color: isActive ? tab.color : "#666", background: isActive ? tab.color + "22" : "transparent", padding: "1px 5px", borderRadius: "6px" }}>{count}</span>}
              </button>
            );
          })}
        </div>
      )}

      {showUniverseView ? (
        <UniverseView universe={universeView} cards={cards} onEdit={setEditing} onDelete={deleteCard} onDrop={dropCard}
          draggingId={draggingId} onDragStart={setDraggingId} onDragEnd={() => setDraggingId(null)} onBack={handleGoHome} universes={universes} />
      ) : isDashboard ? (
        viewMode === "circles" ? (
          <CircleDashboard cards={cards} onSelectUniverse={handleSelectUniverse} onSwitchTab={(id) => { setActiveTab(id); setUniverseView(null); setSearchTerm(""); }} universes={universes} onManageUniverses={() => setShowUniverseManager(true)} />
        ) : (
          <ClassicDashboard cards={cards} onSwitchTab={(id) => { setActiveTab(id); setUniverseView(null); setSearchTerm(""); }} />
        )
      ) : (
        <div style={{ display: "flex", gap: "12px", padding: "16px 16px", overflowX: "auto", alignItems: "flex-start" }}>
          {lists.map(list => (
            <ListColumn key={list.id} list={list} cards={tabCards.filter(c => c.list === list.id)}
              onEdit={setEditing} onDelete={deleteCard} onDrop={dropCard}
              draggingId={draggingId} onDragStart={setDraggingId} onDragEnd={() => setDraggingId(null)}
              onAddCard={addCard} tabColor={tabObj?.color} universes={universes} />
          ))}
        </div>
      )}

      {(!isDashboard || showUniverseView) && viewMode === "circles" && <HomeMarble onClick={handleGoHome} />}
      {editing && <CardEditor card={editing} onSave={saveCard} onDelete={deleteCard} onClose={() => setEditing(null)} currentTab={activeTab} allCards={cards} universes={universes} />}
      {toast && <AutoToast message={toast} onDone={() => setToast(null)} />}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      {showUniverseManager && (
        <UniverseManager universes={universes} cards={cards}
          onSave={async (nu) => { await saveUniversesToDb(nu); setToast(`Universes updated — ${nu.length} marble${nu.length !== 1 ? "s" : ""} in the bag.`); }}
          onClose={() => setShowUniverseManager(false)} />
      )}
    </div>
  );
}
