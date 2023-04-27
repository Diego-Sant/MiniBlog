import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { useAuthentication } from "../../hooks/useAuthentication";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Esse error é o de backend
  const {login, error: authError, loading} = useAuthentication();

  const showFormError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => {
      setError("");
    }, 2500);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const user = {
      email,
      password
    }

    const res = await login(user);

  }

  // Trocar o erro padrão do sistema pelo AuthError personalizado
  useEffect(() => {
    if(authError) {
      showFormError(authError)
    }
  }, [authError])

  return (
    <div className={styles.login}>
      <h1>Entrar</h1>
        <p>Faça o login com seu email e senha</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Email: </span>
            <input type="email" name="email" required placeholder="Email do usuário" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            <span>Senha: </span>
            <input type="password" name="password" required placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {!loading && <button className="btn">Entrar</button>}
          {loading && <button className="btn" disabled>Aguarde...</button>}
          {error && <p className="error">{error}</p>}
        </form>
    </div>
  )
}

export default Login