import React, { useState, useEffect} from 'react';
import { IBaseIntent, IIntent } from '../Models/Intent';
import { gql, useMutation } from '@apollo/client';

const UPDATE_INTENT = gql`
    mutation updateIntent($intention_id: Int!,$intention_name: String!) {
        updateIntention(intention_id: $intention_id, intention_name: $intention_name)
    }
`;


type Intention = { intention_id: number, intention_name: string }

interface IProps {
    intent: Intention;
    onUpdateIntent: (id: number, intention: Intention) => void;
    setEdit: (bool: boolean) => void;
  }
  
  function EditIntentForm(props: IProps) {
    const [updateIntention] = useMutation(UPDATE_INTENT);
    const [intent, setIntent] = useState(props.intent);
    useEffect(() => setIntent(props.intent), [props]);
    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      updateIntention({ variables: { intention_id: intent.intention_id, intention_name: intent.intention_name }});
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
              name="intention_name"
              value={intent.intention_name}
              onChange={onInputChange}
            />
            <div className="form-error">demasiado corto</div>
          </div>
          <div className="form-row">
            <button >Actualizar</button>
            <button onClick={() => props.setEdit(false)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
  
  export default EditIntentForm;