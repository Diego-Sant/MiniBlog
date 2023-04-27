import styles from "./Post.module.css"

import { Link, useParams } from "react-router-dom"
import { useFetchDocument } from "../../hooks/useFetchDocument";

const Post = () => {
    const {id} = useParams();
    const {document: post, loading} = useFetchDocument("posts", id);

  return (
    <div className={styles.postcontainer}>
        {loading && <p>Carregando post...</p>}
        {post && (
            <>
                <h1>{post.title}</h1>
                {post.image ? <img src={post.image} alt={post.title} /> : <img src="#" alt="" style={{ display: "none" }} />}
                <p>{post.body}</p>
                <div className={styles.tags}>
                {post.tags.map((tag) => (
                <Link className={styles.linktag} key={tag} to={`/pesquisa?q=${tag}`}><span>#</span>{tag}</Link>
                ))}
                </div>
            </>
        )}
    </div>
  )
}

export default Post