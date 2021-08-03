import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import ImageIcon from '@material-ui/icons/Image';
import SendIcon from '@material-ui/icons/Send';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useQuery, gql, useMutation } from '@apollo/client';
import EmailForm from '../Components/EmailForm';

const GET_INTENTIONS = gql`
  query getIntentions {
    intentions{
      intention_id
      intention_name
    }
  }
`;

const useRowStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
    input: {
      display: 'none',
    },
    button: {
      margin: theme.spacing(1),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

type Intention = {
  intention_id: number,
  intention_name: string
}

type Client = {
  client_id: number
  first_name: string
  last_name: string
  email: string
}

type Userquestion = {
  userquestion_id: number,
  information: string,
  intention: Intention,
  client: Client
}

interface IProps {
  userquestion: Userquestion
}

const QueryTable: React.FunctionComponent<IProps> = props => {
  const { loading, error, data } = useQuery(GET_INTENTIONS);
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const [selectedIntent, setSelectedIntent] = useState(props.userquestion.intention.intention_id);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedIntent(event.target.value as number);
    console.log(selectedIntent);
  };

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error :(s</div>

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {props.userquestion.information}
        </TableCell>
        <TableCell align="right">{props.userquestion.client.first_name + " " + props.userquestion.client.last_name}</TableCell>
        <TableCell align="right">{props.userquestion.client.email}</TableCell>
        <TableCell align="right">Fecha</TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>

            <EmailForm
              client={props.userquestion.client}
              intention={props.userquestion.intention}
              userquestion_id={props.userquestion.userquestion_id}
              question={props.userquestion.information}
            />

          </Collapse>
        </TableCell>

      </TableRow>

    </React.Fragment>
  );
}

export default QueryTable;