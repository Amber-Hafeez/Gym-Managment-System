import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContextTemp'
import Layout from './components/Layout'
import ComingSoon from './components/ComingSoon'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import MemberList from './pages/Members/MemberList'
import AddMember from './pages/Members/AddMember'
import MemberProfile from './pages/Members/MemberProfile'
import EditMember from './pages/Members/EditMember'
import PlansList from './pages/Plans/PlansList'
import ClassSchedule from './pages/Classes/ClassSchedule'
import ClassBooking from './pages/Classes/ClassBooking'
import MyClasses from './pages/Classes/MyClasses'
import ManageTrainers from './pages/Trainers/ManageTrainers'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-zinc-500">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

// Shows the right Classes view depending on the logged-in profile's role
function ClassesRoute() {
  const { user } = useAuth()
  if (user?.role === 'Trainer') return <MyClasses />
  return <ClassSchedule />
}

function AppRoutes() {
  const { user, loading } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={loading ? null : user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<MemberList />} />
        <Route path="/members/new" element={<AddMember />} />
        <Route path="/members/:id" element={<MemberProfile />} />
        <Route path="/members/:id/edit" element={<EditMember />} />
        <Route path="/plans" element={<PlansList />} />
        <Route path="/classes" element={<ClassesRoute />} />
        <Route path="/class-booking" element={<ClassBooking />} />
        <Route path="/my-classes" element={<MyClasses />} />
        <Route path="/manage-trainers" element={<ManageTrainers />} />
        <Route path="/payments" element={<ComingSoon title="Payments" />} />
        <Route path="/attendance" element={<ComingSoon title="Attendance" />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App