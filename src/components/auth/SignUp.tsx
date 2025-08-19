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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Super Admin Sign Up</h2>
            <p className="mt-2 text-sm text-gray-600">Create a new administration account</p>
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-3 sm:p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <form className="mt-6 lg:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 sm:py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 text-sm sm:text-base"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 sm:py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 text-sm sm:text-base"
                  placeholder="Enter mobile number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </div>
              
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 sm:py-3 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 text-sm sm:text-base"
                  placeholder="Enter password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" /> : <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
              
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 sm:py-3 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 text-sm sm:text-base"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                >
                  {isConfirmPasswordVisible ? <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" /> : <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 sm:py-3 px-4 text-sm sm:text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-black relative min-h-64 lg:min-h-0">
          <div className="absolute inset-0 grid grid-cols-4 gap-2 sm:gap-4 opacity-10 p-4">
            {Array.from({ length: 16 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg"></div>
            ))}
          </div>
          <div className="relative text-center text-white p-4 sm:p-6 lg:p-8">
            <img 
              src="/Dearo Agro.png" 
              alt="Dearo Agro Logo" 
              className="h-32 sm:h-48 lg:h-64 mx-auto mb-4 object-contain" 
            />
            <p className="text-base sm:text-lg font-semibold">Welcome to Dearo Agro</p>
            <p className="text-xs sm:text-sm mt-1">Empowering agriculture with technology</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;