import React from 'react';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import GroupingToolbar from '../Components/GroupingToolbar';
import GroupingHead from '../Components/GroupingHead';
import { useQuery, gql, useMutation } from '@apollo/client';
import { NetworkStatus } from '@apollo/client';

const GET_USERQUESTIONS = gql`
  query getUserquestions {
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

type Intention = {
  intention_id: number,
  intention_name: string
}

type Userquestion = {
  userquestion_id: number,
  information: string,
  intention: Intention,
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

export default function GroupingIndex() {
  const classes = useStyles();
  const { loading, error, data, refetch, networkStatus } = useQuery(GET_USERQUESTIONS, { notifyOnNetworkStatusChange: true, });
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const onUpdateQuestions = () => {
    refetch();
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.userquestions.map((n: Userquestion) => n.userquestion_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, newId: number) => {
    const selectedIndex = selected.indexOf(newId);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, newId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  if (networkStatus === NetworkStatus.refetch) return <div>Actualizando Información</div>;
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error :(s</div>

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>

        <GroupingToolbar
          onUpdateQuestions={onUpdateQuestions}
          numSelected={selected.length}
          selected={selected}
        />

        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <GroupingHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={data.userquestions.length}
            />
            <TableBody>
              {data.userquestions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: Userquestion, index: number) => {
                  const isItemSelected = isSelected(row.userquestion_id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.userquestion_id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.userquestion_id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.information}
                      </TableCell>
                      <TableCell align="right">{row.intention.intention_name}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.userquestions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

    </div>
  );
}
