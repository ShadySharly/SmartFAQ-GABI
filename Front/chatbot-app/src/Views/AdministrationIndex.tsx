import React, { useState } from 'react';
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

const GET_CLIENTS = gql`
  query getClients {
    clients {
      client_id,
      first_name,
      last_name,
      email,
      duty_id
    }
  }
`;

type Client = {
  client_id: number,
  first_name: string,
  last_name: string,
  email: string,
  duty_id: number
}

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
  }),
);
function AdministrationIndex() {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_CLIENTS);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  if (loading) return <p>loading...</p>;
  if (error) return <p>ERROR</p>;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table aria-label="collapsible table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Correo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.clients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((c: Client) => (
                  <TableRow className={classes.root}>
                    <TableCell component="th" scope="row">
                      {c.first_name + c.last_name}
                    </TableCell>
                    <TableCell align="right">
                      {c.email}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.clients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  )
}

export default AdministrationIndex;