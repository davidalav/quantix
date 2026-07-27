import styled from "styled-components";

const LinkButton = styled.a`
  display:block;
  margin-top:25px;
  text-align:center;
  color:#38bdf8;
  font-size:14px;
  font-weight:500;
  text-decoration:none;
  cursor:pointer;
  transition:color 0.2s;

  &:hover{
    color:#0ea5e9;
    text-decoration:underline;
  }
`;

export default LinkButton;