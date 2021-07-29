import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FaqTable from '../Components/FaqTable';
import styled from 'styled-components';


const StyledDiv = styled.div`
  padding: 20px;
  span{
    color: #EA7600;
    font-size:30px;
  };
  .Faq {
    margin-top:20px;
  }
`

const INTENTIONS = gql`
  query consulta {
    intentions{
      intention_id
      intention_name
    }
  },
`;

type Intention = { intention_id: number, intention_name: string }

function FaqIndex() {
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
      <div className="Faq">
        {data.intentions.length > 0 ? (
          data.intentions.map((i: Intention) => (
            <Accordion expanded={expanded === i.intention_name} onChange={handleChange(i.intention_name)} TransitionProps={{ unmountOnExit: true }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <div>
                  <Typography>{i.intention_name}</Typography>
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
