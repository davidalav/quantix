"use client";

import { useState } from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";

// import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UrlCard from "@/components/UrlCard";
import FieldsCard from "@/components/FieldsCard";
import ResultCard from "@/components/ResultCard";
import HistoryCard from "@/components/HistoryCard";

function MainDashboard() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          username: username,
          email: `${username}@example.com`, 
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Успешный вход! Создан пользователь ID: ${data.id}`);
        setIsLoginOpen(false);
        setUsername("");
        setPassword("");
      } else {
        alert(`Ошибка сервера: ${data.detail || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      alert("Не удалось подключиться к бэкенду. Проверьте, запущен ли FastAPI.");
    }
  };

  return (
    <Layout>
      {/* <Sidebar /> */}
      <Main>
        <Header onLoginClick={() => setIsLoginOpen(true)} />
        <Grid>
          <Content>
            <UrlCard onLoginClick={() => setIsLoginOpen(true)}/>
            <FieldsCard />
            <ResultCard />
          </Content>
          <HistoryCard />
        </Grid>
      </Main>

      {/* Попап авторизации в тёмном стиле */}
      {isLoginOpen && (
        <ModalOverlay onClick={() => setIsLoginOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setIsLoginOpen(false)}>&times;</CloseButton>
            
            <Title>Signin</Title>
            
            <Form onSubmit={handleLoginSubmit}>
              <InputGroup>
                <Label>Login</Label>
                <Input 
                  type="text" 
                  placeholder="Введите имя пользователя" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </InputGroup>

              <InputGroup>
                <Label>Password</Label>
                <Input 
                  type="password" 
                  placeholder="Введите пароль" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </InputGroup>

              <CheckboxGroup>
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember Me</label>
              </CheckboxGroup>

              <SubmitButton type="submit">Signin</SubmitButton>
            </Form>

            <RegisterLink href="#">Registration</RegisterLink>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(MainDashboard), { ssr: false });

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  padding: 40px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 25px;
  margin-top: 30px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(5, 8, 15, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #131b2e;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 2px rgba(255, 255, 255, 0.1);
  border: 1px solid #222f4d;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #64748b;
  line-height: 1;
  transition: color 0.2s;
  &:hover {
    color: #ffffff;
  }
`;

const Title = styled.h2`
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  letter-spacing: -0.5px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
`;

const Input = styled.input`
  background: #0b1220;
  border: 1px solid #222f4d;
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: #475569;
  }

  &:focus {
    border-color: #38bdf8;
    box-shadow: 0 0 10px rgba(56, 189, 248, 0.15);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #94a3b8;
  cursor: pointer;

  input {
    cursor: pointer;
    accent-color: #38bdf8;
  }
`;

const SubmitButton = styled.button`
  background: #38bdf8;
  color: #0b1220;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0ea5e9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(56, 189, 248, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const RegisterLink = styled.a`
  display: block;
  margin-top: 25px;
  text-align: center;
  font-size: 14px;
  color: #38bdf8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  &:hover {
    color: #0ea5e9;
    text-decoration: underline;
  }
`;
