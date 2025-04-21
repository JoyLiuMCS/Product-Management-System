import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Cart from './pages/cart';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ProductFormPage from './pages/ProductFormPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PasswordResetSent from './pages/PasswordResetSent';
import ErrorPage from './pages/ErrorPage'; 
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/add-product" element={<ProductFormPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/:id/edit" element={<ProductFormPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/password-reset-sent" element={<PasswordResetSent />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<ErrorPage />} /> {/* 404 fallback */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
