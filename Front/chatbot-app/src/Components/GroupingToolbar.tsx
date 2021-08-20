import React, { useState } from 'react';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useQuery, gql, useMutation } from '@apollo/client';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import BackupIcon from '@material-ui/icons/Backup';


const GET_INTENTIONS = gql`
  query getIntentions {
    intentionsOfRequest{
      intention_id
      intention_name
    }
  }
`;

const UPDATE_USERQUESTION = gql`
  mutation updateUserQuestion ($userquestion_id: Int!, $intention_id: Int!) {
    updateUserquestionByIntention (userquestion_id: $userquestion_id, intention_id: $intention_id)
  }
`;

type Intention = {
  intention_id: number,
  intention_name: string
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
    title: {
      flex: '1 1 100%',
    },
    input: {
      display: 'none',
    },
    button: {
      margin: theme.spacing(1),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

interface IProps {
  onUpdateQuestions: () => void;
  numSelected: number;
  selected: number[];
}

const GroupingToolbar: React.FunctionComponent<IProps> = props => {
  const classes = useToolbarStyles();
  const { loading, error, data } = useQuery(GET_INTENTIONS);
  const [editQuestion] = useMutation(UPDATE_USERQUESTION, {
    onCompleted() {
      props.onUpdateQuestions();
    }
  });
  const [selectedIntent, setSelectedIntent] = useState(-1);
  const { numSelected } = props;

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.selected.map((id: number) => (
      editQuestion({
        variables: {
          userquestion_id: id,
          intention_id: selectedIntent
        },
      })
    ))
  }

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedIntent(event.target.value as number);
    console.log(selectedIntent);
  };

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error :(s</div>

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} seleccionados
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Agrupación de Consultas
        </Typography>
      )}
      {numSelected > 0 ? (

        <form className={classes.root} noValidate autoComplete="off" onSubmit={onFormSubmit}>

          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">Intención</InputLabel>
            <Select
              value={selectedIntent}
              onChange={handleChange}
              displayEmpty
              className={classes.selectEmpty}
            >
              {data.intentionsOfRequest.map((i: Intention) => (

                <MenuItem value={i.intention_id}>
                  {i.intention_name}
                </MenuItem>

              ))}

            </Select>
            <Button
              type="submit"
              variant="contained"
              size="small"
              color="primary"
              className={classes.button}
              endIcon={<BackupIcon />}
            >
              Guardar
            </Button>
          </FormControl>

        </form>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default GroupingToolbar;