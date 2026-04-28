import React, { useState } from 'react';
import { Eye, EyeOff, X, Globe, Mail, Lock, User, CheckCircle2 } from 'lucide-react';

const Auth = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on typing
  };

  const validate = () => {
    if (mode === 'signup' && !formData.name) return 'Name is required';
    if (!formData.email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Invalid email address';
    
    if (mode !== 'forgot') {
      if (!formData.password) return 'Password is required';
      if (formData.password.length < 6) return 'Password must be at least 6 characters';
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Mock API Calls
    if (mode === 'forgot') {
      setSuccess('Password reset link sent to your email!');
      setTimeout(() => {
        setMode('login');
        setSuccess('');
      }, 3000);
      return;
    }

    // Mock successful login/signup
    onLogin({ name: formData.name || 'Jane Doe', email: formData.email, isNewUser: mode === 'signup' });
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm px-4 fade-in">
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 overflow-hidden transform transition-all">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8 mt-2">
          <h2 className="text-3xl font-extrabold text-gray-800">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-gray-500 mt-2">
            {mode === 'login' && 'Secure access to your health records'}
            {mode === 'signup' && 'Join MatraCare to track your health securely'}
            {mode === 'forgot' && 'Enter your email to receive a reset link'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger/10 text-danger-700 border border-danger/20 rounded-xl text-sm font-medium text-center fade-in">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-success/10 text-success border border-success/20 rounded-xl text-sm font-medium text-center flex items-center justify-center space-x-2 fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all"
            />
          </div>

          {mode !== 'forgot' && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          )}

          {mode === 'signup' && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all"
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <button 
                type="button"
                onClick={() => switchMode('forgot')}
                className="text-sm text-primary-dark hover:text-primary-dark/80 font-medium"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-primary-dark hover:bg-primary-dark/90 text-white py-3.5 rounded-2xl font-bold shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-0.5 mt-2"
          >
            {mode === 'login' && 'Sign In'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Send Reset Link'}
          </button>
        </form>

        {mode !== 'forgot' && (
          <>
            <div className="relative flex items-center py-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button 
              type="button"
              className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3.5 rounded-2xl font-medium transition-all"
            >
              <Globe className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
          </>
        )}

        <div className="mt-8 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => switchMode('signup')} className="text-primary-dark font-bold hover:underline">Sign up</button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => switchMode('login')} className="text-primary-dark font-bold hover:underline">Log in</button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Auth;
