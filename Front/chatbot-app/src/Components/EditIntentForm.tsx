import React, { useState, useEffect} from 'react';
import { IBaseIntent, IIntent } from '../Models/Intent';

interface IProps {
    intent: IIntent;
    onUpdateIntent: (id: number, user: IIntent) => void;
    setEdit: (bool: boolean) => void;
  }
  
 function EditIntentForm(props: IProps) {
    const [intent, setIntent] = useState(props.intent);
    useEffect(() => setIntent(props.intent), [props]);
    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if ( !intent.name) {
        console.log("em");
        return false;
      }
      props.onUpdateIntent(intent.id, intent);
    };
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setIntent({ ...intent, [name]: value });
    };
    return (
      <div className="user-form">
        <h1>Editar Intención</h1>
        <form className="form-edit" onSubmit={onFormSubmit}>
          <div className="form-row">
            <label>Nombre</label>
            <input
              type="text"
              placeholder="por favor ingrese un nombre"
              name="name"
              value={intent.name}
              onChange={onInputChange}
            />
            <div className="form-error">demasiado corto</div>
          </div>
          <div className="form-row">
            <button>Actualizar</button>
            <button onClick={() => props.setEdit(false)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
  
  export default EditIntentForm;