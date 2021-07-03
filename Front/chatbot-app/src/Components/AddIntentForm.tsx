import React, { useState } from "react";
import { IBaseIntent } from '../Models/Intent';
import { gql, useMutation } from '@apollo/client';
import styled from "styled-components";

type Intention = { intention_id: number, intention_name: string }

const CREATE_INTENT = gql`
    mutation addIntent($intention_name: String!) {
        createIntention(intention_name: $intention_name)
    }
`;

interface IProps {
    onAddIntent: (intent: Intention) => void;
}
const initIntent: Intention = { intention_id: -1, intention_name: "" };

const AddIntentForm: React.FunctionComponent<IProps> = props => {
    const [addIntention] = useMutation(CREATE_INTENT);
    const [formValue, setFormValue] = useState(initIntent);
    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addIntention({ variables: { intention_name: formValue.intention_name } });
        props.onAddIntent(formValue);
        setFormValue(initIntent)
        return false;
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
    };
    return (
        <div className="intent-form">
            <h1>Añadir Intención</h1>
            <form className="form-edit" onSubmit={onFormSubmit}>
                <div className="form-row">
                    <label>Nombre</label>
                    <input
                        type="text"
                        placeholder="por favor ingrese un nombre"
                        name="intention_name"
                        value={formValue.intention_name}
                        onChange={onInputChange}
                    />
                </div>
                <div className="form-row">
                    <button>Añadir Nueva Intención</button>
                </div>
            </form>
        </div>
    );
};

export default AddIntentForm;
