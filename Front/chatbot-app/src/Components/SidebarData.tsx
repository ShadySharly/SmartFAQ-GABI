import { AiFillCaretDown, AiFillCaretUp, AiFillHome, AiOutlineUser } from "react-icons/ai";
import { BiBook } from "react-icons/bi";
import {RiQuestionAnswerFill} from "react-icons/ri";
import {FaClipboardList} from "react-icons/fa";
import { SidebarItem } from "../Models/SidebarItem";

export const SidebarData: SidebarItem[] = [
    {
        title: 'Home',
        path: '/overview',
        icon: <AiFillHome />,
        iconClosed: < AiFillCaretDown />,
        iconOpened: < AiFillCaretUp />,
        subnav: [
            {
                title: 'Perfil',
                path: '/overview/profile',
                icon: <AiOutlineUser/>,

            },
            {
                title: 'Asignaturas',
                path: '/overview/subjects',
                icon: <FaClipboardList/>,

            }
        ]
    },
    {
        title: 'Mis cursos',
        path: '/courses',
        icon: < BiBook/>,
    },
    {
        title: 'Preguntas Generales',
        path: '/generalFAQ',
        icon: < RiQuestionAnswerFill/>,
    },
    {
        title: 'Asignacion de Consultas',
        path: '/queryassignment',
        icon: < RiQuestionAnswerFill/>,
    },
    {
        title: 'Administración de Intenciones',
        path: '/intentindex',
        icon: < RiQuestionAnswerFill/>,
    },
];