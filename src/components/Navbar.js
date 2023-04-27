import styles from "./Navbar.module.css";

import { NavLink } from "react-router-dom";

import { useAuthentication } from "../hooks/useAuthentication";
import { useAuthValue } from "../context/AuthContext";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";

const Navbar = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [quit, setQuit] = useState(null);

  const {user} = useAuthValue();
  const {logout} = useAuthentication();

  const handleLogout = () => {
    setQuit("logout");
    setShowWarning(true);
  }

  const handleLogoutConfirmed = () => {
    setShowWarning(false);
    logout();
  };

  const handleLogoutCancelled = () => {
    setShowWarning(false);
    setQuit(null);
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <NavLink to="/" className={styles.brand}>Mini <span>Blog</span></NavLink>
        <ul className={styles.links_list}>
          <li>
            <NavLink to="/" className={({isActive}) => (isActive ? styles.active : '')}>Início</NavLink>
          </li>

          {!user && (
            <>
              <li>
                <NavLink to="/login" className={({isActive}) => (isActive ? styles.active : '')}>Entrar</NavLink>
              </li>
              <li>
                <NavLink to="/registrar" className={({isActive}) => (isActive ? styles.active : '')}>Cadastrar</NavLink>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <NavLink to="/postagens/criar" className={({isActive}) => (isActive ? styles.active : '')}>Novo post</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" className={({isActive}) => (isActive ? styles.active : '')}>Dashboard</NavLink>
              </li>
            </>
          )}

          <li>
            <NavLink to="/sobre" className={({isActive}) => (isActive ? styles.active : '')}>Sobre</NavLink>
          </li>
          {user && (
            <li>
              <button onClick={handleLogout} className={styles.sairbotao}><FontAwesomeIcon icon={faRightFromBracket}/></button>
            </li>
          )}
        </ul>
      </nav>

      {showWarning && quit === "logout" && (
      <div className="modal">
        <div className="modalContent">
          <h3>Tem certeza que deseja sair?</h3>
          <div>
            <button className="btndelete_modal" onClick={handleLogoutConfirmed}>Sim</button>
            <button className="btnnormal_modal" onClick={handleLogoutCancelled}>Não</button>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

export default Navbar