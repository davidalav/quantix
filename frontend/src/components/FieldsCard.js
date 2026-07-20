import styled from "styled-components";


const fields=[
"title",
"price",
"image",
"rating",
"description"
];


export default function FieldsCard(){

    return (
        <Card>
            <h3>
                Select fields
            </h3>
                <Fields>
                    {
                        fields.map(field=>(
                            <Tag key={field}>
                                {field}
                            </Tag>
                        ))
                    }
            </Fields>
        </Card>
    )
}


const Card=styled.div`
    background:#111827;
    padding:25px;
    border-radius:16px;
`;


const Fields=styled.div`
    display:flex;
    gap:10px;
    flex-wrap:wrap;
`;


const Tag=styled.span`
    background:#1e293b;
    padding:8px 15px;
    border-radius:20px;
`;