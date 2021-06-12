import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { QueryAssignmentData } from '../Components/QueryAssignmentData';
import { BiSend } from 'react-icons/bi';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


const rows = [
  QueryAssignmentData('consulta', 'intencion', 'respuesta', 1),
];

export default function QueryAssignment() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Sentencia</TableCell>
            <TableCell align="right">Intencion</TableCell>
            <TableCell align="right">Respuesta</TableCell>
            <TableCell align="right">Enviar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.query}>
              <TableCell component="th" scope="row">
                {row.query}
              </TableCell>
              <TableCell align="right">{row.intention}</TableCell>
              <TableCell align="right">{row.answer}</TableCell>
              <TableCell align="right"> <BiSend/> </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}