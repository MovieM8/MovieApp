import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './screens/App.jsx';
import Authentication, { AuthenticationMode } from './screens/Authentication.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UserProvider from './context/UserProvider.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './screens/NotFound.jsx';
import Home from './screens/Home.jsx';
import MyProfile from './screens/Myprofile.jsx';
import Favorites from './screens/Favorites.jsx';
import ScreeningTimes from './screens/ScreeningTimes.jsx';
import MovieSearch from './screens/Search.jsx';
/*import Reviews from './screens/Reviews.jsx';
import Groups from './screens/Groups.jsx';*/
import DeleteAccount from './screens/DeleteAccount.jsx';
import { TheatreProvider } from "./context/TheatreContext.jsx";
import { MovieSearchProvider } from "./context/MovieSearchContext.jsx";
import { MovieProvider } from "./context/MovieContext.jsx"
import MoviePage from './screens/MoviePage.jsx';
import { ReviewProvider } from "./context/ReviewContext.jsx";

// Create router
const router = createBrowserRouter([
  {
    element: (
      <UserProvider>
        <MovieProvider>
          <ReviewProvider>
            <App /> {/* App acts as the layout with Header, Navbar, Aside */}
          </ReviewProvider>
        </MovieProvider>
      </UserProvider>
    ),
    children: [
      // Public routes
      { path: "/", element: <Home /> },
      { path: "/screeningtimes", element: <ScreeningTimes /> },
      { path: "/search", element: <MovieSearch /> },
      { path: "/movie/:id", element: <MoviePage /> },

      /*{ path: "/reviews", element: <Reviews /> },
      { path: "/groups", element: <Groups /> },*/

      // Protected routes
      {
        path: "/myprofile",
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
        children: [
          { path: "favorites", element: <Favorites /> },
          //{ path: "myreviews", element: <MyReviews /> },
          //{ path: "mygroups", element: <MyGroups /> },
          { path: "deleteaccount", element: <DeleteAccount /> },
        ],
      },

      /*{
        path: "/myprofile/favorites",
        element: (
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        ),
      },*/

      // Public auth routes
      {
        path: "/signin",
        element: <Authentication authenticationMode={AuthenticationMode.SignIn} />,
      },
      {
        path: "/signup",
        element: <Authentication authenticationMode={AuthenticationMode.SignUp} />,
      },

      // Not found route
      { path: "*", element: <NotFound /> },
    ],
  },
]);

// Render the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TheatreProvider>
      <MovieSearchProvider>
        <RouterProvider router={router} />
      </MovieSearchProvider>
    </TheatreProvider>
  </StrictMode>
);
