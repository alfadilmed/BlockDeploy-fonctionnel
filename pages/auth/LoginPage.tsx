
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAppContext } from '../../contexts/AppContext';
import { Mail, Lock,LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'user@example.com' && password === 'password') {
      login({ id: '1', name: 'Demo User', email: 'user@example.com', avatarUrl: 'https://picsum.photos/seed/demouser/100/100' });
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Try user@example.com / password');
    }
    setIsLoading(false);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center text-white mb-3">Welcome Back</h2>
      <p className="text-center text-slate-400 mb-8">Login to access your BlockDeploy dashboard.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          iconLeft={<Mail size={18} />}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          iconLeft={<Lock size={18} />}
          required
        />
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading} glowEffect="blue" iconLeft={<LogIn size={18}/>}>
          {isLoading ? 'Logging In...' : 'Login'}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <Link to="/forgot-password" state={{email}} className="text-sm text-brand-accent-blue hover:underline">
          Forgot password?
        </Link>
      </div>
      <p className="mt-8 text-sm text-center text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-brand-accent-purple hover:underline">
          Sign up
        </Link>
      </p>
      {/* Placeholder for Wallet Connect */}
      <div className="my-6 flex items-center justify-center">
          <span className="h-px flex-grow bg-slate-700"></span>
          <span className="mx-4 text-sm text-slate-500">OR</span>
          <span className="h-px flex-grow bg-slate-700"></span>
      </div>
      <Button variant="outline" size="lg" className="w-full" onClick={() => alert('WalletConnect integration coming soon!')}>
        {/* Placeholder Icon for Wallet */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m15-3H6M3 9a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 9v2.25M3 9h18" />
        </svg>
        Connect Wallet
      </Button>
    </>
  );
};

export default LoginPage;
