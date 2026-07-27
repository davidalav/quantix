import styled from "styled-components";
import Card from "./ui/Card";

export default function UrlCard({
  onLoginClick
}) {
  return (
    <Card>
      <h3>
        Website URL
      </h3>
      <Row>
        <Input placeholder="https://example.com"/>

        <Button onClick={onLoginClick}>
          Analyze
        </Button>
      </Row>
    </Card>
  );
}

const Row = styled.div`
  display:flex;
  gap:15px;
  margin-top:20px;
`;

const Input = styled.input`
  flex:1;
  background:#020617;
  border:none;
  padding:15px;
  border-radius:10px;
  color:white;
`;

const Button = styled.button`
  background:#2563eb;
  color:white;
  border:none;
  padding:0 25px;
  border-radius:10px;
  cursor:pointer;
`;