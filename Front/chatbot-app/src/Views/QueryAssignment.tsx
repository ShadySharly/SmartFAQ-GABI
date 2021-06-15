import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core'
import { BiSend } from 'react-icons/bi';
import { useQuery, gql } from '@apollo/client';
import Select from "react-dropdown-select";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


const INTENTIONS = gql`
  query consulta {
    intentions{
      intention_name
    }
  }
`;
type Intention = {
  intention_id: number,
  intention_name: string
}

const rows = [
  {query:'consulta',userquestion_id:'1',information:'¿Como puedo derivar?'},
  {query:'consulta',userquestion_id:'2',information:'¿Como puedo multiplicar matrices?'},
  {query:'consulta',userquestion_id:'3',information:'¿Como puedo multiplicar matrices?'},
];

interface IntentionVars {
  intention_name: string;
}
export default function QueryAssignment() {
  const classes = useStyles();
  const {loading, error, data } = useQuery(INTENTIONS);
  const [dropdown, setDropdown] = useState(false);
  const dropdownIsOpen = () => setDropdown(!dropdown);
  var intencionElegida:any  = null
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return(
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
              <TableCell component="th" scope="row">{row.query}</TableCell>
              <TableCell align="right">{row.query}
                <select name="intentionSelection" onChange={intencionElegida}>
                  {data.intentions.map((intention:Intention) => (
                    <option key={intention.intention_id} value={intention.intention_name}>
                      {intention.intention_name}
                    </option>
                  ))}
                </select>       
              </TableCell>
              <TableCell align="right"> <BiSend/> </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}