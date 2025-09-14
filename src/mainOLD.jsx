import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './screens/App.jsx'
import Authentication, { AuthenticationMode } from './screens/Authentication.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import UserProvider from './context/UserProvider.jsx'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import NotFound from './screens/NotFound.jsx'
import UserLayout from './context/UserLayout.jsx'
import MyProfile from './screens/Myprofile.jsx'



const router = createBrowserRouter([
  {
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element:<App />,
        children: [{ path: "/", element: <Home /> }]
      },
      {
        path: "/signin",
        element: <Authentication authenticationMode={AuthenticationMode.SignIn} />
      },
      {
        path: "/signup",
        element: <Authentication authenticationMode={AuthenticationMode.SignUp} />
      },
      /*{
        path: "/screeningtimes",
        element:<ScreeningTimes />,
      },
      {
        path: "/search",
        element:<Search />,
      },
      {
        path: "/reviews",
        element:<Reviews /> ,
      },
      {
        path: "/groups",
        element:<Groups />,
      },
      */
      //not found route
      {
        path: "*",
        element: <NotFound />
      },

      // Protected routes
      /*{
        path: "/favorites",
        element: (
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        ),
      },*/
      {
        path: "/myprofile",
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      }
    
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
