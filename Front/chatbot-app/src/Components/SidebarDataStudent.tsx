import {AiFillQuestionCircle, AiOutlineUser } from "react-icons/ai";
import { BsFillGearFill } from "react-icons/bs";
import { RiMailDownloadFill } from "react-icons/ri";
import { FaLayerGroup } from "react-icons/fa";
import {RiQuestionAnswerFill} from "react-icons/ri";
import { SidebarItem } from "../Models/SidebarItem";
import SettingsIcon from '@material-ui/icons/Settings';

export const SidebarDataStudent: SidebarItem[] = [
    {
        title: 'Preguntas Generales',
        path: '/generalFAQ',
        icon: < RiQuestionAnswerFill style={{fill:"#043C8B"}}/>,
    },

];