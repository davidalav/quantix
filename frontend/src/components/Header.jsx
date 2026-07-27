"use client";

import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";

export default function Header({onLoginClick}){
  const {user,logout}=useAuth();

  return(
    <HeaderContainer>
      <TextContainer>
        <Title>
          Web Extraction
        </Title>
        <Subtitle>
          Collect structured data automatically
        </Subtitle>
      </TextContainer>
      {
        user?
        <UserBox>
          <Username>
            {user.username}
          </Username>
          <LogoutButton onClick={logout}>
            Logout
          </LogoutButton>
        </UserBox>
        :
        <LoginButton onClick={onLoginClick}>
          Sign in
        </LoginButton>
      }
    </HeaderContainer>
  );
}

const HeaderContainer=styled.header`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
`;

const TextContainer=styled.div`
  display:flex;
  flex-direction:column;
`;

const Title=styled.h1`
  font-size:28px;
  font-weight:700;
  color:white;
  margin:0;
`;

const Subtitle=styled.p`
  color:#94a3b8;
  margin:6px 0 0;
`;

const LoginButton=styled.button`
  background:#131b2e;
  border:1px solid #222f4d;
  color:white;
  padding:10px 18px;
  border-radius:8px;
  cursor:pointer;
`;

const UserBox=styled.div`
  display:flex;
  align-items:center;
  gap:15px;
`;

const Username=styled.span`
  color:white;
  font-weight:600;
`;

const LogoutButton=styled.button`
  background:#ef4444;
  color:white;
  border:none;
  padding:10px 15px;
  border-radius:8px;
  cursor:pointer;
`;