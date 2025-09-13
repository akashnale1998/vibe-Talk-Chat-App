// assets
import { DashboardOutlined  } from '@ant-design/icons';
import {CarOutlined  } from '@ant-design/icons';
import {CloudUploadOutlined  } from '@ant-design/icons';
import {VideoCameraAddOutlined  } from '@ant-design/icons';
import {FieldTimeOutlined  } from '@ant-design/icons';
import SportsMotorsportsOutlinedIcon from '@mui/icons-material/SportsMotorsportsOutlined';// icons
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import VideoCameraFrontOutlinedIcon from '@mui/icons-material/VideoCameraFrontOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import TimeToLeaveOutlinedIcon from '@mui/icons-material/TimeToLeaveOutlined';
import { Chat } from '@mui/icons-material';

const icons = {
  DashboardOutlined,
  CarOutlined,
  CloudUploadOutlined,
  VideoCameraAddOutlined,
  FieldTimeOutlined,
  SportsMotorsportsOutlinedIcon,
  BlockOutlinedIcon,
  SpeedOutlinedIcon,
  GroupAddOutlinedIcon,
  LibraryBooksOutlinedIcon,
  VideoCameraFrontOutlinedIcon,
  CancelOutlinedIcon,
  HomeOutlinedIcon,
  PeopleAltOutlinedIcon,
  TimeToLeaveOutlinedIcon,
  Chat
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.HomeOutlinedIcon,
      breadcrumbs: false
    },
    // {
    //   id: 'anpr',
    //   title: 'ANPR',
    //   type: 'item',
    //   url: '/anpr',
    //   icon: icons.VideoCameraFrontOutlinedIcon,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'uploadExcel',
    //   title: 'Upload Excel',
    //   type: 'item',
    //   url: '/uploadExcel',
    //   icon: icons.CloudUploadOutlined,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'speedDetection',
    //   title: 'Speed Detection',
    //   type: 'item',
    //   url: '/speedDetection',
    //   icon: icons.SpeedOutlinedIcon,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'vehicles',
    //   title: 'Vehicles List',
    //   type: 'item',
    //   url: '/vehicles',
    //   icon: icons.CarOutlined,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'noHelmet',
    //   title: 'No Helmet',
    //   type: 'item',
    //   url: '/noHelmet',
    //   icon: icons.CancelOutlinedIcon,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'peopleCount',
    //   title: 'People Count',
    //   type: 'item',
    //   url: '/peopleCount',
    //   icon: icons.PeopleAltOutlinedIcon,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'vehicleCount',
    //   title: 'Vehicle Count',
    //   type: 'item',
    //   url: '/vehicleCount',
    //   icon: icons.TimeToLeaveOutlinedIcon,
    //   breadcrumbs: false
    // },

     {
      id: 'chatCommunication',
      title: 'Chat',
      type: 'item',
      url: '/chatCommunication',
      icon: icons.Chat,
      breadcrumbs: false
    },
     {
      id: 'ecommerce',
      title: 'e-commerce',
      type: 'item',
      url: '/ecommerce',
      icon: icons.Chat,
      breadcrumbs: false
    },
     {
      id: 'instagram',
      title: 'Instagram',
      type: 'item',
      url: '/instagram',
      icon: icons.Chat,
      breadcrumbs: false
    },
    {
      id: 'adminNotification',
      title: 'adminNotification',
      type: 'item',
      url: '/adminNotification',
      icon: icons.Chat,
      breadcrumbs: false
    },
    {
      id: 'showNotification',
      title: 'showNotification',
      type: 'item',
      url: '/showNotification',
      icon: icons.Chat,
      breadcrumbs: false
    },
    {
      id: 'portfolio',
      title: 'portfolio',
      type: 'item',
      url: '/portfolio',
      icon: icons.Chat,
      breadcrumbs: false
    },
      {
      id: 'vibeTalk',
      title: 'vibeTalk',
      type: 'item',
      url: '/vibeTalk',
      icon: icons.Chat,
      breadcrumbs: false
    },
    {
      id: 'youtube',
      title: 'youtube',
      type: 'item',
      url: '/youtube',
      icon: icons.Chat,
      breadcrumbs: false
    },
  ]
};

export default dashboard;
