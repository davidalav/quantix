"use client";

import styled from "styled-components";
import Card from "./ui/Card";

export default function UrlCard({
  url,
  onUrlChange,
  onAnalyze,
  loading
}) {
  return (
    <Card>
      <h3>
        Website URL
      </h3>
      <Row>
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
        />

        <Button onClick={onAnalyze} disabled={loading || !url}>
          {loading ? "Analyzing..." : "Analyze"}
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

  &:disabled{
    opacity:0.5;
    cursor:not-allowed;
  }
`;