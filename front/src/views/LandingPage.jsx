import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useUserStateContext } from "./context/ContextProvider";
import { useEffect,useState } from "react";
import axiosClient from "../axios.js";
import Loading from '../views/Loading'

const LandingPage = () => {
  const { currentUser, setCurrentUser } = useUserStateContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/login');
  };

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


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-slate-100 ">
      <header className="w-full py-6 bg-zinc-900 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-bold">URL Shortener</h1>
          <nav>
            {/* <a href="/register" className="text-lg mx-2 font-medium hover:text-primary-bg">Register</a> */}
            <button onClick={handleNavigate} className="mx-2 bg-primary-bg text-primary-text px-3 py-1 text-base rounded-full font-bold hover:text-primary-bg hover:bg-secondary-text flex items-center">
              <ArrowRightEndOnRectangleIcon className="w-5 h-5 mr-2 font-extrabold" /> {/* Set icon size */}
              Login
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto flex-grow flex flex-col items-center justify-center px-6">
        <h2 className="text-4xl font-bold mb-6 text-center">
          Simplify Your Links
        </h2>
        <p className="text-lg mb-8 text-center max-w-2xl">
          Our URL shortener helps you transform long, unwieldy links into simple, easy-to-share URLs. Perfect for sharing on social media, emails, and more.
        </p>
        <a href="/register" className="bg-primary-bg text-primary-text font-medium px-6 py-3 rounded-full text-lg hover:bg-primary-text hover:text-primary-bg">
          Get Started
        </a>
      </main>

      <footer className="w-full py-4 bg-zinc-900 text-white text-center">
        <p>&copy; {new Date().getFullYear()} URL Shortener. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
