import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Pencil, Trash2, X, Check, Download } from 'lucide-react';
import * as resumesService from '@/services/resumesService';

export const AdminResumes: React.FC = () => {
  const [resumes, setResumes] = useState<resumesService.Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState<resumesService.ResumeCreate>({
    title_en: '',
    title_fr: '',
    file_url: '',
    file_name: '',
    language: 'en',
    is_active: true,
  });

  const fetchData = async () => {
    try {
      const data = await resumesService.getResumes();
      setResumes(data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      await resumesService.createResume(formData);
      setShowAdd(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating resume:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await resumesService.updateResume(id, formData);
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error('Error updating resume:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumesService.deleteResume(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: '', title_fr: '', file_url: '', file_name: '', language: 'en', is_active: true,
    });
  };

  const startEdit = (resume: resumesService.Resume) => {
    setEditingId(resume.id);
    setFormData({
      title_en: resume.title_en,
      title_fr: resume.title_fr,
      file_url: resume.file_url,
      file_name: resume.file_name,
      language: resume.language,
      is_active: resume.is_active,
    });
  };

  if (loading) return <div className="text-white">Loading...</div>;

  const FormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Title (English)" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input placeholder="Title (French)" value={formData.title_fr} onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="File URL" value={formData.file_url} onChange={(e) => setFormData({ ...formData, file_url: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input placeholder="File Name" value={formData.file_name} onChange={(e) => setFormData({ ...formData, file_name: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value as 'en' | 'fr' })} className="bg-white/10 border border-white/20 text-white rounded-md p-2">
          <option value="en">English</option>
          <option value="fr">French</option>
        </select>
        <label className="flex items-center gap-2 text-white">
          <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
          Active
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'GT Pressura, sans-serif' }}>Resumes</h2>
        <Button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Resume
        </Button>
      </div>

      {showAdd && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader><CardTitle className="text-white">Add Resume</CardTitle></CardHeader>
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
        {resumes.map((resume) => (
          <Card key={resume.id} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              {editingId === resume.id ? (
                <div className="space-y-4">
                  <FormFields />
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(resume.id)} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4" /></Button>
                    <Button onClick={() => setEditingId(null)} variant="ghost" className="text-white"><X className="w-4 h-4" /></Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{resume.title_en}</h3>
                    <p className="text-sm text-gray-400">{resume.file_name} • {resume.language.toUpperCase()} {resume.is_active && '• ✅ Active'}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={resume.file_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300"><Download className="w-4 h-4" /></Button>
                    </a>
                    <Button onClick={() => startEdit(resume)} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300"><Pencil className="w-4 h-4" /></Button>
                    <Button onClick={() => handleDelete(resume.id)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>
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
