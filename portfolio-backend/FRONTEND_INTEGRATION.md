# 🔌 Frontend Integration Guide

How to connect your React/TypeScript frontend to the Spring Boot backend API.

---

## 🎯 Quick Setup

### 1. Install Axios

```bash
npm install axios
```

### 2. Create API Client

Create `src/lib/api.ts`:

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🔐 Authentication

### Login

```typescript
// src/services/authService.ts
import { api } from '@/lib/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    type: string;
    email: string;
    role: string;
  };
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  
  if (response.data.success) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
```

### Login Component Example

```typescript
// src/pages/admin/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
}
```

---

## 📊 Data Services

### Skills Service

```typescript
// src/services/skillsService.ts
import { api } from '@/lib/api';

export interface Skill {
  id: string;
  nameEn: string;
  nameFr: string;
  category: string;
  proficiency: number;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillRequest {
  nameEn: string;
  nameFr: string;
  category: string;
  proficiency: number;
  iconUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

// Get all active skills (public)
export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get('/skills');
  return response.data.data;
};

// Get all skills (admin)
export const getAllSkills = async (): Promise<Skill[]> => {
  const response = await api.get('/skills/all');
  return response.data.data;
};

// Get single skill
export const getSkill = async (id: string): Promise<Skill> => {
  const response = await api.get(`/skills/${id}`);
  return response.data.data;
};

// Create skill (admin)
export const createSkill = async (data: SkillRequest): Promise<Skill> => {
  const response = await api.post('/skills', data);
  return response.data.data;
};

// Update skill (admin)
export const updateSkill = async (id: string, data: Partial<SkillRequest>): Promise<Skill> => {
  const response = await api.put(`/skills/${id}`, data);
  return response.data.data;
};

// Delete skill (admin)
export const deleteSkill = async (id: string): Promise<void> => {
  await api.delete(`/skills/${id}`);
};

// Toggle active status (admin)
export const toggleSkillActive = async (id: string, isActive: boolean): Promise<void> => {
  await api.patch(`/skills/${id}/toggle`, { isActive });
};
```

### Using with React Query

```typescript
// src/hooks/useSkills.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as skillsService from '@/services/skillsService';

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: skillsService.getSkills,
  });
};

export const useAllSkills = () => {
  return useQuery({
    queryKey: ['skills', 'all'],
    queryFn: skillsService.getAllSkills,
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillsService.createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      skillsService.updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillsService.deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};
```

### Using in Component

```typescript
// src/pages/Skills.tsx
import { useSkills } from '@/hooks/useSkills';
import { useLanguage } from '@/contexts/LanguageContext';

export function SkillsPage() {
  const { data: skills, isLoading, error } = useSkills();
  const { language } = useLanguage();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading skills</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills?.map((skill) => (
        <div key={skill.id} className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-bold">
            {language === 'en' ? skill.nameEn : skill.nameFr}
          </h3>
          <p className="text-sm text-gray-600">{skill.category}</p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${skill.proficiency}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{skill.proficiency}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 📤 File Upload

### Upload Resume

```typescript
// src/services/resumeService.ts
import { api } from '@/lib/api';

export const uploadResume = async (file: File, language: 'EN' | 'FR'): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);

  const response = await api.post('/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const downloadResume = async (id: string): Promise<Blob> => {
  const response = await api.get(`/resume/download/${id}`, {
    responseType: 'blob',
  });
  return response.data;
};
```

### Upload Component

```typescript
// src/components/admin/ResumeUploader.tsx
import { useState } from 'react';
import { uploadResume } from '@/services/resumeService';
import { Button } from '@/components/ui/button';

export function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      await uploadResume(file, language);
      alert('Resume uploaded successfully!');
      setFile(null);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <select value={language} onChange={(e) => setLanguage(e.target.value as any)}>
        <option value="EN">English</option>
        <option value="FR">French</option>
      </select>

      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload Resume'}
      </Button>
    </div>
  );
}
```

---

## 📨 Contact Form

```typescript
// src/services/contactService.ts
import { api } from '@/lib/api';

export interface ContactMessageRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const sendContactMessage = async (data: ContactMessageRequest): Promise<void> => {
  await api.post('/contact/send', data);
};
```

```typescript
// src/pages/Contact.tsx
import { useState } from 'react';
import { sendContactMessage } from '@/services/contactService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccess(false);

    try {
      await sendContactMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Me</h1>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Message sent successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />

        <Textarea
          placeholder="Your Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={6}
        />

        <Button type="submit" disabled={sending} className="w-full">
          {sending ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
}
```

---

## 🎨 Environment Variables

Create `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

Update `src/lib/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

For production:

```env
VITE_API_URL=https://your-api-domain.com/api
```

---

## 🚀 Complete Example: Admin Dashboard

```typescript
// src/pages/admin/Dashboard.tsx
import { useAllSkills, useDeleteSkill } from '@/hooks/useSkills';
import { Button } from '@/components/ui/button';

export function AdminDashboard() {
  const { data: skills, isLoading } = useAllSkills();
  const deleteMutation = useDeleteSkill();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Skills Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name (EN)</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Proficiency</th>
              <th className="px-6 py-3 text-left">Active</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills?.map((skill) => (
              <tr key={skill.id} className="border-t">
                <td className="px-6 py-4">{skill.nameEn}</td>
                <td className="px-6 py-4">{skill.category}</td>
                <td className="px-6 py-4">{skill.proficiency}%</td>
                <td className="px-6 py-4">
                  {skill.isActive ? '✅' : '❌'}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDelete(skill.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## ✅ Checklist

- [ ] Install axios
- [ ] Create API client (`src/lib/api.ts`)
- [ ] Create service files for each entity
- [ ] Set up React Query hooks
- [ ] Implement authentication
- [ ] Create protected routes
- [ ] Test all CRUD operations
- [ ] Implement file uploads
- [ ] Add error handling
- [ ] Configure environment variables

---

**🎉 Your frontend is now ready to communicate with the Spring Boot backend!**

