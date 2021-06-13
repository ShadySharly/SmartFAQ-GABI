import React, { useState } from 'react';
import AddIntentForm from '../Components/AddIntentForm';
import EditIntentForm from '../Components/EditIntentForm';
import IntentTable from '../Components/IntentTable';
import { IIntent, IBaseIntent } from '../Models/Intent';
import '../styles.css';


const defaultIntents: Array<IIntent> = [
    { id: 1, name: "Login" },
    { id: 2, name: "Registro" },
    { id: 3, name: "Localizacion" },
    { id: 4, name: "Proceso" },
    { id: 5, name: "Calculo 1" },
];

const initCurrentIntent: IIntent = { id: 0, name: "" };

function IntentIndex() {
    const [intents, setIntents] = useState(defaultIntents);
    const [editIntent, setEditIntent] = useState(initCurrentIntent);
    const [editing, setEdit] = useState(false);
    const onAddIntent = (newIntent: IBaseIntent) => {
        const id = intents.length + 1;
        setIntents([...intents, { ...newIntent, id }]);
    };
    const onCurrentIntent = (intent: IIntent) => {
        setEditIntent(intent);
        setEdit(true);
    };
    const onUpdateIntent = (id: number, newIntent: IIntent) => {
        setEdit(false);
        setIntents(intents.map(i => (i.id === id ? newIntent : i)));
    };
    const onDeleteIntent = (currentIntent: IIntent) => {
        setIntents(intents.filter(i => i.id !== currentIntent.id));
    };
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