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

/*
interface Consultas{
  userquestion_id:number;
  information:string;
  intention:Intentions[];
}
*/

//
//type Consulta = {userquestion_id:number,information:string,intention:Intention};

const INTENTIONS = gql`
  query consulta {
    intentions{
      intention_name
    }
  }
`;

const USERQUESTIONS = gql`
  query consulta {
    userquestions{
      userquestion_id
      information
      intention{
        intention_id
        intention_name
      }
    }
  }
`;


/*
interface Intention{
  intention_name: string;
};
*/
/*
const intentions = [
  {query:'consulta',userquestion_id:'1',information:'¿Como puedo derivar?',intention:null},
  {query:'consulta',userquestion_id:'2',information:'¿Como puedo multiplicar matrices?',intention:null},
  {query:'consulta',userquestion_id:'3',information:'¿Como puedo multiplicar matrices?',intention:null},
];
*/


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
  const {loading, error, data } = useQuery<IntentionVars>(INTENTIONS);
  const [dropdown, setDropdown] = useState(false);
  const dropdownIsOpen = () => setDropdown(!dropdown);
  const IntentionVars = data
  
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
                <Dropdown options={intentionList} onChange={dropdownIsOpen} value={''} placeholder="Select an option" />;
              </TableCell>
              <TableCell align="right"> <BiSend/> </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}