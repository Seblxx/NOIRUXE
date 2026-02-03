import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import * as testimonialsService from '../services/testimonialsService';

interface TestimonialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  onSuccess: () => void;
}

export function TestimonialModal({ open, onOpenChange, userEmail, onSuccess }: TestimonialModalProps) {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await testimonialsService.submitTestimonial({
        author_name: userEmail.split('@')[0],
        author_email: userEmail,
        testimonial_text_en: comment.trim(),
        rating: 5
      });
      setComment('');
      onOpenChange(false);
      onSuccess();
      alert('Comment submitted for approval!');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="bg-black border-white/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Comment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-white/10 border-white/20 text-white min-h-[150px]"
            required
          />
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="bg-white text-black hover:bg-white/90"
            >
              {submitting ? 'Submitting...' : 'Submit Comment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
