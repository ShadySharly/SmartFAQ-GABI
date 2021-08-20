
import React, { useState, useEffect } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {  gql, useMutation } from '@apollo/client';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SaveIcon from '@material-ui/icons/Save';
import Select from '@material-ui/core/Select';




const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
);

const DELETE_CLIENT = gql`
  mutation deleteClient ($client_id: Int!) {
    removeClient (client_id: $client_id)
  }
`;

const EDIT_CLIENT = gql`
  mutation editClient ($client_id: Int!, $duty_id: Int!) {
    updateClient (client_id: $client_id, duty_id: $duty_id)
  }
`;

type Duty = {
  duty_id: number,
  duty_name: string
}

const duties: Duty[] = [
  {
    duty_id: 1,
    duty_name: 'Alumno'
  },
  {
    duty_id: 2,
    duty_name: 'Mentor'
  },
  {
    duty_id: 3,
    duty_name: 'Cientista'
  }
]

interface IProps {
  client_id: number;
  client_name: string;
  client_email: string;
  duty_id: number;
}

const AdministrationForm: React.FunctionComponent<IProps> = props => {
  const classes = useStyles();
  const [deleteClient] = useMutation(DELETE_CLIENT);
  const [editClient] = useMutation(EDIT_CLIENT);
  const [selectedDuty, setSelectedDuty] = useState(props.duty_id);
  const [editing, setEdit] = useState(false);

  useEffect(() => {
    if (props.duty_id !== selectedDuty)
      setEdit(true);
    else
      setEdit(false);
  }, [props.duty_id, selectedDuty]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedDuty(event.target.value as number);
  };

  const onDeleteClient = () => {
    deleteClient({
      variables: {
        client_id: props.client_id
      }
    })
  }

  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    editClient({
      variables: {
        client_id: props.client_id,
        duty_id: selectedDuty
      }
    })
  }

  return (
    <TableRow className={classes.root}>
      <TableCell component="th" scope="row">
        {props.client_name}
      </TableCell>
      <TableCell align="right">
        {props.client_email}
      </TableCell>
      <TableCell align="right">
        <form className={classes.root} noValidate autoComplete="off" onSubmit={onFormSubmit}>

          <FormControl className={classes.formControl}>
            <Select
              value={selectedDuty}
              onChange={handleChange}
              displayEmpty
              className={classes.selectEmpty}
            >
              {duties.map((duty) => (
                <MenuItem value={duty.duty_id}>
                  {duty.duty_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton aria-label="Aceptar" type="submit" disabled={editing ? (false) : (true)}>
            <SaveIcon fontSize="large" />
          </IconButton>

        </form>
      </TableCell>

      <TableCell align="right">
        <IconButton color="primary" aria-label="upload picture" component="span">
          <HighlightOffIcon fontSize="large" onClick={() => { onDeleteClient() }} />
        </IconButton>
      </TableCell>

    </TableRow>
  )
}

export default AdministrationForm;