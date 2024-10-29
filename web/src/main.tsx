import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import '@/index.css'

import App from '@/pages/App'
import Login from '@/pages/Login';
import Account from '@/pages/Account';

import { Toaster } from '@/components/ui/toaster';
import AuthRoute from '@/components/AuthRoute';
import Dashboard from '@/pages/Layout/Dashboard';
import Transaction from '@/pages/Transaction';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRoute><Dashboard /></AuthRoute>,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/transactions",
        element: <Transaction />,
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
)
