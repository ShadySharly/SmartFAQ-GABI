
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import React, { useRef, useLayoutEffect } from 'react';
// @ts-ignore
import RasaWebchat from 'rasa-webchat';



function CustomWidget (){
  sessionStorage.clear();
  return (
    <RasaWebchat
    ///login @userID @chatbotID
    initPayload= {'/login @1 @1'}
    socketUrl={"http://localhost:5005"}
    socketPath={"/socket.io/"}
    title={"GABI - General"}
    inputTextFieldHint={"Escribe un mensaje"}
    embedded={true}
    customData= {{ language: "en"}}
    showFullScreenButton={true}
    displayUnreadCount={true}
    connectOn={"mount"}
    showMessageDate={true}
    params = {{
      storage: "session"
    }}
    />
  )
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardUsers: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

const users = [
  {
    title: 'Alumno',
  },
  {
    title: 'Mentor',
  },
  {
    title: 'Cientista de datos',
  },
];

export default function Main() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            SmartFAQ-Gabi
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
      </Container>
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {users.map((user) => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={user.title} xs={12} md={4}>
              <Card>
                <CardContent>
                  <div className={classes.cardUsers}>
                    <Button variant="contained" color="primary">
                      {user.title}
                    </Button>                    
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <CustomWidget />
      </Container>
    </React.Fragment>
  );
}