import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { api } from '@/lib/api';

interface WorkExperience {
  id: string;
  company_name: string;
  position_en: string;
  position_fr: string;
  description_en: string;
  description_fr: string;
  employment_type: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  display_order: number;
  is_active: boolean;
}

export const AdminWorkExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    position_en: '',
    position_fr: '',
    description_en: '',
    description_fr: '',
    employment_type: 'Full-Time',
    start_date: '',
    end_date: '',
    is_current: false,
    display_order: 0,
    is_active: true,
  });

  const fetchData = async () => {
    try {
      const response = await api.get('/work-experience/');
      setExperiences(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching work experience:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post('/work-experience/', formData);
      setShowAdd(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating work experience:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/work-experience/${id}`, formData);
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error('Error updating work experience:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work experience?')) return;
    try {
      await api.delete(`/work-experience/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting work experience:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: '', position_en: '', position_fr: '', description_en: '',
      description_fr: '', employment_type: 'Full-Time', start_date: '',
      end_date: '', is_current: false, display_order: 0, is_active: true,
    });
  };

  const startEdit = (exp: WorkExperience) => {
    setEditingId(exp.id);
    setFormData({
      company_name: exp.company_name,
      position_en: exp.position_en,
      position_fr: exp.position_fr,
      description_en: exp.description_en,
      description_fr: exp.description_fr,
      employment_type: exp.employment_type,
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current,
      display_order: exp.display_order,
      is_active: exp.is_active,
    });
  };

  if (loading) return <div className="text-white">Loading...</div>;

  const FormFields = () => (
    <div className="space-y-4">
      <Input placeholder="Company Name" value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Position (English)" value={formData.position_en} onChange={(e) => setFormData({ ...formData, position_en: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input placeholder="Position (French)" value={formData.position_fr} onChange={(e) => setFormData({ ...formData, position_fr: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      </div>
      <Textarea placeholder="Description (English)" value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      <Textarea placeholder="Description (French)" value={formData.description_fr} onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      <div className="grid grid-cols-3 gap-4">
        <select value={formData.employment_type} onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })} className="bg-white/10 border border-white/20 text-white rounded-md p-2">
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Self-Employed">Self-Employed</option>
        </select>
        <Input type="date" placeholder="Start Date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input type="date" placeholder="End Date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="bg-white/10 border-white/20 text-white" disabled={formData.is_current} />
      </div>
      <label className="flex items-center gap-2 text-white">
        <input type="checkbox" checked={formData.is_current} onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })} />
        Currently Working Here
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'GT Pressura, sans-serif' }}>Work Experience</h2>
        <Button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Experience
        </Button>
      </div>

      {showAdd && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader><CardTitle className="text-white">Add Work Experience</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormFields />
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-2" /> Save</Button>
              <Button onClick={() => { setShowAdd(false); resetForm(); }} variant="ghost" className="text-white"><X className="w-4 h-4 mr-2" /> Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {experiences.map((exp) => (
          <Card key={exp.id} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              {editingId === exp.id ? (
                <div className="space-y-4">
                  <FormFields />
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(exp.id)} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4" /></Button>
                    <Button onClick={() => setEditingId(null)} variant="ghost" className="text-white"><X className="w-4 h-4" /></Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{exp.position_en}</h3>
                    <p className="text-sm text-gray-400">{exp.company_name} • {exp.employment_type}</p>
                    <p className="text-xs text-gray-500">{exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => startEdit(exp)} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300"><Pencil className="w-4 h-4" /></Button>
                    <Button onClick={() => handleDelete(exp.id)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
