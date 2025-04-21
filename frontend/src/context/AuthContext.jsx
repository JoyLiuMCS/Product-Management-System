const sendResetLink = async (email) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
  
    // 🔥 关键修改：不再发送真实请求，直接模拟成功
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟 API 延迟（可选）
        setAuthState(prev => ({
          ...prev,
          loading: false,
          resetLinkSent: true, // 标记为已发送
        }));
        resolve({ success: true }); // 返回模拟的成功响应
      }, 1000); // 1秒延迟（可选，让 UI 更真实）
    });
  };