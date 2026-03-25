'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function ChatWidget() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const s = io('http://localhost:3001');
    setSocket(s);

    s.emit('join', { role: 'customer', userId });

    s.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      s.disconnect();
    };
  }, [userId]);

  const sendMessage = () => {
    if (socket && input.trim()) {
      const msg = { to: 'agents', from: userId, text: input, role: 'customer' };
      socket.emit('message', msg);
      setMessages((prev) => [...prev, { from: userId, text: input, timestamp: new Date() }]);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btn glass rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
        >
          💬
        </button>
      ) : (
        <div className="glass w-80 h-96 rounded-xl flex flex-col p-4 shadow-2xl relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
          <div className="flex-1 overflow-y-auto mb-4 flex flex-col pt-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-bubble ${m.from === userId ? 'sent' : 'received'}`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={sendMessage} className="btn p-2 min-w-12">
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
