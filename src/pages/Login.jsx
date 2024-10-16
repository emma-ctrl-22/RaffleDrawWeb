import {useState} from 'react'
import Momo from '../assets/Momo.png'
import mtn from '../assets/mtn.png'
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://raffledrawapi.onrender.com/users/login', {
        username,
        password
      });
      
      const { data, message, token,id } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({ role: data, id }));
      
      console.log('Stored user data:', JSON.parse(localStorage.getItem('user')));
      
      toast.success(message || 'Login successful!');
      
      // Redirect based on user role
      if (data === 'admin') {
        navigate('/dashboard');
      } else if (data === 'user') {
        navigate('/raffles');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between ">
        <img src={mtn} alt="Logo 2" className="h-24 w-18" />
        <img src={Momo} alt="Logo 1" className="h-12" />
      </div>
      <h2 className="text-2xl font-bold text-center text-gray-900">Log in</h2>
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-md space-y-8">
          <form onSubmit={loginUser} className="space-y-6 ">
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="username" className="block mb-3 font-medium text-gray-900 text-md">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="block w-full px-3 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder="Enter your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-3 font-medium text-md text-gray-9 00">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="block w-full px-3 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div >
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-black bg-[#F9D100] hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
