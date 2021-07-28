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
import FaqTable from '../Components/FaqTable';
import styled from 'styled-components';

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

const StyledDiv = styled.div`
  padding: 20px;
  span{
    color: #EA7600;
    font-size:18px;
  };
`

const INTENTIONS = gql`
  query consulta {
    intentions{
      intention_id
      intention_name
    }
  }
`;

type Intention = { intention_id: number, intention_name: string }

function FaqIndex() {
  const classes = useStyles();
  const { loading, error, data } = useQuery(INTENTIONS);
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };



  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <StyledDiv>
      <span>Preguntas Frecuentes</span>
      <div className={classes.root}>
        {data.intentions.length > 0 ? (
          data.intentions.map((i: Intention) => (
            <Accordion expanded={expanded === i.intention_name} onChange={handleChange(i.intention_name)} TransitionProps={{ unmountOnExit: true }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <div className={classes.column}>
                  <Typography className={classes.heading}>{i.intention_name}</Typography>
                </div>
                <div className={classes.column}>
                  <Typography className={classes.secondaryHeading}>Preguntas asociadas</Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <FaqTable intent={i} />
                </Typography>
              </AccordionDetails>
            </Accordion>

          ))
        ) : (
          <tr>
            <td colSpan={3}>No hay intenciones</td>
          </tr>
        )}
      </div>
    </StyledDiv>
  );
}

export default FaqIndex;
