import { CreditCard, ShieldCheck, ContactIcon } from 'lucide-react';

const WalletDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-4">
      <div className="max-w-md mx-auto">
        <div className="glass-card p-6 slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">My Wallet</h2>
            <CreditCard className="text-blue-200" />
          </div>
          
          <div className="bg-[#222222] rounded-xl p-6 mb-4 relative overflow-hidden">
            {/* Credit Card Design */}
            <div className="flex flex-col h-48 justify-between">
              <div className="flex justify-between items-start">
                <ContactIcon className="text-white/70 w-8 h-8" />
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

          <div className="flex items-center justify-between text-blue-200">
            <div className="flex items-center">
              <CreditCard className="mr-2" />
              <span>Virtual Card</span>
            </div>
            <ShieldCheck className="text-green-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;