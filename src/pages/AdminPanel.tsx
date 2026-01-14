import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';

const API_URL = 'https://functions.poehali.dev/c51dbb61-b1e5-4923-98ba-c9ddd569ba13';

interface User {
  id: number;
  email: string;
  joined: string;
  messageCount: number;
  lastMessage: string | null;
}

interface Message {
  id: number;
  text: string;
  image?: string;
  sender: 'user' | 'admin';
  timestamp: string;
}

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    const interval = setInterval(loadUsers, 5000); // Обновляем каждые 5 секунд
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.id);
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API_URL}?action=users`);
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadMessages = async (userId: number) => {
    try {
      const res = await fetch(`${API_URL}?action=messages&userId=${userId}`);
      const data = await res.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendAdminMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    setLoading(true);
    try {
      await fetch(`${API_URL}?action=send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          message: newMessage,
          isAdmin: true
        })
      });
      setNewMessage('');
      await loadMessages(selectedUser.id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-150px)]">
          {/* Users List */}
          <Card className="p-4 overflow-y-auto bg-white/10 backdrop-blur border-white/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="Users" size={24} />
              Users ({users.length})
            </h2>
            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedUser?.id === user.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold truncate">{user.email}</div>
                  <div className="text-xs opacity-70">
                    {user.messageCount} messages
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Chat */}
          <Card className="md:col-span-2 flex flex-col bg-white/10 backdrop-blur border-white/20">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-white/20">
                  <h3 className="font-bold text-white text-lg">{selectedUser.email}</h3>
                  <p className="text-sm text-white/60">
                    Joined: {new Date(selectedUser.joined).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          msg.sender === 'admin'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/20 text-white'
                        }`}
                      >
                        {msg.image && (
                          <img src={msg.image} alt="Sent" className="rounded-lg mb-2 max-w-full" />
                        )}
                        <p className="text-sm">{msg.text}</p>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-white/20">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendAdminMessage()}
                      placeholder="Type your reply..."
                      className="flex-1 bg-white/10 border-white/20 text-white"
                    />
                    <Button
                      onClick={sendAdminMessage}
                      disabled={loading}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      <Icon name="Send" size={20} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/60">
                <div className="text-center">
                  <Icon name="MessageSquare" size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Select a user to view conversation</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
