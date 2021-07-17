import { AiFillCaretDown, AiFillCaretUp, AiFillHome, AiOutlineUser } from "react-icons/ai";
import { BiBook } from "react-icons/bi";
import {RiQuestionAnswerFill} from "react-icons/ri";
import {FaClipboardList} from "react-icons/fa";
import { SidebarItem } from "../Models/SidebarItem";

export const SidebarData: SidebarItem[] = [
    {
        title: 'Perfil',
        path: '/profile',
        icon: <AiOutlineUser style={{fill:"#394049"}}/>,

    },
    {
        title: 'Asignaturas',
        path: 'subjects',
        icon: <FaClipboardList style={{fill:"#394049"}}/>,

    },
    {
        title: 'Mis cursos',
        path: '/courses',
        icon: < BiBook style={{fill:"#394049"}}/>,
    },
    {
        title: 'Preguntas Generales',
        path: '/generalFAQ',
        icon: < RiQuestionAnswerFill style={{fill:"#394049"}}/>,
    },
    {
        title: 'Asignacion de Consultas',
        path: '/queryassignment',
        icon: < RiQuestionAnswerFill style={{fill:"#394049"}}/>,
    },
    {
        title: 'Administración de Intenciones',
        path: '/intentindex',
        icon: < RiQuestionAnswerFill style={{fill:"#394049"}}/>,
    },
    {
        title: 'FAQs',
        path: '/faqindex',
        icon: < RiQuestionAnswerFill/>,
    },
    {
        title: 'Agrupacion de Consultas',
        path: '/groupintention',
        icon: < RiQuestionAnswerFill/>,
    },
];