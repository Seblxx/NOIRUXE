import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { api } from '@/lib/api';

interface Project {
  id: string;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  short_description_en?: string;
  short_description_fr?: string;
  image_url?: string;
  project_url?: string;
  github_url?: string;
  technologies?: string[];
  category?: string;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
}

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    title_en: '',
    title_fr: '',
    description_en: '',
    description_fr: '',
    short_description_en: '',
    short_description_fr: '',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: '',
    category: '',
    is_featured: false,
    display_order: 0,
    is_active: true,
  });

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/all');
      setProjects(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    try {
      const data = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      };
      await api.post('/projects/', data);
      setShowAdd(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const data = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      };
      await api.put(`/projects/${id}`, data);
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: '', title_fr: '', description_en: '', description_fr: '',
      short_description_en: '', short_description_fr: '', image_url: '',
      project_url: '', github_url: '', technologies: '', category: '',
      is_featured: false, display_order: 0, is_active: true,
    });
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title_en: project.title_en,
      title_fr: project.title_fr,
      description_en: project.description_en,
      description_fr: project.description_fr,
      short_description_en: project.short_description_en || '',
      short_description_fr: project.short_description_fr || '',
      image_url: project.image_url || '',
      project_url: project.project_url || '',
      github_url: project.github_url || '',
      technologies: project.technologies?.join(', ') || '',
      category: project.category || '',
      is_featured: project.is_featured,
      display_order: project.display_order,
      is_active: project.is_active,
    });
  };

  if (loading) return <div className="text-white">Loading...</div>;

  const FormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Title (English)" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input placeholder="Title (French)" value={formData.title_fr} onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      </div>
      <Textarea placeholder="Description (English)" value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      <Textarea placeholder="Description (French)" value={formData.description_fr} onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Image URL" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input placeholder="Project URL" value={formData.project_url} onChange={(e) => setFormData({ ...formData, project_url: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input placeholder="GitHub URL" value={formData.github_url} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      </div>
      <Input placeholder="Technologies (comma-separated)" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      <label className="flex items-center gap-2 text-white">
        <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} />
        Featured Project
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'GT Pressura, sans-serif' }}>Projects</h2>
        <Button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {showAdd && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader><CardTitle className="text-white">Add New Project</CardTitle></CardHeader>
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
        {projects.map((project) => (
          <Card key={project.id} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              {editingId === project.id ? (
                <div className="space-y-4">
                  <FormFields />
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(project.id)} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4" /></Button>
                    <Button onClick={() => setEditingId(null)} variant="ghost" className="text-white"><X className="w-4 h-4" /></Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{project.title_en}</h3>
                    <p className="text-sm text-gray-400">{project.category} {project.is_featured && '• ⭐ Featured'}</p>
                    <p className="text-xs text-gray-500 mt-1">{project.technologies?.join(', ')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => startEdit(project)} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300"><Pencil className="w-4 h-4" /></Button>
                    <Button onClick={() => handleDelete(project.id)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>
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
