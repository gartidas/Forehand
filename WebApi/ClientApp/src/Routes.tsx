import { Navigate, Route, Routes as RouterRoutes } from 'react-router'
import DefaultLayout from './components/layouts/DefaultLayout'
import ProtectedRoute from './components/layouts/ProtectedRoute'
import Users from './pages/Users'
import Home from './pages/Home'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDetail from './pages/Users/UserDetail'

const Routes = () => {
  return (
    <RouterRoutes>
      <Route
        path='/home'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <Home />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/users'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <Users />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/users/:id'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <UserDetail />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />

      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/' element={<LandingPage />} />
      <Route path='*' element={<Navigate to='/home' />} />
    </RouterRoutes>
  )
}

export default Routes
