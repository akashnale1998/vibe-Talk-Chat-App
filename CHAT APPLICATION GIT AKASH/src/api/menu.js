import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// Initial state for menu master
const initialState = {
  openedItem: 'dashboard',
  openedComponent: 'buttons',
  openedHorizontalItem: null,
  // isDashboardDrawerOpened: true, // Sidebar initially closed
  isComponentDrawerOpened: true
};

// API endpoints
export const endpoints = {
  key: 'api/menu',
  master: 'master',
  dashboard: '/dashboard/default' // Example server URL
};

// Hook to get menu master state
export function useGetMenuMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.master, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      menuMaster: data,
      menuMasterLoading: isLoading
    }),
    [data, isLoading]
  );
  return memoizedValue;
}

// Function to open/close the sidebar
export function handlerDrawerOpen(newState) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => ({
      ...currentMenuMaster,
      isDashboardDrawerOpened: newState // Set new state (true for open, false for close)
    }),
    false
  );
}

// Function to toggle the sidebar open/close
export function handlerDrawerToggle() {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => ({
      ...currentMenuMaster,
      isDashboardDrawerOpened: !currentMenuMaster.isDashboardDrawerOpened // Toggle current state
    }),
    false
  );
}

// Function to activate a specific menu item
export function handlerActiveItem(openedItem) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => ({
      ...currentMenuMaster,
      openedItem // Update the active item
    }),
    false
  );
}
