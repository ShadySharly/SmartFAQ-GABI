import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import { useQuery, gql, useMutation } from '@apollo/client';
import QueryTable from '../Components/QueryTable';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  customTableContainer: {
    overflowX: "initial"
  }
}),
);
const GET_USERQUESTIONS = gql`
  query getUserquestions ($intention_id: Int!) {
    userquestionByIntent (intention_id: $intention_id) {
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
  const { loading, error, data } = useQuery(GET_USERQUESTIONS, {
    variables: {
      intention_id: 0
    },
    pollInterval: 500
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error :(s</div>

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer classes={{ root: classes.customTableContainer }}>
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
              {data.userquestionByIntent
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((u: Userquestion) => (
                  <QueryTable userquestion={u} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.userquestionByIntent.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
