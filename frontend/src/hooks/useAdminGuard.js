import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const useAdminGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'Please log in first.',
        confirmButtonText: 'Go to Sign In',
      }).then(() => {
        navigate('/signin');
      });
      return;
    }

    const user = JSON.parse(rawUser);
    if (user.role !== 'admin') {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Only admins can access this page.',
        confirmButtonText: 'Back to Products',
      }).then(() => {
        navigate('/products');
      });
    }
  }, [navigate]);
};

export default useAdminGuard;

