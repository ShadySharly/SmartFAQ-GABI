import React from "react";
import { IIntent } from '../Models/Intent';

interface IProps {
  intents: Array<IIntent>;
  onEdit: (intent: IIntent) => void;
  onDelete: (intent: IIntent) => void;
}

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
              <tr key={i.id}>
                <td>{i["name"]}</td>
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
