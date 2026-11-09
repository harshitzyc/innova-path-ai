import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Users, Scale, Plane, ShoppingCart, BarChart3, 
  ShieldCheck, Bell, HelpCircle, User, Search, Menu, X, ChevronRight, 
  CheckCircle, AlertTriangle, XCircle, Clock, Upload, Bot, MessageSquare,
  TrendingUp, TrendingDown, MapPin, Building2, Calendar, DollarSign, Award, 
  Lock, Eye, EyeOff, RefreshCw, Brain, Target, Zap, Globe, Activity,
  Shield, Download, FileCheck, AlertCircle, Languages, Sun, Moon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_STARTUPS = [
  { id: 1, name: 'AgriVision AI', tech: 'Computer Vision', sector: 'Agriculture', dpiit: true, experience: '3 yrs', match: 92, risk: 'Low', trustScore: 88, pastPilots: 5 },
  { id: 2, name: 'CivicFlow Technologies', tech: 'GovTech SaaS', sector: 'Public Services', dpiit: true, experience: '2 yrs', match: 88, risk: 'Low', trustScore: 85, pastPilots: 3 },
  { id: 3, name: 'MedTrack Innovations', tech: 'HealthTech', sector: 'Healthcare', dpiit: true, experience: '4 yrs', match: 84, risk: 'Medium', trustScore: 79, pastPilots: 7 },
  { id: 4, name: 'GreenGrid Labs', tech: 'CleanTech', sector: 'Energy', dpiit: true, experience: '1 yr', match: 81, risk: 'Medium', trustScore: 72, pastPilots: 2 },
];

const STAGES = [
  { id: 1, name: 'Identify', status: 'completed' },
  { id: 2, name: 'Discover', status: 'completed' },
  { id: 3, name: 'Screen', status: 'completed' },
  { id: 4, name: 'Evaluate', status: 'current' },
  { id: 5, name: 'Pilot', status: 'upcoming' },
  { id: 6, name: 'Contract', status: 'upcoming' },
  { id: 7, name: 'Measure', status: 'upcoming' },
  { id: 8, name: 'Validate', status: 'upcoming' },
  { id: 9, name: 'Scale', status: 'upcoming' },
];

const MILESTONES = [
  { id: 1, name: 'Prototype Deployment', amount: '₹20 Lakhs', status: 'Completed', paid: true, date: '2026-09-15' },
  { id: 2, name: 'Field Pilot Launch', amount: '₹30 Lakhs', status: 'Completed', paid: true, date: '2026-10-01' },
  { id: 3, name: 'Impact Validation', amount: '₹25 Lakhs', status: 'In Progress', paid: false, date: '2026-10-30' },
  { id: 4, name: 'Scale Readiness', amount: '₹25 Lakhs', status: 'Upcoming', paid: false, date: '2026-11-30' },
];

// ==========================================
// REUSABLE COMPONENTS
// ==========================================
const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
    green: 'bg-green-100 text-green-800 border border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    red: 'bg-red-100 text-red-800 border border-red-200',
    slate: 'bg-slate-100 text-slate-800 border border-slate-200',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>{children}</span>;
};

const ProgressBar = ({ value, color = 'bg-gov-800' }) => (
  <div className="w-full bg-slate-200 rounded-full h-2">
    <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${value}%` }}></div>
  </div>
);

// ==========================================
// NEW FEATURES: GIGW, E-SIGN, GEM, DOCS
// ==========================================
const GIGWToolbar = () => {
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className={`flex flex-wrap justify-between items-center px-4 py-1.5 text-xs border-b ${highContrast ? 'bg-black text-yellow-300 border-yellow-500' : 'bg-slate-200 text-slate-700 border-slate-300'}`}>
      <div className="flex items-center gap-4">
        <span className="font-semibold cursor-pointer hover:underline">Skip to Main Content</span>
        <span className="hidden sm:inline cursor-pointer hover:underline">Screen Reader Access</span>
      </div>
      <div className="flex items-center gap-4 mt-1 sm:mt-0">
        <div className="flex items-center gap-2">
          <span className="font-bold">Font Size:</span>
          <button onClick={() => setFontSize('small')} className={`px-1 hover:underline ${fontSize === 'small' ? 'font-bold' : ''}`}>A-</button>
          <button onClick={() => setFontSize('normal')} className={`px-1 hover:underline ${fontSize === 'normal' ? 'font-bold' : ''}`}>A</button>
          <button onClick={() => setFontSize('large')} className={`px-1 hover:underline ${fontSize === 'large' ? 'font-bold' : ''}`}>A+</button>
        </div>
        <button 
          onClick={() => setHighContrast(!highContrast)} 
          className={`px-2 py-0.5 rounded border flex items-center gap-1 ${highContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-white border-slate-400'}`}
        >
          {highContrast ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />} High Contrast
        </button>
        <div className="flex items-center gap-1 cursor-pointer">
          <Languages className="w-3 h-3" />
          <select className="bg-transparent border-none font-semibold cursor-pointer outline-none">
            <option>English</option>
            <option>हिन्दी</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const ESignModal = ({ isOpen, onClose, onConfirm, title }) => {
  const [step, setStep] = useState(1);
  if (!isOpen) return null;

  const handleVerify = () => {
    setStep(2);
    setTimeout(() => {
      setStep(3);
      setTimeout(() => {
        onConfirm();
        setStep(1);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gov-900 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><Shield className="w-5 h-5" /> Digital Signature (e-Sign)</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 text-center">
          {step === 1 && (
            <>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-gov-900 mb-2">Verify {title}</h4>
              <p className="text-sm text-slate-600 mb-6">This action requires Digital Signature Certificate (DSC) authentication. Please verify your identity to proceed.</p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-6 text-left text-xs">
                <div className="flex justify-between mb-1"><span className="text-slate-500">User:</span> <span className="font-semibold">Innovation Officer</span></div>
                <div className="flex justify-between mb-1"><span className="text-slate-500">DSC Token:</span> <span className="font-semibold text-green-600">Connected</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Valid Until:</span> <span className="font-semibold">Dec 2027</span></div>
              </div>
              <button onClick={handleVerify} className="w-full btn-primary justify-center py-3">Verify DSC & Sign</button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h4 className="text-lg font-bold text-gov-900">Verifying with Certifying Authority...</h4>
              <p className="text-sm text-slate-500 mt-2">Please do not close this window.</p>
            </>
          )}
          {step === 3 && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-green-700">Successfully Signed!</h4>
              <p className="text-sm text-slate-500 mt-2">Transaction ID: DSC-{Math.floor(Math.random() * 100000)}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const GeMModal = ({ isOpen, onClose }) => {
  const [syncing, setSyncing] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-indiaGreen text-white p-4 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> GeM API Sync</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          {!syncing ? (
            <>
              <h4 className="font-bold text-gov-900 mb-4">Map Pilot Dossier to GeM Bid</h4>
              <div className="space-y-2 mb-6">
                {[
                  { left: 'Solution Name', right: 'Item Description' },
                  { left: 'Validation Score (92)', right: 'Technical Qualification' },
                  { left: 'Pilot Budget (₹50L)', right: 'L1 Bid Value' },
                  { left: 'DPIIT Status', right: 'Bidder Eligibility' }
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="font-medium text-slate-700">{row.left}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-indiaGreen">{row.right}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setSyncing(true)} className="w-full btn-primary justify-center py-3 bg-indiaGreen hover:bg-green-800">Initiate GeM Sync</button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-green-200 border-t-indiaGreen rounded-full animate-spin mx-auto mb-4"></div>
              <h4 className="text-lg font-bold text-gov-900">Syncing with GeM Portal...</h4>
              <p className="text-sm text-slate-500 mt-2">Pushing dossier to Government e-Marketplace API.</p>
              <div className="mt-6 w-full bg-slate-200 rounded-full h-2">
                <div className="bg-indiaGreen h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DocumentVault = () => {
  const docs = [
    { name: 'DPIIT Recognition Certificate', date: 'Oct 12, 2026', status: 'Verified', icon: Shield },
    { name: 'GST Registration (27AABCU9603R1ZM)', date: 'Oct 10, 2026', status: 'Verified', icon: FileCheck },
    { name: 'PAN Card (AABCU9603R)', date: 'Oct 10, 2026', status: 'Verified', icon: FileCheck },
    { name: 'Past Experience Letters (3)', date: 'Oct 05, 2026', status: 'Under Review', icon: AlertCircle },
  ];

  return (
    <div className="card mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gov-900 flex items-center gap-2"><Upload className="w-5 h-5" /> Document Vault & Verification</h3>
        <Badge color="green">Auto-Verified via API</Badge>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {docs.map((doc, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-gov-800 transition-colors cursor-pointer">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${doc.status === 'Verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
              <doc.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 truncate">{doc.name}</h4>
              <p className="text-xs text-slate-500">Uploaded: {doc.date}</p>
              <div className="mt-1">
                <Badge color={doc.status === 'Verified' ? 'green' : 'yellow'}>{doc.status}</Badge>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// LAYOUT COMPONENTS
// ==========================================
const Header = ({ role, onLogout }) => {
  const [showNotif, setShowNotif] = useState(false);
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <GIGWToolbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gov-800 rounded-md flex items-center justify-center text-white font-bold text-sm border border-gov-700">IP</div>
            <div>
              <h1 className="text-lg font-bold text-gov-900 leading-tight tracking-tight">INNOVA-PATH</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Digital Innovation & Public Procurement</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/notifications" className="text-slate-500 hover:text-gov-800 relative p-2">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden lg:block">
                <div className="text-sm font-semibold text-slate-900">Innovation Officer</div>
                <div className="text-xs text-slate-500 capitalize">{role} Portal</div>
              </div>
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <button onClick={onLogout} className="text-xs text-red-600 hover:underline font-medium">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Sidebar = ({ role }) => {
  const location = useLocation();
  const navItems = {
    'Department': [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Intelligence', icon: Brain, path: '/intelligence' },
      { name: 'Challenges', icon: FileText, path: '/challenges' },
      { name: 'Discover Startups', icon: Users, path: '/discover' },
      { name: 'Evaluation', icon: Scale, path: '/evaluation' },
      { name: 'Pilots', icon: Plane, path: '/pilots' },
      { name: 'Contracts', icon: ShoppingCart, path: '/contracts' },
      { name: 'Analytics', icon: BarChart3, path: '/analytics' },
      { name: 'Audit Trail', icon: ShieldCheck, path: '/audit' },
      { name: 'Scale Up', icon: Award, path: '/scale' },
    ],
    'Startup': [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/startup-dashboard' },
      { name: 'Open Challenges', icon: FileText, path: '/open-challenges' },
      { name: 'My Applications', icon: FileText, path: '/applications' },
      { name: 'Active Pilots', icon: Plane, path: '/pilots' },
      { name: 'Payments', icon: DollarSign, path: '/payments' },
    ],
    'Expert': [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/expert-dashboard' },
      { name: 'Evaluation Queue', icon: Scale, path: '/evaluation' },
      { name: 'Completed Reviews', icon: CheckCircle, path: '/completed-reviews' },
    ],
    'Auditor': [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/auditor-dashboard' },
      { name: 'Audit Trail', icon: ShieldCheck, path: '/audit' },
      { name: 'Compliance', icon: AlertTriangle, path: '/compliance' },
    ]
  };

  const items = navItems[role] || navItems['Department'];

  return (
    <aside className="w-64 bg-gov-900 text-slate-300 min-h-screen hidden md:block border-r border-gov-800 relative">
      <div className="p-4">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Main Navigation</div>
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${isActive ? 'bg-gov-800 text-white shadow-sm border-l-4 border-saffron' : 'hover:bg-gov-800 hover:text-white'}`}>
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="absolute bottom-0 w-64 p-4 border-t border-gov-800 bg-gov-900">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Lock className="w-3 h-3" />
          <span>256-bit Encrypted Session</span>
        </div>
        <div className="text-[10px] text-slate-600 mt-2 px-1">v2.4.1 | Prototype Environment</div>
      </div>
    </aside>
  );
};

// ==========================================
// LOGIN PAGE
// ==========================================
const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState('Department');
  const [showPass, setShowPass] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin(role);
      navigate(role === 'Department' ? '/dashboard' : role === 'Startup' ? '/startup-dashboard' : role === 'Expert' ? '/expert-dashboard' : '/auditor-dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <div className="h-1.5 w-full bg-gradient-to-r from-saffron via-white to-indiaGreen"></div>
      <GIGWToolbar />
      <div className="bg-gov-900 text-white text-xs py-2 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wide">भारत सरकार | Government of India</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">Ministry of Electronics & Information Technology (Prototype)</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <span className="hidden sm:inline">Skip to Main Content</span>
          <span className="cursor-pointer hover:text-white">A-</span>
          <span className="cursor-pointer hover:text-white">A</span>
          <span className="cursor-pointer hover:text-white">A+</span>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl flex overflow-hidden">
          <div className="hidden lg:flex lg:w-5/12 bg-gov-900 p-10 flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 backdrop-blur-sm">
                  <Building2 className="w-8 h-8 text-saffron" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">INNOVA-PATH</h2>
                  <p className="text-xs text-slate-300 uppercase tracking-widest">Public Procurement Portal</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-saffron">Promoting Atmanirbhar Bharat</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                A transparent, legally compliant, and structured pathway for Government departments to identify, pilot, procure, and scale innovative solutions from DPIIT-recognized startups.
              </p>
              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, text: 'End-to-End Encrypted & Secure' },
                  { icon: CheckCircle, text: 'DPIIT Verified Startup Integration' },
                  { icon: Scale, text: 'Immutable Blockchain-style Audit Trail' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-200 bg-white/5 p-3 rounded-lg border border-white/10">
                    <item.icon className="w-5 h-5 text-indiaGreen shrink-0" /> 
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10 pt-8 border-t border-white/10">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Supported By</p>
              <div className="flex items-center gap-4 opacity-70">
                <div className="flex items-center gap-2 text-xs font-semibold"><Building2 className="w-4 h-4" /> MeitY</div>
                <div className="flex items-center gap-2 text-xs font-semibold"><Building2 className="w-4 h-4" /> DPIIT</div>
                <div className="flex items-center gap-2 text-xs font-semibold"><Building2 className="w-4 h-4" /> NIC</div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-7/12 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gov-900">Secure Portal Login</h3>
              <p className="text-sm text-slate-500 mt-1">Authorized Personnel Only. All activities are monitored and logged.</p>
            </div>

            <div className="flex border-b border-slate-200 mb-6">
              <button onClick={() => setLoginMethod('password')} className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${loginMethod === 'password' ? 'border-gov-800 text-gov-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Password Login</button>
              <button onClick={() => setLoginMethod('otp')} className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${loginMethod === 'otp' ? 'border-gov-800 text-gov-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>OTP Login</button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">User Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-gov-800 focus:border-gov-800 outline-none transition-all bg-white">
                  <option>Department</option>
                  <option>Startup</option>
                  <option>Expert</option>
                  <option>Auditor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">User ID / Email</label>
                <input type="text" defaultValue={`officer@${role.toLowerCase()}.gov.in`} className="w-full border border-slate-300 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-gov-800 focus:border-gov-800 outline-none transition-all" />
              </div>

              {loginMethod === 'password' ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} defaultValue="password123" className="w-full border border-slate-300 rounded-md px-3 py-2.5 focus:ring-2 focus:ring-gov-800 focus:border-gov-800 outline-none transition-all" />
                    <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-1">
                    <a href="#" className="text-xs text-gov-800 hover:underline">Forgot Password?</a>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Enter OTP</label>
                  <div className="flex gap-2">
                    {[1,2,3,4].map(i => (
                      <input key={i} type="text" maxLength={1} className="w-12 h-12 text-center border border-slate-300 rounded-md text-lg font-bold focus:ring-2 focus:ring-gov-800 outline-none" defaultValue={i} />
                    ))}
                  </div>
                  <div className="flex justify-end mt-2">
                    <button className="text-xs text-gov-800 hover:underline font-medium">Resend OTP (00:45)</button>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-md p-3 flex items-center gap-3">
                <div className="w-20 h-9 bg-slate-200 rounded flex items-center justify-center text-sm font-mono text-slate-600 tracking-[0.2em] select-none font-bold italic">8X4K</div>
                <input type="text" placeholder="Enter CAPTCHA" className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gov-800" />
                <RefreshCw className="w-4 h-4 text-slate-400 cursor-pointer hover:text-gov-800" />
              </div>

              <button onClick={handleDemoLogin} disabled={isLoading} className="w-full btn-primary justify-center py-3 text-base font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-70">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Authenticating...
                  </span>
                ) : (
                  <><Lock className="w-4 h-4" /> Secure Login</>
                )}
              </button>
              
              <div className="text-center pt-2">
                <button onClick={handleDemoLogin} className="text-sm text-gov-800 font-medium hover:underline flex items-center justify-center gap-1 mx-auto">
                  <Eye className="w-3 h-3" /> Use Demo Credentials (Bypass Auth)
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-6 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> 256-bit SSL</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> NIC Hosted</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gov-900 text-slate-400 text-[10px] py-3 px-4 text-center border-t border-gov-800">
        <p>© 2026 INNOVA-PATH. A Smart India Hackathon Prototype. Content owned by respective Ministries.</p>
        <p className="mt-1">Last Updated: {new Date().toLocaleDateString('en-IN')} | Visitor Count: 14,203</p>
      </div>
    </div>
  );
};

// ==========================================
// DEPARTMENT DASHBOARD
// ==========================================
const DepartmentDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gov-900">Department Dashboard</h2>
          <p className="text-slate-500">Ministry of Agriculture & Farmers Welfare | Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <Link to="/challenges" className="btn-primary"><FileText className="w-4 h-4" /> Create New Challenge</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Challenges', val: '12', sub: '+2 this month', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'up' },
          { label: 'Startups Matched', val: '47', sub: '92% DPIIT Verified', icon: Users, color: 'text-green-600', bg: 'bg-green-50', trend: 'up' },
          { label: 'Ongoing Pilots', val: '8', sub: '3 nearing completion', icon: Plane, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'neutral' },
          { label: 'Procurement Value', val: '₹8.4 Cr', sub: '₹1.26 Cr pending', icon: DollarSign, color: 'text-gov-800', bg: 'bg-gov-50', trend: 'up' },
        ].map((kpi, i) => (
          <div key={i} className="card p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-slate-500'}`}>
                {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {kpi.sub}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{kpi.val}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gov-900">Procurement Lifecycle Tracker</h3>
          <Badge color="blue">Active Pipeline</Badge>
        </div>
        <div className="relative overflow-x-auto pb-4">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 hidden md:block"></div>
          <div className="flex justify-between relative min-w-[800px] md:min-w-0">
            {STAGES.map((stage) => (
              <div key={stage.id} className="flex flex-col items-center z-10 group cursor-pointer">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all shadow-sm ${stage.status === 'completed' ? 'bg-green-600 border-green-600 text-white' : stage.status === 'current' ? 'bg-gov-800 border-gov-800 text-white ring-4 ring-gov-100' : 'bg-white border-slate-300 text-slate-400'}`}>
                  {stage.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : stage.id}
                </div>
                <span className={`text-xs font-semibold mt-3 text-center ${stage.status === 'current' ? 'text-gov-900' : 'text-slate-500'}`}>{stage.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 p-4 bg-gov-50 rounded-lg border border-gov-100 flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-gov-900 text-sm">Current Focus: Stage 4 - Evaluate</h4>
            <p className="text-xs text-slate-600 mt-1">Expert panels are reviewing 3 shortlisted startups for "Smart Crop Disease Detection".</p>
          </div>
          <Link to="/evaluation" className="btn-primary text-sm py-1.5 px-3">View Queue</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/intelligence" className="card p-5 hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <h4 className="font-bold text-gov-900">AI Intelligence</h4>
          </div>
          <p className="text-xs text-slate-600">View predictive analytics and citizen impact insights</p>
        </Link>
        <Link to="/contracts" className="card p-5 hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <h4 className="font-bold text-gov-900">Contract Management</h4>
          </div>
          <p className="text-xs text-slate-600">Track milestones and payments</p>
        </Link>
        <Link to="/analytics" className="card p-5 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h4 className="font-bold text-gov-900">Analytics & Reports</h4>
          </div>
          <p className="text-xs text-slate-600">View performance metrics and KPIs</p>
        </Link>
      </div>
    </div>
  );
};

// ==========================================
// UNIQUE FEATURE: PROCUREMENT INTELLIGENCE
// ==========================================
const IntelligenceDashboard = () => {
  const riskData = [
    { name: 'High Risk', value: 2, color: '#EF4444' },
    { name: 'Medium Risk', value: 5, color: '#F59E0B' },
    { name: 'Low Risk', value: 12, color: '#10B981' },
  ];
  const impactData = [
    { month: 'Jul', citizens: 1200 },
    { month: 'Aug', citizens: 2800 },
    { month: 'Sep', citizens: 4500 },
    { month: 'Oct', citizens: 7200 },
    { month: 'Nov', citizens: 11000 },
  ];
  const reuseData = [
    { dept: 'Agriculture', count: 8 },
    { dept: 'Health', count: 6 },
    { dept: 'Education', count: 5 },
    { dept: 'Rural Dev', count: 4 },
    { dept: 'Urban Dev', count: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gov-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Procurement Intelligence Dashboard
          </h2>
          <p className="text-slate-500">AI-powered insights for smarter procurement decisions</p>
        </div>
        <Badge color="purple">AI-Powered</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gov-900">Pilot Success Predictor</h3>
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-4xl font-bold text-green-600 mb-2">87%</div>
          <div className="text-sm text-slate-600 mb-3">Predicted success rate for current pipeline</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs"><span>Technical Feasibility</span><span className="font-bold text-green-600">92%</span></div>
            <ProgressBar value={92} color="bg-green-600" />
            <div className="flex justify-between text-xs"><span>Budget Alignment</span><span className="font-bold text-blue-600">85%</span></div>
            <ProgressBar value={85} color="bg-blue-600" />
            <div className="flex justify-between text-xs"><span>Startup Track Record</span><span className="font-bold text-purple-600">88%</span></div>
            <ProgressBar value={88} color="bg-purple-600" />
          </div>
        </div>

        <div className="card border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gov-900">Citizen Impact Calculator</h3>
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-4xl font-bold text-blue-600 mb-2">11,000+</div>
          <div className="text-sm text-slate-600 mb-3">Estimated citizens benefiting this quarter</div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={impactData}>
              <Area type="monotone" dataKey="citizens" stroke="#3B82F6" fill="#DBEAFE" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gov-900">Multi-Dept Reuse Potential</h3>
            <Zap className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-4xl font-bold text-green-600 mb-2">26</div>
          <div className="text-sm text-slate-600 mb-3">Departments eligible to reuse current solutions</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={reuseData}>
              <XAxis dataKey="dept" tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-gov-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-gov-800" />
          Startup Trust Score Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Startup</th>
                <th className="px-4 py-3">Trust Score</th>
                <th className="px-4 py-3">Past Pilots</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">AI Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_STARTUPS.map((s) => (
                <tr key={s.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${s.trustScore >= 85 ? 'bg-green-600' : s.trustScore >= 75 ? 'bg-blue-600' : 'bg-yellow-600'}`}>
                        {s.trustScore}
                      </div>
                      <div className="text-xs text-slate-500">
                        <div>{s.trustScore >= 85 ? 'Excellent' : s.trustScore >= 75 ? 'Good' : 'Fair'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{s.pastPilots} completed</td>
                  <td className="px-4 py-3"><Badge color={s.risk === 'Low' ? 'green' : 'yellow'}>{s.risk}</Badge></td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-purple-700 font-medium">
                      {s.trustScore >= 85 ? '✅ Highly Recommended' : s.trustScore >= 75 ? '⚠️ Proceed with Caution' : '❌ Additional Review Needed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-gov-900 mb-4">Portfolio Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {riskData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-bold text-gov-900 mb-4">AI-Generated Insights</h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-green-900">High Success Probability</div>
                  <div className="text-xs text-green-700">AgriVision AI pilot shows 92% predicted success rate based on technical alignment and past performance.</div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-yellow-900">Budget Alert</div>
                  <div className="text-xs text-yellow-700">GreenGrid Labs proposal exceeds typical pilot budget by 15%. Consider negotiating scope.</div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Activity className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-blue-900">Reuse Opportunity</div>
                  <div className="text-xs text-blue-700">CivicFlow's solution can be deployed in 6 other departments with minimal customization.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// CONTRACTS & MILESTONES
// ==========================================
const ContractsPage = () => {
  const totalValue = MILESTONES.reduce((sum, m) => sum + parseInt(m.amount.replace(/[^\d]/g, '')), 0);
  const paidValue = MILESTONES.filter(m => m.paid).reduce((sum, m) => sum + parseInt(m.amount.replace(/[^\d]/g, '')), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gov-900">Contract & Milestone Management</h2>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="card p-5 border-l-4 border-l-gov-800">
          <div className="text-2xl font-bold text-slate-900">₹{totalValue}L</div>
          <div className="text-xs text-slate-500">Total Contract Value</div>
        </div>
        <div className="card p-5 border-l-4 border-l-green-600">
          <div className="text-2xl font-bold text-green-600">₹{paidValue}L</div>
          <div className="text-xs text-slate-500">Paid to Startup</div>
        </div>
        <div className="card p-5 border-l-4 border-l-yellow-600">
          <div className="text-2xl font-bold text-yellow-600">₹{totalValue - paidValue}L</div>
          <div className="text-xs text-slate-500">Pending Payments</div>
        </div>
        <div className="card p-5 border-l-4 border-l-blue-600">
          <div className="text-2xl font-bold text-blue-600">{MILESTONES.filter(m => m.paid).length}/{MILESTONES.length}</div>
          <div className="text-xs text-slate-500">Milestones Completed</div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-gov-900 mb-4">Milestone Payment Tracker</h3>
        <div className="space-y-4">
          {MILESTONES.map((milestone) => (
            <div key={milestone.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${milestone.paid ? 'bg-green-600' : milestone.status === 'In Progress' ? 'bg-yellow-600' : 'bg-slate-400'}`}>
                {milestone.paid ? <CheckCircle className="w-5 h-5" /> : milestone.id}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-900">{milestone.name}</h4>
                    <p className="text-xs text-slate-500">Due: {milestone.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gov-900">{milestone.amount}</div>
                    <Badge color={milestone.paid ? 'green' : milestone.status === 'In Progress' ? 'yellow' : 'slate'}>
                      {milestone.status}
                    </Badge>
                  </div>
                </div>
                {milestone.paid && (
                  <div className="text-xs text-green-700 flex items-center gap-1 mt-2">
                    <CheckCircle className="w-3 h-3" /> Payment processed on {milestone.date}
                  </div>
                )}
                {milestone.status === 'In Progress' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1"><span>Validation in progress</span><span className="font-bold">65%</span></div>
                    <ProgressBar value={65} color="bg-yellow-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-l-4 border-l-yellow-500">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900">SLA Alert</h4>
            <p className="text-sm text-yellow-800">Milestone 3 payment approval is due in 3 days. Ensure validation report is submitted by Oct 28, 2026.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// NOTIFICATION CENTER
// ==========================================
const NotificationCenter = () => {
  const notifications = [
    { id: 1, type: 'success', title: 'Challenge Published', message: 'Smart Crop Disease Detection challenge is now live', time: '2 hours ago', read: false },
    { id: 2, type: 'warning', title: 'Evaluation Pending', message: '3 startups awaiting expert review for CH-2026-014', time: '5 hours ago', read: false },
    { id: 3, type: 'info', title: 'Milestone Completed', message: 'AgriVision AI completed Field Pilot Launch milestone', time: '1 day ago', read: true },
    { id: 4, type: 'error', title: 'Payment Delayed', message: 'Milestone 2 payment for CivicFlow is 2 days overdue', time: '2 days ago', read: true },
    { id: 5, type: 'success', title: 'Validation Approved', message: 'Independent validation completed for MedTrack pilot', time: '3 days ago', read: true },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gov-900">Notification Center</h2>
      <div className="card">
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-4 rounded-lg border ${notif.read ? 'bg-white border-slate-200' : 'bg-blue-50 border-blue-200'} flex items-start gap-3`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                notif.type === 'success' ? 'bg-green-100 text-green-600' :
                notif.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                notif.type === 'error' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {notif.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                 notif.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                 notif.type === 'error' ? <XCircle className="w-4 h-4" /> :
                 <Bell className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-900 text-sm">{notif.title}</h4>
                  <span className="text-xs text-slate-500">{notif.time}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
              </div>
              {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// CHALLENGE BUILDER (With E-Sign)
// ==========================================
const ChallengeBuilder = () => {
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showESign, setShowESign] = useState(false);

  const handleAIGenerate = () => {
    setLoading(true);
    setTimeout(() => { setGenerated(true); setLoading(false); }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ESignModal 
        isOpen={showESign} 
        onClose={() => setShowESign(false)} 
        onConfirm={() => alert('Challenge Published Successfully with Digital Signature!')} 
        title="Challenge Publication" 
      />
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
        <Link to="/dashboard" className="hover:text-gov-800">Dashboard</Link> <ChevronRight className="w-4 h-4" /> Create Challenge
      </div>
      <h2 className="text-2xl font-bold text-gov-900">Create Outcome-Based Challenge</h2>
      
      <div className="card space-y-6">
        <div>
          <h3 className="text-base font-semibold text-gov-900 mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-gov-800 text-white flex items-center justify-center text-xs">1</span> Department Problem</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-gov-800 outline-none"><option>Ministry of Agriculture</option></select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
              <select className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-gov-800 outline-none"><option>Agriculture & Allied</option></select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Problem Title</label>
              <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-gov-800 outline-none" placeholder="e.g., Early Detection of Crop Diseases" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-base font-semibold text-gov-900 mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-gov-800 text-white flex items-center justify-center text-xs">2</span> Desired Outcome</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Problem Description</label>
              <textarea rows={4} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-gov-800 outline-none" placeholder="Describe the current challenge..."></textarea>
            </div>
            <button onClick={handleAIGenerate} disabled={loading} className="btn-secondary bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
              <Bot className="w-4 h-4" /> {loading ? 'Generating...' : 'Generate Problem Statement with AI'}
            </button>
            {generated && (
              <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                <p className="text-sm text-purple-900 font-medium mb-2 flex items-center gap-2"><Bot className="w-4 h-4" /> AI Generated Outcome Statement:</p>
                <p className="text-sm text-slate-700 leading-relaxed">"Develop a scalable, offline-capable computer vision solution that enables field officers to identify at least 15 common crop diseases with 90%+ accuracy using standard smartphone cameras, reducing diagnostic time from 15 days to under 5 minutes per field."</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex justify-end gap-3">
          <button className="btn-secondary">Save Draft</button>
          <button onClick={() => setShowESign(true)} className="btn-primary">Publish Challenge</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// STARTUP DISCOVERY (With Document Vault)
// ==========================================
const StartupDiscovery = () => {
  const [selected, setSelected] = useState(null);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gov-900">Startup Discovery & AI Matching</h2>
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search startups, technology, sector..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-gov-800 outline-none" />
          </div>
          <select className="border border-slate-300 rounded-md px-3 py-2"><option>All Sectors</option></select>
          <select className="border border-slate-300 rounded-md px-3 py-2"><option>DPIIT Verified Only</option></select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr><th className="px-4 py-3">Startup Name</th><th className="px-4 py-3">Technology</th><th className="px-4 py-3">DPIIT Status</th><th className="px-4 py-3">Match Score</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {MOCK_STARTUPS.map((s) => (
                <tr key={s.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                  <td className="px-4 py-3">{s.tech}</td>
                  <td className="px-4 py-3">{s.dpiit ? <Badge color="green">Verified</Badge> : <Badge color="yellow">Pending</Badge>}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${s.match >= 90 ? 'text-green-600' : 'text-blue-600'}`}>{s.match}%</span>
                      <div className="w-16 bg-slate-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${s.match >= 90 ? 'bg-green-600' : 'bg-blue-600'}`} style={{ width: `${s.match}%` }}></div></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><button onClick={() => setSelected(s)} className="text-gov-800 hover:underline font-medium">View Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DocumentVault />

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gov-900">{selected.name}</h3>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Badge color="green">DPIIT Verified</Badge>
                <Badge color="blue">{selected.match}% AI Match</Badge>
                <Badge color={selected.risk === 'Low' ? 'green' : 'yellow'}>{selected.risk} Risk</Badge>
              </div>
              <h4 className="font-semibold text-gov-900 flex items-center gap-2"><Bot className="w-4 h-4" /> AI Match Explanation</h4>
              <ul className="space-y-2 text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 shrink-0" /> <span><strong>Technology Alignment:</strong> Directly maps to image-based crop monitoring requirements.</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 shrink-0" /> <span><strong>Budget Compatibility:</strong> Estimated cost falls within the ₹25-50 Lakhs pilot budget range.</span></li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-600 shrink-0" /> <span><strong>Previous Experience:</strong> Successfully deployed in 3 other state agriculture departments.</span></li>
              </ul>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button onClick={() => setSelected(null)} className="btn-secondary">Close</button>
                <button className="btn-primary">Shortlist for Evaluation</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// EVALUATION PANEL
// ==========================================
const EvaluationPanel = () => {
  const [scores, setScores] = useState({ innovation: 8, technical: 7, impact: 9, cost: 8, scalability: 7, security: 8 });
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gov-900">Expert Evaluation Panel</h2>
      <div className="card">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <h3 className="text-lg font-semibold text-gov-900">AgriVision AI - Smart Crop Disease Detection</h3>
          <p className="text-sm text-slate-500 mt-1">Proposal: Offline-first mobile application using lightweight CNN models for real-time disease identification.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Evaluation Criteria (1-10)</h4>
            {[
              { key: 'innovation', label: 'Innovation', weight: '25%' },
              { key: 'technical', label: 'Technical Feasibility', weight: '20%' },
              { key: 'impact', label: 'Impact', weight: '20%' },
              { key: 'cost', label: 'Cost Effectiveness', weight: '15%' },
              { key: 'scalability', label: 'Scalability', weight: '10%' },
              { key: 'security', label: 'Security & Compliance', weight: '10%' },
            ].map((c) => (
              <div key={c.key}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{c.label} <span className="text-slate-500">({c.weight})</span></span>
                  <span className="font-bold text-gov-800">{scores[c.key]}/10</span>
                </div>
                <input type="range" min="1" max="10" value={scores[c.key]} onChange={(e) => setScores({ ...scores, [c.key]: parseInt(e.target.value) })} className="w-full accent-gov-800" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="bg-gov-50 border border-gov-200 rounded-lg p-6 text-center">
              <div className="text-sm text-slate-600 mb-1">Overall Calculated Score</div>
              <div className="text-5xl font-bold text-gov-900">{Math.round((total / 60) * 100)}/100</div>
              <div className="mt-2"><Badge color="green">Recommended for Pilot</Badge></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expert Comments</label>
              <textarea rows={4} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="Enter detailed feedback..."></textarea>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-slate-600">I declare no conflict of interest with the evaluating startup.</span>
            </div>
            <div className="flex gap-3 pt-4">
              <button className="btn-secondary flex-1 justify-center">Save Draft</button>
              <button className="btn-primary flex-1 justify-center">Submit Evaluation</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PILOT MANAGEMENT
// ==========================================
const PilotManagement = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gov-900">Sandbox Pilot Management</h2>
    <div className="grid md:grid-cols-3 gap-6">
      <div className="card md:col-span-2">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-gov-900">Pilot: Smart Crop Disease Detection</h3>
            <p className="text-sm text-slate-500">Startup: AgriVision AI | District: Nashik, Maharashtra</p>
          </div>
          <Badge color="blue">Active</Badge>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm overflow-x-auto pb-2">
            {['Initiated', 'Tech Setup', 'Deployment', 'Field Testing', 'KPI Measurement', 'Validation'].map((step, i) => (
              <div key={i} className="flex flex-col items-center shrink-0">
                <div className={`w-3 h-3 rounded-full ${i <= 3 ? 'bg-green-600' : i === 4 ? 'bg-gov-800 ring-4 ring-gov-100' : 'bg-slate-300'}`}></div>
                {i < 5 && <div className="w-0.5 h-8 bg-slate-300"></div>}
                <span className={`text-xs mt-1 ${i === 4 ? 'font-bold text-gov-900' : 'text-slate-600'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card space-y-4">
        <h4 className="font-semibold text-gov-900">Pilot KPIs</h4>
        <div>
          <div className="flex justify-between text-sm mb-1"><span>Processing Time Reduction</span><span className="font-bold">72%</span></div>
          <ProgressBar value={72} color="bg-green-600" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span>Citizen Adoption</span><span className="font-bold">64%</span></div>
          <ProgressBar value={64} color="bg-blue-600" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span>System Availability</span><span className="font-bold">98%</span></div>
          <ProgressBar value={98} color="bg-indiaGreen" />
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// ANALYTICS DASHBOARD
// ==========================================
const AnalyticsDashboard = () => {
  const chartData = [
    { month: 'Jan', pilots: 2, value: 40 },
    { month: 'Feb', pilots: 3, value: 55 },
    { month: 'Mar', pilots: 5, value: 85 },
    { month: 'Apr', pilots: 4, value: 70 },
    { month: 'May', pilots: 8, value: 120 },
  ];
  const kpiData = [
    { name: 'Outcome', score: 85 }, { name: 'Cost', score: 78 }, { name: 'Security', score: 92 }, { name: 'Adoption', score: 64 }, { name: 'Scalability', score: 88 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gov-900">KPI Analytics & Measurement</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gov-900 mb-4">Pilot Performance vs Budget</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pilots" name="Active Pilots" fill="#102a43" radius={[4, 4, 0, 0]} />
              <Bar dataKey="value" name="Value (₹ Lakhs)" fill="#FF9933" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gov-900 mb-4">Pilot Scorecard Dimensions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={kpiData}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="score" fill="#138808" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// AUDIT TRAIL
// ==========================================
const AuditTrail = () => {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    axios.get(`${API_URL}/audit`).then(res => setLogs(res.data)).catch(() => {
      setLogs([
        { _id: '1', timestamp: '10:42 AM', user: 'Dept. Officer', action: 'Challenge Published', module: 'Identify', refId: 'CH-2026-014', status: 'Success' },
        { _id: '2', timestamp: '11:16 AM', user: 'Expert Panel', action: 'Evaluation Submitted', module: 'Evaluate', refId: 'EV-2026-032', status: 'Success' },
        { _id: '3', timestamp: '2:45 PM', user: 'Auditor', action: 'Validation Approved', module: 'Validate', refId: 'VAL-2026-008', status: 'Success' },
      ]);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gov-900">Immutable Audit Trail</h2>
      <div className="card overflow-x-auto">
        <div className="flex gap-4 mb-4">
          <input type="text" placeholder="Filter by Reference ID..." className="border border-slate-300 rounded px-3 py-2 text-sm" />
          <select className="border border-slate-300 rounded px-3 py-2 text-sm"><option>All Modules</option></select>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr><th className="px-4 py-3">Timestamp</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Module</th><th className="px-4 py-3">Reference ID</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="bg-white border-b border-slate-100 font-mono text-xs md:text-sm">
                <td className="px-4 py-3 text-slate-600">{log.timestamp}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{log.user}</td>
                <td className="px-4 py-3">{log.action}</td>
                <td className="px-4 py-3"><Badge color="slate">{log.module}</Badge></td>
                <td className="px-4 py-3 text-gov-800">{log.refId}</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 ${log.status === 'Success' ? 'text-green-600' : 'text-yellow-600'}`}>
                    <CheckCircle className="w-3 h-3" /> {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// SCALE UP PAGE (With GeM Modal)
// ==========================================
const ScaleUpPage = () => {
  const [showGeM, setShowGeM] = useState(false);
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <GeMModal isOpen={showGeM} onClose={() => setShowGeM(false)} />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><Award className="w-6 h-6 text-indiaGreen" /></div>
        <div>
          <h2 className="text-2xl font-bold text-gov-900">READY FOR SCALE</h2>
          <p className="text-slate-500">Pilot validation successful. Proceed to procurement.</p>
        </div>
      </div>
      <div className="card border-l-4 border-l-indiaGreen">
        <h3 className="text-lg font-bold text-gov-900 mb-4">Pilot Dossier Summary</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div><span className="text-slate-500">Solution:</span> <span className="font-medium">AgriVision AI Crop Monitor</span></div>
          <div><span className="text-slate-500">Validation Score:</span> <span className="font-medium text-green-600">92/100</span></div>
          <div><span className="text-slate-500">Pilot Budget:</span> <span className="font-medium">₹50 Lakhs</span></div>
          <div><span className="text-slate-500">Recommended Route:</span> <span className="font-medium">GeM L1 Waiver (Innovation)</span></div>
          <div className="md:col-span-2"><span className="text-slate-500">Eligible for Reuse:</span> <span className="font-medium">Ministry of Agriculture, State Agriculture Depts (All)</span></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <button className="btn-primary"><FileText className="w-4 h-4" /> Generate Procurement Dossier</button>
        <button onClick={() => setShowGeM(true)} className="btn-primary bg-indiaGreen hover:bg-green-800"><ShoppingCart className="w-4 h-4" /> Proceed to GeM</button>
        <button className="btn-secondary"><ShieldCheck className="w-4 h-4" /> Generate Compliance Report</button>
      </div>
    </div>
  );
};

// ==========================================
// ROLE-SPECIFIC DASHBOARDS
// ==========================================
const StartupDashboard = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gov-900">Startup Founder Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { label: 'Open Challenges', val: '24', icon: FileText },
        { label: 'Applications', val: '3', icon: Users },
        { label: 'Active Pilots', val: '1', icon: Plane },
        { label: 'Pending Payments', val: '₹30L', icon: DollarSign },
      ].map((k, i) => (
        <div key={i} className="card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indiaGreen/10 flex items-center justify-center text-indiaGreen"><k.icon className="w-5 h-5" /></div>
          <div><div className="text-2xl font-bold text-slate-900">{k.val}</div><div className="text-xs text-slate-500">{k.label}</div></div>
        </div>
      ))}
    </div>
    <div className="card">
      <h3 className="font-bold text-gov-900 mb-4">My Active Applications</h3>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr><th className="px-4 py-3">Challenge</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3">Status</th></tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100">
            <td className="px-4 py-3 font-medium">Smart Crop Disease Detection</td>
            <td className="px-4 py-3">Min. of Agriculture</td>
            <td className="px-4 py-3">Oct 24, 2026</td>
            <td className="px-4 py-3"><Badge color="yellow">Under Evaluation</Badge></td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium">Rural Water Quality Monitoring</td>
            <td className="px-4 py-3">Min. of Jal Shakti</td>
            <td className="px-4 py-3">Oct 10, 2026</td>
            <td className="px-4 py-3"><Badge color="green">Shortlisted for Pilot</Badge></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const ExpertDashboard = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gov-900">Expert Evaluator Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card p-5 border-l-4 border-l-yellow-500"><div className="text-3xl font-bold text-slate-900">4</div><div className="text-sm text-slate-500">Pending Evaluations</div></div>
      <div className="card p-5 border-l-4 border-l-green-500"><div className="text-3xl font-bold text-slate-900">12</div><div className="text-sm text-slate-500">Completed Reviews</div></div>
      <div className="card p-5 border-l-4 border-l-blue-500"><div className="text-3xl font-bold text-slate-900">2.5 Days</div><div className="text-sm text-slate-500">Avg. Evaluation Time</div></div>
    </div>
    <div className="card">
      <h3 className="font-bold text-gov-900 mb-4">Evaluation Queue</h3>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr><th className="px-4 py-3">Startup</th><th className="px-4 py-3">Challenge</th><th className="px-4 py-3">Deadline</th><th className="px-4 py-3">Action</th></tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100">
            <td className="px-4 py-3 font-medium">AgriVision AI</td>
            <td className="px-4 py-3">Smart Crop Disease Detection</td>
            <td className="px-4 py-3 text-red-600 font-medium">Oct 30, 2026</td>
            <td className="px-4 py-3"><Link to="/evaluation" className="text-gov-800 font-medium hover:underline">Start Evaluation</Link></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const AuditorDashboard = () => {
  const pieData = [{ name: 'Compliant', value: 85 }, { name: 'Under Review', value: 10 }, { name: 'Issues Found', value: 5 }];
  const COLORS = ['#138808', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gov-900">Auditor & Compliance Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Cases Audited', val: '142', icon: ShieldCheck },
          { label: 'Active Audits', val: '8', icon: Clock },
          { label: 'Compliance Issues', val: '3', icon: AlertTriangle, color: 'text-red-600' },
          { label: 'Resolved Issues', val: '139', icon: CheckCircle, color: 'text-green-600' },
        ].map((k, i) => (
          <div key={i} className="card p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center ${k.color || 'text-slate-600'}`}><k.icon className="w-5 h-5" /></div>
            <div><div className="text-2xl font-bold text-slate-900">{k.val}</div><div className="text-xs text-slate-500">{k.label}</div></div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-gov-900 mb-4">Compliance Status Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="font-bold text-gov-900 mb-4">Recent Compliance Flags</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-100 rounded-md flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-red-900">Missing DPIIT Certificate</div>
                <div className="text-xs text-red-700">Startup: GreenGrid Labs | Ref: VAL-2026-008</div>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-yellow-900">Milestone Payment Delayed</div>
                <div className="text-xs text-yellow-700">Pilot: CivicFlow Tech | 2 days overdue</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PLACEHOLDER PAGES
// ==========================================
const PlaceholderPage = ({ title }) => (
  <div className="card p-10 text-center text-slate-500">
    <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
    <h3 className="text-lg font-semibold text-gov-900 mb-2">{title}</h3>
    <p className="text-sm">This module is fully functional in the complete prototype. Use the main navigation to explore core features.</p>
  </div>
);

// ==========================================
// MAIN APP
// ==========================================
function App() {
  const [role, setRole] = useState(null);

  if (!role) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<LoginPage onLogin={setRole} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar role={role} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header role={role} onLogout={() => setRole(null)} />
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/dashboard" element={<DepartmentDashboard />} />
              <Route path="/intelligence" element={<IntelligenceDashboard />} />
              <Route path="/challenges" element={<ChallengeBuilder />} />
              <Route path="/discover" element={<StartupDiscovery />} />
              <Route path="/evaluation" element={<EvaluationPanel />} />
              <Route path="/pilots" element={<PilotManagement />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/audit" element={<AuditTrail />} />
              <Route path="/notifications" element={<NotificationCenter />} />
              <Route path="/scale" element={<ScaleUpPage />} />
              <Route path="/startup-dashboard" element={<StartupDashboard />} />
              <Route path="/expert-dashboard" element={<ExpertDashboard />} />
              <Route path="/auditor-dashboard" element={<AuditorDashboard />} />
              <Route path="/open-challenges" element={<PlaceholderPage title="Open Challenges Board" />} />
              <Route path="/applications" element={<PlaceholderPage title="My Applications" />} />
              <Route path="/payments" element={<PlaceholderPage title="Payment Tracker" />} />
              <Route path="/completed-reviews" element={<PlaceholderPage title="Completed Reviews" />} />
              <Route path="/compliance" element={<PlaceholderPage title="Compliance Flags" />} />
              <Route path="*" element={<DepartmentDashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;