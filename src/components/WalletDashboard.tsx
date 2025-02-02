import { CreditCard, ShieldCheck, ContactIcon, CheckCircle2 } from 'lucide-react';

const WalletDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-900">My Wallet</h2>
            <CreditCard className="text-blue-600 w-12 h-12" />
          </div>

          {/* Ready to Tap Status */}
          <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-lg">
            <CheckCircle2 className="text-green-500 w-6 h-6" />
            <span className="text-green-700 font-medium">Ready to Tap</span>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 mb-4 relative overflow-hidden">
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
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;