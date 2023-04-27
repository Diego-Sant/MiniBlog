import styles from "./Search.module.css";

import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import { useQuery } from "../../hooks/useQuery";
import PostDetails from "../../components/PostDetails";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


const Search = () => {
    const query = useQuery();
    const search = query.get("q");

    const {documents: posts} = useFetchDocuments("posts", search)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      setLoading(false);
    }, [search])

  return (
    <div className={styles.alinhartexto}>
      {loading && <p>Carregando...</p>}
      {!loading && posts && posts.length === 0 && (
        <>
          <p>Nenhum resultado enconrtado para a busca: "{search}"</p>
          <Link to="/" className="btn btn-dark">Voltar</Link>
        </>
      )}
      {!loading && posts && posts.length > 0 && (
        <>
        <h2>Resultado da pesquisa: "{search}"</h2>
        {posts.map((post) => (
        <div className={styles.post_detail}>
          {post.image ? <img src={post.image} alt={post.title} /> : <img src="#" alt="" style={{ display: "none" }} />}
          <h2>{post.title}</h2>
          <p className={styles.createdby}>{post.createdBy}</p>
          <p className={styles.body}>{post.body}</p>
          <Link to={`/postagens/${post.id}`} className='btn-outline'>Ler</Link>
        </div>))}
        </>
      )}
    </div>
  )
}

export default Search