import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import useAuth from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import useAuthStore from './store/useAuthStore.js';
import Loading from './components/Loading';
import { useThemeStore } from './store/useThemeStore.js';

function App() {
  useAuth();
  const { loading, user } = useAuthStore();

  const { theme } = useThemeStore()



  if (loading) {
    return (
      <Loading />
    );
  }

  // console.log(theme)
  return (
    <div data-theme={theme} className='w-full h-screen  fixed overflow-hidden overflow-y-auto'>
            {user && <Header />}
      <main className='h-[90vh] mt-[10vh]'>

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Toaster />
      </main>
      <Header />
    </div>
  );
}

export default App;
