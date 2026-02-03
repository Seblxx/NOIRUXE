import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { api } from '@/lib/api';

interface Education {
  id: string;
  institution_name: string;
  degree_en: string;
  degree_fr: string;
  field_of_study_en: string;
  field_of_study_fr: string;
  description_en?: string;
  description_fr?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  display_order: number;
  is_active: boolean;
}

export const AdminEducation: React.FC = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    institution_name: '',
    degree_en: '',
    degree_fr: '',
    field_of_study_en: '',
    field_of_study_fr: '',
    description_en: '',
    description_fr: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    display_order: 0,
    is_active: true,
  });

  const fetchData = async () => {
    try {
      const response = await api.get('/education/');
      setEducations(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post('/education/', formData);
      setShowAdd(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating education:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/education/${id}`, formData);
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error('Error updating education:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education record?')) return;
    try {
      await api.delete(`/education/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      institution_name: '', degree_en: '', degree_fr: '', field_of_study_en: '',
      field_of_study_fr: '', description_en: '', description_fr: '', location: '',
      start_date: '', end_date: '', is_current: false, display_order: 0, is_active: true,
    });
  };

  const startEdit = (edu: Education) => {
    setEditingId(edu.id);
    setFormData({
      institution_name: edu.institution_name,
      degree_en: edu.degree_en,
      degree_fr: edu.degree_fr,
      field_of_study_en: edu.field_of_study_en,
      field_of_study_fr: edu.field_of_study_fr,
      description_en: edu.description_en || '',
      description_fr: edu.description_fr || '',
      location: edu.location || '',
      start_date: edu.start_date,
      end_date: edu.end_date || '',
      is_current: edu.is_current,
      display_order: edu.display_order,
      is_active: edu.is_active,
    });
  };

  if (loading) return <div className="text-white">Loading...</div>;

  const FormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Institution Name" value={formData.institution_name} onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Degree (English)" value={formData.degree_en} onChange={(e) => setFormData({ ...formData, degree_en: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input placeholder="Degree (French)" value={formData.degree_fr} onChange={(e) => setFormData({ ...formData, degree_fr: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Field of Study (English)" value={formData.field_of_study_en} onChange={(e) => setFormData({ ...formData, field_of_study_en: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input placeholder="Field of Study (French)" value={formData.field_of_study_fr} onChange={(e) => setFormData({ ...formData, field_of_study_fr: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      </div>
      <Textarea placeholder="Description (English)" value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      <Textarea placeholder="Description (French)" value={formData.description_fr} onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      <div className="grid grid-cols-2 gap-4">
        <Input type="date" placeholder="Start Date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input type="date" placeholder="End Date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="bg-white/10 border-white/20 text-white" disabled={formData.is_current} />
      </div>
      <label className="flex items-center gap-2 text-white">
        <input type="checkbox" checked={formData.is_current} onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })} />
        Currently Studying Here
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'GT Pressura, sans-serif' }}>Education</h2>
        <Button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Education
        </Button>
      </div>

      {showAdd && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader><CardTitle className="text-white">Add Education</CardTitle></CardHeader>
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
        {educations.map((edu) => (
          <Card key={edu.id} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              {editingId === edu.id ? (
                <div className="space-y-4">
                  <FormFields />
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(edu.id)} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4" /></Button>
                    <Button onClick={() => setEditingId(null)} variant="ghost" className="text-white"><X className="w-4 h-4" /></Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{edu.degree_en}</h3>
                    <p className="text-sm text-gray-400">{edu.institution_name} • {edu.field_of_study_en}</p>
                    <p className="text-xs text-gray-500">{edu.start_date} - {edu.is_current ? 'Present' : edu.end_date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => startEdit(edu)} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300"><Pencil className="w-4 h-4" /></Button>
                    <Button onClick={() => handleDelete(edu.id)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>
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
