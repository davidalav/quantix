import styled from "styled-components";

export default function Modal({
  children,
  onClose
}) {
  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          ×
        </CloseButton>

        {children}
      </Content>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(5, 8, 15, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: #131b2e;
  border: 1px solid #222f4d;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: white;
  }
`;