import React, { useState } from "react";
import { IBaseIntent } from '../Models/Intent';
import { gql, useMutation } from '@apollo/client';
import styled from "styled-components";

const ADD_REQUEST = gql`
  mutation addRequest($intention_id: Int!, $information: String!) {
    createRequest(intention_id: $intention_id, information: $information)
  }
`;

type Request = { request_id: number, intention_id: number, information: string }

interface IProps {
  intentId: number;
}

const defaultRequest: Request = { request_id: -1, intention_id: -1, information: "" }

const AddRequestForm: React.FunctionComponent<IProps> = props => {
  const [addRequest] = useMutation(ADD_REQUEST);
  const [formValue, setFormValue] = useState(defaultRequest);
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addRequest({ variables: { intention_id: props.intentId, information: formValue.information } })
    setFormValue(defaultRequest)
    return false;
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  return (
    <form onSubmit={onFormSubmit}>
      <input
        type="text"
        name="information"
        value={formValue.information}
        onChange={onInputChange}
      />
    </form>
  );

}

export default AddRequestForm