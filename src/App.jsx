import { useState, useEffect } from 'react';
import { db, auth, provider, signInWithPopup, signOut } from './firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch {
      alert("로그인 실패");
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  const submitPost = async () => {
    if (!content.trim()) return;
    await addDoc(collection(db, "posts"), {
      uid: user.uid,
      name: user.displayName,
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
      <header>새롬고 자유게시판</header>
      <div className="container">
        {user ? (
          <div>
            <div style={{ marginBottom: 8 }}>{user.displayName}님 환영합니다 <button onClick={logout}>로그아웃</button></div>
            <textarea rows="3" value={content} onChange={e => setContent(e.target.value)} placeholder="내용 입력..." />
            <button onClick={submitPost}>글 작성</button>
          </div>
        ) : (
          <button onClick={login}>Google 로그인</button>
        )}
        <hr />
        {posts.map(p => (
          <div key={p.id} className="card">
            <div style={{ fontWeight: 'bold' }}>{p.name}</div>
            <div>{p.content}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{p.time?.seconds ? new Date(p.time.seconds * 1000).toLocaleString() : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}