"use client";

import styled from "styled-components";
import Card from "./ui/Card";

export default function FieldsCard({
  listSelector,
  onListSelectorChange,
  fields,
  onAddField,
  onFieldChange,
  onRemoveField,
  tableMode,
  onTableModeToggle,
  tableRowSelector,
  onTableRowSelectorChange,
  tableCellSelector,
  onTableCellSelectorChange,
  tableHeaderSelector,
  onTableHeaderSelectorChange,
  tableLabelSelector,
  onTableLabelSelectorChange
}){
  return (
    <Card>
      <TitleRow>
        <h3>Select fields</h3>
        <ToggleButton type="button" $active={tableMode} onClick={() => onTableModeToggle(!tableMode)}>
          {tableMode ? "Табличный режим ✓" : "Обычный режим"}
        </ToggleButton>
      </TitleRow>

      {tableMode ? (
        <TableFields>
          <FieldBlock>
            <Label>Row selector — селектор одной строки таблицы</Label>
            <Input
              placeholder=".flex.h-12.bg-white.border-b"
              value={tableRowSelector || ""}
              onChange={(e) => onTableRowSelectorChange(e.target.value)}
            />
          </FieldBlock>

          <FieldBlock>
            <Label>Cell selector — селектор ячейки внутри строки</Label>
            <Input
              placeholder=".relative.flex.z-1.items-center.h-full"
              value={tableCellSelector || ""}
              onChange={(e) => onTableCellSelectorChange(e.target.value)}
            />
          </FieldBlock>

          <FieldBlock>
            <Label>Header selector (опционально) — селектор заголовков колонок</Label>
            <Input
              placeholder="th или .table-header-cell"
              value={tableHeaderSelector || ""}
              onChange={(e) => onTableHeaderSelectorChange(e.target.value)}
            />
          </FieldBlock>

          <FieldBlock>
            <Label>Label selector (опционально) — селектор названия/подписи строки</Label>
            <Input
              placeholder="a.truncate или .bank-name"
              value={tableLabelSelector || ""}
              onChange={(e) => onTableLabelSelectorChange(e.target.value)}
            />
          </FieldBlock>
        </TableFields>
      ) : (
        <>
          <ListSelectorWrapper>
            <Label>Container Selector (Optional for lists/tables):</Label>
            <Input
              placeholder="e.g. table tr:has(td) or #rb tr"
              value={listSelector || ""}
              onChange={(e) => onListSelectorChange(e.target.value)}
            />
          </ListSelectorWrapper>

          <Fields>
            {fields.map(field=>(
              <FieldRow key={field.id}>
                <Input
                  placeholder="Field name (title)"
                  value={field.name}
                  onChange={(e) => onFieldChange(field.id, "name", e.target.value)}
                />
                <Input
                  placeholder="CSS selector (td:nth-child(2))"
                  value={field.selector}
                  onChange={(e) => onFieldChange(field.id, "selector", e.target.value)}
                />
                <RemoveButton onClick={() => onRemoveField(field.id)}>
                  ×
                </RemoveButton>
              </FieldRow>
            ))}
          </Fields>

          <AddButton onClick={onAddField}>
            + Add field
          </AddButton>
        </>
      )}
    </Card>
  );
}

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToggleButton = styled.button`
  background: ${p => p.$active ? "#2563eb" : "#1e293b"};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
`;

const TableFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ListSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 13px;
  color: #94a3b8;
`;

const Fields = styled.div`
  display:flex;
  flex-direction:column;
  gap:10px;
`;

const FieldRow = styled.div`
  display:flex;
  gap:10px;
  align-items:center;
`;

const Input = styled.input`
  flex:1;
  background:#020617;
  border:none;
  padding:10px 15px;
  border-radius:10px;
  color:white;
`;

const RemoveButton = styled.button`
  background:#1e293b;
  color:#f87171;
  border:none;
  width:36px;
  height:36px;
  border-radius:10px;
  cursor:pointer;
  font-size:18px;
`;

const AddButton = styled.button`
  margin-top:15px;
  background:#1e293b;
  color:white;
  border:none;
  padding:10px 20px;
  border-radius:10px;
  cursor:pointer;
`;