import React from "react";
import { IIntent } from '../Models/Intent';
import { gql, useMutation } from '@apollo/client';

/*
const DELETE_INTENT = gql`
    mutation removeIntent($intention_id: Int!) {
      removeIntention(intention_id: $intention_id)
    }
`;
*/
//  deleteIntention({ variables: { intention_id: i.intention_id} });

type Intention = { intention_id: number, intention_name: string }

interface IProps {
  intents: Array<Intention>;
  onEdit: (intent: Intention) => void;
  onDelete: (intent: Intention) => void;
}
//const [deleteIntention] = useMutation(DELETE_INTENT);
const IntentTable: React.FunctionComponent<IProps> = props => {
  return (
    <div className="intent-table">
      <h1>Vista de Intenciones</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {props.intents.length > 0 ? (
            props.intents.map(i => (
              <tr key={i.intention_id}>
                <td>{i["intention_name"]}</td>
                <td>
                  <button onClick={() => props.onEdit(i)}>Editar</button>
                  <button onClick={() => props.onDelete(i)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No hay intenciones</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default IntentTable;
