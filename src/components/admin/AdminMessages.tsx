import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Trash2, Mail, Clock, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchData = async () => {
    try {
      const response = await api.get('/contact');
      setMessages(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      fetchData();
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleMarkRead = async (message: ContactMessage) => {
    if (message.is_read) return;
    try {
      await api.patch(`/contact/${message.id}/read`);
      fetchData();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const openMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    handleMarkRead(message);
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'GT Pressura, sans-serif' }}>
          Contact Messages
        </h2>
        <span className="text-gray-400">{messages.length} messages</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message List */}
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No messages yet</p>
          ) : (
            messages.map((message) => (
              <Card 
                key={message.id} 
                className={`bg-white/5 border-white/10 cursor-pointer transition-all hover:border-white/30 ${
                  !message.is_read ? 'border-l-4 border-l-blue-500' : ''
                } ${selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => openMessage(message)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!message.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                        <h3 className="text-white font-semibold truncate">{message.name}</h3>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{message.email}</p>
                      <p className="text-sm text-gray-500 truncate mt-1">{message.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                      <Button 
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDelete(message.id); }} 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div>
          {selectedMessage ? (
            <Card className="bg-white/5 border-white/10 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Message from {selectedMessage.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">From:</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-blue-400 hover:underline flex items-center gap-1">
                      {selectedMessage.email}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {selectedMessage.subject && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Subject:</span>
                      <span className="text-white">{selectedMessage.subject}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="pt-4 flex gap-2">
                  <a href={`mailto:${selectedMessage.email}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Mail className="w-4 h-4 mr-2" /> Reply
                    </Button>
                  </a>
                  <Button 
                    onClick={() => handleDelete(selectedMessage.id)} 
                    variant="ghost" 
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/5 border-white/10 border-dashed">
              <CardContent className="p-8 text-center">
                <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Select a message to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
