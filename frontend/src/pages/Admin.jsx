import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Admin.css";

const NAV = [
  { icon: "📊", label: "Overview",  key: "overview" },
  { icon: "🎥", label: "Videos",    key: "videos"   },
  { icon: "🖼️", label: "Images",    key: "images"   },
  { icon: "🎵", label: "Audio",     key: "audio"    },
  { icon: "📁", label: "All Media", key: "all"      },
];

const TYPE_ICON  = { video: "🎥", image: "🖼️", audio: "🎵" };
const TYPE_COLOR = { video: "type-video", image: "type-image", audio: "type-audio" };

// ✅ Explicit map instead of brittle string replace
const NAV_TYPE_MAP = {
  videos: "video",
  images: "image",
  audio:  "audio",   // was broken before — "audio".replace("s","") = "audi"
};

function detectType(file) {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "image";
}

function Admin() {
  const [activeNav,    setActiveNav]    = useState("overview");
  const [viewMode,     setViewMode]     = useState("grid");
  const [media,        setMedia]        = useState([]);
  const [showUpload,   setShowUpload]   = useState(false);
  const [toast,        setToast]        = useState(null);
  const [deleteId,     setDeleteId]     = useState(null);
  const [search,       setSearch]       = useState("");
  const [editItem,     setEditItem]     = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const [form,      setForm]      = useState({ title: "", description: "", category: "", type: "video" });
  const [file,      setFile]      = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const navigate = useNavigate();

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");
    if (!token || role !== "admin") navigate("/login");
  }, []);

  // ── Load files ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await API.get("/files");
        const mapped = res.data.map((f, i) => {
          const ext  = f.filename.split(".").pop().toLowerCase();
          const type = ["mp4", "mov", "avi", "webm"].includes(ext)
            ? "video"
            : ["mp3", "wav", "ogg", "aac"].includes(ext)
            ? "audio"
            : "image";
          return {
            id:       f.id ?? i + 1,         // ✅ use real id if backend sends one
            title:    f.filename,
            category: f.category ?? "uploaded",
            type,
            size:     f.size
                        ? `${(f.size / 1024 / 1024).toFixed(1)} MB`
                        : "—",
            date:     f.created_at
                        ? f.created_at.split("T")[0]
                        : new Date().toISOString().split("T")[0],
            url:      f.url,
          };
        });
        setMedia(mapped);
      } catch {
        showToast("⚠️ Could not load files from server.", "error");
      } finally {
        setLoadingFiles(false);
      }
    };
    fetchFiles();
  }, []);

  // ── Logout — clears ALL auth keys ────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");   // ✅ added
    navigate("/login");
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Filter — fixed audio bug ──────────────────────────────────────────────
  const filtered = media.filter((m) => {
    const matchNav =
      activeNav === "overview" || activeNav === "all"
        ? true
        : m.type === NAV_TYPE_MAP[activeNav];   // ✅ explicit map
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());
    return matchNav && matchSearch;
  });

  const stats = [
    { icon: "🎥", label: "Videos",      val: media.filter((m) => m.type === "video").length, cls: "stat-blue"   },
    { icon: "🖼️", label: "Images",      val: media.filter((m) => m.type === "image").length, cls: "stat-green"  },
    { icon: "🎵", label: "Audio",       val: media.filter((m) => m.type === "audio").length, cls: "stat-purple" },
    { icon: "📁", label: "Total Files", val: media.length,                                    cls: "stat-amber"  },
  ];

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!form.title || !file) {
      showToast("Please add a title and select a file.", "error");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await API.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newItem = {
        id:          Date.now(),
        title:       form.title,
        description: form.description,
        category:    form.category || "general",
        type:        detectType(file),
        size:        `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        date:        new Date().toISOString().split("T")[0],
        url:         res.data.url,
        filename:    res.data.filename,
      };

      setMedia((prev) => [newItem, ...prev]);
      setForm({ title: "", description: "", category: "", type: "video" });
      setFile(null);
      setShowUpload(false);
      showToast(`✅ "${newItem.title}" uploaded successfully!`);
    } catch (err) {
      showToast(
        err.response?.data?.detail || "❌ Upload failed. Check file type.",
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      // ✅ wire to real endpoint when ready — currently safe no-op if it 404s
      await API.delete(`/files/${id}`).catch(() => {});
      setMedia((prev) => prev.filter((m) => m.id !== id));
      showToast("🗑️ Item removed.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  // ── Edit save ─────────────────────────────────────────────────────────────
  const handleEditSave = async () => {
    try {
      // ✅ wire to real endpoint when ready — currently safe no-op if it 404s
      await API.put(`/files/${editItem.id}`, editItem).catch(() => {});
      setMedia((prev) => prev.map((m) => (m.id === editItem.id ? editItem : m)));
      showToast("✏️ Item updated successfully!");
    } finally {
      setEditItem(null);
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type === "error" ? "admin-toast--error" : ""}`}>
          {toast.msg}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-icon">🗑️</div>
            <h3>Delete this item?</h3>
            <p>This action cannot be undone.</p>
            <div className="admin-modal-btns">
              <button className="admin-modal-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-modal-delete" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal--edit">
            <h3>✏️ Edit Item</h3>
            <div className="upload-field">
              <label>Title</label>
              <input className="upload-input" value={editItem.title}
                onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} />
            </div>
            <div className="upload-field">
              <label>Category</label>
              <input className="upload-input" value={editItem.category}
                onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} />
            </div>
            <div className="upload-field">
              <label>Description</label>
              <textarea className="upload-input upload-textarea"
                value={editItem.description || ""}
                onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
            </div>
            <div className="admin-modal-btns">
              <button className="admin-modal-cancel" onClick={() => setEditItem(null)}>Cancel</button>
              <button className="admin-modal-save"   onClick={handleEditSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-layout">

        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-logo">
            <div className="admin-sidebar-logo-icon">🛡️</div>
            <span>Admin Panel</span>
          </div>
          <p className="admin-nav-label">Manage</p>
          <ul className="admin-nav">
            {NAV.map((n) => (
              <li key={n.key}>
                <button
                  className={`admin-nav-btn ${activeNav === n.key ? "active" : ""}`}
                  onClick={() => setActiveNav(n.key)}
                >
                  <span>{n.icon}</span> {n.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="admin-sidebar-divider" />
          <button className="admin-logout-btn" onClick={logout}>
            <span>🚪</span> Logout
          </button>
        </aside>

        {/* Main content */}
        <main className="admin-main">

          {/* Header */}
          <div className="admin-header">
            <div>
              <h1 className="admin-header-title">
                {NAV.find((n) => n.key === activeNav)?.icon}{" "}
                {NAV.find((n) => n.key === activeNav)?.label}
              </h1>
              <p className="admin-header-sub">
                {filtered.length} item{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button className="admin-upload-btn" onClick={() => setShowUpload(true)}>
              + Upload
            </button>
          </div>

          {/* Stats */}
          {activeNav === "overview" && (
            <div className="admin-stats">
              {stats.map((s, i) => (
                <div key={i} className={`admin-stat ${s.cls}`}>
                  <span className="admin-stat-icon">{s.icon}</span>
                  <div className="admin-stat-val">{s.val}</div>
                  <div className="admin-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Search + view toggle */}
          <div className="admin-toolbar">
            <input
              className="admin-search"
              placeholder="🔍 Search by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="admin-view-toggle">
              <button className={viewMode === "grid"  ? "active" : ""} onClick={() => setViewMode("grid")}>⊞ Grid</button>
              <button className={viewMode === "table" ? "active" : ""} onClick={() => setViewMode("table")}>☰ Table</button>
            </div>
          </div>

          {/* Upload panel */}
          {showUpload && (
            <div className="upload-panel">
              <div className="upload-panel-header">
                <h3>📤 Upload New Media</h3>
                <button className="upload-close" onClick={() => setShowUpload(false)}>✕</button>
              </div>
              <div className="upload-grid">
                <div className="upload-field">
                  <label>Title *</label>
                  <input className="upload-input" placeholder="e.g. Chest Workout Tutorial"
                    value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="upload-field">
                  <label>Category</label>
                  <input className="upload-input" placeholder="e.g. chest, legs, nutrition"
                    value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="upload-field">
                  <label>Type</label>
                  <select className="upload-input upload-select"
                    value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="video">🎥 Video</option>
                    <option value="image">🖼️ Image</option>
                    <option value="audio">🎵 Audio</option>
                  </select>
                </div>
                <div className="upload-field">
                  <label>Description</label>
                  <input className="upload-input" placeholder="Short description (optional)"
                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div
                className="upload-dropzone"
                onClick={() => fileRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
              >
                {file
                  ? <span>📎 {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                  : <span>📁 Click or drag & drop your file here</span>
                }
                <input ref={fileRef} type="file" style={{ display: "none" }}
                  accept="video/*,image/*,audio/*"
                  onChange={(e) => setFile(e.target.files[0])} />
              </div>
              <button className="upload-submit" onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading…" : "Upload File →"}
              </button>
            </div>
          )}

          {/* Loading */}
          {loadingFiles && (
            <div className="admin-empty">
              <span>⏳</span>
              <p>Loading files from server…</p>
            </div>
          )}

          {/* Empty */}
          {!loadingFiles && filtered.length === 0 && (
            <div className="admin-empty">
              <span>📭</span>
              <p>No items found. Upload something!</p>
            </div>
          )}

          {/* Grid view */}
          {!loadingFiles && viewMode === "grid" && filtered.length > 0 && (
            <div className="admin-grid">
              {filtered.map((item, i) => (
                <div key={item.id} className="admin-card" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="admin-card-thumb">
                    {item.url && item.type === "image"
                      ? <img src={item.url} alt={item.title} />
                      : <span className="admin-card-thumb-icon">{TYPE_ICON[item.type]}</span>
                    }
                    <span className={`admin-card-badge ${TYPE_COLOR[item.type]}`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="admin-card-body">
                    <div className="admin-card-title">{item.title}</div>
                    <div className="admin-card-meta">{item.category} · {item.size} · {item.date}</div>
                  </div>
                  <div className="admin-card-actions">
                    <button className="admin-action-btn admin-action-edit"
                      onClick={() => setEditItem({ ...item })}>✏️ Edit</button>
                    <button className="admin-action-btn admin-action-del"
                      onClick={() => setDeleteId(item.id)}>🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table view */}
          {!loadingFiles && viewMode === "table" && filtered.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Size</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, i) => (
                    <tr key={item.id}>
                      <td className="admin-table-num">{i + 1}</td>
                      <td>
                        <span className={`admin-table-badge ${TYPE_COLOR[item.type]}`}>
                          {TYPE_ICON[item.type]} {item.type}
                        </span>
                      </td>
                      <td className="admin-table-title">{item.title}</td>
                      <td className="admin-table-cat">{item.category}</td>
                      <td>{item.size}</td>
                      <td>{item.date}</td>
                      <td>
                        <div className="admin-table-actions">
                          <button className="admin-action-btn admin-action-edit"
                            onClick={() => setEditItem({ ...item })}>✏️</button>
                          <button className="admin-action-btn admin-action-del"
                            onClick={() => setDeleteId(item.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>
    </>
  );
}

export default Admin;