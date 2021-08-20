import {AiFillQuestionCircle, AiOutlineUser } from "react-icons/ai";
import { BsFillGearFill } from "react-icons/bs";
import { RiMailDownloadFill } from "react-icons/ri";
import { FaLayerGroup } from "react-icons/fa";
import {RiQuestionAnswerFill} from "react-icons/ri";
import { SidebarItem } from "../Models/SidebarItem";
import SettingsIcon from '@material-ui/icons/Settings';

export const SidebarDataScientist: SidebarItem[] = [
    {
        title: 'Administración de Intenciones',
        path: '/intentindex',
        icon: < BsFillGearFill style={{fill:"#043C8B"}}/>,
    },
    {
        title: 'FAQs',
        path: '/faqindex',
        icon: < AiFillQuestionCircle style={{fill:"#043C8B"}}/>,
    },
    {
        title: 'Agrupacion de Consultas',
        path: '/groupintention',
        icon: < FaLayerGroup style={{fill:"#043C8B"}}/>,
    },
    {
        title: 'Administración de Usuarios',
        path: '/adminindex',
        icon: < AiOutlineUser style={{fill:"#043C8B"}}/>,
    },
    {
        title: 'Ajustes',
        path: '/settingindex',
        icon: < SettingsIcon style={{fill:"#043C8B"}}/>,
    },
];