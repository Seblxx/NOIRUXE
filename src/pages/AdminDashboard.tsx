import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { TiltedCard } from '../components/TiltedCard';
import {
  ArrowLeft, Plus, Pencil, Trash2, Save, X, Shield,
  Zap, Briefcase, Gamepad2, ChevronDown, ChevronLeft, ChevronRight, FolderOpen, GraduationCap, FileText, MessageSquare, Eye, Star, Check, XCircle, Upload, Image as ImageIcon, Film, Loader2
} from 'lucide-react';
import { supabase } from '../services/authService';
import * as skillsService from '../services/skillsService';
import * as workExperienceService from '../services/workExperienceService';
import * as hobbiesService from '../services/hobbiesService';
import * as projectsService from '../services/projectsService';
import * as educationService from '../services/educationService';
import * as resumesService from '../services/resumesService';
import * as contactService from '../services/contactService';
import * as testimonialsService from '../services/testimonialsService';
import { useLanguage } from '../contexts/LanguageContext';
import { T } from '../components/Translate';
import { translateBatch } from '../services/translationService';

type Tab = 'skills' | 'experience' | 'hobbies' | 'projects' | 'education' | 'resumes' | 'messages' | 'testimonials';

const font = { fontFamily: "'GT Pressura', sans-serif" };
const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');

// ─── Field component defined OUTSIDE to prevent remounting on every keystroke ───
const FormField = ({
  label, name, type = 'text', rows, options, value, onChange,
}: {
  label: string;
  name: string;
  type?: string;
  rows?: number;
  options?: string[];
  value: any;
  onChange: (name: string, value: any) => void;
}) => (
  <div>
    <label className="block text-[11px] mb-1.5 tracking-[0.15em] uppercase" style={{ ...font, color: 'rgba(255,255,255,0.6)' }}>
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        rows={rows || 2}
        className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
        style={{ ...font, color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }}
      />
    ) : type === 'select' ? (
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50 transition-all appearance-none"
          style={{ ...font, color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          {options?.map(o => <option key={o} value={o} style={{ backgroundColor: '#111' }}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.4)' }} />
      </div>
    ) : type === 'checkbox' ? (
      <label className="flex items-center gap-2 py-1">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(name, e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm text-white/70" style={font}><T>Enabled</T></span>
      </label>
    ) : type === 'range' ? (
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          value={value || 0}
          onChange={(e) => onChange(name, parseInt(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-cyan-400 w-10 text-right" style={font}>{value}%</span>
      </div>
    ) : (
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(name, type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
        style={{ ...font, color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }}
      />
    )}
  </div>
);

// ─── File Upload component defined OUTSIDE to prevent remounting ────
const FileUploadField = ({
  label, name, value, onChange, accept, multiple,
}: {
  label: string;
  name: string;
  value: any;
  onChange: (name: string, value: any) => void;
  accept?: string;
  multiple?: boolean;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const doUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError('');
    try {
      const token = localStorage.getItem('token');
      if (multiple) {
        // Multiple files — upload each, collect URLs as comma-separated string
        const urls: string[] = value ? String(value).split(',').map((s: string) => s.trim()).filter(Boolean) : [];
        for (let i = 0; i < files.length; i++) {
          const fd = new FormData();
          fd.append('file', files[i]);
          const res = await fetch(`${API_HOST}/api/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          });
          if (!res.ok) throw new Error('Upload failed');
          const data = await res.json();
          // If URL is already absolute (Supabase), use as-is; otherwise prepend API_HOST
          const fileUrl = data.url.startsWith('http') ? data.url : `${API_HOST}${data.url}`;
          urls.push(fileUrl);
        }
        onChange(name, urls.join(', '));
      } else {
        const fd = new FormData();
        fd.append('file', files[0]);
        const res = await fetch(`${API_HOST}/api/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        // If URL is already absolute (Supabase), use as-is; otherwise prepend API_HOST
        const fileUrl = data.url.startsWith('http') ? data.url : `${API_HOST}${data.url}`;
        onChange(name, fileUrl);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    doUpload(e.dataTransfer.files);
  };

  // Check if existing value looks like image/video for preview
  const currentUrl = value ? String(value) : '';
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(currentUrl.split(',')[0]?.trim() || '');
  const isVideo = /\.(mp4|webm|mov)$/i.test(currentUrl.split(',')[0]?.trim() || '');

  return (
    <div>
      <label className="block text-[11px] mb-1.5 tracking-[0.15em] uppercase" style={{ ...font, color: 'rgba(255,255,255,0.6)' }}>
        {label}
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        className="relative rounded-lg cursor-pointer transition-all"
        style={{
          border: dragOver ? '2px dashed rgba(0,255,255,0.6)' : '1px solid rgba(255,255,255,0.15)',
          backgroundColor: dragOver ? 'rgba(0,255,255,0.05)' : 'rgba(255,255,255,0.03)',
          padding: '0.75rem',
          minHeight: '4rem',
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => doUpload(e.target.files)}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <Loader2 size={18} className="animate-spin" style={{ color: '#22d3ee' }} />
            <span className="text-xs text-cyan-400" style={font}>Uploading…</span>
          </div>
        ) : currentUrl ? (
          <div className="space-y-2">
            {/* Thumbnail preview */}
            {isImage && (
              <div className="flex flex-wrap gap-1.5 max-h-[4.5rem] overflow-y-auto">
                {currentUrl.split(',').map((u: string, i: number) => (
                  <img key={i} src={u.trim()} alt="" className="h-10 w-10 object-cover rounded" />
                ))}
              </div>
            )}
            {isVideo && (
              <div className="flex items-center gap-2">
                <Film size={16} style={{ color: '#22d3ee' }} />
                <span className="text-xs text-white/60 truncate" style={font}>{currentUrl.split('/').pop()}</span>
              </div>
            )}
            {!isImage && !isVideo && (
              <div className="flex items-center gap-2">
                <ImageIcon size={16} style={{ color: '#22d3ee' }} />
                <span className="text-xs text-white/60 truncate" style={font}>{currentUrl.split('/').pop()}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Upload size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span className="text-[10px] text-white/40" style={font}>Click or drag to replace</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2 gap-1">
            <Upload size={20} style={{ color: 'rgba(255,255,255,0.3)' }} />
            <span className="text-[10px] text-white/40" style={font}>{multiple ? 'Click or drag files' : 'Click or drag a file'}</span>
          </div>
        )}
      </div>
      {currentUrl && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(name, ''); }}
          className="text-[10px] mt-1 hover:text-red-400 transition-colors"
          style={{ ...font, color: 'rgba(255,255,255,0.3)' }}
        >
          ✕ Remove
        </button>
      )}
      {uploadError && (
        <div className="text-[10px] mt-1 px-2 py-1 rounded" style={{ ...font, color: '#f87171', backgroundColor: 'rgba(248,113,113,0.1)' }}>
          ⚠ {uploadError}
        </div>
      )}
    </div>
  );
};

// ─── Tab button ─────────────────────────────────────────────────────────
const SectionButton = ({ active, onClick, icon: Icon, label }: {
  active: boolean; onClick: () => void; icon: any; label: string;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm tracking-wider uppercase transition-all border"
    style={{
      ...font,
      backgroundColor: active ? 'rgba(0,255,255,0.1)' : 'transparent',
      borderColor: active ? 'rgba(0,255,255,0.4)' : 'rgba(255,255,255,0.1)',
      color: active ? '#22d3ee' : 'rgba(255,255,255,0.6)',
    }}
  >
    <Icon size={26} />
    <span>{label}</span>
  </button>
);

// ─── Main Component ─────────────────────────────────────────────────────
export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('skills');
  const [mobileTabsOpen, setMobileTabsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActionMode, setMobileActionMode] = useState<'none' | 'edit' | 'delete'>('none');
  const [mobileFormPanel, setMobileFormPanel] = useState<0 | 1>(0);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Data
  const [skills, setSkills] = useState<skillsService.Skill[]>([]);
  const [experiences, setExperiences] = useState<workExperienceService.WorkExperience[]>([]);
  const [hobbies, setHobbies] = useState<hobbiesService.Hobby[]>([]);
  const [projects, setProjects] = useState<projectsService.Project[]>([]);
  const [education, setEducation] = useState<educationService.Education[]>([]);
  const [resumes, setResumes] = useState<resumesService.Resume[]>([]);
  const [messages, setMessages] = useState<contactService.StoredContactMessage[]>([]);
  const [testimonials, setTestimonials] = useState<testimonialsService.Testimonial[]>([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form data (generic record)
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const syncToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      localStorage.setItem('token', session.access_token);
    }
  };

  // Stable field change handler — avoids recreating on every render
  const handleFieldChange = useCallback((name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Auth check — only on mount, never redirect after initial success
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!session?.user) {
        navigate('/login');
        return;
      }
      localStorage.setItem('token', session.access_token);
      setIsAdmin(true);
    };
    check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT') { navigate('/login'); return; }
      if (session?.access_token) {
        localStorage.setItem('token', session.access_token);
      }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Data loading
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      await syncToken();
      const [s, e, h, p, ed, r, m, t] = await Promise.all([
        skillsService.getAllSkills().catch(() => []),
        workExperienceService.getWorkExperience().catch(() => []),
        hobbiesService.getHobbies(false).catch(() => []),
        projectsService.getProjects().catch(() => []),
        educationService.getEducation().catch(() => []),
        resumesService.getResumes().catch(() => []),
        contactService.getContactMessages().catch(() => []),
        testimonialsService.getAllTestimonialsAdmin().catch(() => []),
      ]);
      setSkills(s);
      setExperiences(e);
      setHobbies(h);
      setProjects(p);
      setEducation(ed);
      setResumes(r);
      setMessages(m);
      setTestimonials(t);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) loadAll();
  }, [isAdmin, loadAll]);

  // ─── CRUD handlers ────────────────────────────────────────────────────
  const openAdd = () => {
    setModalMode('add');
    setEditingId(null);
    setError('');
    if (activeTab === 'skills') {
      setFormData({ name_en: '', category: 'Frontend', proficiency: 50, icon_url: '', display_order: 0, is_active: true });
    } else if (activeTab === 'experience') {
      setFormData({ company_name: '', position_en: '', description_en: '', location: '', employment_type: 'Full-time', start_date: '', end_date: '', is_current: false, company_logo_url: '', company_website: '', achievements_en: '', display_order: 0, is_active: true });
    } else if (activeTab === 'projects') {
      setFormData({ title_en: '', description_en: '', image_url: '', video_url: '', gallery_urls: '', technologies: '', project_url: '', github_url: '', category: '', display_order: projects.length, is_active: true });
    } else if (activeTab === 'education') {
      setFormData({ institution_name: '', degree_en: '', field_of_study_en: '', description_en: '', location: '', start_date: '', end_date: '', is_current: false, grade: '', logo_url: '', achievements_en: '', display_order: 0, is_active: true });
    } else if (activeTab === 'resumes') {
      setFormData({ title_en: '', file_url: '', file_name: '', language: 'en', file_size: 0, is_active: true });
    } else if (activeTab === 'testimonials') {
      setFormData({ author_name: '', author_email: '', author_position_en: '', author_company: '', author_image_url: '', testimonial_text_en: '', rating: 5, status: 'pending', display_order: 0 });
    } else {
      setFormData({ name_en: '', description_en: '', icon_url: '', image_url: '', display_order: 0, is_active: true });
    }
    setMobileFormPanel(0);
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setModalMode('edit');
    setEditingId(item.id);
    setError('');
    const data = { ...item };
    delete data.id;
    delete data.created_at;
    delete data.updated_at;
    delete data.reviewed_at;
    if (data.start_date) data.start_date = data.start_date.split('T')[0];
    if (data.end_date) data.end_date = data.end_date.split('T')[0];
    // Convert JSON arrays to comma-separated strings for editing
    ['gallery_urls', 'technologies', 'achievements_en', 'achievements_fr'].forEach(key => {
      if (Array.isArray(data[key])) data[key] = data[key].join(', ');
      else if (data[key] === null || data[key] === undefined) data[key] = '';
    });
    setFormData(data);
    setMobileFormPanel(0);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await syncToken();

      // Auto-translate EN fields → FR
      const withFr = { ...formData };
      const enFrPairs: [string, string][] = [
        ['title_en', 'title_fr'], ['name_en', 'name_fr'],
        ['description_en', 'description_fr'], ['short_description_en', 'short_description_fr'],
        ['position_en', 'position_fr'], ['degree_en', 'degree_fr'],
        ['field_of_study_en', 'field_of_study_fr'],
        ['testimonial_text_en', 'testimonial_text_fr'],
        ['author_position_en', 'author_position_fr'],
      ];
      const toTranslate: { en: string; fr: string; text: string }[] = [];
      for (const [en, fr] of enFrPairs) {
        if (withFr[en] && typeof withFr[en] === 'string' && withFr[en].trim()) {
          toTranslate.push({ en, fr, text: withFr[en] });
        }
      }
      if (toTranslate.length > 0) {
        try {
          const results = await translateBatch(toTranslate.map(t => t.text), 'en', 'fr');
          for (let i = 0; i < toTranslate.length; i++) {
            withFr[toTranslate[i].fr] = results[i];
          }
        } catch {
          for (const [en, fr] of enFrPairs) {
            if (withFr[en] && !withFr[fr]) withFr[fr] = withFr[en];
          }
        }
      }
      // Auto-translate achievements
      if (withFr.achievements_en && typeof withFr.achievements_en === 'string' && withFr.achievements_en.trim()) {
        try {
          const items = withFr.achievements_en.split(',').map((s: string) => s.trim()).filter(Boolean);
          if (items.length > 0) {
            const results = await translateBatch(items, 'en', 'fr');
            withFr.achievements_fr = results.join(', ');
          }
        } catch {
          if (!withFr.achievements_fr) withFr.achievements_fr = withFr.achievements_en;
        }
      }

      const payload = { ...withFr };
      // Null out empty optional string fields
      const nullableStringFields = [
        'icon_url', 'image_url', 'video_url', 'company_logo_url', 'company_website', 'location',
        'employment_type', 'end_date', 'start_date', 'project_url', 'github_url',
        'short_description_en', 'short_description_fr', 'category', 'grade', 'logo_url',
        'file_size', 'author_position_en', 'author_position_fr', 'author_company', 'author_image_url',
        'testimonial_text_fr',
      ];
      Object.keys(payload).forEach(k => {
        if (payload[k] === '' && nullableStringFields.includes(k)) {
          payload[k] = null;
        }
      });
      // Convert comma-separated strings to JSON arrays
      ['gallery_urls', 'technologies', 'achievements_en', 'achievements_fr'].forEach(key => {
        if (typeof payload[key] === 'string') {
          const trimmed = payload[key].trim();
          payload[key] = trimmed ? trimmed.split(',').map((s: string) => s.trim()).filter(Boolean) : null;
        }
      });
      // Convert file_size to number
      if (payload.file_size !== null && payload.file_size !== undefined) {
        payload.file_size = parseInt(payload.file_size) || null;
      }

      if (activeTab === 'skills') {
        if (modalMode === 'add') await skillsService.createSkill(payload as any);
        else await skillsService.updateSkill(editingId!, payload as any);
      } else if (activeTab === 'experience') {
        if (modalMode === 'add') await workExperienceService.createWorkExperience(payload as any);
        else await workExperienceService.updateWorkExperience(editingId!, payload as any);
      } else if (activeTab === 'projects') {
        if (modalMode === 'add') await projectsService.createProject(payload as any);
        else await projectsService.updateProject(editingId!, payload as any);
      } else if (activeTab === 'education') {
        if (modalMode === 'add') await educationService.createEducation(payload as any);
        else await educationService.updateEducation(editingId!, payload as any);
      } else if (activeTab === 'resumes') {
        if (modalMode === 'add') await resumesService.createResume(payload as any);
        else await resumesService.updateResume(editingId!, payload as any);
      } else if (activeTab === 'testimonials') {
        if (modalMode === 'add') await testimonialsService.createTestimonialAdmin(payload);
        else await testimonialsService.updateTestimonial(editingId!, payload as any);
      } else {
        if (modalMode === 'add') await hobbiesService.createHobby(payload as any);
        else await hobbiesService.updateHobby(editingId!, payload as any);
      }
      setModalOpen(false);
      await loadAll();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || (language === 'fr' ? 'Échec de la sauvegarde' : 'Failed to save'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await syncToken();
      if (activeTab === 'skills') await skillsService.deleteSkill(id);
      else if (activeTab === 'experience') await workExperienceService.deleteWorkExperience(id);
      else if (activeTab === 'projects') await projectsService.deleteProject(id);
      else if (activeTab === 'education') await educationService.deleteEducation(id);
      else if (activeTab === 'resumes') await resumesService.deleteResume(id);
      else if (activeTab === 'messages') await contactService.deleteContactMessage(id);
      else if (activeTab === 'testimonials') await testimonialsService.deleteTestimonial(id);
      else await hobbiesService.deleteHobby(id);
      setDeleteId(null);
      await loadAll();
    } catch (err: any) {
      alert(err.response?.data?.detail || (language === 'fr' ? 'Échec de la suppression' : 'Failed to delete'));
    } finally {
      setDeleting(false);
    }
  };

  // ─── Form fields per tab (uses stable FormField + handleFieldChange) ──
  const existingCategories = [...new Set(skills.map(s => s.category).filter(Boolean))].sort();

  const renderFormFields = () => {
    if (activeTab === 'skills') {
      return (
        <div className="grid grid-cols-2 gap-3">
          <FormField label={t('f.name', 'Name', 'Nom')} name="name_en" value={formData.name_en} onChange={handleFieldChange} />
          <FormField label={t('f.category', 'Category', 'Catégorie')} name="category" type="select" options={existingCategories} value={formData.category} onChange={handleFieldChange} />
          <FormField label={t('f.proficiency', 'Proficiency', 'Compétence')} name="proficiency" type="range" value={formData.proficiency} onChange={handleFieldChange} />
          <FileUploadField label={t('f.iconUrl', 'Icon', 'Icône')} name="icon_url" accept="image/*" value={formData.icon_url} onChange={handleFieldChange} />
          <FormField label={t('f.displayOrder', 'Display Order', 'Ordre d\'affichage')} name="display_order" type="number" value={formData.display_order} onChange={handleFieldChange} />
          <FormField label={t('f.active', 'Active', 'Actif')} name="is_active" type="checkbox" value={formData.is_active} onChange={handleFieldChange} />
        </div>
      );
    }
    if (activeTab === 'experience') {
      const panelLeft = (
        <div className="space-y-3">
          <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ ...font, color: 'rgba(0,255,255,0.6)' }}><T>Content</T></div>
          <FormField label={t('f.company', 'Company', 'Entreprise')} name="company_name" value={formData.company_name} onChange={handleFieldChange} />
          <FormField label={t('f.positionEn', 'Position', 'Poste')} name="position_en" value={formData.position_en} onChange={handleFieldChange} />
          <FormField label={t('f.descEn', 'Description', 'Description')} name="description_en" type="textarea" rows={3} value={formData.description_en} onChange={handleFieldChange} />
          <FormField label={t('f.achievementsEn', 'Achievements (comma-separated)', 'Réalisations (séparées par virgules)')} name="achievements_en" type="textarea" rows={2} value={formData.achievements_en} onChange={handleFieldChange} />
        </div>
      );
      const panelRight = (
        <div className="space-y-3">
          <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ ...font, color: 'rgba(0,255,255,0.6)' }}><T>Details & Settings</T></div>
          <FormField label={t('f.type', 'Type', 'Type')} name="employment_type" type="select" options={['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Self-Employed']} value={formData.employment_type} onChange={handleFieldChange} />
          <FormField label={t('f.location', 'Location', 'Emplacement')} name="location" value={formData.location} onChange={handleFieldChange} />
          <FileUploadField label={t('f.companyLogo', 'Company Logo', 'Logo entreprise')} name="company_logo_url" accept="image/*" value={formData.company_logo_url} onChange={handleFieldChange} />
          <FormField label={t('f.companyWebsite', 'Company Website', 'Site web entreprise')} name="company_website" value={formData.company_website} onChange={handleFieldChange} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label={t('f.startDate', 'Start Date', 'Date de début')} name="start_date" type="date" value={formData.start_date} onChange={handleFieldChange} />
            <FormField label={t('f.endDate', 'End Date', 'Date de fin')} name="end_date" type="date" value={formData.end_date} onChange={handleFieldChange} />
          </div>
          <FormField label={t('f.displayOrder', 'Display Order', 'Ordre d\'affichage')} name="display_order" type="number" value={formData.display_order} onChange={handleFieldChange} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label={t('f.currentlyWorking', 'Currently Working', 'Actuellement en poste')} name="is_current" type="checkbox" value={formData.is_current} onChange={handleFieldChange} />
            <FormField label={t('f.active', 'Active', 'Actif')} name="is_active" type="checkbox" value={formData.is_active} onChange={handleFieldChange} />
          </div>
        </div>
      );
      if (isMobile) {
        return (
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setMobileFormPanel(0)} className="p-2 rounded-lg transition-all" style={{ color: mobileFormPanel === 0 ? '#22d3ee' : 'rgba(255,255,255,0.3)' }}><ChevronLeft size={24} /></button>
              <span className="text-xs tracking-widest uppercase" style={{ ...font, color: 'rgba(255,255,255,0.5)' }}>{mobileFormPanel === 0 ? t('f.panelContent', 'Content', 'Contenu') : t('f.panelDetails', 'Details & Settings', 'Détails & Paramètres')} — {mobileFormPanel + 1}/2</span>
              <button onClick={() => setMobileFormPanel(1)} className="p-2 rounded-lg transition-all" style={{ color: mobileFormPanel === 1 ? '#22d3ee' : 'rgba(255,255,255,0.3)' }}><ChevronRight size={24} /></button>
            </div>
            {mobileFormPanel === 0 ? panelLeft : panelRight}
          </div>
        );
      }
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {panelLeft}
          {panelRight}
        </div>
      );
    }
    if (activeTab === 'projects') {
      const handleCoverUpload = (name: string, val: any) => {
        if (val && typeof val === 'string') {
          // Detect if uploaded file is a video by extension
          const isVideo = /\.(mp4|webm|mov|avi)$/i.test(val);
          if (isVideo) {
            handleFieldChange('video_url', val);
            handleFieldChange('image_url', '');
          } else {
            handleFieldChange('image_url', val);
            handleFieldChange('video_url', '');
          }
        } else {
          handleFieldChange(name, val);
        }
      };
      const panelLeft = (
        <div className="space-y-3">
          <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ ...font, color: 'rgba(0,255,255,0.6)' }}><T>Content</T></div>
          <FormField label={t('f.title', 'Title', 'Titre')} name="title_en" value={formData.title_en} onChange={handleFieldChange} />
          <FormField label={t('f.desc', 'Description', 'Description')} name="description_en" type="textarea" rows={3} value={formData.description_en} onChange={handleFieldChange} />
          <FormField label={t('f.technologies', 'Technologies (comma-separated)', 'Technologies (séparées par virgules)')} name="technologies" value={formData.technologies} onChange={handleFieldChange} />
          <FormField label={t('f.category', 'Category', 'Catégorie')} name="category" value={formData.category} onChange={handleFieldChange} />
          <FormField label={t('f.projectUrl', 'Project URL', 'URL du projet')} name="project_url" value={formData.project_url} onChange={handleFieldChange} />
          <FormField label={t('f.githubUrl', 'GitHub URL', 'URL GitHub')} name="github_url" value={formData.github_url} onChange={handleFieldChange} />
        </div>
      );
      const panelRight = (
        <div className="space-y-3">
          <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ ...font, color: 'rgba(0,255,255,0.6)' }}><T>Media & Settings</T></div>
          <FileUploadField label={t('f.coverMedia', 'Cover (Image or Video)', 'Couverture (image ou vidéo)')} name="image_url" accept="image/*,video/*" value={formData.image_url || formData.video_url} onChange={handleCoverUpload} />
          <FileUploadField label={t('f.gallery', 'Gallery Images', 'Images de la galerie')} name="gallery_urls" accept="image/*" multiple value={formData.gallery_urls} onChange={handleFieldChange} />
          <FormField label={t('f.active', 'Active', 'Actif')} name="is_active" type="checkbox" value={formData.is_active} onChange={handleFieldChange} />
        </div>
      );
      if (isMobile) {
        return (
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setMobileFormPanel(0)} className="p-2 rounded-lg transition-all" style={{ color: mobileFormPanel === 0 ? '#22d3ee' : 'rgba(255,255,255,0.3)' }}><ChevronLeft size={24} /></button>
              <span className="text-xs tracking-widest uppercase" style={{ ...font, color: 'rgba(255,255,255,0.5)' }}>{mobileFormPanel === 0 ? t('f.panelContent', 'Content', 'Contenu') : t('f.panelMedia', 'Media & Settings', 'Médias & Paramètres')} — {mobileFormPanel + 1}/2</span>
              <button onClick={() => setMobileFormPanel(1)} className="p-2 rounded-lg transition-all" style={{ color: mobileFormPanel === 1 ? '#22d3ee' : 'rgba(255,255,255,0.3)' }}><ChevronRight size={24} /></button>
            </div>
            {mobileFormPanel === 0 ? panelLeft : panelRight}
          </div>
        );
      }
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {panelLeft}
          {panelRight}
        </div>
      );
    }
    if (activeTab === 'education') {
      const panelLeft = (
        <div className="space-y-3">
          <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ ...font, color: 'rgba(0,255,255,0.6)' }}><T>Content</T></div>
          <FormField label={t('f.institution', 'Institution', 'Établissement')} name="institution_name" value={formData.institution_name} onChange={handleFieldChange} />
          <FormField label={t('f.degreeEn', 'Degree', 'Diplôme')} name="degree_en" value={formData.degree_en} onChange={handleFieldChange} />
          <FormField label={t('f.fieldEn', 'Field of Study', 'Domaine d\'études')} name="field_of_study_en" value={formData.field_of_study_en} onChange={handleFieldChange} />
          <FormField label={t('f.descEn', 'Description', 'Description')} name="description_en" type="textarea" rows={3} value={formData.description_en} onChange={handleFieldChange} />
          <FormField label={t('f.achievementsEn', 'Achievements (comma-separated)', 'Réalisations (séparées par virgules)')} name="achievements_en" type="textarea" rows={2} value={formData.achievements_en} onChange={handleFieldChange} />
        </div>
      );
      const panelRight = (
        <div className="space-y-3">
          <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ ...font, color: 'rgba(0,255,255,0.6)' }}><T>Details & Settings</T></div>
          <FormField label={t('f.location', 'Location', 'Emplacement')} name="location" value={formData.location} onChange={handleFieldChange} />
          <FormField label={t('f.grade', 'Grade', 'Note')} name="grade" value={formData.grade} onChange={handleFieldChange} />
          <FileUploadField label={t('f.logoUrl', 'Logo', 'Logo')} name="logo_url" accept="image/*" value={formData.logo_url} onChange={handleFieldChange} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label={t('f.startDate', 'Start Date', 'Date de début')} name="start_date" type="date" value={formData.start_date} onChange={handleFieldChange} />
            <FormField label={t('f.endDate', 'End Date', 'Date de fin')} name="end_date" type="date" value={formData.end_date} onChange={handleFieldChange} />
          </div>
          <FormField label={t('f.displayOrder', 'Display Order', 'Ordre d\'affichage')} name="display_order" type="number" value={formData.display_order} onChange={handleFieldChange} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label={t('f.currentlyEnrolled', 'Currently Enrolled', 'Actuellement inscrit')} name="is_current" type="checkbox" value={formData.is_current} onChange={handleFieldChange} />
            <FormField label={t('f.active', 'Active', 'Actif')} name="is_active" type="checkbox" value={formData.is_active} onChange={handleFieldChange} />
          </div>
        </div>
      );
      if (isMobile) {
        return (
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setMobileFormPanel(0)} className="p-2 rounded-lg transition-all" style={{ color: mobileFormPanel === 0 ? '#22d3ee' : 'rgba(255,255,255,0.3)' }}><ChevronLeft size={24} /></button>
              <span className="text-xs tracking-widest uppercase" style={{ ...font, color: 'rgba(255,255,255,0.5)' }}>{mobileFormPanel === 0 ? t('f.panelContent', 'Content', 'Contenu') : t('f.panelDetails', 'Details & Settings', 'Détails & Paramètres')} — {mobileFormPanel + 1}/2</span>
              <button onClick={() => setMobileFormPanel(1)} className="p-2 rounded-lg transition-all" style={{ color: mobileFormPanel === 1 ? '#22d3ee' : 'rgba(255,255,255,0.3)' }}><ChevronRight size={24} /></button>
            </div>
            {mobileFormPanel === 0 ? panelLeft : panelRight}
          </div>
        );
      }
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {panelLeft}
          {panelRight}
        </div>
      );
    }
    if (activeTab === 'resumes') {
      return (
        <div className="grid grid-cols-2 gap-3">
          <FormField label={t('f.titleEn', 'Title', 'Titre')} name="title_en" value={formData.title_en} onChange={handleFieldChange} />
          <FormField label={t('f.fileName', 'File Name', 'Nom du fichier')} name="file_name" value={formData.file_name} onChange={handleFieldChange} />
          <div className="col-span-2"><FileUploadField label={t('f.fileUrl', 'Resume File', 'Fichier CV')} name="file_url" accept=".pdf,.doc,.docx" value={formData.file_url} onChange={handleFieldChange} /></div>
          <FormField label={t('f.language', 'Language', 'Langue')} name="language" type="select" options={['en', 'fr']} value={formData.language} onChange={handleFieldChange} />
          <FormField label={t('f.fileSize', 'File Size (bytes)', 'Taille du fichier (octets)')} name="file_size" type="number" value={formData.file_size} onChange={handleFieldChange} />
          <FormField label={t('f.active', 'Active', 'Actif')} name="is_active" type="checkbox" value={formData.is_active} onChange={handleFieldChange} />
        </div>
      );
    }
    if (activeTab === 'testimonials') {
      return (
        <div className="grid grid-cols-2 gap-3">
          <FormField label={t('f.authorName', 'Author Name', 'Nom de l\'auteur')} name="author_name" value={formData.author_name} onChange={handleFieldChange} />
          <FormField label={t('f.authorEmail', 'Author Email', 'Email de l\'auteur')} name="author_email" value={formData.author_email} onChange={handleFieldChange} />
          <FormField label={t('f.position', 'Position', 'Poste')} name="author_position_en" value={formData.author_position_en} onChange={handleFieldChange} />
          <FormField label={t('f.company', 'Company', 'Entreprise')} name="author_company" value={formData.author_company} onChange={handleFieldChange} />
          <div className="col-span-2"><FileUploadField label={t('f.authorImage', 'Author Image', 'Image de l\'auteur')} name="author_image_url" value={formData.author_image_url} onChange={handleFieldChange} accept="image/*" /></div>
          <div className="col-span-2"><FormField label={t('f.testimonial', 'Testimonial', 'Témoignage')} name="testimonial_text_en" type="textarea" rows={3} value={formData.testimonial_text_en} onChange={handleFieldChange} /></div>
          <FormField label={t('f.rating', 'Rating (1-5)', 'Note (1-5)')} name="rating" type="select" options={['1', '2', '3', '4', '5']} value={String(formData.rating)} onChange={(name: string, val: any) => handleFieldChange(name, parseInt(val))} />
          <FormField label={t('f.status', 'Status', 'Statut')} name="status" type="select" options={['pending', 'approved', 'rejected']} value={formData.status} onChange={handleFieldChange} />
          <FormField label={t('f.displayOrder', 'Display Order', 'Ordre d\'affichage')} name="display_order" type="number" value={formData.display_order} onChange={handleFieldChange} />
        </div>
      );
    }
    // hobbies
    return (
      <div className="grid grid-cols-2 gap-3">
        <FormField label={t('f.name', 'Name', 'Nom')} name="name_en" value={formData.name_en} onChange={handleFieldChange} />
        <FormField label={t('f.displayOrder', 'Display Order', 'Ordre d\'affichage')} name="display_order" type="number" value={formData.display_order} onChange={handleFieldChange} />
        <div className="col-span-2"><FormField label={t('f.desc', 'Description', 'Description')} name="description_en" type="textarea" rows={2} value={formData.description_en} onChange={handleFieldChange} /></div>
        <FileUploadField label={t('f.icon', 'Icon', 'Icône')} name="icon_url" value={formData.icon_url} onChange={handleFieldChange} accept="image/*" />
        <FileUploadField label={t('f.image', 'Image', 'Image')} name="image_url" value={formData.image_url} onChange={handleFieldChange} accept="image/*" />
        <FormField label={t('f.active', 'Active', 'Actif')} name="is_active" type="checkbox" value={formData.is_active} onChange={handleFieldChange} />
      </div>
    );
  };

  // ─── Table rows per tab ───────────────────────────────────────────────
  const currentItems = activeTab === 'skills' ? skills
    : activeTab === 'experience' ? experiences
    : activeTab === 'projects' ? projects
    : activeTab === 'education' ? education
    : activeTab === 'resumes' ? resumes
    : activeTab === 'messages' ? messages
    : activeTab === 'testimonials' ? testimonials
    : hobbies;

  const renderRow = (item: any) => {
    if (activeTab === 'skills') {
      const s = item as skillsService.Skill;
      return (
        <>
          <td className="px-5 py-5 text-sm text-white" style={font}>{s.name_en}</td>
          <td className="px-5 py-5 text-sm text-white/70" style={font}>{s.category}</td>
          <td className="px-5 py-5">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${s.proficiency}%`, background: 'linear-gradient(90deg, #06b6d4, #22d3ee)' }} />
              </div>
              <span className="text-xs text-cyan-400 w-8 text-right" style={font}>{s.proficiency}%</span>
            </div>
          </td>
          <td className="px-5 py-5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.is_active ? '#4ade80' : '#f87171' }} />
          </td>
        </>
      );
    }
    if (activeTab === 'experience') {
      const e = item as workExperienceService.WorkExperience;
      return (
        <>
          <td className="px-5 py-5 text-sm text-white" style={font}>{e.company_name}</td>
          <td className="px-5 py-5 text-sm text-white/70" style={font}>{e.position_en}</td>
          <td className="px-5 py-5 text-sm text-white/50" style={font}>
            {e.start_date?.split('T')[0]} → {e.is_current ? (language === 'fr' ? 'Présent' : 'Present') : e.end_date?.split('T')[0] || '—'}
          </td>
          <td className="px-5 py-5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.is_active ? '#4ade80' : '#f87171' }} />
          </td>
        </>
      );
    }
    if (activeTab === 'projects') {
      const p = item as projectsService.Project;
      return (
        <>
          <td className="px-5 py-5 text-sm text-white" style={font}>{p.title_en}</td>
          <td className="px-5 py-5 text-sm text-white/70" style={font}>{p.category || '—'}</td>
          <td className="px-5 py-5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.is_active ? '#4ade80' : '#f87171' }} />
          </td>
        </>
      );
    }
    if (activeTab === 'education') {
      const ed = item as educationService.Education;
      return (
        <>
          <td className="px-5 py-5 text-sm text-white" style={font}>{ed.institution_name}</td>
          <td className="px-5 py-5 text-sm text-white/70" style={font}>{ed.degree_en}</td>
          <td className="px-5 py-5 text-sm text-white/50" style={font}>{ed.field_of_study_en}</td>
          <td className="px-5 py-5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ed.is_active ? '#4ade80' : '#f87171' }} />
          </td>
        </>
      );
    }
    if (activeTab === 'resumes') {
      const r = item as resumesService.Resume;
      return (
        <>
          <td className="px-5 py-5 text-sm text-white" style={font}>{r.title_en}</td>
          <td className="px-5 py-5 text-sm text-white/70" style={font}>{r.file_name}</td>
          <td className="px-5 py-5 text-sm text-white/50 uppercase" style={font}>{r.language}</td>
          <td className="px-5 py-5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.is_active ? '#4ade80' : '#f87171' }} />
          </td>
        </>
      );
    }
    if (activeTab === 'messages') {
      const msg = item as contactService.StoredContactMessage;
      return (
        <>
          <td className="px-5 py-5 text-sm text-white" style={font}>
            <div className="flex items-center gap-2">
              {!msg.is_read && <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />}
              {msg.name}
            </div>
          </td>
          <td className="px-5 py-5 text-sm text-white/70" style={font}>{msg.email}</td>
          <td className="px-5 py-5 text-sm text-white/50 max-w-xs truncate" style={font}>{msg.message}</td>
          <td className="px-5 py-5 text-sm text-white/40" style={font}>{new Date(msg.created_at).toLocaleDateString()}</td>
        </>
      );
    }
    if (activeTab === 'testimonials') {
      const te = item as testimonialsService.Testimonial;
      const statusColor = te.status === 'approved' ? '#4ade80' : te.status === 'rejected' ? '#f87171' : '#facc15';
      return (
        <>
          <td className="px-5 py-5 text-sm text-white" style={font}>{te.author_name}</td>
          <td className="px-5 py-5 text-sm text-white/70 max-w-xs truncate" style={font}>{te.testimonial_text_en?.slice(0, 60)}{(te.testimonial_text_en?.length || 0) > 60 ? '…' : ''}</td>
          <td className="px-5 py-5 text-sm" style={{ ...font, color: statusColor }}>{te.status}</td>
          <td className="px-5 py-5 text-sm text-white/50" style={font}>{'★'.repeat(te.rating)}{'☆'.repeat(5 - te.rating)}</td>
        </>
      );
    }
    const h = item as hobbiesService.Hobby;
    return (
      <>
        <td className="px-5 py-5 text-sm text-white" style={font}>{h.name_en}</td>
        <td className="px-5 py-5 text-sm text-white/70 max-w-xs truncate" style={font}>{h.description_en}</td>
        <td className="px-5 py-5 text-sm text-white/50" style={font}>{h.display_order}</td>
        <td className="px-5 py-5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: h.is_active ? '#4ade80' : '#f87171' }} />
        </td>
      </>
    );
  };

  const tableHeaders = activeTab === 'skills'
    ? ['Name', 'Category', 'Proficiency', 'Active']
    : activeTab === 'experience'
      ? ['Company', 'Position', 'Period', 'Active']
      : activeTab === 'projects'
        ? ['Title', 'Category', 'Active']
        : activeTab === 'education'
          ? ['Institution', 'Degree', 'Field of Study', 'Active']
          : activeTab === 'resumes'
            ? ['Title', 'File', 'Language', 'Active']
            : activeTab === 'messages'
              ? ['Name', 'Email', 'Message', 'Date']
              : activeTab === 'testimonials'
                ? ['Author', 'Testimonial', 'Status', 'Rating']
                : ['Name', 'Description', 'Order', 'Active'];

  if (!isAdmin) return null;

  return (
    <>
      <div className="min-h-screen bg-black relative overflow-hidden crt-effect">
        <div className="scanline" />
        <CustomCursor />
        <TiltedCard />

        {/* Back button */}
        <motion.button
          onClick={() => navigate('/')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          className="fixed top-8 left-8 flex items-center gap-2 hover:text-white transition-colors z-50"
          style={{ ...font, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.7)' }}
        >
          <ArrowLeft size={20} />
          <span className="text-base tracking-widest"><T>HOME</T></span>
        </motion.button>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center px-8 pb-12" style={{ paddingTop: '3.5rem' }}>
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-2">
              <Shield size={36} style={{ color: '#22d3ee' }} />
              <h1 className="text-5xl md:text-6xl font-black tracking-tight" style={font}>
                <span className="text-white">{t('admin.admin', 'ADMIN', 'ADMIN')} </span>
                <span style={{ color: '#22d3ee' }}>{t('admin.dashboard', 'DASHBOARD', 'TABLEAU DE BORD')}</span>
              </h1>
            </div>
            <p className="text-base tracking-[0.3em] uppercase mb-8" style={{ ...font, color: 'rgba(255,255,255,0.5)' }}>
              <T>Manage your portfolio content</T>
            </p>
          </motion.div>

          {/* Tabs — Desktop: normal buttons, Mobile: dropdown */}
          {!isMobile ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              <SectionButton active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} icon={Zap} label={t('admin.skills', 'Skills', 'Compétences')} />
              <SectionButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={FolderOpen} label={t('admin.projects', 'Projects', 'Projets')} />
              <SectionButton active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={Briefcase} label={t('admin.experience', 'Experience', 'Expérience')} />
              <SectionButton active={activeTab === 'education'} onClick={() => setActiveTab('education')} icon={GraduationCap} label={t('admin.education', 'Education', 'Éducation')} />
              <SectionButton active={activeTab === 'hobbies'} onClick={() => setActiveTab('hobbies')} icon={Gamepad2} label={t('admin.hobbies', 'Hobbies', 'Loisirs')} />
              <SectionButton active={activeTab === 'testimonials'} onClick={() => setActiveTab('testimonials')} icon={Star} label={t('admin.testimonials', 'Testimonials', 'Témoignages')} />
              <SectionButton active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} icon={MessageSquare} label={t('admin.messages', 'Messages', 'Messages')} />
            </motion.div>
          ) : (
            <>
              {/* Mobile tab toggle button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setMobileTabsOpen(true)}
                className="mb-10 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm tracking-wider uppercase border"
                style={{
                  ...font,
                  backgroundColor: 'rgba(0,255,255,0.1)',
                  borderColor: 'rgba(0,255,255,0.4)',
                  color: '#22d3ee',
                }}
              >
                <span>{activeTab}</span>
                <ChevronDown size={18} />
              </motion.button>

              {/* Fullscreen staggered menu - portaled to body */}
              {createPortal(
                <AnimatePresence>
                  {mobileTabsOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 2147483646,
                        backgroundColor: 'black',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'auto',
                      }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {/* Home button first */}
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ delay: 0, duration: 0.25 }}
                          onClick={() => {
                            navigate('/');
                            setMobileTabsOpen(false);
                          }}
                          className="flex items-center gap-3 text-white uppercase tracking-[0.25em] text-2xl py-4 px-6 hover:text-cyan-400 transition-colors"
                          style={{ fontFamily: 'GT Pressura, sans-serif', fontWeight: 700 }}
                        >
                          <ArrowLeft size={28} />
                          <span><T>Home</T></span>
                        </motion.button>
                        
                        {([
                          { key: 'skills' as Tab, icon: Zap, label: t('admin.skills', 'Skills', 'Compétences') },
                          { key: 'projects' as Tab, icon: FolderOpen, label: t('admin.projects', 'Projects', 'Projets') },
                          { key: 'experience' as Tab, icon: Briefcase, label: t('admin.experience', 'Experience', 'Expérience') },
                          { key: 'education' as Tab, icon: GraduationCap, label: t('admin.education', 'Education', 'Éducation') },
                          { key: 'hobbies' as Tab, icon: Gamepad2, label: t('admin.hobbies', 'Hobbies', 'Loisirs') },
                          { key: 'resumes' as Tab, icon: FileText, label: t('admin.resumes', 'Resumes', 'CVs') },
                          { key: 'testimonials' as Tab, icon: Star, label: t('admin.testimonials', 'Testimonials', 'Témoignages') },
                          { key: 'messages' as Tab, icon: MessageSquare, label: t('admin.messages', 'Messages', 'Messages') },
                        ]).map((tab, idx) => (
                          <motion.button
                            key={tab.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ delay: (idx + 1) * 0.05, duration: 0.25 }}
                            onClick={() => {
                              setActiveTab(tab.key);
                              setMobileTabsOpen(false);
                              setMobileActionMode('none');
                            }}
                            className="flex items-center gap-3 text-white uppercase tracking-[0.25em] text-2xl py-4 px-6 hover:text-cyan-400 transition-colors"
                            style={{ fontFamily: 'GT Pressura, sans-serif', fontWeight: 700 }}
                          >
                            <tab.icon size={28} />
                            <span>{tab.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>,
                document.body
              )}
            </>
          )}

          {/* Add button - desktop only */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-5xl flex justify-end mb-5"
            >
              {activeTab !== 'messages' && (
                <button
                  onClick={openAdd}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm tracking-wider uppercase transition-all"
                  style={{
                    ...font,
                    backgroundColor: 'rgba(0,255,255,0.1)',
                    border: '1px solid rgba(0,255,255,0.4)',
                    color: '#22d3ee',
                  }}
                >
                  <Plus size={18} />
                  <T>{`Add ${activeTab === 'skills' ? 'Skill' : activeTab === 'experience' ? 'Experience' : activeTab === 'projects' ? 'Project' : activeTab === 'education' ? 'Education' : activeTab === 'resumes' ? 'Resume' : activeTab === 'testimonials' ? 'Testimonial' : 'Hobby'}`}</T>
                </button>
              )}
            </motion.div>
          )}

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-5xl"
          >
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
              </div>
            ) : currentItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/50 text-lg" style={font}><T>{`No ${activeTab} yet. Click "Add" to create one.`}</T></p>
              </div>
            ) : isMobile ? (
              // Mobile: Action-first interface
              <div className="bg-black/60 backdrop-blur-xl rounded-lg border border-white/10 p-6">
                {mobileActionMode === 'none' ? (
                  // Show action buttons
                  <div className="flex flex-col gap-4">
                    {activeTab !== 'messages' && (
                      <button
                        onClick={() => openAdd()}
                        className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-lg tracking-wider uppercase transition-all border"
                        style={{
                          ...font,
                          backgroundColor: 'rgba(0,255,255,0.1)',
                          borderColor: 'rgba(0,255,255,0.4)',
                          color: '#22d3ee',
                        }}
                      >
                        <Plus size={24} />
                        <span>
                          <T>{activeTab === 'skills' ? 'Add Skill' : activeTab === 'experience' ? 'Add Experience' : activeTab === 'projects' ? 'Add Project' : activeTab === 'education' ? 'Add Education' : activeTab === 'resumes' ? 'Add Resume' : activeTab === 'testimonials' ? 'Add Testimonial' : 'Add Hobby'}</T>
                        </span>
                      </button>
                    )}
                    
                    {currentItems.length > 0 && (
                      <>
                        <button
                          onClick={() => setMobileActionMode('edit')}
                          className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-lg tracking-wider uppercase transition-all border"
                          style={{
                            ...font,
                            backgroundColor: 'rgba(0,255,255,0.08)',
                            borderColor: 'rgba(0,255,255,0.2)',
                            color: '#22d3ee',
                          }}
                        >
                          <Pencil size={24} />
                          <span><T>Edit Item</T></span>
                        </button>
                        
                        <button
                          onClick={() => setMobileActionMode('delete')}
                          className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-lg tracking-wider uppercase transition-all border"
                          style={{
                            ...font,
                            backgroundColor: 'rgba(248,113,113,0.08)',
                            borderColor: 'rgba(248,113,113,0.2)',
                            color: '#f87171',
                          }}
                        >
                          <Trash2 size={24} />
                          <span><T>Delete Item</T></span>
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  // Show item selection list
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg tracking-wider uppercase" style={{ ...font, color: '#22d3ee' }}>
                        <T>{mobileActionMode === 'edit' ? 'Select item to edit' : 'Select item to delete'}</T>
                      </h3>
                      <button
                        onClick={() => setMobileActionMode('none')}
                        className="p-2 rounded-lg transition-all"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                      {currentItems.map((item: any) => {
                        // Get display text based on tab type
                        let displayText = '';
                        switch (activeTab) {
                          case 'skills':
                            displayText = language === 'fr' ? (item.name_fr || item.name_en) : (item.name_en || item.name_fr);
                            break;
                          case 'projects':
                            displayText = language === 'fr' ? (item.title_fr || item.title_en) : (item.title_en || item.title_fr);
                            break;
                          case 'experience':
                            displayText = `${item.company_name} - ${language === 'fr' ? (item.position_fr || item.position_en) : (item.position_en || item.position_fr)}`;
                            break;
                          case 'education':
                            displayText = `${item.institution_name} - ${language === 'fr' ? (item.degree_fr || item.degree_en) : (item.degree_en || item.degree_fr)}`;
                            break;
                          case 'hobbies':
                            displayText = language === 'fr' ? (item.name_fr || item.name_en) : (item.name_en || item.name_fr);
                            break;
                          case 'resumes':
                            displayText = `${language === 'fr' ? (item.title_fr || item.title_en) : (item.title_en || item.title_fr)} (${item.language.toUpperCase()})`;
                            break;
                          case 'messages':
                            displayText = `${item.name} - ${item.subject || item.message?.substring(0, 40) + '...'}`;
                            break;
                          case 'testimonials':
                            displayText = `${item.author_name} - ${(item.testimonial_text_en || '').substring(0, 40)}...`;
                            break;
                          default:
                            displayText = item.id;
                        }
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              if (mobileActionMode === 'edit') {
                                openEdit(item);
                              } else {
                                setDeleteId(item.id);
                              }
                              setMobileActionMode('none');
                            }}
                            className="flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all border"
                            style={{
                              ...font,
                              backgroundColor: 'rgba(255,255,255,0.03)',
                              borderColor: 'rgba(255,255,255,0.1)',
                              color: 'rgba(255,255,255,0.9)',
                            }}
                          >
                            <span className="text-sm truncate">{displayText}</span>
                            {mobileActionMode === 'edit' ? (
                              <Pencil size={18} style={{ color: '#22d3ee' }} />
                            ) : (
                              <Trash2 size={18} style={{ color: '#f87171' }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-black/60 backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {tableHeaders.map(h => (
                        <th key={h} className="px-5 py-4 text-left text-sm tracking-wider uppercase" style={{ ...font, color: 'rgba(255,255,255,0.4)' }}>
                          <T>{h}</T>
                        </th>
                      ))}
                      <th className="px-5 py-4 text-right text-sm tracking-wider uppercase" style={{ ...font, color: 'rgba(255,255,255,0.4)' }}>
                        <T>Actions</T>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item: any, index: number) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/[0.06] transition-colors" style={{ backgroundColor: index % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                        {renderRow(item)}
                        <td className="px-5 py-4.5">
                          <div className="flex justify-end gap-2">
                            {activeTab === 'messages' ? (
                              <>
                                {!(item as contactService.StoredContactMessage).is_read && (
                                  <button
                                    onClick={async () => { await contactService.markMessageAsRead(item.id); await loadAll(); }}
                                    className="p-2 rounded-lg transition-all"
                                    style={{ color: '#22d3ee', backgroundColor: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.2)' }}
                                    title={language === 'fr' ? 'Marquer comme lu' : 'Mark as read'}
                                  >
                                    <Eye size={20} />
                                  </button>
                                )}
                              </>
                            ) : activeTab === 'testimonials' ? (
                              <>
                                {(item as testimonialsService.Testimonial).status !== 'approved' && (
                                  <button
                                    onClick={async () => { await testimonialsService.approveTestimonial(item.id); await loadAll(); }}
                                    className="p-2 rounded-lg transition-all"
                                    style={{ color: '#4ade80', backgroundColor: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}
                                    title={language === 'fr' ? 'Approuver' : 'Approve'}
                                  >
                                    <Check size={20} />
                                  </button>
                                )}
                                {(item as testimonialsService.Testimonial).status !== 'rejected' && (
                                  <button
                                    onClick={async () => { await testimonialsService.rejectTestimonial(item.id); await loadAll(); }}
                                    className="p-2 rounded-lg transition-all"
                                    style={{ color: '#fb923c', backgroundColor: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)' }}
                                    title={language === 'fr' ? 'Rejeter' : 'Reject'}
                                  >
                                    <XCircle size={20} />
                                  </button>
                                )}
                                <button
                                  onClick={() => openEdit(item)}
                                  className="p-2 rounded-lg transition-all"
                                  style={{ color: '#22d3ee', backgroundColor: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.2)' }}
                                  title={language === 'fr' ? 'Modifier' : 'Edit'}
                                >
                                  <Pencil size={20} />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => openEdit(item)}
                                className="p-2 rounded-lg transition-all"
                                style={{ color: '#22d3ee', backgroundColor: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.2)' }}
                                title={language === 'fr' ? 'Modifier' : 'Edit'}
                              >
                                <Pencil size={20} />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="p-2 rounded-lg transition-all"
                              style={{ color: '#f87171', backgroundColor: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
                              title={language === 'fr' ? 'Supprimer' : 'Delete'}
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ─── Add / Edit Modal ──────────────────────────────────────────── */}
      {createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-cursor"
              style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.88)', padding: '1.5rem' }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full flex flex-col"
                style={{
                  maxWidth: ['projects', 'experience', 'education', 'testimonials'].includes(activeTab) ? '64rem' : '36rem',
                  maxHeight: 'calc(100vh - 3rem)',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(10,10,10,0.98)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
                  overflow: 'hidden',
                }}
              >
                {/* Modal header — fixed */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
                  <h3 className="text-white text-lg tracking-widest uppercase" style={font}>
                    <T>{`${modalMode === 'add' ? 'Add' : 'Edit'} ${activeTab === 'skills' ? 'Skill' : activeTab === 'experience' ? 'Experience' : activeTab === 'projects' ? 'Project' : activeTab === 'education' ? 'Education' : activeTab === 'testimonials' ? 'Testimonial' : 'Hobby'}`}</T>
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', padding: '0.25rem', lineHeight: 1 }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal body — scrollable */}
                <div className="overflow-y-auto flex-1 px-6 py-4" style={{ minHeight: 0 }}>
                  {error && (
                    <div className="mb-4 p-3 rounded-lg text-sm text-center" style={{ color: '#f87171', backgroundColor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
                      {typeof error === 'string' ? error : JSON.stringify(error)}
                    </div>
                  )}
                  {renderFormFields()}
                </div>

                {/* Modal footer — fixed */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10 flex-shrink-0">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all"
                    style={{ ...font, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent' }}
                  >
                    <T>Cancel</T>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all disabled:opacity-50"
                    style={{ ...font, backgroundColor: '#ffffff', color: '#000000' }}
                  >
                    <Save size={14} />
                    {saving ? <T>Saving...</T> : <T>Save</T>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ─── Delete Confirmation Modal ─────────────────────────────────── */}
      {createPortal(
        <AnimatePresence>
          {deleteId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-cursor"
              style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.88)' }}
              onClick={(e: React.MouseEvent) => { if (e.target === e.currentTarget) setDeleteId(null); }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  maxWidth: '24rem', margin: '0 1rem', borderRadius: '0.75rem',
                  padding: '2rem', backgroundColor: 'rgba(10,10,10,0.98)',
                  border: '1px solid rgba(248,113,113,0.3)', textAlign: 'center',
                }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.4)' }}>
                  <Trash2 size={24} style={{ color: '#f87171' }} />
                </div>
                <h3 className="text-white text-lg mb-2" style={font}><T>Delete this item?</T></h3>
                <p className="text-sm mb-6" style={{ ...font, color: 'rgba(255,255,255,0.6)' }}>
                  <T>This action cannot be undone. The item will be permanently removed.</T>
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all"
                    style={{ ...font, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent' }}
                  >
                    <T>Cancel</T>
                  </button>
                  <button
                    onClick={() => handleDelete(deleteId)}
                    disabled={deleting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all disabled:opacity-50"
                    style={{ ...font, backgroundColor: '#f87171', color: '#000' }}
                  >
                    <Trash2 size={14} />
                    {deleting ? <T>Deleting...</T> : <T>Delete</T>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
