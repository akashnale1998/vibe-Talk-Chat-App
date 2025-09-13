// import { lazy } from 'react';

// // project import
// import Loadable from 'components/Loadable';
// import Dashboard from 'layout/Dashboard';
// import Vehicles from 'pages/dashboard/Vehicles';
// import UploadExcel from 'pages/dashboard/UploadExcel';
// import ViewHistory from 'pages/dashboard/ViewHistory';
// import ANPR from 'pages/dashboard/ANPR';
// import VideoDetails from 'pages/dashboard/VideoDetails';
// import SpeedDetection from 'pages/dashboard/SpeedDetection';
// import NoHelmet from 'pages/dashboard/NoHelmet';
// import PeopleCount from 'pages/dashboard/PeopleCount';
// import VehicleCount from 'pages/dashboard/VehicleCount';
// import ViewProfile from 'layout/Dashboard/Header/HeaderContent/Profile/ViewProfile';
// import ChatCommunication from 'pages/dashboard/ChatCommunication';

// const Color = Loadable(lazy(() => import('pages/component-overview/color')));
// const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
// const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
// const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// // render - sample page
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// // ==============================|| MAIN ROUTING ||============================== //

// const MainRoutes = {
//   path: '/',
//   // element: <ChatCommunication />,
  
//   children: [
//     // {
//     //   path: '/',
//     //   element: <DashboardDefault />
//     // },
//     // {
//     //   path: 'color',
//     //   element: <Color />
//     // },
//     // {
//     //   path: 'dashboard',
//     //   children: [
//     //     {
//     //       path: 'default',
//     //       element: <DashboardDefault />
//     //     }
//     //   ]
//     // },
//     // {
//     //   path: 'vehicles',
//     //   element: <Vehicles />
//     // },
//     // {
//     //   path: 'anpr',
//     //   element: <ANPR />
//     // },
//     // {
//     //   path: 'uploadExcel',
//     //   element: <UploadExcel />
//     // },
//     // {
//     //   path: 'viewHistory',
//     //   element: <ViewHistory />
//     // },
//     // {
//     //   path: 'videoDetails',
//     //   element: <VideoDetails />
//     // },
//     // {
//     //   path: "videoDetails/:id",
//     //   element: <VideoDetails />, // Dynamic route for video details
//     // },
//     // {
//     //   path: 'speedDetection',
//     //   element: <SpeedDetection />
//     // },
//     // {
//     //   path: 'noHelmet',
//     //   element: <NoHelmet />
//     // },
//     // {
//     //   path: 'peopleCount',
//     //   element: <PeopleCount />
//     // },
//     // {
//     //   path: 'vehicleCount',
//     //   element: <VehicleCount />
//     // },
//     // {
//     //   path: 'viewProfile',
//     //   element: <ViewProfile />
//     // },
//     // {
//     //   path: 'sample-page',
//     //   element: <SamplePage />
//     // },
//     // {
//     //   path: 'shadow',
//     //   element: <Shadow />
//     // },
//     // {
//     //   path: 'typography',
//     //   element: <Typography />
//     // }

//      {
//       path: '/',
//       element: <ChatCommunication />
//     },

    
//   ]
// };

// export default MainRoutes;

import { lazy } from "react";
import Loadable from "components/Loadable";
import ChatCommunication from "pages/dashboard/ChatCommunication";
import ProtectedRoute from "pages/dashboard/ProtectedRoute";
import InstagramClone from "pages/dashboard/InstagramClone";
import AdminNotification from "pages/dashboard/NotificationAdmin";
import ShowNotification from "pages/dashboard/ShowNotification";
import Portfolio from "pages/dashboard/Portfolio";
import VibeTalk from "pages/dashboard/VibTalk";
import YouTubeClone from "pages/dashboard/YouTube";

// Lazy load ECommerce page
const ECommerce = Loadable(lazy(() => import("pages/dashboard/e-commerce")));

const MainRoutes = {
  path: "/",
  children: [
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <ChatCommunication />
        </ProtectedRoute>
      ),
    },
    {
      path: "/ecommerce",
      element: (
        <ProtectedRoute>
          <ECommerce />
        </ProtectedRoute>
      ),
    },
    {
      path: "/instagram",
      element: (
        <ProtectedRoute>
          <InstagramClone />
        </ProtectedRoute>
      ),
    },
     {
      path: "/adminNotification",
      element: (
        <ProtectedRoute>
          <AdminNotification />
        </ProtectedRoute>
      ),
    },
    {
      path: "/showNotification",
      element: (
        <ProtectedRoute>
          <ShowNotification />
        </ProtectedRoute>
      ),
    },
    {
      path: "/portfolio",
      element: (
        <ProtectedRoute>
          <Portfolio />
        </ProtectedRoute>
      ),
    },
     {
      path: "/vibeTalk",
      element: (
        <ProtectedRoute>
          <VibeTalk />
        </ProtectedRoute>
      ),
    },
    {
      path: "/youtube",
      element: (
        <ProtectedRoute>
          <YouTubeClone />
        </ProtectedRoute>
      ),
    },
  ],
};

export default MainRoutes;
