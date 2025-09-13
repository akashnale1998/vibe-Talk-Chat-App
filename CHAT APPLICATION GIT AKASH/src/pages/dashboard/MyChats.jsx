import React, { useEffect, useState } from 'react';

const MyChats = () => {
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    // TODO: fetch recent chats from API or local state
    // For demo, let's use static data
    const chats = [
      { id: 1, name: 'Akash Nale' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Jane Smith' }
    ];
    setRecentChats(chats);
  }, []);

  return (
    <div>
      <h2>My Recent Chats</h2>
      <ul>
        {recentChats.map(chat => (
          <li key={chat.id}>{chat.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyChats;
