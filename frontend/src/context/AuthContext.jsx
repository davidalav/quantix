"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoaded(true);
  }, []);

  function login(authResponse) {
    // authResponse: { access_token, user } — то, что возвращает POST /login/
    setUser(authResponse.user);
    setToken(authResponse.access_token);

    localStorage.setItem("token", authResponse.access_token);
    localStorage.setItem("user", JSON.stringify(authResponse.user));
  }

  async function logout() {
    try {
        // 1. Опционально: уведомляем бэкенд (если нужно)
        await fetch('http://localhost:8000/api/logout/', { 
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
    } catch (e) {
        console.log("Бэкенд уже недоступен или токен просрочен");
    } finally {
        // 2. Жестко чистим авторизационные данные из браузера
        localStorage.removeItem('token');
        localStorage.removeItem('user'); 
        // Если использовали sessionStorage или cookies — чистим и их:
        sessionStorage.clear();

        // 3. КРИТИЧЕСКИЙ ШАГ: Принудительный рефреш страницы
        // Это полностью уничтожит текущий React-state в памяти,
        // остановит MutationObserver (если он работал) и вернет юзера на чистый экран логина.
        window.location.href = '/'; 
        // или: window.location.reload();
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loaded }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}