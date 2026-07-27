"use client";

import {useState} from "react";
import styled from "styled-components";

import {useRegister} from "@/hooks/useAuth";
import {useAuth} from "@/context/AuthContext";

export default function RegisterForm({
  onSuccess
}){

  const registerMutation=useRegister();

  const {login}=useAuth();

  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");


  function handleSubmit(e){

    e.preventDefault();


    registerMutation.mutate(
      {
        username,
        email,
        password
      },
      {
        onSuccess(data){

          login(data);

          setUsername("");
          setEmail("");
          setPassword("");

          onSuccess();

        }
      }
    );

  }


  return(
    <Form onSubmit={handleSubmit}>

      <InputGroup>

        <Label>
          Username
        </Label>

        <Input
          value={username}
          onChange={
            e=>setUsername(e.target.value)
          }
          placeholder="username"
        />

      </InputGroup>


      <InputGroup>

        <Label>
          Email
        </Label>

        <Input
          type="email"
          value={email}
          onChange={
            e=>setEmail(e.target.value)
          }
          placeholder="email@example.com"
        />

      </InputGroup>


      <InputGroup>

        <Label>
          Password
        </Label>

        <Input
          type="password"
          value={password}
          onChange={
            e=>setPassword(e.target.value)
          }
          placeholder="password"
        />

      </InputGroup>


      {
        registerMutation.error &&
        <Error>
          {registerMutation.error.message}
        </Error>
      }


      <Button
        disabled={registerMutation.isPending}
      >

        {
          registerMutation.isPending
          ?
          "Creating..."
          :
          "Create account"
        }

      </Button>


    </Form>
  );

}


const Form=styled.form`
 display:flex;
 flex-direction:column;
 gap:20px;
`;

const InputGroup=styled.div`
 display:flex;
 flex-direction:column;
 gap:8px;
`;

const Label=styled.label`
 color:#94a3b8;
`;

const Input=styled.input`
 background:#0b1220;
 border:1px solid #222f4d;
 color:white;
 padding:12px;
 border-radius:8px;
`;

const Button=styled.button`
 background:#38bdf8;
 color:#0b1220;
 border:none;
 padding:12px;
 border-radius:8px;
 cursor:pointer;

 &:disabled{
   opacity:.5;
   cursor:not-allowed;
 }
`;

const Error=styled.div`
 color:#ef4444;
`;