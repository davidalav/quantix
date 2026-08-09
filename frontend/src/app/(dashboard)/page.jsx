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
  const [listSelector, setListSelector] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [tableMode, setTableMode] = useState(false);
  const [tableRowSelector, setTableRowSelector] = useState("");
  const [tableCellSelector, setTableCellSelector] = useState("");
  const [tableHeaderSelector, setTableHeaderSelector] = useState("");
  const [tableLabelSelector, setTableLabelSelector] = useState("");

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

    if (!url.trim()) {
      setError("Укажи URL сайта");
      return;
    }

    let payload;

    if (tableMode) {
      if (!tableRowSelector.trim() || !tableCellSelector.trim()) {
        setError("В табличном режиме обязательны Row selector и Cell selector");
        return;
      }

      payload = {
        url: url.trim(),
        selectors: {},
        table_mode: true,
        table_row_selector: tableRowSelector.trim(),
        table_cell_selector: tableCellSelector.trim(),
        table_header_selector: tableHeaderSelector.trim() || null,
        table_label_selector: tableLabelSelector.trim() || null,
        wait_seconds: 4
      };
    } else {
      const selectors = {};
      for (const field of fields) {
        if (field.name.trim() && field.selector.trim()) {
          selectors[field.name.trim()] = field.selector.trim();
        }
      }

      if (Object.keys(selectors).length === 0) {
        setError("Добавь хотя бы одно поле с CSS-селектором");
        return;
      }

      payload = {
        url: url.trim(),
        selectors,
        list_selector: listSelector?.trim() || null,
        wait_seconds: 4
      };
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await crawlWebsite(payload);
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
          listSelector={listSelector}
          onListSelectorChange={setListSelector}
          fields={fields}
          onAddField={addField}
          onFieldChange={updateField}
          onRemoveField={removeField}
          tableMode={tableMode}
          onTableModeToggle={setTableMode}
          tableRowSelector={tableRowSelector}
          onTableRowSelectorChange={setTableRowSelector}
          tableCellSelector={tableCellSelector}
          onTableCellSelectorChange={setTableCellSelector}
          tableHeaderSelector={tableHeaderSelector}
          onTableHeaderSelectorChange={setTableHeaderSelector}
          tableLabelSelector={tableLabelSelector}
          onTableLabelSelectorChange={setTableLabelSelector}
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