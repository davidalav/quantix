"use client";

import {useState} from "react";
import styled from "styled-components";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";

export default function DashboardLayout({children}){
  const [modal,setModal]=useState(null);

  function openLogin(){
    setModal("login");
  }

  function closeModal(){
    setModal(null);
  }

  return(
    <Layout>
      <Sidebar
        onProtectedClick={openLogin}
      />

      <Main>
        <Header
          onLoginClick={openLogin}
        />

        {children}
      </Main>

      <LoginModal
        isOpen={modal==="login"}
        onClose={closeModal}
        onRegister={()=>{
          setModal("register");
        }}
      />

      <RegisterModal
        isOpen={modal==="register"}
        onClose={closeModal}
      />
    </Layout>
  );
}

const Layout=styled.div`
  display:flex;
  min-height:100vh;
`;

const Main=styled.main`
  flex:1;
  padding:40px;
`;