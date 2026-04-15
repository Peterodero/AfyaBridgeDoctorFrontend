// src/routes/AppRouter.jsx
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { UIProvider } from '../context/UIContext'
import Layout         from '../components/layout/Layout'
import Dashboard      from '../pages/Dashboard'
import Appointments   from '../pages/Appointments'
import Patients       from '../pages/Patients'
import PatientProfile from '../pages/PatientProfile'
import Telemedicine   from '../pages/Telemedicine'
import EPrescriptions from '../pages/EPrescriptions'
import Analytics      from '../pages/Analytics'
import Settings       from '../pages/Settings'
import HelpCenter     from '../pages/HelpCenter'
import Notifications  from '../pages/Notifications'
import Login          from '../pages/auth/Login'
import Register       from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import Wallet         from '../pages/Wallet'

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

// Single root layout — AuthProvider and UIProvider wrap the entire app once
function RootLayout() {
  return (
    <AuthProvider>
      <UIProvider>
        <Outlet />
      </UIProvider>
    </AuthProvider>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Guest routes
      { path: '/login',           element: <GuestRoute><Login /></GuestRoute>          },
      { path: '/register',        element: <GuestRoute><Register /></GuestRoute>       },
      { path: '/forgot-password', element: <GuestRoute><ForgotPassword /></GuestRoute> },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: [
              { index: true,                  element: <Navigate to="/dashboard" replace /> },
              { path: 'dashboard',            element: <Dashboard />      },
              { path: 'appointments',         element: <Appointments />   },
              { path: 'patients',             element: <Patients />       },
              { path: 'patients/:patientId',  element: <PatientProfile /> },
              { path: 'telemedicine',         element: <Telemedicine />   },
              { path: 'prescriptions',        element: <EPrescriptions /> },
              // { path: 'analytics',            element: <Analytics />      },
              { path: 'wallet',               element: <Wallet />         },
              { path: 'settings',             element: <Settings />       },
              { path: 'help',                 element: <HelpCenter />     },
              { path: 'notifications',        element: <Notifications />  },
            ],
          },
        ],
      },

      { path: '*', element: <Navigate to="/login" replace /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
