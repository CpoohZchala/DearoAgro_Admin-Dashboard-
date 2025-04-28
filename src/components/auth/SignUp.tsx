import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiResponse, signUp } from '../../api/authApi';
import { User } from '../../models/User';
import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for visibility toggle

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    userType: 'Super Admin',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); // State for password visibility
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false); // State for confirm password visibility
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.fullName || !formData.mobileNumber || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = new User({
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        userType: formData.userType,
      });

      const response: ApiResponse = await signUp(user.toJson()); // Explicitly type the response
      console.log('API Response:', response); // Debug log to inspect the response object

      if (response.token) {
        localStorage.setItem('token', response.token);

        if (response.userType) {
          localStorage.setItem('userType', response.userType);
        } else {
          throw new Error('User type is undefined');
        }

        if (response.id) {
          localStorage.setItem('userId', response.id);
        } else {
          throw new Error('User ID is undefined');
        }

        navigate('/admin/dashboard');
      } else {
        setError(response.message || 'Sign up failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl bg-white shadow-lg">
        <div className="w-1/2 p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Super Admin Sign Up</h2>
            <p className="mt-2 text-sm text-gray-600">Create a new administration account</p>
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              
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
                  value={formData.mobileNumber}
                  onChange={handleChange}
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
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm pr-12" // Adjusted padding-right for better alignment
                  placeholder="Enter password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0  right-4 flex items-center text-gray-500"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm pr-12" // Adjusted padding-right for better alignment
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500" // Ensured alignment with input field
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                >
                  {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
          <div className="text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/signin" className="font-medium text-green-600 hover:text-green-500">
                Sign In
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

export default SignUp;