import React, { useState } from 'react';
import AddIntentForm from '../Components/AddIntentForm';
import EditIntentForm from '../Components/EditIntentForm';
import IntentTable from '../Components/IntentTable';
import { IIntent, IBaseIntent } from '../Models/Intent';
import { ApolloClient } from '@apollo/client';
import { useQuery, gql , useMutation} from '@apollo/client';
import '../styles.css';

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
        <div className="IntentIndex">
            <h1>Administración de Intenciones</h1>
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
        </div>
    );
}


export default IntentIndex;