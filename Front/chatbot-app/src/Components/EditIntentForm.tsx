import React, { useState, useEffect} from 'react';
import { IBaseIntent, IIntent } from '../Models/Intent';

type Intention = { intention_id: number, intention_name: string }

interface IProps {
    intent: Intention;
    onUpdateIntent: (id: number, intention: Intention) => void;
    setEdit: (bool: boolean) => void;
  }
  
 function EditIntentForm(props: IProps) {
    const [intent, setIntent] = useState(props.intent);
    useEffect(() => setIntent(props.intent), [props]);
    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if ( !intent.intention_name) {
        console.log("em");
        return false;
      }
      props.onUpdateIntent(intent.intention_id, intent);
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
              value={intent.intention_name}
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