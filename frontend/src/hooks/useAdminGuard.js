// src/hooks/useAdminGuard.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAdminGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      alert('⚠️ 请先登录');
      navigate('/signin');
      return;
    }

    const user = JSON.parse(rawUser);
    if (user.role !== 'admin') {
      alert('⛔ 只有管理员可以访问这个页面');
      navigate('/products');
    }
  }, []);
};

export default useAdminGuard;
