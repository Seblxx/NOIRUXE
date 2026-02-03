import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import * as testimonialsService from '../services/testimonialsService';

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail: string;
}

export function AddTestimonialModal({ isOpen, onClose, onSuccess, userEmail }: AddTestimonialModalProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await testimonialsService.submitTestimonial({
        author_name: userEmail.split('@')[0],
        author_email: userEmail,
        testimonial_text_en: content.trim(),
        rating: 5
      });
      alert('Testimonial submitted! It will appear after admin approval.');
      setContent('');
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert('Failed to submit testimonial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="bg-black border-2 border-white/20 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Testimonial</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/60 text-sm mb-2 block">
              Signed in as: {userEmail}
            </label>
            <Textarea
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-white/10 border-white/20 text-white min-h-[150px]"
              required
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex-1 bg-white text-black hover:bg-white/90"
            >
              {loading ? 'Submitting...' : 'Submit Testimonial'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
