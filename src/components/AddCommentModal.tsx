import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface AddCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => Promise<void>;
}

export function AddCommentModal({ isOpen, onClose, onSubmit }: AddCommentModalProps) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await onSubmit(comment);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="bg-black border-2 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Comment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-white/10 border-white/20 text-white min-h-[150px]"
            required
          />
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading || !comment.trim()}
              className="flex-1 bg-white text-black hover:bg-white/90"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
