import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  const submitPost = async () => {
    if (!content.trim()) return;
    await addDoc(collection(db, "posts"), {
      name: "익명",
      content,
      time: serverTimestamp()
    });
    setContent('');
    loadPosts();
  };

  const loadPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    items.sort((a, b) => b.time?.seconds - a.time?.seconds);
    setPosts(items);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div>
      <header style={{ background: '#d63384', color: 'white', padding: 16, fontSize: 20, textAlign: 'center' }}>
        새롬고 자유게시판 (익명)
      </header>
      <div className="container">
        <textarea rows="3" value={content} onChange={e => setContent(e.target.value)} placeholder="내용 입력..." />
        <button onClick={submitPost}>글 작성</button>
        <hr />
        {posts.map(p => (
          <div key={p.id} className="card">
            <div style={{ fontWeight: 'bold' }}>{p.name}</div>
            <div>{p.content}</div>
            <div style={{ fontSize: 12, color: '#888' }}>
              {p.time?.seconds ? new Date(p.time.seconds * 1000).toLocaleString() : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}