import styled from "styled-components";


export default function ResultCard(){

    return (
        <Card>
            <h3>
                JSON Preview
            </h3>
            <Code>
                {`
                    {
                        "title":"MacBook Air",
                        "price":"999$",
                        "rating":4.8
                    }
                `}
            </Code>
        </Card>
    )

}


const Card=styled.div`
    background:#111827;
    padding:25px;
    border-radius:16px;
`;


const Code=styled.pre`
    background:#020617;
    padding:20px;
    border-radius:10px;
    color:#4ade80;
`;