import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import * as hobbiesService from '@/services/hobbiesService';

export const AdminHobbies: React.FC = () => {
  const [hobbies, setHobbies] = useState<hobbiesService.Hobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState<hobbiesService.HobbyCreate>({
    name_en: '',
    name_fr: '',
    description_en: '',
    description_fr: '',
    icon_url: '',
    image_url: '',
    display_order: 0,
    is_active: true,
  });

  const fetchData = async () => {
    try {
      const data = await hobbiesService.getHobbies(false);
      setHobbies(data);
    } catch (error) {
      console.error('Error fetching hobbies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      await hobbiesService.createHobby(formData);
      setShowAdd(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating hobby:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await hobbiesService.updateHobby(id, formData);
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error('Error updating hobby:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hobby?')) return;
    try {
      await hobbiesService.deleteHobby(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting hobby:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name_en: '', name_fr: '', description_en: '', description_fr: '',
      icon_url: '', image_url: '', display_order: 0, is_active: true,
    });
  };

  const startEdit = (hobby: hobbiesService.Hobby) => {
    setEditingId(hobby.id);
    setFormData({
      name_en: hobby.name_en,
      name_fr: hobby.name_fr,
      description_en: hobby.description_en,
      description_fr: hobby.description_fr,
      icon_url: hobby.icon_url || '',
      image_url: hobby.image_url || '',
      display_order: hobby.display_order,
      is_active: hobby.is_active,
    });
  };

  if (loading) return <div className="text-white">Loading...</div>;

  const FormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Name (English)" value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input placeholder="Name (French)" value={formData.name_fr} onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      </div>
      <Textarea placeholder="Description (English)" value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      <Textarea placeholder="Description (French)" value={formData.description_fr} onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Icon URL" value={formData.icon_url} onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })} className="bg-white/10 border-white/20 text-white" />
        <Input placeholder="Image URL" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="bg-white/10 border-white/20 text-white" />
      </div>
      <label className="flex items-center gap-2 text-white">
        <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
        Active
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'GT Pressura, sans-serif' }}>Hobbies</h2>
        <Button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Hobby
        </Button>
      </div>

      {showAdd && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader><CardTitle className="text-white">Add Hobby</CardTitle></CardHeader>
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
        {hobbies.map((hobby) => (
          <Card key={hobby.id} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              {editingId === hobby.id ? (
                <div className="space-y-4">
                  <FormFields />
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(hobby.id)} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4" /></Button>
                    <Button onClick={() => setEditingId(null)} variant="ghost" className="text-white"><X className="w-4 h-4" /></Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{hobby.name_en}</h3>
                    <p className="text-sm text-gray-400">{hobby.description_en.substring(0, 100)}...</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => startEdit(hobby)} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300"><Pencil className="w-4 h-4" /></Button>
                    <Button onClick={() => handleDelete(hobby.id)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>
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
