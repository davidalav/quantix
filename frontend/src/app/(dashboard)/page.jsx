"use client";

import styled from "styled-components";

import UrlCard from "@/components/UrlCard";
import FieldsCard from "@/components/FieldsCard";
import ResultCard from "@/components/ResultCard";
import HistoryCard from "@/components/HistoryCard";

export default function Page(){
  return(
    <Grid>
      <Content>
        <UrlCard />
        <FieldsCard />
        <ResultCard />
      </Content>

      <HistoryCard />
    </Grid>
  );
}

const Grid=styled.div`
  display:grid;
  grid-template-columns:1fr 320px;
  gap:25px;
`;

const Content=styled.div`
  display:flex;
  flex-direction:column;
  gap:25px;
`;