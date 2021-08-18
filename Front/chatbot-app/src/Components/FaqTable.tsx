import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { RiDeleteBin6Fill, RiEdit2Line } from 'react-icons/ri';
import styled from 'styled-components';
import AddRequestForm from './AddRequestForm';
import EditRequestForm from './EditRequestForm';

const StyledDiv = styled.div`
  .MuiAccordionDetails-root{
    display:block;
    text-align:left;
  };
  .Icons{
    align-items:left;
  };
`

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

const defaultRequest: Request = { request_id: -1, information: "" };

interface IProps {
  intent: Intention
}

const FaqTable: React.FunctionComponent<IProps> = props => {
  const [deleteRequest] = useMutation(DELETE_REQUEST)
  const [editRequest, setEditRequest] = useState(defaultRequest);
  const { loading, error, data } = useQuery(REQUESTS_BY_INTENT, {
    variables: { intention_id: props.intent.intention_id }, pollInterval: 500,
  });

  const onAddRequest = (newRequest: Request) => {
    console.log(newRequest);
  }

  const onDeleteRequest = (currentRequest: Request) => {
    deleteRequest({ variables: { request_id: currentRequest.request_id } })
  }

  const onCurrentRequest = (request: Request) => {
    setEditRequest(request);
  }

  const onUpdateRequest = () => {
    setEditRequest(defaultRequest);
  }

  const onCancelUpdate = () => {
    setEditRequest(defaultRequest);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;

  return (
    <StyledDiv >

      <AddRequestForm
        intentId={props.intent.intention_id}
        onAddRequest={onAddRequest}
      />

      {data.requestByIntent.length > 0 ? (
        data.requestByIntent.map((r: Request) => (
          <AccordionDetails>

            {editRequest.request_id === r.request_id ? (
              <EditRequestForm
                intention={props.intent}
                request={editRequest}
                onUpdateRequest={onUpdateRequest}
                onCancelUpdate={onCancelUpdate}
              />
            ) : (
              <div>
                <div className="Faq">
                  {r.information}
                </div>
                <div className="Icons">

                  <Typography variant="caption">
                    <IconButton aria-label="edit">
                      <RiEdit2Line style={{ fill: "#043C8B", fontSize: "20px" }} onClick={() => { onCurrentRequest(r) }} />
                    </IconButton>
                    <IconButton aria-label="delete">
                      <RiDeleteBin6Fill style={{ fontSize: "20px" }} onClick={() => { onDeleteRequest(r) }} />
                    </IconButton>
                  </Typography>

                </div>
              </div>
            )}
          </AccordionDetails>
        ))
      ) : (
        <tr>
          <td colSpan={3}>No hay Preguntas Frecuentes aún</td>
        </tr>
      )}

    </StyledDiv >
  )
}

export default FaqTable;