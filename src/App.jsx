import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import ComingSoon from './components/ComingSoon'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import MemberList from './pages/Members/MemberList'
import AddMember from './pages/Members/AddMember'
import MemberProfile from './pages/Members/MemberProfile'
import EditMember from './pages/Members/EditMember'
import PlansList from './pages/Plans/PlansList'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-zinc-500">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
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
        <Route path="/trainers" element={<ComingSoon title="Trainers" />} />
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