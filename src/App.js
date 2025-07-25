import React, { useState } from 'react';
import { Check, X, Users, Building2, Globe, Eye, Edit2 } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/AuthForm';
import LoginButton from './components/LoginButton';
import './index.css';

const App = () => {
  const { user, loading } = useAuth();
  const [selectedGlobalPolicies, setSelectedGlobalPolicies] = useState(['vanguard-advised']);
  const [pendingGlobalPolicy, setPendingGlobalPolicy] = useState('');
  const [individualPoliciesEnabled, setIndividualPoliciesEnabled] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedFundForChange, setSelectedFundForChange] = useState(null);
  const [tempPolicySelection, setTempPolicySelection] = useState('');

  const policies = [
    {
      id: 'company-board',
      name: 'Company Board-aligned Policy',
      icon: Building2,
      description: 'Aligns with company board recommendations'
    },
    {
      id: 'egan-jones',
      name: 'Egan-Jones Wealth-Focused Policy',
      icon: Globe,
      description: 'Focuses on shareholder wealth creation'
    },
    {
      id: 'glass-lewis',
      name: 'Glass Lewis ESG Policy',
      icon: Users,
      description: 'Environmental, social, and governance focused'
    },
    {
      id: 'mirror-voting',
      name: 'Mirror Voting Policy',
      icon: Eye,
      description: 'Mirrors the voting patterns of similar funds'
    },
    {
      id: 'vanguard-advised',
      name: 'Vanguard-Advised Funds Policy',
      icon: () => (
        <div className="w-6 h-6 bg-black text-white rounded flex items-center justify-center font-bold text-sm">
          V
        </div>
      ),
      description: 'Vanguard\'s proprietary voting approach'
    }
  ];

  const fundsList = [
    { name: 'VANGUARD GROWTH ETF', account: 'Brokerage Account', accountNumber: '***-9847', policy: 'mirror-voting' },
    { name: 'VANGUARD S&P 500 GROWTH ETF', account: 'Brokerage Account', accountNumber: '***-2156', policy: 'company-board' },
    { name: 'VANGUARD TAX MANAGED CAPITAL APPRC ADMIRAL CL', account: 'Brokerage Account', accountNumber: '***-7389', policy: 'vanguard-advised' },
    { name: 'VANGUARD GROWTH ETF', account: 'Roth IRA Brokerage Account', accountNumber: '***-4521', policy: 'egan-jones' }
  ];

  const [fundPolicies, setFundPolicies] = useState(
    fundsList.reduce((acc, fund, index) => {
      acc[index] = fund.policy;
      return acc;
    }, {})
  );

  const handlePolicyChange = (fundIndex) => {
    setSelectedFundForChange(fundIndex);
    setTempPolicySelection(fundPolicies[fundIndex]);
    setShowPolicyModal(true);
  };

  const savePolicyChange = () => {
    setFundPolicies(prev => ({
      ...prev,
      [selectedFundForChange]: tempPolicySelection
    }));
    setShowPolicyModal(false);
    setSelectedFundForChange(null);
  };

  const handleGlobalPolicySelect = (policyId) => {
    setPendingGlobalPolicy(policyId);
    setShowConfirmModal(true);
  };

  const confirmGlobalPolicy = () => {
    setSelectedGlobalPolicies([pendingGlobalPolicy]);
    // Apply to all funds
    const newPolicies = {};
    fundsList.forEach((_, index) => {
      newPolicies[index] = pendingGlobalPolicy;
    });
    setFundPolicies(newPolicies);
    setShowConfirmModal(false);
    setPendingGlobalPolicy('');
  };

  const cancelGlobalPolicy = () => {
    // Reset to previous selection
    setShowConfirmModal(false);
    setPendingGlobalPolicy('');
  };

  const getPolicyName = (policyId) => {
    return policies.find(p => p.id === policyId)?.name || 'Unknown Policy';
  };

  const getPolicyIcon = (policyId) => {
    const policy = policies.find(p => p.id === policyId);
    if (policy?.icon) {
      if (typeof policy.icon === 'function') {
        return policy.icon;
      }
      return policy.icon;
    }
    return Users;
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-green-200 flex items-center justify-center p-4">
        <AuthForm />
      </div>
    );
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-green-200 pt-6 md:pt-12 pb-2">
        <div className="max-w-7xl mx-auto px-4 md:px-9">
          {/* Header with login button */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 md:mb-8">
            <h1 className="text-3xl md:text-6xl font-black text-left text-white mb-4 md:mb-0" style={{ fontFamily: '"FF Mark Pro Heavy", system-ui, sans-serif' }}>
              Proxy voting: Your voice, your choice
            </h1>
            <div className="self-start md:mt-4">
              <LoginButton />
            </div>
          </div>
          
          <div className="bg-white shadow-4xl p-4 md:p-8 relative -mb-16 md:-mb-24 z-20 border border-black-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="flex flex-col order-1 lg:order-1">
                <div className="w-full h-32 mb-3">
                  <img 
                    src={require("./iamge.jpeg")} 
                    alt="People voting" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="underline hover:opacity-50 transition-colors text-lg md:text-xl text-left font-bold" style={{ color: '#2159d2', fontFamily: '"FF Mark Pro Regular", system-ui, sans-serif' }}>
                  Frequently asked questions {'>'}
                </button>
              </div>
              
              <div className="lg:border-r border-black-600 lg:pr-4 order-2 lg:order-2">
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: '"FF Mark Pro Heavy", system-ui, sans-serif' }}>What's Vanguard offering?</h3>
                <p className="text-black text-sm leading-relaxed text-justify" style={{ fontFamily: '"FF Mark Pro Regular", system-ui, sans-serif' }}>
                  <span className="underline" style={{ color: '#2159d2' }}>The Vanguard Investor Choice Pilot Program</span> is providing a 
                  way for you to participate in the proxy voting process by 
                  choosing a proxy voting policy that will help direct how your 
                  shares in select Vanguard equity index funds are voted on 
                  shareholder matters at the companies held in those funds.
                </p>
              </div>
              
              <div className="lg:pl-4 order-3 lg:order-3">
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: '"FF Mark Pro Heavy", system-ui, sans-serif' }}>What's proxy voting?</h3>
                <p className="text-black-700 text-sm leading-relaxed text-justify" style={{ fontFamily: '"FF Mark Pro Regular", system-ui, sans-serif' }}>
                  Public companies hold shareholder meetings where key issues
                  —such as electing the board of directors and executive pay—
                  are presented to a shareholder vote. Proxy voting enables 
                  shareholders to cast their votes without attending a specific 
                  company's meeting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-5 pt-20 md:pt-32 pb-12">
        <div className="text-left mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-black-900 mb-4 md:mb-6" style={{ fontFamily: '"FF Mark Pro Heavy", system-ui, sans-serif' }}>
            Want to choose a policy for all Vanguard funds?
          </h2>
          <p className="text-base md:text-lg text-black-700 mb-2 text-justify" style={{ fontFamily: '"FF Mark Pro Regular", system-ui, sans-serif' }}>
            Vanguard Investor Choice currently offers the following policy options that reflect a broad range of 
            approaches to proxy voting that you may choose to apply to your{' '}
            <span className="underline" style={{ color: '#2159d2' }}>
              participating Vanguard equity index funds
            </span>{' '}
            held in <span className="underline" style={{ color: '#2159d2' }}>
              the accounts that are eligible
            </span>, now or in the future, to participate in Investor Choice.
          </p>
          <p className="text-black-600 mb-6 md:mb-8 text-justify" style={{ fontFamily: '"FF Mark Pro Regular", system-ui, sans-serif' }}>
            Expand each of the following policies to review the details and make your selection. You can change 
            your choice at any time. <strong>Participation in this program is voluntary. No further action is required if you 
            choose not to participate.</strong>
          </p>
        </div>

        {/* Policy Options */}
        <div className="space-y-4 mb-8 md:mb-12">
          {policies.map((policy) => {
            const Icon = typeof policy.icon === 'function' ? policy.icon : policy.icon;
            const isSelected = selectedGlobalPolicies.includes(policy.id);
            
            return (
              <div key={policy.id} className="border rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="bg-teal-100 text-teal-800 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full flex-shrink-0">
                      {typeof policy.icon === 'function' ? (
                        <policy.icon className="w-6 h-6 md:w-8 md:h-8 text-black" />
                      ) : (
                        <Icon className="w-6 h-6 md:w-8 md:h-8 text-black" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <h3 className="text-lg md:text-2xl font-bold text-black-900 break-words" style={{ fontFamily: '"FF Mark Pro Heavy", system-ui, sans-serif' }}>{policy.name}</h3>
                      {policy.id === 'vanguard-advised' && <span className="text-sm text-black-500 flex-shrink-0">*</span>}
                      {/* Dropdown arrow icon */}
                      <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {isSelected ? (
                    <div className="flex items-center space-x-2 font-bold bg-black px-6 md:px-8 py-2 rounded-full self-start md:self-center">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-black bg-white">
                        <Check className="w-4 h-4 text-black" />
                      </span>
                      <span className="text-base text-white">Selected</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleGlobalPolicySelect(policy.id)}
                      className="border-2 border-black px-4 py-2 rounded-full transition-colors text-sm md:text-base font-bold text-black hover:bg-black hover:text-white self-start md:self-center whitespace-nowrap"
                      style={{ fontFamily: '"FF Mark Pro Regular", system-ui, sans-serif' }}
                    >
                      Apply to all funds
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Individual Fund Selection */}
        <div className="mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black-900 mb-4 md:mb-6" style={{ fontFamily: '"FF Mark Pro Heavy", system-ui, sans-serif' }}>
            Want to choose policies for individual funds?
          </h2>
          <p className="text-black-700 mb-4 md:mb-6 text-justify" style={{ fontFamily: '"FF Mark Pro Regular", system-ui, sans-serif' }}>
            If you'd like to apply a different voting policy to an individual participating Vanguard fund in your 
            eligible Vanguard accounts, you should first select a policy above to apply to all of your Vanguard 
            funds. Then you can come back here to edit policy selections for individual participating Vanguard 
            funds.
          </p>
          
          <div className="flex items-start space-x-3 mb-6 md:mb-8">
            <div className="relative flex-shrink-0 mt-1">
              <input
                type="checkbox"
                id="individual-policies"
                checked={individualPoliciesEnabled}
                onChange={(e) => setIndividualPoliciesEnabled(e.target.checked)}
                className="sr-only"
              />
              <div 
                onClick={() => setIndividualPoliciesEnabled(!individualPoliciesEnabled)}
                className={`w-14 h-8 rounded-full cursor-pointer transition-colors border-2 ${
                  individualPoliciesEnabled ? 'bg-gray-400 border-black-700' : 'bg-gray-200 border-gray-300'
                } relative`}
              >
                <div 
                  className={`w-6 h-6 bg-black rounded-full shadow-md transform transition-transform absolute top-0.5 ${
                    individualPoliciesEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                >
                  {individualPoliciesEnabled && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <label htmlFor="individual-policies" className="text-black-700 cursor-pointer flex-1" style={{ fontFamily: '"FF Mark Pro Regular", system-ui, sans-serif' }}>
              Yes, let me choose policies for individual funds.
            </label>
          </div>

          {individualPoliciesEnabled && (
            <div>
              <div className="hidden md:grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-black-900 mb-4 flex items-center space-x-2" style={{ fontFamily: '"FF Mark Pro Heavy", system-ui, sans-serif' }}>
                    <span>Your participating funds</span>
                    <div className="w-4 h-4 bg-black-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">?</span>
                    </div>
                  </h3>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black-900 mb-4 text-right" style={{ fontFamily: '"FF Mark Pro Heavy", system-ui, sans-serif' }}>Your policy</h3>
                </div>
              </div>

              {fundsList.map((fund, index) => {
                const PolicyIconComponent = getPolicyIcon(fundPolicies[index]);
                return (
                  <div key={index} className="border-b border-black-200 py-4">
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8">
                      <div className="order-1">
                        <h4 className="font-medium text-black-900 mb-2 text-sm md:text-base" style={{ fontFamily: '"FF Mark Pro Heavy", system-ui, sans-serif' }}>{fund.name}</h4>
                        <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
                          <span className="text-xs text-black-600 bg-black-100 px-2 py-1 rounded inline-block" style={{ fontFamily: '"FF Mark Pro Regular", system-ui, sans-serif' }}>{fund.accountNumber}</span>
                          <span className="text-xs text-black-600" style={{ fontFamily: '"FF Mark Pro Regular", system-ui, sans-serif' }}>{fund.account}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end order-2">
                        <div className="md:hidden">
                          <span className="text-sm font-semibold text-black-900">Policy:</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-black-900 text-sm underline" style={{ fontFamily: '"FF Mark Pro Regular", system-ui, sans-serif' }}>{getPolicyName(fundPolicies[index])}</span>
                          <button
                            onClick={() => handlePolicyChange(index)}
                            className="text-black hover:text-black-700 font-medium p-1"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Policy Selection Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-lg md:text-xl font-semibold pr-4">Select a different policy for this fund</h3>
                <button
                  onClick={() => setShowPolicyModal(false)}
                  className="text-black-500 hover:text-black-700 flex-shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-3 mb-6">
                {policies.map((policy) => (
                  <label key={policy.id} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="policy-selection"
                      value={policy.id}
                      checked={tempPolicySelection === policy.id}
                      onChange={(e) => setTempPolicySelection(e.target.value)}
                      className="sr-only"
                    />
                    <span
                      className={`w-5 h-5 rounded-full border border-black border-[1.5px] bg-white flex items-center justify-center transition-colors duration-150 flex-shrink-0 mt-0.5`}
                    >
                      {tempPolicySelection === policy.id && (
                        <span className="w-2 h-2 rounded-full bg-black block"></span>
                      )}
                    </span>
                    <span className="text-black-900 text-sm md:text-base break-words">{policy.name}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <button
                  onClick={savePolicyChange}
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-black-800 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowPolicyModal(false)}
                  className="border border-black-300 px-6 py-2 rounded-full hover:bg-black-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-lg md:text-xl font-semibold pr-4">Confirm Policy Selection</h3>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-black-500 hover:text-black-700 flex-shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-black-700 mb-4 text-sm md:text-base">
                By selecting this policy, you understand that it will apply to all current and future funds participating in 
                Investor Choice held in your eligible Vanguard accounts.
              </p>
              
              <p className="text-black-600 text-sm mb-4 md:mb-6">This includes funds advised by Vanguard that:</p>
              
              <ul className="text-sm text-black-600 mb-6 space-y-1">
                <li>• You already own that are currently in the Investor Choice Pilot Program or that join the Pilot later.</li>
                <li>• You purchase at a later date that are participating in the Investor Choice Pilot Program at that time.</li>
              </ul>
              
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <button
                  onClick={confirmGlobalPolicy}
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-black-800 transition-colors"
                >
                  Yes, apply to all funds
                </button>
                <button
                  onClick={cancelGlobalPolicy}
                  className="border border-black-300 px-6 py-2 rounded-full hover:bg-black-50 transition-colors"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;