
import { useState } from 'react';
import AuthScreen from '@/components/AuthScreen';
import AddFundingSource from '@/components/AddFundingSource';
import WalletDashboard from '@/components/WalletDashboard';

const Index = () => {
  const [step, setStep] = useState('auth');

  const handleAuthentication = () => {
    setStep('funding');
  };

  const handleFundingComplete = () => {
    setStep('dashboard');
  };

  return (
    <>
      {step === 'auth' && <AuthScreen onAuthenticate={handleAuthentication} />}
      {step === 'funding' && <AddFundingSource onComplete={handleFundingComplete} />}
      {step === 'dashboard' && <WalletDashboard />}
    </>
  );
};

export default Index;
