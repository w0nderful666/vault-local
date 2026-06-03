import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Clipboard,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileJson,
  Heart,
  Languages,
  Lock,
  Moon,
  Pencil,
  Pin,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Toast, type ToastMessage } from "@/components/Toast";
import { siteMeta } from "@/config/siteMeta";
import { sampleClips } from "@/data/sampleClips";
import { clipboardStorage } from "@/lib/clipboardStorage";
import {
  CLIP_TYPES,
  type ClipItem,
  type ClipType,
  copyTextToClipboard,
  createClipFromContent,
  detectSensitive,
  detectClipType,
  generateClipTitle,
  summarizeClip,
} from "@/lib/clipboardUtils";
import { AUTO_LOCK_MINUTES, decryptContent, encryptContent } from "@/lib/cryptoVault";

type Theme = "light" | "dark";
type Language = "zh" | "en";
type FilterMode = {
  query: string;
  type: "All" | ClipType;
  tag: string;
  onlyPinned: boolean;
  onlyFavorite: boolean;
};

const text = {
  zh: {
    localName: "本地剪贴内容保险箱",
    tagline: "Local First / No Backend / GitHub Pages Ready 的本地内容浮窗工作台。",
    quickCapture: "Quick Capture",
    pasteFromClipboard: "从剪贴板导入",
    manualPaste: "手动粘贴",
    saveContent: "保存内容",
    ctrlEnter: "Press Ctrl + Enter to save",
    sensitive: "敏感内容",
    autoTitle: "自动标题",
    autoType: "自动类型识别",
    floatingCards: "Floating Cards",
    recentClips: "Recent clips",
    search: "搜索",
    tags: "标签",
    type: "类型",
    copy: "复制",
    edit: "编辑",
    clone: "克隆",
    delete: "删除",
    pin: "置顶",
    favorite: "收藏",
    reveal: "Reveal / Hide",
    details: "Open details",
    unlockVault: "Unlock vault",
    lockVault: "Lock vault",
    masterPassword: "Master password",
    locked: "Vault locked",
    unlocked: "Vault unlocked",
    encryptionEnabled: "Encryption enabled",
    unlockToReveal: "Unlock to reveal",
    importJson: "Import JSON",
    exportJson: "Export JSON",
    loadSample: "Load sample data",
    clearAll: "Clear all data",
    privacyFirst: "Privacy first",
    localOnly: "Local only",
    noBackend: "No backend",
    settings: "Settings",
    appearance: "Appearance",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    language: "Language",
    savedFromClipboard: "Saved from clipboard",
    saved: "Saved",
    copied: "Copied",
    readingClipboard: "Reading clipboard...",
    emptyClipboard: "Clipboard is empty. Paste content manually.",
    clipboardDenied: "Clipboard permission denied. Use Ctrl + V manually.",
    unlockFirst: "Unlock vault before saving or revealing sensitive content.",
    imported: "JSON imported",
    exported: "JSON exported",
    deleted: "Deleted",
    noResults: "No clips match the current filters.",
    privacyNote:
      "Your content never leaves this page. Data is stored in this browser only; clearing browser data removes it. Export JSON backups regularly.",
  },
  en: {
    localName: "Local Clipboard Vault",
    tagline: "A Local First / No Backend / GitHub Pages Ready floating workspace for snippets.",
    quickCapture: "Quick Capture",
    pasteFromClipboard: "Paste from clipboard",
    manualPaste: "Manual paste",
    saveContent: "Save content",
    ctrlEnter: "Press Ctrl + Enter to save",
    sensitive: "Sensitive content",
    autoTitle: "Auto title",
    autoType: "Local type detection",
    floatingCards: "Floating Cards",
    recentClips: "Recent clips",
    search: "Search",
    tags: "Tags",
    type: "Type",
    copy: "Copy",
    edit: "Edit",
    clone: "Clone",
    delete: "Delete",
    pin: "Pin",
    favorite: "Favorite",
    reveal: "Reveal / Hide",
    details: "Open details",
    unlockVault: "Unlock vault",
    lockVault: "Lock vault",
    masterPassword: "Master password",
    locked: "Vault locked",
    unlocked: "Vault unlocked",
    encryptionEnabled: "Encryption enabled",
    unlockToReveal: "Unlock to reveal",
    importJson: "Import JSON",
    exportJson: "Export JSON",
    loadSample: "Load sample data",
    clearAll: "Clear all data",
    privacyFirst: "Privacy first",
    localOnly: "Local only",
    noBackend: "No backend",
    settings: "Settings",
    appearance: "Appearance",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    language: "Language",
    savedFromClipboard: "Saved from clipboard",
    saved: "Saved",
    readingClipboard: "Reading clipboard...",
    emptyClipboard: "Clipboard is empty. Paste content manually.",
    clipboardDenied: "Clipboard permission denied. Paste manually with Ctrl + V.",
    unlockFirst: "Unlock vault before saving or revealing sensitive content.",
    imported: "JSON imported",
    exported: "JSON exported",
    deleted: "Deleted",
    noResults: "No clips match the current filters.",
    privacyNote:
      "Your content never leaves this page. Data is stored in this browser only; clearing browser data removes it. Export JSON backups regularly.",
    copied: "Copied",
  },
} satisfies Record<Language, Record<string, string>>;

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem(`${siteMeta.localStoragePrefix}.theme`);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "zh";
  return window.localStorage.getItem(`${siteMeta.localStoragePrefix}.language`) === "en"
    ? "en"
    : "zh";
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function sortClips(clips: ClipItem[]): ClipItem[] {
  return [...clips].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

function matchesFilter(clip: ClipItem, filter: FilterMode, revealedContent?: string): boolean {
  if (filter.type !== "All" && clip.type !== filter.type) return false;
  if (filter.onlyPinned && !clip.pinned) return false;
  if (filter.onlyFavorite && !clip.favorite) return false;
  if (filter.tag && !clip.tags.includes(filter.tag)) return false;

  const query = filter.query.trim().toLowerCase();
  if (!query) return true;

  const searchable = [
    clip.title,
    clip.type,
    clip.note,
    clip.tags.join(" "),
    clip.encrypted && !revealedContent ? "" : (revealedContent ?? clip.content ?? ""),
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function downloadText(fileName: string, content: string): void {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [clips, setClips] = useState<ClipItem[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [manualText, setManualText] = useState("");
  const [manualSensitive, setManualSensitive] = useState(false);
  const [filter, setFilter] = useState<FilterMode>({
    query: "",
    type: "All",
    tag: "",
    onlyPinned: false,
    onlyFavorite: false,
  });
  const [vaultPassword, setVaultPassword] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<ClipItem | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [dockFilter, setDockFilter] = useState<ClipType | "All">("All");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"appearance" | "workspace" | "advanced">(
    "appearance"
  );
  const [leavingIds, setLeavingIds] = useState<Set<string>>(new Set());
  const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set());
  const [filtering, setFiltering] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const manualTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [captureMode, setCaptureMode] = useState<"idle" | "reading" | "manual">("idle");
  const t = text[language];
  const vaultUnlocked = vaultPassword.length > 0;

  const lockVault = useCallback(() => {
    setVaultPassword("");
    setPasswordInput("");
    setRevealed({});
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem(`${siteMeta.localStoragePrefix}.theme`, theme);
    window.localStorage.setItem(`${siteMeta.localStoragePrefix}.language`, language);
  }, [theme, language]);

  useEffect(() => {
    const saved = clipboardStorage.readAll();
    const next = saved.length > 0 ? saved : sampleClips;
    setClips(sortClips(next));
    setStorageLoaded(true);
    if (saved.length === 0) {
      clipboardStorage.saveAll(sampleClips);
    }
  }, []);

  useEffect(() => {
    if (storageLoaded) {
      clipboardStorage.saveAll(sortClips(clips));
    }
  }, [clips, storageLoaded]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!vaultUnlocked) return undefined;
    let timer = window.setTimeout(lockVault, AUTO_LOCK_MINUTES * 60 * 1000);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(lockVault, AUTO_LOCK_MINUTES * 60 * 1000);
    };
    window.addEventListener("keydown", reset);
    window.addEventListener("pointerdown", reset);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("pointerdown", reset);
    };
  }, [vaultUnlocked, lockVault]);

  useEffect(() => {
    if (
      filter.query ||
      filter.type !== "All" ||
      filter.tag ||
      filter.onlyPinned ||
      filter.onlyFavorite
    ) {
      setFiltering(true);
      const timer = window.setTimeout(() => setFiltering(false), 180);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [filter]);

  const tags = useMemo(
    () => Array.from(new Set(clips.flatMap((clip) => clip.tags))).sort(),
    [clips]
  );

  const [debouncedFilter, setDebouncedFilter] = useState(filter);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFilter(filter);
    }, 150);
    return () => window.clearTimeout(timer);
  }, [filter]);

  const filteredClips = useMemo(
    () =>
      clips.filter((clip) => {
        if (dockFilter !== "All" && clip.type !== dockFilter) return false;
        return matchesFilter(clip, debouncedFilter, revealed[clip.id]);
      }),
    [clips, debouncedFilter, revealed, dockFilter]
  );

  const showToast = (text: string, tone: ToastMessage["tone"] = "success") => {
    setToast({ id: crypto.randomUUID(), text, tone });
  };

  const focusManualCapture = () => {
    setCaptureMode("manual");
    window.requestAnimationFrame(() => {
      manualTextareaRef.current?.focus();
    });
  };

  const markClipCreated = (id: string) => {
    setHighlightIds((current) => new Set(current).add(id));
    window.setTimeout(() => {
      setHighlightIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }, 900);
  };

  const persistClip = async (clip: ClipItem, content: string): Promise<ClipItem | null> => {
    if (!clip.sensitive) {
      return {
        ...clip,
        content,
        encrypted: false,
        encryptedPayload: undefined,
      };
    }

    if (!vaultUnlocked) {
      showToast(t.unlockFirst, "danger");
      return null;
    }

    const encryptedPayload = await encryptContent(content, vaultPassword);
    return {
      ...clip,
      content: undefined,
      encrypted: true,
      encryptedPayload,
    };
  };

  const saveNewContent = async (
    content: string,
    options: { sensitive?: boolean; successText?: string } = {}
  ): Promise<boolean> => {
    const trimmed = content.trim();
    if (!trimmed) {
      showToast(t.emptyClipboard, "warning");
      focusManualCapture();
      return false;
    }
    const shouldForceSensitive = options.sensitive === true;
    const created = createClipFromContent(trimmed, shouldForceSensitive ? { sensitive: true } : {});
    if (!shouldForceSensitive && detectSensitive(trimmed) && !vaultUnlocked) {
      focusManualCapture();
      showToast(t.unlockFirst, "danger");
      return false;
    }
    const stored = await persistClip(created, trimmed);
    if (!stored) return false;
    setClips((current) => sortClips([stored, ...current]));
    markClipCreated(stored.id);
    setManualText("");
    setManualSensitive(false);
    setCaptureMode("idle");
    showToast(options.successText ?? t.saved);
    return true;
  };

  const importFromClipboard = async () => {
    if (!navigator.clipboard?.readText) {
      focusManualCapture();
      showToast(t.clipboardDenied, "warning");
      return;
    }

    setCaptureMode("reading");
    showToast(t.readingClipboard, "warning");

    try {
      const clipboardText = await navigator.clipboard.readText();
      const saved = await saveNewContent(clipboardText, { successText: t.savedFromClipboard });
      if (!saved) {
        setCaptureMode("manual");
      }
    } catch {
      focusManualCapture();
      showToast(t.clipboardDenied, "warning");
    }
  };

  const copyClip = async (clip: ClipItem) => {
    const content = clip.encrypted ? revealed[clip.id] : clip.content;
    if (clip.encrypted && !content) {
      showToast(t.unlockFirst, "danger");
      return;
    }
    try {
      await copyTextToClipboard(content ?? "");
      showToast(t.copied);
    } catch {
      showToast(t.clipboardDenied, "danger");
    }
  };

  const revealClip = async (clip: ClipItem) => {
    if (!clip.encrypted || !clip.encryptedPayload) return;
    if (revealed[clip.id]) {
      setRevealed((current) => {
        const next = { ...current };
        delete next[clip.id];
        return next;
      });
      return;
    }
    if (!vaultUnlocked) {
      showToast(t.unlockFirst, "danger");
      return;
    }
    try {
      const content = await decryptContent(clip.encryptedPayload, vaultPassword);
      setRevealed((current) => ({ ...current, [clip.id]: content }));
      return content;
    } catch {
      showToast("Wrong password or damaged payload.", "danger");
    }
    return null;
  };

  const updateClip = (id: string, patch: Partial<ClipItem>) => {
    setClips((current) =>
      sortClips(
        current.map((clip) =>
          clip.id === id ? { ...clip, ...patch, updatedAt: new Date().toISOString() } : clip
        )
      )
    );
  };

  const openEdit = async (clip: ClipItem) => {
    let content = revealed[clip.id] ?? clip.content ?? "";
    if (clip.encrypted && !revealed[clip.id]) {
      const decrypted = await revealClip(clip);
      if (!decrypted) return;
      content = decrypted;
    }
    setEditing(clip);
    setEditContent(content);
    setEditTags(clip.tags.join(", "));
  };

  const saveEdit = async () => {
    if (!editing) return;
    const updated: ClipItem = {
      ...editing,
      title: editing.title.trim() || generateClipTitle(editContent),
      type: editing.type || detectClipType(editContent),
      tags: editTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      updatedAt: new Date().toISOString(),
    };
    const stored = await persistClip(updated, editContent);
    if (!stored) return;
    setClips((current) =>
      sortClips(current.map((clip) => (clip.id === stored.id ? stored : clip)))
    );
    setRevealed((current) => ({ ...current, [stored.id]: editContent }));
    setEditing(null);
    showToast(t.saved);
  };

  const cloneClip = async (clip: ClipItem) => {
    const sourceContent = revealed[clip.id] ?? clip.content;
    if (clip.encrypted && !sourceContent) {
      showToast(t.unlockFirst, "danger");
      return;
    }
    const now = new Date().toISOString();
    const clone: ClipItem = {
      ...clip,
      id: crypto.randomUUID(),
      title: `${clip.title} Copy`,
      content: sourceContent,
      encryptedPayload: undefined,
      createdAt: now,
      updatedAt: now,
    };
    const stored = await persistClip(clone, sourceContent ?? "");
    if (!stored) return;
    setClips((current) => sortClips([stored, ...current]));
    showToast(t.clone);
  };

  const deleteClip = (clip: ClipItem) => {
    if (!window.confirm(`Delete "${clip.title}"?`)) return;
    setLeavingIds((current) => new Set(current).add(clip.id));
    window.setTimeout(() => {
      setClips((current) => current.filter((item) => item.id !== clip.id));
      setRevealed((current) => {
        const next = { ...current };
        delete next[clip.id];
        return next;
      });
      setLeavingIds((current) => {
        const next = new Set(current);
        next.delete(clip.id);
        return next;
      });
    }, 240);
    showToast(t.deleted);
  };

  const exportJson = () => {
    const date = new Date().toISOString().slice(0, 10);
    downloadText(
      `vault-local-v${siteMeta.version}-${date}.json`,
      clipboardStorage.exportJson(clips)
    );
    showToast(t.exported);
  };

  const importJson = async (file: File | undefined) => {
    if (!file) return;
    try {
      const text = await file.text();
      const merged = clipboardStorage.importJson(text, clips);
      setClips(sortClips(merged));
      showToast(t.imported);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Import failed.", "danger");
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = "";
      }
    }
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const clearAll = () => {
    setShowClearConfirm(true);
  };

  const confirmClearAll = () => {
    clipboardStorage.clear();
    setClips([]);
    setRevealed({});
    showToast(t.clearAll);
    setShowClearConfirm(false);
  };

  return (
    <div className="app-shell" data-testid="app-shell">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__icon">
            <Clipboard size={18} />
          </span>
          <span className="topbar__version">v{siteMeta.version}</span>
          <span className="topbar__badge">Local First</span>
          <span className="topbar__badge">No Backend</span>
        </div>
        <div className="topbar__actions">
          <Button
            aria-label="Toggle theme"
            data-testid="theme-toggle"
            icon={theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            size="sm"
            variant="ghost"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
          <Button
            aria-label="Toggle language"
            data-testid="language-toggle"
            icon={<Languages size={17} />}
            onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
            size="sm"
            variant="ghost"
          >
            {language === "zh" ? "EN" : "中文"}
          </Button>
        </div>
      </header>

      <main>
        <div className="workspace">
          <div className="main-content" data-filtering={filtering}>
            <div className="floating-grid" data-filtering={filtering} data-testid="floating-cards">
              {filteredClips.map((clip) => (
                <article
                  aria-label={`${clip.title} - ${clip.type}`}
                  className={`clip-card${leavingIds.has(clip.id) ? " clip-card--leaving" : ""}${highlightIds.has(clip.id) ? " clip-card--new" : ""}`}
                  data-testid="clip-card"
                  key={clip.id}
                  onClick={() => void copyClip(clip)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      void copyClip(clip);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="clip-card__bar">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="clip-card__head">
                    <div>
                      <h3>{clip.title}</h3>
                      <small>{formatTime(clip.updatedAt)}</small>
                    </div>
                    <span className="type-badge">{clip.type}</span>
                  </div>
                  <p className="clip-card__summary">{summarizeClip(clip, revealed[clip.id])}</p>
                  <div className="tag-row tag-row--compact">
                    {clip.tags.map((tag) => (
                      <span className="tag tag--small" key={tag}>
                        {tag}
                      </span>
                    ))}
                    {clip.pinned ? <span className="tag tag--small">Pinned</span> : null}
                    {clip.favorite ? <span className="tag tag--small">Favorite</span> : null}
                    {clip.sensitive ? <span className="tag tag--small">Sensitive</span> : null}
                    {clip.encrypted ? <span className="tag tag--small">Encrypted</span> : null}
                  </div>
                  <div className="clip-card__actions" onClick={(event) => event.stopPropagation()}>
                    <Button
                      title={t.copy}
                      icon={<Copy size={11} />}
                      onClick={() => void copyClip(clip)}
                      size="sm"
                      variant="primary"
                    />
                    <Button
                      title={t.edit}
                      icon={<Pencil size={11} />}
                      onClick={() => void openEdit(clip)}
                      size="sm"
                      variant="ghost"
                    />
                    <Button
                      title={t.clone}
                      icon={<Sparkles size={11} />}
                      onClick={() => void cloneClip(clip)}
                      size="sm"
                      variant="ghost"
                    />
                    <Button
                      title={t.pin}
                      icon={<Pin size={11} />}
                      onClick={() => updateClip(clip.id, { pinned: !clip.pinned })}
                      size="sm"
                      variant={clip.pinned ? "primary" : "ghost"}
                    />
                    <Button
                      title={t.favorite}
                      icon={<Heart size={11} />}
                      onClick={() => updateClip(clip.id, { favorite: !clip.favorite })}
                      size="sm"
                      variant={clip.favorite ? "primary" : "ghost"}
                    />
                    {clip.encrypted ? (
                      <Button
                        title={t.reveal}
                        icon={revealed[clip.id] ? <EyeOff size={11} /> : <Eye size={11} />}
                        onClick={() => void revealClip(clip)}
                        size="sm"
                        variant="ghost"
                      />
                    ) : null}
                    <Button
                      title={t.delete}
                      icon={<Trash2 size={11} />}
                      onClick={() => deleteClip(clip)}
                      size="sm"
                      variant="ghost"
                    />
                  </div>
                </article>
              ))}
            </div>
            {filteredClips.length === 0 ? <p className="empty-note">{t.noResults}</p> : null}
          </div>

          <aside className="sidebar">
            <div className="sidebar__section" data-testid="quick-capture" id="capture">
              <textarea
                aria-label={t.manualPaste}
                className={
                  captureMode === "manual"
                    ? "capture-textarea capture-textarea--attention"
                    : "capture-textarea"
                }
                data-capture-mode={captureMode}
                onChange={(event) => setManualText(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                    void saveNewContent(manualText, { sensitive: manualSensitive || undefined });
                  }
                }}
                placeholder="Paste content... (Ctrl+Enter)"
                ref={manualTextareaRef}
                value={manualText}
              />
              <div className="capture-dock__actions">
                <label className="check">
                  <input
                    checked={manualSensitive}
                    onChange={(event) => setManualSensitive(event.target.checked)}
                    type="checkbox"
                  />
                  {t.sensitive}
                </label>
                <Button
                  icon={<Plus size={15} />}
                  onClick={() =>
                    void saveNewContent(manualText, { sensitive: manualSensitive || undefined })
                  }
                  size="sm"
                >
                  {t.saveContent}
                </Button>
              </div>
            </div>

            <div className="sidebar__section">
              <label className="search-box">
                <Search size={15} />
                <input
                  aria-label={t.search}
                  onChange={(event) =>
                    setFilter((current) => ({ ...current, query: event.target.value }))
                  }
                  placeholder={t.search}
                  value={filter.query}
                />
              </label>
            </div>

            <div className="sidebar__section">
              <div className="chip-row">
                <button
                  aria-pressed={filter.type === "All"}
                  className={filter.type === "All" ? "chip is-active" : "chip"}
                  onClick={() => setFilter((current) => ({ ...current, type: "All" }))}
                  type="button"
                >
                  All
                </button>
                {CLIP_TYPES.map((type) => (
                  <button
                    aria-pressed={filter.type === type}
                    className={filter.type === type ? "chip is-active" : "chip"}
                    key={type}
                    onClick={() => setFilter((current) => ({ ...current, type }))}
                    type="button"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar__section">
              <select
                aria-label={t.tags}
                onChange={(event) =>
                  setFilter((current) => ({ ...current, tag: event.target.value }))
                }
                value={filter.tag}
              >
                <option value="">All tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            <div className="sidebar__section">
              <div className="button-row">
                <Button
                  icon={<Heart size={14} />}
                  onClick={() =>
                    setFilter((current) => ({ ...current, onlyFavorite: !current.onlyFavorite }))
                  }
                  variant={filter.onlyFavorite ? "primary" : "secondary"}
                  size="sm"
                >
                  {t.favorite}
                </Button>
                <Button
                  icon={<Pin size={14} />}
                  onClick={() =>
                    setFilter((current) => ({ ...current, onlyPinned: !current.onlyPinned }))
                  }
                  variant={filter.onlyPinned ? "primary" : "secondary"}
                  size="sm"
                >
                  {t.pin}
                </Button>
              </div>
            </div>

            <div className="sidebar__section">
              <Button
                onClick={() =>
                  setFilter({
                    query: "",
                    type: "All",
                    tag: "",
                    onlyPinned: false,
                    onlyFavorite: false,
                  })
                }
                size="sm"
              >
                Clear · {filteredClips.length}
              </Button>
              <Button
                disabled={captureMode === "reading"}
                icon={<Clipboard size={15} />}
                onClick={importFromClipboard}
                variant="primary"
                size="sm"
              >
                {captureMode === "reading" ? t.readingClipboard : t.pasteFromClipboard}
              </Button>
            </div>
          </aside>
        </div>

        <div className="dock">
          <div className="dock__items">
            <button
              className={dockFilter === "All" ? "dock__item dock__item--active" : "dock__item"}
              onClick={() => setDockFilter("All")}
              title="All"
            >
              <Clipboard size={16} />
            </button>
            {CLIP_TYPES.slice(0, 6).map((type) => (
              <button
                key={type}
                className={dockFilter === type ? "dock__item dock__item--active" : "dock__item"}
                onClick={() => setDockFilter(type)}
                title={type}
              >
                {type === "Prompt" && <Sparkles size={16} />}
                {type === "API Key" && <Lock size={16} />}
                {type === "Token" && <ShieldCheck size={16} />}
                {type === "Command" && <Terminal size={16} />}
                {type === "Note" && <FileJson size={16} />}
                {type === "Template" && <FileJson size={16} />}
                {type === "JSON" && <FileJson size={16} />}
                {type === "Markdown" && <FileJson size={16} />}
                {type === "Other" && <FileJson size={16} />}
              </button>
            ))}
          </div>
          <button
            className="dock__settings"
            onClick={() => setSettingsOpen(true)}
            title={t.settings}
          >
            <Settings size={16} />
          </button>
        </div>
      </main>

      <Modal
        closeLabel="Close"
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title={t.settings}
      >
        <div className="window window--preferences">
          <div className="window__sidebar">
            <button
              className={settingsTab === "appearance" ? "is-active" : ""}
              onClick={() => setSettingsTab("appearance")}
            >
              <Sun size={16} />
              <span>{t.appearance}</span>
            </button>
            <button
              className={settingsTab === "workspace" ? "is-active" : ""}
              onClick={() => setSettingsTab("workspace")}
            >
              <Clipboard size={16} />
              <span>Workspace</span>
            </button>
            <button
              className={settingsTab === "advanced" ? "is-active" : ""}
              onClick={() => setSettingsTab("advanced")}
            >
              <ShieldCheck size={16} />
              <span>Advanced</span>
            </button>
          </div>
          <div className="window__main">
            {settingsTab === "appearance" && (
              <>
                <div className="window__header">
                  <div className="window__chrome">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="window__title">{t.appearance}</span>
                  <span style={{ width: 44 }} />
                </div>
                <div className="window__content">
                  <div className="settings-panel">
                    <div className="settings__section">
                      <h3>{t.theme}</h3>
                      <div className="settings__options">
                        <button
                          className={`settings__option ${theme === "light" ? "is-active" : ""}`}
                          onClick={() => setTheme("light")}
                        >
                          <Sun size={14} />
                          {t.light}
                        </button>
                        <button
                          className={`settings__option ${theme === "dark" ? "is-active" : ""}`}
                          onClick={() => setTheme("dark")}
                        >
                          <Moon size={14} />
                          {t.dark}
                        </button>
                      </div>
                    </div>
                    <div className="settings__section">
                      <h3>{t.language}</h3>
                      <div className="settings__options">
                        <button
                          className={`settings__option ${language === "zh" ? "is-active" : ""}`}
                          onClick={() => setLanguage("zh")}
                        >
                          中文
                        </button>
                        <button
                          className={`settings__option ${language === "en" ? "is-active" : ""}`}
                          onClick={() => setLanguage("en")}
                        >
                          English
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {settingsTab === "workspace" && (
              <>
                <div className="window__header">
                  <div className="window__chrome">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="window__title">Workspace</span>
                  <span style={{ width: 44 }} />
                </div>
                <div className="window__content">
                  <div className="settings-panel">
                    <div className="settings__section">
                      <h3>Display</h3>
                      <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                        Workspace display settings coming soon.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            {settingsTab === "advanced" && (
              <>
                <div className="window__header">
                  <div className="window__chrome">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="window__title">Advanced</span>
                  <span style={{ width: 44 }} />
                </div>
                <div className="window__content">
                  <div className="settings-panel">
                    <div className="settings__section">
                      <h3>Vault</h3>
                      <div className="vault-panel">
                        <div className="vault-panel__status">
                          <span
                            className={vaultUnlocked ? "vault-dot vault-dot--open" : "vault-dot"}
                          />
                          <strong>{vaultUnlocked ? t.unlocked : t.locked}</strong>
                          <small>{AUTO_LOCK_MINUTES} min auto lock</small>
                        </div>
                        <label className="field">
                          <span>{t.masterPassword}</span>
                          <input
                            autoComplete="off"
                            onChange={(event) => setPasswordInput(event.target.value)}
                            placeholder="Never saved"
                            type="password"
                            value={passwordInput}
                          />
                        </label>
                        <div className="button-row">
                          <Button
                            icon={<ShieldCheck size={17} />}
                            onClick={() => {
                              if (!passwordInput) return showToast(t.unlockFirst, "danger");
                              setVaultPassword(passwordInput);
                              setPasswordInput("");
                              showToast(t.unlocked);
                            }}
                            variant="primary"
                          >
                            {t.unlockVault}
                          </Button>
                          <Button icon={<Lock size={17} />} onClick={lockVault}>
                            {t.lockVault}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="settings__section">
                      <h3>Data</h3>
                      <div className="settings__options">
                        <input
                          accept="application/json"
                          hidden
                          onChange={(event) => void importJson(event.target.files?.[0])}
                          ref={importInputRef}
                          type="file"
                        />
                        <Button
                          icon={<Upload size={17} />}
                          onClick={() => importInputRef.current?.click()}
                        >
                          {t.importJson}
                        </Button>
                        <Button icon={<Download size={17} />} onClick={exportJson}>
                          {t.exportJson}
                        </Button>
                        <Button
                          icon={<FileJson size={17} />}
                          onClick={() => setClips(sortClips(sampleClips))}
                        >
                          {t.loadSample}
                        </Button>
                        <Button icon={<Trash2 size={17} />} onClick={clearAll} variant="danger">
                          {t.clearAll}
                        </Button>
                      </div>
                    </div>
                    <div className="settings__section">
                      <p className="privacy-note">{t.privacyNote}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        closeLabel="Close"
        isOpen={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?.title ?? t.details}
      >
        {editing ? (
          <div className="window">
            <div className="window__header">
              <div className="window__chrome">
                <span />
                <span />
                <span />
              </div>
              <span className="window__title">{editing?.title ?? t.details}</span>
              <span style={{ width: 44 }} />
            </div>
            <div className="window__content">
              <div className="edit-form">
                <div className="edit-form__group">
                  <label className="edit-form__label">Title</label>
                  <input
                    className="edit-form__input edit-form__input--title"
                    value={editing.title}
                    onChange={(event) => setEditing({ ...editing, title: event.target.value })}
                  />
                </div>
                <div className="edit-form__group">
                  <label className="edit-form__label">{t.type}</label>
                  <select
                    className="edit-form__input edit-form__select"
                    value={editing.type}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (CLIP_TYPES.includes(value as ClipType)) {
                        setEditing({ ...editing, type: value as ClipType });
                      }
                    }}
                  >
                    {CLIP_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="edit-form__group">
                  <label className="edit-form__label">Content</label>
                  <textarea
                    className="edit-form__input edit-form__textarea"
                    value={editContent}
                    onChange={(event) => setEditContent(event.target.value)}
                  />
                </div>
                <div className="edit-form__group">
                  <label className="edit-form__label">{t.tags}</label>
                  <input
                    className="edit-form__input"
                    value={editTags}
                    onChange={(event) => setEditTags(event.target.value)}
                  />
                </div>
                <div className="edit-form__group">
                  <label className="edit-form__label">Note</label>
                  <input
                    className="edit-form__input"
                    value={editing.note}
                    onChange={(event) => setEditing({ ...editing, note: event.target.value })}
                  />
                </div>
                <div className="edit-form__flags">
                  <label className="edit-form__flag">
                    <input
                      type="checkbox"
                      checked={editing.sensitive}
                      onChange={(event) =>
                        setEditing({ ...editing, sensitive: event.target.checked })
                      }
                    />
                    {t.sensitive}
                  </label>
                  <label className="edit-form__flag">
                    <input
                      type="checkbox"
                      checked={editing.pinned}
                      onChange={(event) => setEditing({ ...editing, pinned: event.target.checked })}
                    />
                    {t.pin}
                  </label>
                  <label className="edit-form__flag">
                    <input
                      type="checkbox"
                      checked={editing.favorite}
                      onChange={(event) =>
                        setEditing({ ...editing, favorite: event.target.checked })
                      }
                    />
                    {t.favorite}
                  </label>
                </div>
                {editing.sensitive && !editing.encrypted ? (
                  <p className="edit-form__note">
                    Legacy sensitive item: re-save while vault is unlocked to enable encryption.
                  </p>
                ) : null}
              </div>
            </div>
            <div className="window__footer">
              <Button onClick={() => setEditing(null)} variant="ghost">
                Close
              </Button>
              <Button
                icon={<ShieldCheck size={17} />}
                onClick={() => void saveEdit()}
                variant="primary"
              >
                {t.saveContent}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        closeLabel="Cancel"
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear All Data"
      >
        <div className="confirm-dialog">
          <p>Clear all Local Clipboard Vault data in this browser?</p>
          <div className="confirm-dialog__actions">
            <Button onClick={() => setShowClearConfirm(false)} variant="ghost">
              Cancel
            </Button>
            <Button onClick={confirmClearAll} variant="danger">
              Clear All
            </Button>
          </div>
        </div>
      </Modal>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
