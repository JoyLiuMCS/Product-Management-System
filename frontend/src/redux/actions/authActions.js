export const sendResetLink = (email) => async (dispatch) => {
    try {
      // Replace with actual backend call
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      dispatch({ type: 'RESET_LINK_SENT' });
    } catch (err) {
      dispatch({ type: 'RESET_LINK_ERROR', payload: err.message });
    }
  };
  