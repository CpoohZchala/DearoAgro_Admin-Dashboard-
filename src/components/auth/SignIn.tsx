import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, ApiResponse } from '../../api/authApi'; 
import { User } from '../../models/User';
import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignIn = () => {
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); // State for password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!mobileNumber || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = new User({ 
        mobileNumber, 
        password,
        userType: 'Super Admin'
      });

      const response: ApiResponse = await signIn(user.toJson());
      console.log('SignIn Response:', response);

      if (response.token) {
        localStorage.setItem('token', response.token);

        if (response.userType) {
          localStorage.setItem('userType', response.userType);
          console.log('User Type:', response.userType); 
        } else {
          throw new Error('User type is undefined');
        }

        if (response.userId) {
          localStorage.setItem('userId', response.userId);
        } else {
          throw new Error('User ID is undefined');
        }

        if (response.userType === 'Super Admin') {
          console.log('Navigating to Admin Dashboard');
          navigate('/dashboard/profile'); 
        } else {
          setError('You do not have Super Admin privileges');
        }
      } else {
        setError(response.message || 'Sign in failed');
      }
    } catch (err: any) {
      console.error('Error during sign in:', err);
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl bg-white shadow-lg">
        <div className="w-1/2 p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Super Admin Sign In</h2>
            <p className="mt-2 text-sm text-gray-600">Access the administration dashboard</p>
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  placeholder="Enter mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          <div className="text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/signup" className="font-medium text-green-600 hover:text-green-500">
                Sign Up
              </a>
            </p>
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center bg-black relative">
          <div className="absolute inset-0 grid grid-cols-4 gap-4 opacity-10">
            {Array.from({ length: 16 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg"></div>
            ))}
          </div>
          <div className="relative text-center text-white">
            <img src="/Dearo Agro.png" alt="Dearo Agro Logo" className="h-64 mx-auto mb-4" />
            <p className="text-lg font-semibold">Welcome to Dearo Agro</p>
            <p className="text-sm">Empowering agriculture with technology</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;