import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

import { useAuthentication } from "./hooks/useAuthentication";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CreatePost from "./pages/CreatePost/CreatePost";
import Dashboard from "./pages/Dashboard/Dashboard";
import Search from "./pages/Search/Search";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Post from "./pages/Post/Post";
import EditPost from "./pages/EditPost/EditPost";

function App() {
  const [user, setUser] = useState(undefined)
  const {auth} = useAuthentication()

  const loadingUser = user === undefined

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

  }, [auth])

  if(loadingUser) {
    return <p style={{textAlign: 'center'}}>Carregando...</p>
  }

  return (
    <div className="App">
      <AuthProvider value={{user}}>
        <BrowserRouter>
          <div className="container">
            <Navbar /> 
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/pesquisa" element={<Search />}></Route>
                  <Route path="/postagens/:id" element={<Post />}></Route>
                  <Route path="/login" element={!user ? <Login /> : <Navigate to="/"/>} />
                  <Route path="/registrar" element={!user ? <Register /> : <Navigate to="/"/>} />
                  <Route path="/postagens/editar/:id" element={user ? <EditPost /> : <Navigate to="/login"/>} />
                  <Route path="/postagens/criar" element={user ? <CreatePost /> : <Navigate to="/registrar"/>} />
                  <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login"/>} /> 
                </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
