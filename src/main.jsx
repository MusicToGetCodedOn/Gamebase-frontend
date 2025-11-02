import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import HomeRoute from './routes/HomeRoute.jsx'
import DiscoverRoute from './routes/DiscoverRoute.jsx'
import TrendingRoute from './routes/TrendingRoute.jsx'
import UpcomingRoute from './routes/UpcomingRoute.jsx'
import AccountRoute from './routes/AccountRoute.jsx'
import TopRatedRoute from './routes/TopRatedRoute.jsx'
import GameDetailRoute from './routes/GameDetailRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ContactRoute from './routes/ContactRoute.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomeRoute />
      },
      {
        path: '/discover',
        element: <DiscoverRoute />
      },
      {
        path: '/trending',
        element: <TrendingRoute />
      },
      {
        path: '/top-rated',
        element: <TopRatedRoute />
      },
      {
        path: '/upcoming',
        element: <UpcomingRoute />
      },
      {
        path: '/profile',
        element: <AccountRoute />
      },{
        path: '/game/:id',
        element: <GameDetailRoute />,
      },
      {
        path: '/contact',
        element: <ContactRoute />
      }
    
    ],
  },
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router}/>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
