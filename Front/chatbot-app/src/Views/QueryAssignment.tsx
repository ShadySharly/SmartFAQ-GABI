import { makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core'
import { BiSend } from 'react-icons/bi';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

/*
const results = []
const rowsExample = results.map(result => {
  return {query:result.query ,intention: result.intention, answer: result.answer 'respuesta',send:'' }
})
*/
const rows = [
  {query:'consulta',intention: 'intencion',answer: 'respuesta',send:'' },
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