import { Navigate, Route, Routes as RouterRoutes } from 'react-router'
import DefaultLayout from './components/layouts/DefaultLayout'
import ProtectedRoute from './components/layouts/ProtectedRoute'
import Users from './pages/Users'
import Home from './pages/Home'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDetail from './pages/Users/UserDetail'
import Courts from './pages/Courts'
import SportsGear from './pages/SportsGear'
import GiftCards from './pages/GiftCards'
import ConsumerGoods from './pages/ConsumerGoods'
import Reservations from './pages/Reservations'
import CreateReservation from './pages/Reservations/CreateReservation'
import ReservationDetail from './pages/Reservations/ReservationDetail'
import UpdateReservation from './pages/Reservations/UpdateReservation'
import Cart from './pages/Cart'
import TrainerReservations from './pages/TrainerReservations'
import SubscriptionCards from './pages/SubscriptionCards'
import Settings from './pages/Settings'
import UpdateUser from './pages/Users/UpdateUser'

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
      <Route
        path='/courts'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <Courts />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/sports-gear'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <SportsGear />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/gift-cards'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <GiftCards />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/consumer-goods'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <ConsumerGoods />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/reservations'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <Reservations />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/reservations/trainer'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <TrainerReservations />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/reservations/new/:fromDate/:toDate'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <CreateReservation />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/reservations/:reservationId'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <ReservationDetail />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/reservations/:reservationId/update'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <UpdateReservation />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/cart'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <Cart />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/subscription-cards'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <SubscriptionCards />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/settings/change-password'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <Settings />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/users/:id/edit'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <UpdateUser />
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
