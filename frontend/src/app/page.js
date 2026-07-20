"use client";

import styled from "styled-components";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UrlCard from "@/components/UrlCard";
import FieldsCard from "@/components/FieldsCard";
import ResultCard from "@/components/ResultCard";
import HistoryCard from "@/components/HistoryCard";


export default function Home(){


  return (
    <Layout>
      <Sidebar/>
      <Main>
        <Header/>
        <Grid>
          <Content>
            <UrlCard/>
            <FieldsCard/>
            <ResultCard/>
          </Content>
          <HistoryCard/>
        </Grid>
      </Main>
    </Layout>
  )

}



const Layout=styled.div`
  display:flex;
  min-height:100vh;
`;


const Main=styled.main`
  flex:1;
  padding:40px;
`;


const Grid=styled.div`
  display:grid;
  grid-template-columns:
  1fr 320px;
  gap:25px;
  margin-top:30px;
`;


const Content=styled.div`
  display:flex;
  flex-direction:column;
  gap:25px;
`;