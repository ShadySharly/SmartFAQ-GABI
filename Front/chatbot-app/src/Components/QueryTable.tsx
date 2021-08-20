import React, { useState } from 'react';
import Collapse from '@material-ui/core/Collapse';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import EmailForm from '../Components/EmailForm';

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
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

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