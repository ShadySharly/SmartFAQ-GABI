import React, { useState, useEffect } from 'react';
import { IBaseIntent, IIntent } from '../Models/Intent';
import { gql, useMutation } from '@apollo/client';
import styled from 'styled-components';

const UPDATE_REQUEST = gql`
  mutation editRequest ($request_id: Int!, $intention_id: Int!, $information: String!) {
    updateRequest(request_id: $request_id, intention_id: $intention_id, information: $information)
  }
`;
type Intention = { intention_id: number, intention_name: string }
type Request = { request_id: number, information: string }

interface IProps {
  intention: Intention;
  request: Request;
}

const EditRequestForm: React.FunctionComponent<IProps> = props => {

  const [updateRequest] = useMutation(UPDATE_REQUEST);
  const [request, setRequest] = useState(props.request);
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateRequest({variables: { request_id: request.request_id, intention_id: props.intention.intention_id, information: request.information}})
    return false;
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequest({ ...request, [name]: value });
  };

  return (
    <form onSubmit={onFormSubmit}>
      <input
        type="text"
        name="information"
        value={request.information}
        onChange={onInputChange}
      />
    </form>

  );

}

export default EditRequestForm