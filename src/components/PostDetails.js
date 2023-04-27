import styles from './PostDetails.module.css'

import { Link } from 'react-router-dom'

const PostDetails = ({post}) => {
  return (
    <div className={styles.post_detail}>
      {post.image ? <img src={post.image} alt={post.title} /> : <img src="#" alt="" style={{ display: "none" }} />}
        <h2>{post.title}</h2>
        <p className={styles.createdby}>{post.createdBy}</p>
        <p className={styles.body}>{post.body}</p>
        {Array.isArray(post.tags) ?
        <div className={styles.tags}>
            {post.tags.map((tag) => (
                <Link className={styles.linktag} key={tag} to={`/pesquisa?q=${tag}`}><span>#</span>{tag}</Link>
            ))} 
        </div> : null}
        <Link to={`/postagens/${post.id}`} className='btn-outline'>Ler</Link>
    </div>
  )
}

export default PostDetails