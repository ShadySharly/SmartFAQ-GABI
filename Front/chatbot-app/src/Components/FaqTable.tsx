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
      color: theme.palette.text.secondary,
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
  }),
);

const REQUESTS_BY_INTENT = gql`
  query getRequests ($intention_id: Int!) {
    requestByIntent (intention_id: $intention_id) {
      request_id
      intention_id
      information
    }
  }
`;

interface IProps {
  intent: Intention
}

type Intention = { intention_id: number, intention_name: string }

const FaqTable: React.FunctionComponent<IProps> = props => {
  const classes = useStyles();

  const { loading, error, data } = useQuery(REQUESTS_BY_INTENT , {
    variables: { intention_id: props.intent.intention_id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
  return (
    <div>
      <AccordionDetails className={classes.details}>
        <div className={classes.column} />
        <div className={classes.column}>
          <Chip label="Pregunta" onDelete={() => { }} />
        </div>
        <div className={clsx(classes.column, classes.helper)}>
          <Typography variant="caption">
            Select your destination of choice
            <br />
            <a href="#secondary-heading-and-columns" className={classes.link}>
              Learn more
            </a>
          </Typography>
        </div>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button size="small">Cancel</Button>
        <Button size="small" color="primary">
          Save
        </Button>
      </AccordionActions>
    </div>
  )
}

export default FaqTable;