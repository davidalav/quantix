"use client";

import styled from "styled-components";
import { useRouter,usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Database,
  History,
  Settings
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar({onProtectedClick}){
  const router=useRouter();
  const pathname=usePathname();
  const {user}=useAuth();

  const menu=[
    {name:"Dashboard",icon:LayoutDashboard,path:"/",protected:false},
    {name:"Sources",icon:Globe,path:"/sources",protected:true},
    {name:"Extractors",icon:Database,path:"/extractors",protected:true},
    {name:"History",icon:History,path:"/history",protected:true},
    {name:"Settings",icon:Settings,path:"/settings",protected:true}
  ];

  function handleClick(item){
    if(item.protected && !user){
      onProtectedClick();
      return;
    }
    router.push(item.path);
  }

  return(
    <Wrapper>
      <Logo>
        ⚡ Quantix
      </Logo>
      {
        menu.map(item=>{
          const Icon=item.icon;
          const active=pathname===item.path;

          return(
            <Item
              key={item.name}
              $active={active}
              onClick={()=>handleClick(item)}
            >
              <Icon size={20}/>
              {item.name}
            </Item>
          );
        })
      }
    </Wrapper>
  );
}

const Wrapper=styled.aside`
  width:250px;
  background:#111827;
  padding:30px;
  border-right:1px solid #1f2937;
  height:100vh;
`;

const Logo=styled.h1`
  font-size:26px;
  margin-bottom:40px;
  color:white;
`;

const Item=styled.div`
  display:flex;
  gap:12px;
  align-items:center;
  padding:15px 0;
  color:${props=>props.$active?"#38bdf8":"#9ca3af"};
  cursor:pointer;

  &:hover{
    color:white;
  }
`;