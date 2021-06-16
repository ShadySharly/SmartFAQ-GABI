import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core'
import { BiSend } from 'react-icons/bi';
import { useQuery, gql , useMutation} from '@apollo/client';

import Select from "react-dropdown-select";
import 'react-dropdown/style.css';

import SendButton from "../Components/SendButton";



const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});



const QUERY = gql`
  query consulta {
    intentions{
      intention_id
      intention_name
    }
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


const UPDATE_USER = gql`
  mutation update($userquestion_id: Int!, $intention_id: Int!) {
    updateUserquestion(userquestion_id: $userquestion_id, intention_id: $intention_id )
  }
`;

type Intention = {
  intention_id: number,
  intention_name: string
}

type Userquestion = {
  userquestion_id: number,
  information: string,
  intention: Intention
}


export default function QueryAssignment() {

  const classes = useStyles();
  const {loading, error, data } = useQuery(QUERY);
  const [updateUser] = useMutation(UPDATE_USER);
  const [dropdown, setDropdown] = useState(false);
  const [newIntention, setNewIntention] = useState(0);
  const dropdownIsOpen = () => setDropdown(!dropdown);
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
          {data.userquestions.map((userquestion:Userquestion) => (
            <TableRow key={userquestion.userquestion_id}>
              <TableCell component="th" scope="row">{userquestion.information}</TableCell>
              <TableCell align="right">{userquestion.userquestion_id}
                <select name="intentionSelection"  onChange={e => setNewIntention(+e.target.value)}>
                  {data.intentions.map((intention:Intention) => (
                    <option value={intention.intention_id} >
                      {intention.intention_name}
                    </option>
                  ))}
                </select>       
              </TableCell>
              <TableCell align="right">
                {newIntention}
                <button onClick={()=>updateUser({ variables: {userquestion_id:userquestion.userquestion_id ,intention_id:newIntention}})}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}