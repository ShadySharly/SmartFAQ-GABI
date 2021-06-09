//import gql from 'graphql-tag';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';

const PERMISSION = gql`
    query getPermissions {
        permissions{
            permission_id
            permission_name
        }
    }
`;

const Mov = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    color: #000000;
    height: 5vh;
`;

type Permission = {permission_id:number,permission_name:string};

function ChatbotData(){
    const {loading, error, data} = useQuery(PERMISSION);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return data.permissions.map(({permission_id, permission_name}:Permission) => (
        <Mov>
            <div key={permission_id}>
                <p>{permission_id}: {permission_name}</p>    
            </div>
        </Mov>
    ));
}

export default ChatbotData;