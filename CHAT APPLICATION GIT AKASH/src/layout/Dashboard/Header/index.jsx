import { useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';

import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';

import useSWR from 'swr'; // Correct import for useSWR

// assets
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';

// Endpoints and initial state
const endpoints = {
  key: 'api/menu',
  master: 'master'
};

const initialState = {
  isDashboardDrawerOpened: true
};

export default function Header() {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg')); // Detect if screen is small (mobile/tablet)

  // Fetching the menu state using SWR
  const { data: menuMaster, mutate: menuMutate } = useSWR(endpoints.key + endpoints.master, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  // Toggle the sidebar open/close
  // const handlerDrawerToggle = () => {
  //   menuMutate(
  //     (currentMenuMaster) => ({
  //       ...currentMenuMaster,
  //       isDashboardDrawerOpened: !currentMenuMaster.isDashboardDrawerOpened
  //     }),
  //     false
  //   );
  // };

  const handlerDrawerToggle = () => {
  menuMutate(
    (currentMenuMaster) => ({
      ...currentMenuMaster,
      isDashboardDrawerOpened: false // Always false
    }),
    false
  );
};

  // Sync drawer state on screen size change
  // useEffect(() => {
  //   menuMutate(
  //     (currentMenuMaster) => ({
  //       ...currentMenuMaster,
  //       isDashboardDrawerOpened: !downLG
  //     }),
  //     false
  //   );
  // }, [downLG, menuMutate]);

useEffect(() => {
  menuMutate(
    (currentMenuMaster) => ({
      ...currentMenuMaster,
      isDashboardDrawerOpened: false
    }),
    false
  );
}, [downLG, menuMutate]);


  const drawerOpen = menuMaster?.isDashboardDrawerOpened || false;

  // Header content
  const headerContent = useMemo(() => <HeaderContent />, []);

  const iconBackColor = '#e9e3f3';
  const iconBackColorOpen = '#e9e3f3';

  // Header toolbar with toggle button
  const mainHeader = (
    <Toolbar>
      <IconButton
        disableRipple
        aria-label="toggle drawer"
        onClick={handlerDrawerToggle}
        edge="start"
        sx={{
          color: '#3a186e',
          bgcolor: drawerOpen ? iconBackColorOpen : iconBackColor,
          ml: { xs: 0, lg: -2 }
        }}
      >
        {drawerOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      </IconButton>
      {headerContent}
    </Toolbar>
  );

  // AppBar style
  const appBarProps = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`
    }
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled open={drawerOpen} {...appBarProps}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBarProps}>{mainHeader}</AppBar>
      )}
    </>
  );
}
