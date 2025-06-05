
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';


const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setIsLoading(true);
    
    // Simulate API call for registration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // On successful registration (mocked)
    const newUser = { id: Date.now().toString(), name, email, avatarUrl: `https://picsum.photos/seed/${email}/100/100` };
    login(newUser); // Log in the new user
    navigate('/dashboard'); // Redirect to dashboard
    
    setIsLoading(false);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center text-white mb-3">Create Your Account</h2>
      <p className="text-center text-slate-400 mb-8">Join BlockDeploy and start deploying smart contracts today.</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="name"
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          iconLeft={<User size={18} />}
          required
        />
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
          placeholder="•••••••• (min. 6 characters)"
          iconLeft={<Lock size={18} />}
          required
        />
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          iconLeft={<Lock size={18} />}
          required
        />
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading} glowEffect="blue" iconLeft={<UserPlus size={18} />}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
      <p className="mt-8 text-sm text-center text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-accent-purple hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
};

export default RegisterPage;
