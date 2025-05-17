import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [notice, setNotice] = useState('');
  const [admin, setAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ id: '', pwd: '' });

  const loadPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    items.sort((a, b) => b.time?.seconds - a.time?.seconds);
    setPosts(items);
  };

  const submitPost = async () => {
    if (!content.trim()) return;
    await addDoc(collection(db, "posts"), {
      name: admin ? "📢 관리자 공지" : "익명",
      content,
      time: serverTimestamp()
    });
    setContent('');
    loadPosts();
  };

  const deletePost = async (id) => {
    if (!admin) return;
    await deleteDoc(doc(db, "posts", id));
    loadPosts();
  };

  const handleLogin = () => {
    if (loginData.id === "이지운" && loginData.pwd === "jeewoon0801*") {
      setAdmin(true);
      setShowLogin(false);
      alert("관리자 로그인 성공");
    } else {
      alert("로그인 실패");
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div>
      <header style={{ background: '#d63384', color: 'white', padding: 16, fontSize: 20, textAlign: 'center', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 16, top: 16 }}>
          <button style={{ fontSize: 12 }} onClick={() => setShowLogin(true)}>관리자 로그인</button>
        </span>
        새롬고 자유게시판 {admin && "(관리자 모드)"}
      </header>

      {showLogin && (
        <div style={{ background: '#fff0f5', padding: 16, textAlign: 'center' }}>
          <div>아이디: <input value={loginData.id} onChange={e => setLoginData({ ...loginData, id: e.target.value })} /></div>
          <div>비밀번호: <input type="password" value={loginData.pwd} onChange={e => setLoginData({ ...loginData, pwd: e.target.value })} /></div>
          <button onClick={handleLogin}>로그인</button>
        </div>
      )}

      <div className="container">
        <textarea rows="3" value={content} onChange={e => setContent(e.target.value)} placeholder={admin ? "공지 작성" : "내용 입력..."} />
        <button onClick={submitPost}>{admin ? "공지 작성" : "글 작성"}</button>
        <hr />
        {posts.map(p => (
          <div key={p.id} className="card">
            <div style={{ fontWeight: 'bold' }}>{p.name}</div>
            <div>{p.content}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{p.time?.seconds ? new Date(p.time.seconds * 1000).toLocaleString() : ''}</div>
            {admin && (
              <button style={{ marginTop: 8, background: '#888' }} onClick={() => deletePost(p.id)}>삭제</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
