
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Mail, Send } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success
    setMessage(`If an account exists for ${email}, a password reset link has been sent.`);
    setIsLoading(false);
    // setEmail(''); // Optionally clear email field
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center text-white mb-3">Forgot Your Password?</h2>
      <p className="text-center text-slate-400 mb-8">
        No worries! Enter your email address below, and we'll send you a link to reset your password.
      </p>
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
          disabled={isLoading}
        />
        {message && <p className="text-sm text-center text-green-400">{message}</p>}
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading} glowEffect="blue" iconLeft={<Send size={18}/>}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
      <p className="mt-8 text-sm text-center text-slate-400">
        Remembered your password?{' '}
        <Link to="/login" className="font-medium text-brand-accent-purple hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
};

export default ForgotPasswordPage;
