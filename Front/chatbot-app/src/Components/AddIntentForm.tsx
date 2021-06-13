import React, { useState } from "react";
import { IBaseIntent } from '../Models/Intent';

interface IProps {
    onAddIntent: (intent: IBaseIntent) => void;
}
const initIntent = { name: "" };
const AddIntentForm: React.FunctionComponent<IProps> = props => {
    const [formValue, setFormValue] = useState(initIntent);
    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const rules = [
            { key: "name", required: true, label: "Nombre" },
            { key: "name", maxLength: 16, label: "Nombre" },
            { key: "name", minLength: 4, label: "Nombre" },
        ];

        props.onAddIntent(formValue);
        setFormValue(initIntent)
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
                        name="name"
                        value={formValue.name}
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
