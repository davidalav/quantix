"use client";

import styled from "styled-components";
import Card from "./ui/Card";

export default function ResultCard({
  result,
  loading,
  error
}){
  return (
    <Card>
      <h3>
        JSON Preview
      </h3>

      <Code>
        {
          loading
            ? "Analyzing..."
            : error
            ? `Error: ${error}`
            : result
            ? JSON.stringify(result, null, 2)
            : "Run an analysis to see results here."
        }
      </Code>
    </Card>
  );
}

const Code = styled.pre`
  background:#020617;
  padding:20px;
  border-radius:10px;
  color:#4ade80;
  white-space:pre-wrap;
  word-break:break-word;
  max-height:500px;
  overflow-y:auto;
`;