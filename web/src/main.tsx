import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from '@/pages/App'
import Login from '@/pages/Login';
import { Toaster } from '@/components/ui/toaster';
import '@/index.css'
import AuthRoute from '@/components/AuthRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRoute><App /></AuthRoute>,
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
