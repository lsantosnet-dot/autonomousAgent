'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function AgentDashboard() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: any[] }>({});
  const [input, setInput] = useState('');

  useEffect(() => {
    const s = io('http://localhost:3001');
    setSocket(s);

    s.emit('join', { role: 'agent', userId: 'agent_01' });

    s.on('active_chats', (chats) => setActiveChats(chats));
    s.on('new_chat', (chat) => setActiveChats((prev) => [...prev, chat]));

    s.on('message', (msg) => {
      setMessages((prev) => ({
        ...prev,
        [msg.from]: [...(prev[msg.from] || []), msg],
      }));
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && selectedChat && input.trim()) {
      const msg = { to: selectedChat, from: 'Support', text: input, role: 'agent' };
      socket.emit('message', msg);
      setMessages((prev) => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), { from: 'Support', text: input, timestamp: new Date() }],
      }));
      setInput('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 font-bold text-lg">Active Chats</div>
        {activeChats.map((chat) => (
          <div
            key={chat.userId}
            onClick={() => setSelectedChat(chat.userId)}
            className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
              selectedChat === chat.userId ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
            }`}
          >
            <div className="font-semibold text-sm">{chat.userId}</div>
            <div className="text-xs text-gray-400 truncate">{chat.lastMessage || 'Starting conversation...'}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-gray-200 font-bold text-lg bg-gray-50">
              Chat: {selectedChat}
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col pt-8">
              {(messages[selectedChat] || []).map((m, i) => (
                <div
                  key={i}
                  className={`chat-bubble ${m.from === 'Support' ? 'sent' : 'received'}`}
                >
                  <div className="text-[10px] opacity-70 mb-1 font-bold">{m.from}</div>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your response..."
                className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button onClick={sendMessage} className="btn bg-indigo-600 hover:bg-indigo-700 px-6">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
