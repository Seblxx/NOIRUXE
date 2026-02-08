import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CustomCursor } from '../components/CustomCursor';
import { TiltedCard } from '../components/TiltedCard';
import {
  ArrowLeft, Plus, Pencil, Trash2, Save, X, Shield,
  Zap, Briefcase, Gamepad2, ChevronDown
} from 'lucide-react';
import { supabase } from '../services/authService';
import * as skillsService from '../services/skillsService';
import * as workExperienceService from '../services/workExperienceService';
import * as hobbiesService from '../services/hobbiesService';

type Tab = 'skills' | 'experience' | 'hobbies';

const font = { fontFamily: "'GT Pressura', sans-serif" };

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
        <span className="text-sm text-white/70" style={font}>Enabled</span>
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

// ─── Tab button ─────────────────────────────────────────────────────────
const SectionButton = ({ active, onClick, icon: Icon, label }: {
  active: boolean; onClick: () => void; icon: any; label: string;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-7 py-3.5 rounded-lg text-base tracking-wider uppercase transition-all border"
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('skills');

  // Data
  const [skills, setSkills] = useState<skillsService.Skill[]>([]);
  const [experiences, setExperiences] = useState<workExperienceService.WorkExperience[]>([]);
  const [hobbies, setHobbies] = useState<hobbiesService.Hobby[]>([]);

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
      const [s, e, h] = await Promise.all([
        skillsService.getAllSkills().catch(() => []),
        workExperienceService.getWorkExperience().catch(() => []),
        hobbiesService.getHobbies(false).catch(() => []),
      ]);
      setSkills(s);
      setExperiences(e);
      setHobbies(h);
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
      setFormData({ name_en: '', name_fr: '', category: 'Frontend', proficiency: 50, icon_url: '', display_order: 0, is_active: true });
    } else if (activeTab === 'experience') {
      setFormData({ company_name: '', position_en: '', position_fr: '', description_en: '', description_fr: '', location: '', employment_type: 'Full-time', start_date: '', end_date: '', is_current: false, display_order: 0, is_active: true });
    } else {
      setFormData({ name_en: '', name_fr: '', description_en: '', description_fr: '', icon_url: '', image_url: '', display_order: 0, is_active: true });
    }
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
    if (data.start_date) data.start_date = data.start_date.split('T')[0];
    if (data.end_date) data.end_date = data.end_date.split('T')[0];
    setFormData(data);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await syncToken();
      const payload = { ...formData };
      Object.keys(payload).forEach(k => {
        if (payload[k] === '') {
          if (['icon_url', 'image_url', 'company_logo_url', 'company_website', 'location', 'employment_type', 'end_date'].includes(k)) {
            payload[k] = null;
          }
        }
      });

      if (activeTab === 'skills') {
        if (modalMode === 'add') await skillsService.createSkill(payload as any);
        else await skillsService.updateSkill(editingId!, payload as any);
      } else if (activeTab === 'experience') {
        if (modalMode === 'add') await workExperienceService.createWorkExperience(payload as any);
        else await workExperienceService.updateWorkExperience(editingId!, payload as any);
      } else {
        if (modalMode === 'add') await hobbiesService.createHobby(payload as any);
        else await hobbiesService.updateHobby(editingId!, payload as any);
      }
      setModalOpen(false);
      await loadAll();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to save');
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
      else await hobbiesService.deleteHobby(id);
      setDeleteId(null);
      await loadAll();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete');
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
          <FormField label="Name (EN)" name="name_en" value={formData.name_en} onChange={handleFieldChange} />
          <FormField label="Name (FR)" name="name_fr" value={formData.name_fr} onChange={handleFieldChange} />
          <FormField label="Category" name="category" type="select" options={existingCategories} value={formData.category} onChange={handleFieldChange} />
          <FormField label="Proficiency" name="proficiency" type="range" value={formData.proficiency} onChange={handleFieldChange} />
          <FormField label="Active" name="is_active" type="checkbox" value={formData.is_active} onChange={handleFieldChange} />
        </div>
      );
    }
    if (activeTab === 'experience') {
      return (
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Company" name="company_name" value={formData.company_name} onChange={handleFieldChange} />
          <FormField label="Position (EN)" name="position_en" value={formData.position_en} onChange={handleFieldChange} />
          <FormField label="Position (FR)" name="position_fr" value={formData.position_fr} onChange={handleFieldChange} />
          <FormField label="Type" name="employment_type" type="select" options={['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Self-Employed']} value={formData.employment_type} onChange={handleFieldChange} />
          <div className="col-span-2"><FormField label="Description (EN)" name="description_en" type="textarea" rows={2} value={formData.description_en} onChange={handleFieldChange} /></div>
          <div className="col-span-2"><FormField label="Description (FR)" name="description_fr" type="textarea" rows={2} value={formData.description_fr} onChange={handleFieldChange} /></div>
          <FormField label="Start Date" name="start_date" type="date" value={formData.start_date} onChange={handleFieldChange} />
          <FormField label="End Date" name="end_date" type="date" value={formData.end_date} onChange={handleFieldChange} />
          <FormField label="Currently Working" name="is_current" type="checkbox" value={formData.is_current} onChange={handleFieldChange} />
          <FormField label="Active" name="is_active" type="checkbox" value={formData.is_active} onChange={handleFieldChange} />
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Name (EN)" name="name_en" value={formData.name_en} onChange={handleFieldChange} />
        <FormField label="Name (FR)" name="name_fr" value={formData.name_fr} onChange={handleFieldChange} />
        <div className="col-span-2"><FormField label="Description (EN)" name="description_en" type="textarea" rows={2} value={formData.description_en} onChange={handleFieldChange} /></div>
        <div className="col-span-2"><FormField label="Description (FR)" name="description_fr" type="textarea" rows={2} value={formData.description_fr} onChange={handleFieldChange} /></div>
        <FormField label="Active" name="is_active" type="checkbox" value={formData.is_active} onChange={handleFieldChange} />
      </div>
    );
  };

  // ─── Table rows per tab ───────────────────────────────────────────────
  const currentItems = activeTab === 'skills' ? skills : activeTab === 'experience' ? experiences : hobbies;

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
            {e.start_date?.split('T')[0]} → {e.is_current ? 'Present' : e.end_date?.split('T')[0] || '—'}
          </td>
          <td className="px-5 py-5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.is_active ? '#4ade80' : '#f87171' }} />
          </td>
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
          <span className="text-base tracking-widest">HOME</span>
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
                <span className="text-white">ADMIN </span>
                <span style={{ color: '#22d3ee' }}>DASHBOARD</span>
              </h1>
            </div>
            <p className="text-base tracking-[0.3em] uppercase mb-8" style={{ ...font, color: 'rgba(255,255,255,0.5)' }}>
              Manage your portfolio content
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 mb-10"
          >
            <SectionButton active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} icon={Zap} label="Skills" />
            <SectionButton active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={Briefcase} label="Experience" />
            <SectionButton active={activeTab === 'hobbies'} onClick={() => setActiveTab('hobbies')} icon={Gamepad2} label="Hobbies" />
          </motion.div>

          {/* Add button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-5xl flex justify-end mb-5"
          >
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
              Add {activeTab === 'skills' ? 'Skill' : activeTab === 'experience' ? 'Experience' : 'Hobby'}
            </button>
          </motion.div>

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
                <p className="text-white/50 text-lg" style={font}>No {activeTab} yet. Click "Add" to create one.</p>
              </div>
            ) : (
              <div className="bg-black/60 backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {tableHeaders.map(h => (
                        <th key={h} className="px-5 py-4 text-left text-sm tracking-wider uppercase" style={{ ...font, color: 'rgba(255,255,255,0.4)' }}>
                          {h}
                        </th>
                      ))}
                      <th className="px-5 py-4 text-right text-sm tracking-wider uppercase" style={{ ...font, color: 'rgba(255,255,255,0.4)' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item: any, index: number) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/[0.06] transition-colors" style={{ backgroundColor: index % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                        {renderRow(item)}
                        <td className="px-5 py-4.5">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEdit(item)}
                              className="p-2 rounded-lg transition-all"
                              style={{ color: '#22d3ee', backgroundColor: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.2)' }}
                              title="Edit"
                            >
                              <Pencil size={20} />
                            </button>
                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="p-2 rounded-lg transition-all"
                              style={{ color: '#f87171', backgroundColor: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
                              title="Delete"
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
              onClick={(e: React.MouseEvent) => { if (e.target === e.currentTarget) setModalOpen(false); }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full flex flex-col"
                style={{
                  maxWidth: '36rem',
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
                    {modalMode === 'add' ? 'Add' : 'Edit'} {activeTab === 'skills' ? 'Skill' : activeTab === 'experience' ? 'Experience' : 'Hobby'}
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
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all disabled:opacity-50"
                    style={{ ...font, backgroundColor: '#ffffff', color: '#000000' }}
                  >
                    <Save size={14} />
                    {saving ? 'Saving...' : 'Save'}
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
                <h3 className="text-white text-lg mb-2" style={font}>Delete this item?</h3>
                <p className="text-sm mb-6" style={{ ...font, color: 'rgba(255,255,255,0.6)' }}>
                  This action cannot be undone. The item will be permanently removed.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all"
                    style={{ ...font, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteId)}
                    disabled={deleting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all disabled:opacity-50"
                    style={{ ...font, backgroundColor: '#f87171', color: '#000' }}
                  >
                    <Trash2 size={14} />
                    {deleting ? 'Deleting...' : 'Delete'}
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
