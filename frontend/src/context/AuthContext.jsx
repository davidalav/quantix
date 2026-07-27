"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext=createContext();


export function AuthProvider({
  children
}){

  const [user,setUser]=useState(null);
  const [loaded,setLoaded]=useState(false);


  useEffect(()=>{

    const savedUser=localStorage.getItem(
      "user"
    );

    if(savedUser){
      setUser(
        JSON.parse(savedUser)
      );
    }

    setLoaded(true);

  },[]);


  function login(userData){

    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

  }


  function logout(){

    setUser(null);

    localStorage.removeItem(
      "user"
    );

  }


  return(
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loaded
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}


export function useAuth(){

  return useContext(AuthContext);

}