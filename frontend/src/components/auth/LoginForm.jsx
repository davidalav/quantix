"use client";

import {useState} from "react";
import styled from "styled-components";

import {useLogin} from "@/hooks/useAuth";
import {useAuth} from "@/context/AuthContext";


export default function LoginForm({
  onSuccess
}){

  const loginMutation=useLogin();

  const {login}=useAuth();


  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");


  function handleSubmit(e){

    e.preventDefault();


    loginMutation.mutate(
      {
        username,
        password
      },
      {
        onSuccess(data){

          login(data);

          setUsername("");
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
        />

      </InputGroup>


      {
        loginMutation.error &&
        <Error>
          {loginMutation.error.message}
        </Error>
      }


      <Button
        disabled={loginMutation.isPending}
      >
        {
          loginMutation.isPending
          ?
          "Loading..."
          :
          "Sign in"
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
`;

const Error=styled.div`
 color:#ef4444;
`;