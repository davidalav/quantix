"use client";

import { useState } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";

import UrlCard from "@/components/UrlCard";
import FieldsCard from "@/components/FieldsCard";
import ResultCard from "@/components/ResultCard";
import HistoryCard from "@/components/HistoryCard";
import { crawlWebsite } from "@/lib/api";

export default function Page(){
  const [url, setUrl] = useState("");
  const [fields, setFields] = useState([{ id: nanoid(), name: "", selector: "" }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function addField(){
    setFields(prev => [...prev, { id: nanoid(), name: "", selector: "" }]);
  }

  function updateField(id, key, value){
    setFields(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f));
  }

  function removeField(id){
    setFields(prev => prev.filter(f => f.id !== id));
  }

  async function handleAnalyze(){
    setError(null);

    // selectors — обязательное поле для скрапинга, без него бэк вернёт пустой data
    const selectors = {};
    for (const field of fields) {
      if (field.name.trim() && field.selector.trim()) {
        selectors[field.name.trim()] = field.selector.trim();
      }
    }

    if (!url.trim()) {
      setError("Укажи URL сайта");
      return;
    }

    if (Object.keys(selectors).length === 0) {
      setError("Добавь хотя бы одно поле с CSS-селектором");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await crawlWebsite({ url, selectors });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return(
    <Grid>
      <Content>
        <UrlCard url={url} onUrlChange={setUrl} onAnalyze={handleAnalyze} loading={loading} />
        <FieldsCard
          fields={fields}
          onAddField={addField}
          onFieldChange={updateField}
          onRemoveField={removeField}
        />
        <ResultCard result={result} loading={loading} error={error} />
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