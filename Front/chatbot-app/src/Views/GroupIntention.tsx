import { IIntent } from '../Models/Intent';
import { gql, useQuery, useMutation } from '@apollo/client';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, IconButton, MenuItem} from '@material-ui/core'
import styled from "styled-components";


type Intention = { intention_id: number, intention_name: string }

const INTENTIONS = gql`
  query consulta {
    intentions{
      intention_id
      intention_name
    }
  }
`;

const StyledDiv = styled.div `
    padding: 20px;
    span{
        color: #EA7600;
        margin-bottom:20px;
        font-size:30px; 
    };
    .MuiPaper-root{
        margin-top:20px;
    };
    .MuiTableHead-root .MuiTableCell-root{
        font-size:20px;
        background-color:#394049;
        color: white;
    }
`

function GroupIntention() {
    const { loading, error, data } = useQuery(INTENTIONS);
    return (
    <StyledDiv>
        <span>Agrupar intenciones</span>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"></TableCell>
                            <TableCell align="left">Intencion</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((i: Intention) => (
                                <TableRow key={i.intention_id}>
                                    <TableCell>{i["intention_name"]}</TableCell>
                                </TableRow>
                            ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>No hay intenciones</td>
                                </tr>
                            )};
                    </TableBody>
            </Table>
        </TableContainer>
    </StyledDiv>
    );
};
export default GroupIntention;
