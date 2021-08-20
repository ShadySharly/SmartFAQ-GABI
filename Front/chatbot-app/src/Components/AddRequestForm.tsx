import React, { useState } from "react";
import { IBaseIntent } from '../Models/Intent';
import { gql, useMutation } from '@apollo/client';
import styled from "styled-components";
import { TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '25ch',
    },
  }),
);

const ADD_REQUEST = gql`
  mutation addRequest($intention_id: Int!, $information: String!) {
    createRequest(intention_id: $intention_id, information: $information)
  }
`;

type Request = { request_id: number, intention_id: number, information: string }

interface IProps {
  intentId: number;
  onAddRequest: (request: Request) => void;
}

const defaultRequest: Request = { request_id: -1, intention_id: -1, information: "" }

const AddRequestForm: React.FunctionComponent<IProps> = props => {
  const classes = useStyles();
  const [addRequest] = useMutation(ADD_REQUEST);
  const [formValue, setFormValue] = useState(defaultRequest);
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addRequest({ variables: { intention_id: props.intentId, information: formValue.information } })
    props.onAddRequest(formValue);
    setFormValue(defaultRequest)
    return false;
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  return (
    <div className={classes.root}>
      <form onSubmit={onFormSubmit} >
        <TextField
          id="standard-full-width"
          name="information"
          value={formValue.information}
          onChange={onInputChange}
          style={{ margin: 8 }}
          placeholder="Placeholder"
          helperText="Ingrese nueva variante para la intención"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Typography variant="caption">
          <IconButton aria-label="Aceptar" type="submit">
            <SaveIcon fontSize="large" />
          </IconButton>
        </Typography>
      </form>
    </div>
  );

}

export default AddRequestForm