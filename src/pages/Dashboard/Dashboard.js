import styles from './Dashboard.module.css';

import { useAuthValue } from '../../context/AuthContext';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDeleteDocument } from '../../hooks/useDeleteDocument';

const Dashboard = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const {user} = useAuthValue();
  const uid = user.uid;

  const {documents: posts, loading} = useFetchDocuments("posts", null, uid);
  const {deleteDocument} = useDeleteDocument("posts");

  const handleDelete = (id) => {
    setDocumentToDelete(id);
    setShowWarning(true);
  }

  const handleDeleteConfirmed = () => {
    setShowWarning(false);
    deleteDocument(documentToDelete);
  }

  const handleDeleteCancelled = () => {
    setShowWarning(false);
    setDocumentToDelete(null);
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className={styles.dashboard}>
        <h2>Dashboard</h2>
        {posts && posts.length === 0 ? (
          <div className={styles.noposts}>
            <p>Você não postou nada ainda &#128532;</p>
            <Link to="/postagens/criar" className='btn'>Criar primeiro post!</Link>
          </div>
        ) : (
          <>
          <p>Gerencie os seus posts &#128522;</p>
          <div className={styles.containerheader}>
            <div className={styles.post_header}>
              <span>Título</span>
              <span>Ações</span>
            </div>
          </div>
          
          {posts && posts.map((post) => (
          <div key={post.id} className={styles.post_row}>
            <p>{post.title}</p>
            <div className={styles.post_content}>
              <div className={styles.buttoncontainer}>
                <Link to={`/postagens/${post.id}`} className={styles.btnnormal}>Ver</Link>
                <Link to={`/postagens/editar/${post.id}`} className={styles.btnnormal}>Editar</Link>
                <button onClick={() => handleDelete(post.id)} className={styles.btndelete}>Excluir</button>
              </div>
            </div>
          </div>
          ))}
          </>
        )}

        {showWarning && documentToDelete && (
          <div className="modal">
            <div className="modalContent">
              <h3>Tem certeza que deseja excluir o post?</h3>
              <div>
                <button className="btndelete_modal" onClick={handleDeleteConfirmed}>Sim</button>
                <button className="btnnormal_modal" onClick={handleDeleteCancelled}>Não</button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Dashboard