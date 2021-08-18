import {AiFillQuestionCircle, AiOutlineUser } from "react-icons/ai";
import { BiBook} from "react-icons/bi";
import { BsFillGearFill } from "react-icons/bs";
import { RiMailDownloadFill } from "react-icons/ri";
import { FaLayerGroup } from "react-icons/fa";
import {RiQuestionAnswerFill} from "react-icons/ri";
import {FaClipboardList} from "react-icons/fa";
import { SidebarItem } from "../Models/SidebarItem";

export const SidebarData: SidebarItem[] = [
    {
        title: 'Perfil',
        path: '/profile',
        icon: <AiOutlineUser style={{fill:"#043C8B"}}/>,

    },
    {
        title: 'Asignaturas',
        path: 'subjects',
        icon: <FaClipboardList style={{fill:"#043C8B"}}/>,

    },
    {
        title: 'Mis cursos',
        path: '/courses',
        icon: < BiBook style={{fill:"#043C8B"}}/>,
    },
    {
        title: 'Preguntas Generales',
        path: '/generalFAQ',
        icon: < RiQuestionAnswerFill style={{fill:"#043C8B"}}/>,
    },
    {
        title: 'Asignacion de Consultas',
        path: '/queryassignment',
        icon: < RiMailDownloadFill style={{fill:"#043C8B"}}/>,
    },
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
        icon: < FaLayerGroup style={{fill:"#043C8B"}}/>,
    },
];