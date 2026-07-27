import styled from "styled-components";

export default styled.input`
    background:#0b1220;
    border:1px solid #222f4d;
    color:white;
    padding:12px 16px;
    border-radius:8px;
    font-size:15px;
    outline:none;
    &::placeholder{
    color:#475569;
    }
    &:focus{
    border-color:#38bdf8;
    }
`;