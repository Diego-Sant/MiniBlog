import styles from './CreatePost.module.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthValue } from '../../context/AuthContext'
import { useInsertDocument } from '../../hooks/useInsertDocument'

import { getStorage, ref, uploadBytes } from 'firebase/storage';
import 'firebase/storage';

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [body, setBody] = useState("");
  const [charCountBody, setCharCountBody] = useState(0);
  const [charCountTitle, setCharCountTitle] = useState(0);
  const [charCountTags, setCharCountTags] = useState(0);
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {user} = useAuthValue();
  const {insertDocument, response} = useInsertDocument("posts");

  const navigate = useNavigate();

  const showFormError = (errorMessage) => {
    setFormError(errorMessage);
    setTimeout(() => {
      setFormError("");
    }, 2500);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("")
    setIsLoading(true);

    if (!image && !body) {
      showFormError("Por favor, insira pelo menos a imagem ou o conteúdo!");
      setIsLoading(false);
      return;
    }

    if(formError) return;

    if (body.length > 200) {
      showFormError("O conteúdo deve ter no máximo 200 caracteres!");
      setIsLoading(false);
      return;
    }

    if (title.length > 50) {
      showFormError("O título deve ter no máximo 50 caracteres!");
      setIsLoading(false);
      return;
    }

    if (image) {
      // Faça a conversão da imagem em uma URL base64
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const imageUrl = reader.result;
  
        // Faça o upload da imagem para o Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, 'nome_do_arquivo');
        await uploadBytes(storageRef, image);
        setImageUrl(imageUrl);

        // Continue com o restante do código
        insertDocument({ title, image: imageUrl, body, tags, uid: user.uid, createdBy: user.displayName }).then(() => {
          setIsLoading(false); // Atualize a variável de estado para indicar o fim do carregamento, em caso de sucesso
        })
          .catch((error) => {
            setIsLoading(false); // Atualize a variável de estado para indicar o fim do carregamento, em caso de erro
            console.error(error);
          });
      };
    } else {
      // Continue com o restante do código se não houver imagem
      insertDocument({ title, image: "", body, tags, uid: user.uid, createdBy: user.displayName }).then(() => {
        setIsLoading(false); // Atualize a variável de estado para indicar o fim do carregamento, em caso de sucesso
      })
        .catch((error) => {
          setIsLoading(false); // Atualize a variável de estado para indicar o fim do carregamento, em caso de erro
          console.error(error);
        });
    }

    setIsLoading(false)
    navigate("/")
  };

  const handleTagsChange = (e) => {
    const tagsInput = e.target.value;

    if (tagsInput === '') {
      setCharCountTags(0);
      setTags([]);
      return;
    }

    const tagsArray = tagsInput.split(",").map(tag => tag.trim().toLowerCase());
    setCharCountTags(tagsArray.length);

    const TagsSet = new Set(tagsArray);
    if (TagsSet.size !== tagsArray.length) {
      showFormError("Evite repetir as mesmas palavras nas tags!");
      return;
    }

    if (tagsArray.length <= 5) {
      setTags(tagsArray);
    } else {
      showFormError("Você pode adicionar no máximo 5 tags!")
    }
  }

  const handleBodyChange = (e) => {
    const inputValue = e.target.value;
    setBody(inputValue);
    setCharCountBody(inputValue.length);
  }

  const handleTitleChange = (e) => {
    const inputTitleValue = e.target.value;
    setTitle(inputTitleValue);
    setCharCountTitle(inputTitleValue.length);
  }
  
  return (
    <div className={styles.createPost}>
        <h2>Criar Post</h2>
        <p>Escreva sobre o que quiser compartilhar!</p>
        <form onSubmit={handleSubmit}>
          <label>
            <div className={styles.contentbetween}>
              <span>Título: </span>
              <p>{charCountTitle}/50 caracteres</p>
            </div>
            <input type="text" name="title" placeholder="Pense em um bom título &#128522;" onChange={handleTitleChange} value={title} />
          </label>
          <label>
            <span>Imagem: </span>
            <div className={styles.labelImage}>
            <input type="file" name="image" onChange={(e) => setImage(e.target.files[0])} />
            {image && (<button type="button" className={styles.flexbtn} onClick={() => setImage(null)}>Limpar</button>)}
            </div>
          </label>
          <label>
            <div className={styles.contentbetween}>
              <span>Conteúdo: </span>
              <p>{charCountBody}/200 caracteres</p>
            </div>
            <textarea name="body" placeholder='Escreva sobre a sua postagem &#128513;' onChange={handleBodyChange} value={body} className={styles.textareabody}></textarea>
          </label>
          <label>
            <div className={styles.contentbetween}>
              <span>Tags: </span>
              <p>{charCountTags}/5 tags</p>
            </div>
            <input type="text" name="tags" placeholder="Insira as tagas separadas por vírgula &#128521;" onChange={handleTagsChange} value={tags} />
          </label>
          {!isLoading && <button className="btn">Postar</button>}
          {isLoading && <button className="btn" disabled>Aguarde...</button>}
          {formError && <p className="error">{formError}</p>}
        </form>
    </div>
  )
}

export default CreatePost