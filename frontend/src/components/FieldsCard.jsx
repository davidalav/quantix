"use client";

import styled from "styled-components";
import Card from "./ui/Card";

export default function FieldsCard({
  fields,
  onAddField,
  onFieldChange,
  onRemoveField
}){
  return (
    <Card>
      <h3>
        Select fields
      </h3>

      <Fields>
        {
          fields.map(field=>(
            <FieldRow key={field.id}>
              <Input
                placeholder="Field name (title)"
                value={field.name}
                onChange={(e) => onFieldChange(field.id, "name", e.target.value)}
              />
              <Input
                placeholder="CSS selector (h1.product-title)"
                value={field.selector}
                onChange={(e) => onFieldChange(field.id, "selector", e.target.value)}
              />
              <RemoveButton onClick={() => onRemoveField(field.id)}>
                ×
              </RemoveButton>
            </FieldRow>
          ))
        }
      </Fields>

      <AddButton onClick={onAddField}>
        + Add field
      </AddButton>
    </Card>
  );
}

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