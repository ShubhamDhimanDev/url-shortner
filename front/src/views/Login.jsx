import { Link, Navigate } from "react-router-dom";
import { useUserStateContext } from "./context/ContextProvider";
import axiosClient from "../axios.js";
import { useEffect,useState } from "react";
import Loading from '../views/Loading'
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';

export default function Login() {
  const { currentUser, setCurrentUser } = useUserStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ __html: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 



  useEffect(() => {
    axiosClient.get('/user') // Replace with your endpoint to fetch the current user
      .then(({ data }) => {
        setCurrentUser(data);
        navigate('/dashboard');
      })
      .catch((error) => {
        setCurrentUser({});
        // Handle 401 Unauthorized error
        // if (error.response && error.response.status === 401) {
        //   navigate('/login'); // Redirect to login if user is not authenticated
        // }
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the request completes
      });
  }, [setCurrentUser, navigate]);

  if (loading) {
    return <Loading/> // Or any loading indicator you prefer
  }

  if (currentUser.id) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({ __html: '' });

    // First, get the CSRF cookie
    axiosClient.get("/csrf-cookie",
      {
        withCredentials: true,
        withXSRFToken: true,
      }).then(() => {
        // Then, send login credentials
        axiosClient
          .post("/login", { email, password })
          .then(({ data }) => {
            // Update user context with authenticated user data
            setCurrentUser(data.user);
          })
          .catch((error) => {
            if (error.response) {
              const finalErrors = Object.values(error.response.data.errors || {}).reduce(
                (accum, next) => [...accum, ...next],
                []
              );
              setError({ __html: finalErrors.join('<br>') });
            }
          });
      });
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-theme-primary">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <a href="/">
          <img
            className="mx-auto h-10 w-auto"
            // src={logo}
            alt="iD"
          />
        </a> */}
        <h2 className="text-center text-4xl font-bold leading-9 tracking-tight text-slate-100">
          Sign In
        </h2>
        {error.__html && (
          <div
            className="mt-2 bg-red-500 rounded py-2 px-3 text-white"
            dangerouslySetInnerHTML={error}
          ></div>
        )}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-xl font-medium leading-6 text-white"
            >
              Your email: 
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="font-bold block w-full bg-theme-secondary rounded-full border-0 outline-0 py-1.5 text-white placeholder:text-gray-400 sm:text-sm sm:leading-6 pl-8"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xl font-medium leading-6 text-white"
              >
                Password:
              </label>
              <div className="text-sm">
                <Link
                  className="font-semibold text-lg leading-6 text-white hover:text-primary-bg"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="font-bold block w-full bg-theme-secondary rounded-full border-0 outline-0 py-1.5 text-white placeholder:text-gray-400 sm:text-sm sm:leading-6 pl-8"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
                type="submit"
                className="font-bold rounded-full px-10 py-1 pb-2 text-medium leading-6 text-white border-2 border-blue hover:text-primary-bg hover:bg-blue transition-colors duration-300"
              >
                Sign in
              </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not registered yet?{' '}
          <Link
            className="font-semibold text-lg leading-6 text-white hover:text-primary-bg"
            to="/register"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
