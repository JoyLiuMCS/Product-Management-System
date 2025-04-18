const initialState = {
    user: null,
    loading: false,
    error: null,
    resetLinkSent: false,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'RESET_LINK_SENT':
        return {
          ...state,
          resetLinkSent: true,
          error: null,
        };
      case 'RESET_LINK_ERROR':
        return {
          ...state,
          resetLinkSent: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;
  