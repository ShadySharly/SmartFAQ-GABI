import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useQuery, gql, useMutation } from '@apollo/client';
import QueryTable from '../Components/QueryTable';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles({
  customTableContainer: {
    overflowX: "initial"
  }
});

const GET_USERQUESTIONS = gql`
  query getUserquestions {
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

export default function QueryAssignment() {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_USERQUESTIONS);


  if (loading) return <div>Loading...</div>
  if (error) return <div>Error :(s</div>

  return (
    <TableContainer component={Paper} classes={{ root: classes.customTableContainer }}>
      <Table aria-label="collapsible table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Consulta</TableCell>
            <TableCell align="right">Autor</TableCell>
            <TableCell align="right">Correo</TableCell>
            <TableCell align="right">Fecha</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.userquestions.map((u: Userquestion) => (
            <QueryTable userquestion={u} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
