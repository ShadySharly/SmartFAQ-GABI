import {BiSend} from "react-icons/bi";
import IconButton from '@material-ui/core/IconButton';


export default function SendButton() {
  return (
      <IconButton aria-label="send">
        <BiSend />
      </IconButton>
  );
}