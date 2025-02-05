import { CreditCard, ShieldCheck, ContactIcon, CheckCircle2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const WalletDashboard = () => {
  const [mandateStatus, setMandateStatus] = useState<'pending' | 'completed'>('pending');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const { toast } = useToast();

  // Simulating webhook handling - in a real app, this would be called by your backend
  const handleWebhookEvent = (eventType: 'mandate.completed' | 'payment.completed', data?: { amount?: string }) => {
    console.log('Webhook event received:', eventType, data);
    switch (eventType) {
      case 'mandate.completed':
        setMandateStatus('completed');
        toast({
          title: "Mandate Setup Complete",
          description: "Your card is now ready for payments",
        });
        break;
      case 'payment.completed':
        if (data?.amount) {
          setPaymentAmount(data.amount);
          setShowPaymentSuccess(true);
          toast({
            title: "Payment Successful",
            description: `Payment of ${data.amount} has been processed`,
          });
          // Auto-hide the success message after 3 seconds
          setTimeout(() => setShowPaymentSuccess(false), 3000);
        }
        break;
    }
  };

  const handleCardClick = () => {
    // Simulate a payment completion webhook event
    handleWebhookEvent('payment.completed', { amount: '€10.00' });
  };

  // Test buttons for mobile
  const simulateMandateCompletion = () => {
    handleWebhookEvent('mandate.completed');
  };

  const simulatePayment = () => {
    handleWebhookEvent('payment.completed', { amount: '€25.00' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-4">
      <div className="max-w-md mx-auto">
        {/* Test Buttons */}
        <div className="mb-4 space-y-2">
          <Button 
            onClick={simulateMandateCompletion}
            className="w-full bg-yellow-500 hover:bg-yellow-600"
          >
            Simulate Mandate Completion
          </Button>
          <Button 
            onClick={simulatePayment}
            className="w-full"
            disabled={mandateStatus !== 'completed'}
          >
            Simulate €25 Payment
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 slide-up">
          {/* Mandate Status */}
          {mandateStatus === 'completed' ? (
            <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="text-green-500 w-6 h-6" />
              <span className="text-green-700 font-medium">Ready to Tap</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-6 p-3 bg-yellow-50 rounded-lg">
              <CheckCircle2 className="text-yellow-500 w-6 h-6" />
              <span className="text-yellow-700 font-medium">Setting up mandate...</span>
            </div>
          )}
          
          <div 
            className={`bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 mb-4 relative overflow-hidden ${mandateStatus === 'completed' ? 'cursor-pointer' : 'opacity-75'}`}
            onClick={mandateStatus === 'completed' ? handleCardClick : undefined}
          >
            {/* Credit Card Design */}
            <div className="flex flex-col h-48 justify-between">
              <div className="flex justify-between items-start">
                <ContactIcon className="text-white/70 w-16 h-16" />
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-400 opacity-70" />
                  <div className="w-4 h-4 rounded-full bg-yellow-400" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-white/90 text-xl tracking-widest">
                  <span>••••</span>
                  <span>••••</span>
                  <span>••••</span>
                  <span>4582</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-white/80 text-sm">
                    <div>CARD HOLDER</div>
                    <div className="font-medium">John Doe</div>
                  </div>
                  <div className="text-white/80 text-sm">
                    <div>EXPIRES</div>
                    <div className="font-medium">12/25</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <ShieldCheck className="text-green-400 w-12 h-12" />
          </div>

          {/* Payment Success Modal */}
          {showPaymentSuccess && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 m-4 max-w-sm w-full text-center slide-up">
                <div className="flex justify-center mb-4">
                  <Check className="w-24 h-24 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-4">{paymentAmount} has been processed</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;