import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import EditRequestForm from './EditRequestForm';
import AddRequestForm from './AddRequestForm';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.primary,
    },
    icon: {
      verticalAlign: 'bottom',
      height: 20,
      width: 20,
    },
    details: {
      alignItems: 'center',
    },
    column: {
      flexBasis: '33.33%',
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    button: {
      margin: theme.spacing(1),
    },
    margin: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }),
);

const REQUESTS_BY_INTENT = gql`
  query getRequests ($intention_id: Int!) {
    requestByIntent (intention_id: $intention_id) {
      request_id
      information
    }
  }
`;

const DELETE_REQUEST = gql`
  mutation deleteRequest($request_id: Int!) {
    removeRequest(request_id: $request_id)
  }
`;



type Request = { request_id: number, information: string }
type Intention = { intention_id: number, intention_name: string }
interface IProps {
  intent: Intention
}

const FaqTable: React.FunctionComponent<IProps> = props => {
  const classes = useStyles();
  const [deleteRequest] = useMutation(DELETE_REQUEST)
  const { loading, error, data } = useQuery(REQUESTS_BY_INTENT, {
    variables: { intention_id: props.intent.intention_id }, pollInterval: 500,
  });

  const onDeleteRequest = (currentRequest: Request) => {
    deleteRequest({ variables: { request_id: currentRequest.request_id } })
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;

  return (
    <div className={classes.root}>

      {data.requestByIntent.length > 0 ? (
        data.requestByIntent.map((r: Request) => (
          <AccordionDetails className={classes.details}>
            <div className={classes.column} />
            <div className={classes.column}>
              {r.information}
            </div>
            <div className={clsx(classes.column, classes.helper)}>
              <Typography variant="caption">
                  <IconButton aria-label="edit" className={classes.margin}>
                    <EditIcon fontSize="large" />
                  </IconButton>
                  <IconButton aria-label="delete" className={classes.margin}>
                    <DeleteIcon fontSize="large" onClick={() => { onDeleteRequest(r) }}/>
                  </IconButton>
              </Typography>
            </div>
          </AccordionDetails>
        ))
      ) : (
        <tr>
          <td colSpan={3}>No hay Preguntas Frecuentes aún</td>
        </tr>
      )}
    </div>
  )
}

export default FaqTable;