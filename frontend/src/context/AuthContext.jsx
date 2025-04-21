const sendResetLink = async (email) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
  
    return new Promise((resolve) => {
      setTimeout(() => {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          resetLinkSent: true,
        }));
        resolve({ success: true });
      }, 1000);
    });
  };