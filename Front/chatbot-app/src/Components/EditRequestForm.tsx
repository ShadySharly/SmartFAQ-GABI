import React, { useState} from 'react';
import { gql, useMutation } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { TextField } from '@material-ui/core';
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
  onUpdateRequest: () => void;
  onCancelUpdate: () => void;
}

const EditRequestForm: React.FunctionComponent<IProps> = props => {

  const classes = useStyles();
  const [updateRequest] = useMutation(UPDATE_REQUEST);
  const [request, setRequest] = useState(props.request);
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateRequest({ variables: { request_id: request.request_id, intention_id: props.intention.intention_id, information: request.information } })
    props.onUpdateRequest();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequest({ ...request, [name]: value });
  };

  return (
    <div className={classes.root}>
      <form onSubmit={onFormSubmit}>
        <TextField
          id="outlined-full-width"
          name="information"
          value={request.information}
          onChange={onInputChange}
          style={{ margin: 8 }}
          helperText="Ingrese un nuevo nombre"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />

        <Typography variant="caption">
          <IconButton aria-label="Aceptar" type="submit">
            <CheckCircleIcon fontSize="large" />
          </IconButton>
          <IconButton aria-label="Cancelar">
            <CancelIcon fontSize="large" onClick={() => { props.onCancelUpdate() }} />
          </IconButton>
        </Typography>


      </form>
    </div>

  );
}

export default EditRequestForm