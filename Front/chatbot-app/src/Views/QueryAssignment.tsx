import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, IconButton, MenuItem} from '@material-ui/core'
import { BiSend } from 'react-icons/bi';
import { useQuery, gql , useMutation} from '@apollo/client';
import 'react-dropdown/style.css';
import styled from 'styled-components';
import EmailForm from '../Components/EmailForm';

import {InputLabel} from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const StyledSelect = styled(Select)`
  min-width: 120px;
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
      client {
        client_id
        first_name
        last_name
        email
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

type IntentionsList = string[]

export default function QueryAssignment() {

  const classes = useStyles();
  const {loading, error, data } = useQuery(QUERY);
  const [updateUser] = useMutation(UPDATE_USER);
  const [dropdown, setDropdown] = useState(false);
  const dropdownIsOpen = () => setDropdown(!dropdown);
  const initialIntentions: IntentionsList = [];
  const [selectedIntentions, setSelectedIntentions] = useState(initialIntentions);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);
  const updateIntentions = (newIntention:string, index:number) => {
    const updatedSelectedIntentions = [...selectedIntentions];
    updatedSelectedIntentions[index] = newIntention;
    setSelectedIntentions(updatedSelectedIntentions);
  } 

  
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
          {data.userquestions.map((userquestion:Userquestion, id:number) => (
            <TableRow key={userquestion.userquestion_id}>
              <TableCell component="th" scope="row">{userquestion.information}</TableCell>
              <TableCell align="right">
                <InputLabel
                    disableAnimation={false}
                    htmlFor="searchCriteria"
                  >
                    {userquestion.intention.intention_name}
                  </InputLabel>      
                <StyledSelect id={id.toString()} value={selectedIntentions[id]} onChange={e => updateIntentions(e.target.value as string, id)}>
                  <MenuItem selected disabled value="">
                    <em>{userquestion.intention.intention_name}</em>
                  </MenuItem>
                  {data.intentions.map((intention:Intention) => (
                      <MenuItem value={intention.intention_id} >
                        {intention.intention_name}
                      </MenuItem>
                    ))}
                </StyledSelect>       
              </TableCell>

              <TableCell>

                <EmailForm
                    client={userquestion.client}
                    intention={userquestion.intention}
                    question={userquestion.information}
                />

              </TableCell>

              <TableCell align="right">
                <IconButton onClick={()=>updateUser({ variables: {userquestion_id:userquestion.userquestion_id ,intention_id:selectedIntentions[id]}})}>
                  <BiSend/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}