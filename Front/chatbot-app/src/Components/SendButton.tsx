import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {BiSend} from "react-icons/bi";
import IconButton from '@material-ui/core/IconButton';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

export default function SendButton() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <IconButton aria-label="send">
        <BiSend />
      </IconButton>
    </div>
  );
}