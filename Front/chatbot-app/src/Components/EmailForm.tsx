import React, { useState } from 'react';
import * as emailjs from "emailjs-com";
import { useQuery, gql, useMutation } from '@apollo/client';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ImageIcon from '@material-ui/icons/Image';
import SendIcon from '@material-ui/icons/Send';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';

// Credenciales de Emailjs
const SERVICE_ID = "email_gabi"
const TEMPLATE_ID = "template_gabi"
const USER_ID = "user_ZzvYX0zvfN8BLkNencRPB"
const GABI_EMAIL = "smartfaq.gabi@gmail.com"

const useRowStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
    input: {
      display: 'none',
    },
    button: {
      margin: theme.spacing(1),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

type Client = {
  client_id: number
  first_name: string
  last_name: string
  email: string
}

type Intention = {
  intention_id: number,
  intention_name: string
}
interface IProps {
  client: Client;
  intention: Intention;
  userquestion_id: number;
  question: string;
}

const GET_INTENTIONS = gql`
  query getIntentions {
    intentionsOfRequest{
      intention_id
      intention_name
    }
  }
`;

const UPDATE_USERQUESTION = gql`
  mutation updateUserQuestion ($userquestion_id: Int!, $intention_id: Int!, $response: String!) {
    updateUserquestion (userquestion_id: $userquestion_id, intention_id: $intention_id, response: $response)
  }
`;

const EmailForm: React.FunctionComponent<IProps> = props => {
  const classes = useRowStyles();
  const [answer, setAnswer] = React.useState("");
  const [editQuestion] = useMutation(UPDATE_USERQUESTION);
  const { loading, error, data } = useQuery(GET_INTENTIONS);
  const [editing, setEdit] = useState(false);

  const [selectedIntent, setSelectedIntent] = useState(props.intention.intention_id);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedIntent(event.target.value as number);
    console.log(selectedIntent);
  };

  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    editQuestion({
      variables: {
        userquestion_id: props.userquestion_id,
        intention_id: selectedIntent,
        response: answer
      }
    })

    var info = {
      to_email: props.client.email,
      to_first_name: props.client.first_name,
      to_last_name: props.client.last_name,
      from_name: 'GABI',
      mentor_name: 'Mentor X',
      question: props.question,
      message: answer,
      reply_to: GABI_EMAIL
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, info, USER_ID).then(
      function (response) {
        console.log(response.status, response.text);
      },
      function (err) {
        console.log(err);
      }
    );
    setAnswer("");
    return false;
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error :(s</div>

  return (
    <React.Fragment>
      <Box margin={1}>
        <form className={classes.root} noValidate autoComplete="off" onSubmit={onFormSubmit}>
          <div>
            <TextField
              id="filled-multiline-static"
              label="Ingrese su respuesta"
              onChange={(event) => setAnswer(event.target.value)}
              multiline
              rows={6}
              rowsMax={10}
              defaultValue=""
              variant="filled"
              fullWidth={true}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            size="small"
            color="secondary"
            className={classes.button}
            endIcon={<SendIcon />}
          >
            Enviar Respuesta
          </Button>

          <input accept="image/*" className={classes.input} id="icon-button-file" type="file" />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <ImageIcon fontSize="large" />
            </IconButton>
          </label>

          <FormControl className={classes.formControl}>
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
          </FormControl>

        </form>
      </Box>
    </React.Fragment>
  );
}

export default EmailForm;