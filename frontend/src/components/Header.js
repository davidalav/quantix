"use client";

import styled from "styled-components";

export default function Header({ onLoginClick }) {
  return (
    <HeaderContainer>
      <TextContainer>
        <Title>Web Extraction</Title>
        <Subtitle>Collect structured data automatically</Subtitle>
      </TextContainer>
      
      <LoginButton onClick={onLoginClick} title="Войти в аккаунт">
        <Icon width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </Icon>
        <span>Sign in</span>
      </LoginButton>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 20px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #131b2e;
  border: 1px solid #222f4d;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #1e293b;
    border-color: #38bdf8;
    color: #38bdf8;
  }

  &:active {
    transform: scale(0.98);
  }
`

const Icon = styled.svg`
  color: currentColor;
`