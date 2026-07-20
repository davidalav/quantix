import styled from "styled-components";


export default function HistoryCard(){

    return (
        <Card>
            <h3>
                Recent jobs
            </h3>
            <Item>
                Amazon scraper
                <span>Success</span>
            </Item>
            <Item>
                Wikipedia
                <span>Success</span>
            </Item>
            <Item>
                Shop parser
                <span>Running</span>
            </Item>
        </Card>
    )

}


const Card=styled.div`
    background:#111827;
    padding:25px;
    border-radius:16px;
    height:max-content;
`;


const Item=styled.div`
    display:flex;
    justify-content:space-between;
    margin:20px 0;
    span{
        color:#4ade80;
    }
`;