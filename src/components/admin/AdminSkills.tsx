import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { api } from '@/lib/api';

interface Skill {
  id: string;
  name_en: string;
  name_fr: string;
  category: string;
  proficiency: number;
  display_order: number;
  is_active: boolean;
}

export const AdminSkills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name_en: '',
    name_fr: '',
    category: '',
    proficiency: 80,
    display_order: 0,
    is_active: true,
  });

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills/all');
      setSkills(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post('/skills/', formData);
      setShowAdd(false);
      setFormData({ name_en: '', name_fr: '', category: '', proficiency: 80, display_order: 0, is_active: true });
      fetchSkills();
    } catch (error) {
      console.error('Error creating skill:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/skills/${id}`, formData);
      setEditingId(null);
      fetchSkills();
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const startEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData({
      name_en: skill.name_en,
      name_fr: skill.name_fr,
      category: skill.category,
      proficiency: skill.proficiency,
      display_order: skill.display_order,
      is_active: skill.is_active,
    });
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'GT Pressura, sans-serif' }}>Skills</h2>
        <Button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Skill
        </Button>
      </div>

      {showAdd && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Add New Skill</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Name (English)" value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} className="bg-white/10 border-white/20 text-white" />
              <Input placeholder="Name (French)" value={formData.name_fr} onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })} className="bg-white/10 border-white/20 text-white" />
              <Input placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="bg-white/10 border-white/20 text-white" />
              <Input type="number" placeholder="Proficiency %" value={formData.proficiency} onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })} className="bg-white/10 border-white/20 text-white" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-2" /> Save</Button>
              <Button onClick={() => setShowAdd(false)} variant="ghost" className="text-white"><X className="w-4 h-4 mr-2" /> Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {skills.map((skill) => (
          <Card key={skill.id} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              {editingId === skill.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} className="bg-white/10 border-white/20 text-white" />
                    <Input value={formData.name_fr} onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })} className="bg-white/10 border-white/20 text-white" />
                    <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="bg-white/10 border-white/20 text-white" />
                    <Input type="number" value={formData.proficiency} onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })} className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(skill.id)} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4" /></Button>
                    <Button onClick={() => setEditingId(null)} variant="ghost" className="text-white"><X className="w-4 h-4" /></Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{skill.name_en}</h3>
                    <p className="text-sm text-gray-400">{skill.category} • {skill.proficiency}%</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => startEdit(skill)} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300"><Pencil className="w-4 h-4" /></Button>
                    <Button onClick={() => handleDelete(skill.id)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>
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
