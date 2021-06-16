import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core'
import { BiSend } from 'react-icons/bi';
import { useQuery, gql } from '@apollo/client';
import { useMutation } from '@apollo/react-hooks';
import Select from "react-dropdown-select";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import styled from 'styled-components';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const ButtonIcon = styled(Link)`
  display:flex;
  jusfity-content: flex-start;
  align-items: center;
  height: 3rem;
  font-size: 2rem;
  margin-left: 2rem;
`

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
  mutation consulta {
    updateUserquestion($userquestion_id: Int!, $intention_id: Int!)
  }
`

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
  const dropdownIsOpen = () => setDropdown(!dropdown);

  //updateUser({ variables: {userquestion_id:this.userquestion_id ,intention_id:this.intention_id}});

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
          {data.userquestions.map((userquestion:Userquestion) => (
            <TableRow key={userquestion.userquestion_id}>
              <TableCell component="th" scope="row">{userquestion.information}</TableCell>
              <TableCell align="right">{userquestion.userquestion_id}
                <select name="intentionSelection" onChange={intencionElegida}>
                  {data.intentions.map((intention:Intention) => (
                    <option key={intention.intention_id} value={intention.intention_name}>
                      {intention.intention_name}
                    </option>
                  ))}
                </select>       
              </TableCell>
              <TableCell align="right">
                <Butt>
                  <BiSend/> 
              </TableCell>
            </TableRow>
            
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}