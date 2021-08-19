import { useQuery, gql, useMutation } from '@apollo/client';
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
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
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import Divider from '@material-ui/core/Divider';

const StyledDiv = styled.div`
  padding:20px;
  span.page-title{
      color: #EA7600;
      font-size: 30px;
      padding-bottom:10px;
  };
  .intent-flex-wrapper {
      margin-top:20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
  };
  .intent-form{
      margin-top:20px;
      margin-left:20px;
  };
  .intent-table {
      flex: 1;
      width: 50%;
      margin-top:20px;
      margin-left:200px;
  };
  .user-form{
      margin-top:20px;
      margin-left:20px;
      span{
          font-size:30px;
          font-weight:bold;
      }
  };
  .form-row {
      margin-bottom: 10px;
      margin-top:10px;
      span{
          font-weight:bold;
      };
      label{
          font-weight:bold;
      };
  };
  .form-error {
      color: red;
      font-size: 14px;
      line-height: 26px;
  }
`

const StyledForm = styled.div`
  color: #394049;
  background-color: #D9D9D9;
  margin-top: 8px;
  margin-left: 12px;
  margin-right: 12px;
  border-radius: 10px;
`


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
      flexGrow: 1,
      maxWidth: 752,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
  }),
);

const GET_CHATBOT = gql`
  query getChatbot {
    chatbot {
      chatbot_id,
      training_date,
      confidence,
      chatbot_version
    }
  }
`;

const EDIT_CHATBOT = gql`
  mutation editChatbot ($confidence: Int!) {
    updateChatbot (confidence: $confidence)
  }
`;

function SettingIndex() {
  const classes = useStyles();
  const [selectedConfidence, setSelectedConfidence] = useState(1);
  const { loading, error, data } = useQuery(GET_CHATBOT, {
    onCompleted(data) {
      setSelectedConfidence(data.chatbot.confidence);
    },
    pollInterval: 500
  });
  const [editChatbot] = useMutation(EDIT_CHATBOT);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedConfidence(event.target.value as number);
  };

  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(typeof(selectedConfidence));
    var newConfidence = +selectedConfidence;

    editChatbot({
      variables: {
        confidence: newConfidence
      }
    })
  }

  if (loading) return <p>loading...</p>;
  if (error) return <p>ERROR</p>;

  return (
    <StyledDiv>
      <span className="page-title">Ajustes</span>
      <StyledForm>
        <div className="intent-flex-wrapper">
          <form className={classes.root} noValidate autoComplete="off" onSubmit={onFormSubmit}>

            <List>
              <ListItem>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Ultima fecha de entrenamiento"
                  secondary={data.chatbot.training_date}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Indice de Confianza"
                />

              </ListItem>

              <ListItem>
                <TextField
                  id="filled-number"
                  type="number"
                  value={selectedConfidence}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: 0,
                    max: 100,
                    step: 1
                  }}
                  onChange={handleChange}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Versión utilizada"
                  secondary={data.chatbot.chatbot_version}
                />
              </ListItem>

              <Divider />

              <ListItem>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  color="primary"
                  endIcon={<SaveIcon />}
                >
                  Guardar
                </Button>
              </ListItem>

            </List>
          </form>
        </div>
      </StyledForm>
    </StyledDiv >
  );
}

export default SettingIndex;