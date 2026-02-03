import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Check, X, Trash2, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import * as testimonialsService from '@/services/testimonialsService';

export const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<testimonialsService.Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const fetchData = async () => {
    try {
      const data = await testimonialsService.getAllTestimonialsAdmin(filter === 'all' ? undefined : filter);
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleApprove = async (id: string) => {
    try {
      await testimonialsService.approveTestimonial(id);
      fetchData();
    } catch (error) {
      console.error('Error approving testimonial:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await testimonialsService.rejectTestimonial(id);
      fetchData();
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await testimonialsService.deleteTestimonial(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'border-green-500/30 bg-green-500/5';
      case 'rejected': return 'border-red-500/30 bg-red-500/5';
      default: return 'border-yellow-500/30 bg-yellow-500/5';
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'GT Pressura, sans-serif' }}>Testimonials</h2>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              variant={filter === status ? 'default' : 'ghost'}
              className={filter === status ? 'bg-blue-600' : 'text-white'}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {testimonials.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No testimonials found</p>
        ) : (
          testimonials.map((testimonial) => (
            <Card key={testimonial.id} className={`bg-white/5 ${getStatusColor(testimonial.status)}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(testimonial.status)}
                      <h3 className="text-lg font-semibold text-white">{testimonial.author_name}</h3>
                      <span className="text-xs text-gray-400">{testimonial.author_email}</span>
                    </div>
                    
                    {testimonial.author_company && (
                      <p className="text-sm text-gray-400 mb-2">
                        {testimonial.author_position_en} at {testimonial.author_company}
                      </p>
                    )}
                    
                    <p className="text-white/90 mb-3">{testimonial.testimonial_text_en}</p>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted: {new Date(testimonial.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {testimonial.status === 'pending' && (
                      <>
                        <Button onClick={() => handleApprove(testimonial.id)} className="bg-green-600 hover:bg-green-700" size="sm">
                          <Check className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button onClick={() => handleReject(testimonial.id)} className="bg-red-600 hover:bg-red-700" size="sm">
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                    {testimonial.status === 'rejected' && (
                      <Button onClick={() => handleApprove(testimonial.id)} className="bg-green-600 hover:bg-green-700" size="sm">
                        <Check className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    )}
                    {testimonial.status === 'approved' && (
                      <Button onClick={() => handleReject(testimonial.id)} className="bg-orange-600 hover:bg-orange-700" size="sm">
                        <X className="w-4 h-4 mr-1" /> Unpublish
                      </Button>
                    )}
                    <Button onClick={() => handleDelete(testimonial.id)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
