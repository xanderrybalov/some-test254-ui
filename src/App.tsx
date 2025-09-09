import { Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { MovieDetailsPage } from './components/MovieDetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/movies/:id" element={<MovieDetailsPage />} />
      {/* Protected routes can be added here */}
      {/* <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> */}
    </Routes>
  );
}

export default App;
