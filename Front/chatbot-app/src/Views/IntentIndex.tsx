import React, { useState } from 'react';
import AddIntentForm from '../Components/AddIntentForm';
import EditIntentForm from '../Components/EditIntentForm';
import IntentTable from '../Components/IntentTable';
import { IIntent, IBaseIntent } from '../Models/Intent';
import { ApolloClient } from '@apollo/client';
import { useQuery, gql , useMutation} from '@apollo/client';
import '../styles.css';
import styled from 'styled-components';

type Intention = { intention_id: number, intention_name: string }

const defaultIntents: Array<IIntent> = [
    { id: 1, name: "Login" },
    { id: 2, name: "Registro" },
    { id: 3, name: "Localizacion" },
    { id: 4, name: "Proceso" },
    { id: 5, name: "Calculo 1" },
];

const INTENTIONS = gql`
  query consulta {
    intentions{
      intention_id
      intention_name
    }
  }
`;

const DELETE_INTENT = gql`
    mutation removeIntent($intention_id: Int!) {
      removeIntention(intention_id: $intention_id)
    }
`;

const StyledDiv = styled.div `
    padding:20px;
    span.page-title{
        color: #EA7600;
        font-size: 30px;
        padding-bottom:10px;
    };
    .intent-flex-wrapper {
        margin-top:20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    };
    .intent-form{
        margin-top:20px;
        margin-left:20px;
    };
    .intent-table {
        flex: 1;
        width: 50%;
        margin-top:20px;
        margin-left:200px;
    };
    .user-form{
        margin-top:20px;
        margin-left:20px;
        span{
            font-size:30px;
            font-weight:bold;
        }
    };
    .form-row {
        margin-bottom: 10px;
        margin-top:10px;
        span{
            font-weight:bold;
        };
        label{
            font-weight:bold;
        };
    };
    .form-error {
        color: red;
        font-size: 14px;
        line-height: 26px;
    }
`

const StyledForm = styled.div `
    color: #394049;
    background-color: #D9D9D9;
    margin-top: 8px;
    margin-left: 12px;
    margin-right: 12px;
    border-radius: 10px;
`

const initCurrentIntent: Intention = { intention_id: -1, intention_name: "" };

function IntentIndex() {
    const [deleteIntent] = useMutation(DELETE_INTENT)
    const { loading, error, data } = useQuery(INTENTIONS);
    const [intents, setIntents] = useState(data?.intentions);
    const [editIntent, setEditIntent] = useState(initCurrentIntent);
    const [editing, setEdit] = useState(false);
    const onAddIntent = (newIntent: Intention) => {
        console.log('Intencion ' + newIntent.intention_id + 'nombre' + newIntent.intention_name);
        setIntents([...intents, { ...newIntent }]);
    };
    const onCurrentIntent = (intent: Intention) => {
        setEditIntent(intent);
        setEdit(true);
    };
    const onUpdateIntent = (id: number, newIntent: Intention) => {
        setEdit(false);
        setIntents(intents.map((i: Intention) => (i.intention_id === id ? newIntent : i)));
    };
    const onDeleteIntent = (currentIntent: Intention) => {
        deleteIntent({ variables: { intention_id: currentIntent.intention_id } })
        setIntents(intents.filter((i: Intention) => i.intention_id !== currentIntent.intention_id));
    };

    if (loading) return <p>loading...</p>;
    if (error) return <p>ERROR</p>;
    if (!intents) return <p>Not found</p>;
    return (
        <StyledDiv>
            <span className="page-title">Administración de Intenciones</span>
            <StyledForm>
            <div className="intent-flex-wrapper">
                {editing ? (
                    <EditIntentForm
                        intent={editIntent}
                        onUpdateIntent={onUpdateIntent}
                        setEdit={setEdit}
                    />
                ) : (
                    <AddIntentForm onAddIntent={onAddIntent} />
                )}
                <IntentTable
                    intents={intents}
                    onEdit={onCurrentIntent}
                    onDelete={onDeleteIntent}
                />
            </div>
            </StyledForm>
        </StyledDiv>
    );
}


export default IntentIndex;