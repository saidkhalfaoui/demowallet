import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App } from '@capacitor/app';

const CallbackScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Register deep link listener
    App.addListener('appUrlOpen', (data: { url: string }) => {
      console.log('Deep link opened', data.url);
      // Extract any parameters from the URL if needed
      // Navigate to the appropriate screen
      navigate('/');
    });

    return () => {
      // Cleanup listener
      App.removeAllListeners();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Processing...</h2>
        <p className="text-center text-gray-600">Please wait while we process your request.</p>
      </div>
    </div>
  );
};

export default CallbackScreen;