import styled from "styled-components";

import {
LayoutDashboard,
Globe,
Database,
History,
Settings
} from "lucide-react";


export default function Sidebar(){

    const menu=[
        {name:"Dashboard",icon:LayoutDashboard},
        {name:"Sources",icon:Globe},
        {name:"Extractors",icon:Database},
        {name:"History",icon:History},
        {name:"Settings",icon:Settings}
    ];
    
    return (
        <Wrapper>


            <Logo>
                ⚡ Quantix
            </Logo>
            {
                menu.map(item=>{
                const Icon=item.icon;
                    return (
                        <Item key={item.name}>
                            <Icon size={20}/>
                            {item.name}
                        </Item>
                    )
                })
            }
        </Wrapper>
    )
}

const Wrapper=styled.aside`
    width:250px;
    background:#111827;
    padding:30px;
    border-right:1px solid #1f2937;
`;

const Logo=styled.h1`
    font-size:26px;
    margin-bottom:40px;
`;

const Item=styled.div`
    display:flex;
    gap:12px;
    align-items:center;
    padding:15px 0;
    color:#9ca3af;
    cursor:pointer;

    &:hover{
        color:white;
    }
`;