import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Shield, XCircle, Check } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

const iconMap = {
  error: { icon: XCircle, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' },
  warning: { icon: AlertTriangle, color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.2)', borderColor: 'rgba(245, 158, 11, 0.5)' },
  success: { icon: Check, color: '#4ade80', bgColor: 'rgba(74, 222, 128, 0.2)', borderColor: 'rgba(74, 222, 128, 0.5)' },
  info: { icon: Shield, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 0.5)' },
};

export const SecurityModal = ({ isOpen, type, title, message, buttonText = 'OK', onClose }: SecurityModalProps) => {
  const { icon: Icon, color, bgColor, borderColor } = iconMap[type];

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-cursor"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.88)',
          cursor: 'default !important',
        } as React.CSSProperties}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            maxWidth: '28rem',
            margin: '0 1rem',
            borderRadius: '0.5rem',
            padding: '2rem',
            backgroundColor: 'rgba(10,10,10,0.98)',
            border: '1px solid rgba(255,255,255,0.15)',
            textAlign: 'center',
            cursor: 'default !important',
          } as React.CSSProperties}
        >
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
          >
            <Icon size={28} style={{ color }} />
          </div>
          <h3
            className="text-xl text-white mb-2"
            style={{ fontFamily: "'GT Pressura', sans-serif" }}
          >
            {title}
          </h3>
          <p
            className="text-sm mb-6"
            style={{ fontFamily: "'GT Pressura', sans-serif", color: 'rgba(255,255,255,0.7)' }}
          >
            {message}
          </p>
          <button
            onClick={onClose}
            className="text-sm tracking-wider uppercase transition-colors hover:text-white"
            style={{
              fontFamily: "'GT Pressura', sans-serif",
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer !important',
            } as React.CSSProperties}
          >
            {buttonText}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
