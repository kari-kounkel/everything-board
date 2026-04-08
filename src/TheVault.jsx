import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

const GOLD = "#E8B931";
const DARK = "#1A1A1A";
const BG = "#FEFCF6";
const SAND = "#E6E2D8";
const MID = "#2A2520";

const LINK_CATEGORIES = [
  "Website", "Substack", "Stripe", "Supabase", "Dreamhost",
  "Vercel", "GitHub", "Tool", "Social", "Client", "Other"
];

const NOTE_TAGS = [
  "FlowSuite", "Everything Board", "CARES", "Freedom Force",
  "Creative", "Hoglund", "Personal", "Tech", "General"
];

function copyToClipboard(text, onDone) {
  navigator.clipboard.writeText(text).then(() => { if (onDone) onDone(); });
}

// ─── LINK FORM ───
function LinkForm({ initial, onSave, onCancel }) {
  const [label, setLabel] = useState(initial?.label || "");
  const [url, setUrl] = useState(initial?.url || "");
  const [category, setCategory] = useState(initial?.category || "Website");
  const [notes, setNotes] = useState(initial?.notes || "");

  const inp = {
    width: "100%", padding: "9px 12px", borderRadius: "8px",
    border: "1.5px solid #D8D3C6", background: "#FDFCF6",
    fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
    color: DARK, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: SAND, borderRadius: "12px", marginBottom: "12px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "10px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "4px" }}>Label</label>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Ask Kari Priority Form" style={inp} />
        </div>
        <div style={{ width: 140 }}>
          <label style={{ fontSize: "10px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "4px" }}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
            {LINK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={{ fontSize: "10px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "4px" }}>URL</label>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." style={inp} />
      </div>
      <div>
        <label style={{ fontSize: "10px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "4px" }}>Notes (optional)</label>
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any context worth remembering" style={inp} />
      </div>
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ padding: "7px 16px", borderRadius: "8px", border: "1.5px solid #D8D3C6", background: "transparent", color: "#888", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
        <button onClick={() => { if (!label.trim() || !url.trim()) return; onSave({ label, url, category, notes }); }}
          style={{ padding: "7px 18px", borderRadius: "8px", border: "none", background: DARK, color: GOLD, fontSize: "12px", fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          Save Link
        </button>
      </div>
    </div>
  );
}

// ─── LINK ROW ───
function LinkRow({ link, onDelete, onEdit }) {
  const [copied, setCopied] = useState(false);
  const catColors = {
    Website: "#4A6FA5", Substack: "#E07B39", Stripe: "#6772E5",
    Supabase: "#3ECF8E", Dreamhost: "#CC2929", Vercel: "#000",
    GitHub: "#333", Tool: "#3A7D7B", Social: "#C7548E",
    Client: "#5B8C5A", Other: "#888"
  };
  const color = catColors[link.category] || "#888";

  return (
    <div style={{ background: BG, border: "1.5px solid #E8E3D8", borderRadius: "10px", padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: DARK }}>{link.label}</span>
          <span style={{ fontSize: "9px", fontWeight: 700, color, background: color + "18", border: "1px solid " + color + "44", borderRadius: "5px", padding: "1px 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{link.category}</span>
        </div>
        <div style={{ fontSize: "11px", color: "#4A6FA5", fontWeight: 500, wordBreak: "break-all", marginBottom: link.notes ? "4px" : 0 }}>{link.url}</div>
        {link.notes && <div style={{ fontSize: "11px", color: "#888", fontStyle: "italic" }}>{link.notes}</div>}
      </div>
      <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
        <button onClick={() => { copyToClipboard(link.url, () => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); }}
          style={{ padding: "5px 9px", borderRadius: "7px", border: "1.5px solid #D8D3C6", background: copied ? "#E8B93122" : "transparent", color: copied ? GOLD : "#888", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          {copied ? "✓" : "Copy"}
        </button>
        <a href={link.url} target="_blank" rel="noreferrer"
          style={{ padding: "5px 9px", borderRadius: "7px", border: "1.5px solid #D8D3C6", background: "transparent", color: "#4A6FA5", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}>
          Open →
        </a>
        <button onClick={() => onEdit(link)}
          style={{ padding: "5px 9px", borderRadius: "7px", border: "1.5px solid #D8D3C6", background: "transparent", color: "#888", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          Edit
        </button>
        <button onClick={() => { if (confirm("Delete this link?")) onDelete(link.id); }}
          style={{ padding: "5px 9px", borderRadius: "7px", border: "1.5px solid #f0c0b0", background: "transparent", color: "#D4644E", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          ×
        </button>
      </div>
    </div>
  );
}

// ─── LINKS TAB ───
function LinksTab({ userId }) {
  const [links, setLinks] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  const load = useCallback(async () => {
    const { data } = await supabase.from("vault_links").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (data) setLinks(data);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const saveLink = async (fields) => {
    if (editing) {
      await supabase.from("vault_links").update(fields).eq("id", editing.id);
      setEditing(null);
    } else {
      await supabase.from("vault_links").insert({ ...fields, user_id: userId });
      setAdding(false);
    }
    load();
  };

  const deleteLink = async (id) => {
    await supabase.from("vault_links").delete().eq("id", id);
    load();
  };

  const filtered = links
    .filter(l => filterCat === "All" || l.category === filterCat)
    .filter(l => !search || l.label.toLowerCase().includes(search.toLowerCase()) || l.url.toLowerCase().includes(search.toLowerCase()) || (l.notes || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search links..."
          style={{ flex: 1, minWidth: 160, padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #D8D3C6", background: "#FDFCF6", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: DARK, outline: "none" }} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #D8D3C6", background: "#FDFCF6", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: DARK, outline: "none", cursor: "pointer" }}>
          <option>All</option>
          {LINK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={() => { setAdding(true); setEditing(null); }}
          style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: DARK, color: GOLD, fontSize: "12px", fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          + Add Link
        </button>
      </div>

      {adding && <LinkForm onSave={saveLink} onCancel={() => setAdding(false)} />}
      {editing && <LinkForm initial={editing} onSave={saveLink} onCancel={() => setEditing(null)} />}

      {filtered.length === 0 && !adding && (
        <div style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: "13px" }}>
          {links.length === 0 ? "No links yet — add your first one above." : "No links match your search."}
        </div>
      )}

      {filtered.map(l => (
        <LinkRow key={l.id} link={l} onDelete={deleteLink} onEdit={(link) => { setEditing(link); setAdding(false); }} />
      ))}
    </div>
  );
}

// ─── NOTE FORM ───
function NoteForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [body, setBody] = useState(initial?.body || "");
  const [tag, setTag] = useState(initial?.tag || "General");

  const inp = {
    width: "100%", padding: "9px 12px", borderRadius: "8px",
    border: "1.5px solid #D8D3C6", background: "#FDFCF6",
    fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
    color: DARK, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: SAND, borderRadius: "12px", marginBottom: "12px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "10px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "4px" }}>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What is this about?" style={inp} />
        </div>
        <div style={{ width: 140 }}>
          <label style={{ fontSize: "10px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "4px" }}>Tag</label>
          <select value={tag} onChange={e => setTag(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
            {NOTE_TAGS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={{ fontSize: "10px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "4px" }}>Note</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Everything worth remembering goes here." rows={5}
          style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
      </div>
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ padding: "7px 16px", borderRadius: "8px", border: "1.5px solid #D8D3C6", background: "transparent", color: "#888", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
        <button onClick={() => { if (!title.trim() || !body.trim()) return; onSave({ title, body, tag }); }}
          style={{ padding: "7px 18px", borderRadius: "8px", border: "none", background: DARK, color: GOLD, fontSize: "12px", fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          Save Note
        </button>
      </div>
    </div>
  );
}

// ─── NOTE CARD ───
function NoteCard({ note, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const tagColors = {
    FlowSuite: "#4A6FA5", "Everything Board": "#E8B931", CARES: "#5B8C5A",
    "Freedom Force": "#C7366B", Creative: "#E07B39", Hoglund: "#9B2335",
    Personal: "#C7548E", Tech: "#3A7D7B", General: "#888"
  };
  const color = tagColors[note.tag] || "#888";
  const preview = note.body.length > 120 ? note.body.slice(0, 120) + "..." : note.body;

  return (
    <div style={{ background: BG, border: "1.5px solid #E8E3D8", borderRadius: "10px", padding: "14px 16px", marginBottom: "8px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: DARK }}>{note.title}</span>
            <span style={{ fontSize: "9px", fontWeight: 700, color, background: color + "18", border: "1px solid " + color + "44", borderRadius: "5px", padding: "1px 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{note.tag}</span>
          </div>
          <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {expanded ? note.body : preview}
          </div>
          {note.body.length > 120 && (
            <button onClick={() => setExpanded(p => !p)}
              style={{ background: "none", border: "none", color: "#4A6FA5", fontSize: "11px", fontWeight: 600, cursor: "pointer", padding: "4px 0", fontFamily: "'DM Sans', sans-serif" }}>
              {expanded ? "Show less ▲" : "Show more ▼"}
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
          <button onClick={() => onEdit(note)}
            style={{ padding: "5px 9px", borderRadius: "7px", border: "1.5px solid #D8D3C6", background: "transparent", color: "#888", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
          <button onClick={() => { if (confirm("Delete this note?")) onDelete(note.id); }}
            style={{ padding: "5px 9px", borderRadius: "7px", border: "1.5px solid #f0c0b0", background: "transparent", color: "#D4644E", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>×</button>
        </div>
      </div>
      <div style={{ fontSize: "10px", color: "#bbb", marginTop: "8px" }}>
        {new Date(note.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </div>
    </div>
  );
}

// ─── NOTES TAB ───
function NotesTab({ userId }) {
  const [notes, setNotes] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("All");

  const load = useCallback(async () => {
    const { data } = await supabase.from("vault_notes").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (data) setNotes(data);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const saveNote = async (fields) => {
    if (editing) {
      await supabase.from("vault_notes").update(fields).eq("id", editing.id);
      setEditing(null);
    } else {
      await supabase.from("vault_notes").insert({ ...fields, user_id: userId });
      setAdding(false);
    }
    load();
  };

  const deleteNote = async (id) => {
    await supabase.from("vault_notes").delete().eq("id", id);
    load();
  };

  const filtered = notes
    .filter(n => filterTag === "All" || n.tag === filterTag)
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search notes..."
          style={{ flex: 1, minWidth: 160, padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #D8D3C6", background: "#FDFCF6", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: DARK, outline: "none" }} />
        <select value={filterTag} onChange={e => setFilterTag(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #D8D3C6", background: "#FDFCF6", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: DARK, outline: "none", cursor: "pointer" }}>
          <option>All</option>
          {NOTE_TAGS.map(t => <option key={t}>{t}</option>)}
        </select>
        <button onClick={() => { setAdding(true); setEditing(null); }}
          style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: DARK, color: GOLD, fontSize: "12px", fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          + Add Note
        </button>
      </div>

      {adding && <NoteForm onSave={saveNote} onCancel={() => setAdding(false)} />}
      {editing && <NoteForm initial={editing} onSave={saveNote} onCancel={() => setEditing(null)} />}

      {filtered.length === 0 && !adding && (
        <div style={{ textAlign: "center", padding: "40px", color: "#aaa", fontSize: "13px" }}>
          {notes.length === 0 ? "No notes yet — add your first one above." : "No notes match your search."}
        </div>
      )}

      {filtered.map(n => (
        <NoteCard key={n.id} note={n} onDelete={deleteNote} onEdit={(note) => { setEditing(note); setAdding(false); }} />
      ))}
    </div>
  );
}

// ─── THE VAULT MODAL ───
export default function TheVault({ userId, onClose }) {
  const [tab, setTab] = useState("links");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9998, display: "flex", flexDirection: "column" }}>
      <div style={{ background: DARK, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: GOLD, fontWeight: 800, fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>🗄️ The Vault</span>
          <div style={{ display: "flex", gap: "4px", background: "#2A2A2A", borderRadius: "8px", padding: "3px" }}>
            <button onClick={() => setTab("links")}
              style={{ padding: "5px 16px", borderRadius: "6px", border: "none", background: tab === "links" ? GOLD : "transparent", color: tab === "links" ? DARK : "#888", fontSize: "11px", fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              🔗 Links
            </button>
            <button onClick={() => setTab("notes")}
              style={{ padding: "5px 16px", borderRadius: "6px", border: "none", background: tab === "notes" ? GOLD : "transparent", color: tab === "notes" ? DARK : "#888", fontSize: "11px", fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              📝 Notes
            </button>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "1px solid #444", color: "#aaa", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>✕ Close</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", maxWidth: "800px", width: "100%", margin: "0 auto" }}>
        {tab === "links" ? <LinksTab userId={userId} /> : <NotesTab userId={userId} />}
      </div>
    </div>
  );
}
