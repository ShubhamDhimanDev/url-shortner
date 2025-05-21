import { Link, Navigate } from "react-router-dom";
import { useUserStateContext } from "./context/ContextProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios.js";

export default function Register() {
  const { userToken, setCurrentUser } = useUserStateContext();

  if (userToken) {
    return <Navigate to='/dashboard' />
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState({ __html: '' });
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({ __html: '' });

    axiosClient.post('/register', {
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation
    })
      .then(({ data }) => {
        setCurrentUser(data.user);
        navigate('/dashboard');
      })
      .catch((error) => {
        if(error.response){
          const finalErrors = Object.values(error.response.data.errors).reduce((accum, next) => [...accum, ...next], [])
          console.error(finalErrors)
          setError({__html: finalErrors.join('<br>')})
        }
      })
  }

  return (
    <>
      <div className="flex flex-1 bg-theme-primary min-h-screen flex-col justify-center px-6 py-12 lg:px-8 text-slate-100">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className=" text-center text-4xl font-bold leading-9 tracking-tight text-slate-100">
            Sign Up
          </h1>
          
        </div>
        <p className="mt-8 text-center text-sm text-slate-100">
            <Link to='/login' className="font-medium text-dark">
              Already have an account? <span className="text-white hover:text-primary-bg text-xl">Sign In</span>
            </Link>
          </p>
          {error.__html && (<div className="mt-2 bg-red-500 rounded py-2 px-3 text-white" dangerouslySetInnerHTML={error}>
            </div>)}

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="name" className="block text-xl font-medium leading-6 text-white">
                *Name :
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={e=>setName(e.target.value)}
                  // autoComplete="off"
                  required
                  className="block w-full bg-theme-secondary rounded-full border-0 outline-0 py-1.5 text-white placeholder:text-gray-400 sm:text-base font-medium sm:leading-6 pl-8"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xl font-medium leading-6 text-white">
                *Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  readOnly
                  onFocus={(e) => e.target.removeAttribute("readOnly")}
                  required
                  className="block w-full bg-theme-secondary rounded-full border-0 outline-0 py-1.5 text-white placeholder:text-gray-400 sm:text-sm sm:leading-6 pl-8"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xl font-medium leading-6 text-white">
                  *Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  readOnly
                  onFocus={(e) => e.target.removeAttribute("readOnly")}
                  required
                  className="block w-full bg-theme-secondary rounded-full border-0 outline-0 py-1.5 text-white placeholder:text-gray-400 sm:text-sm sm:leading-6 pl-8"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password_confirmation" className="block text-xl font-medium leading-6 text-white">
                  *Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={e=>setPasswordConfirmation(e.target.value)}
                  readOnly
                  onFocus={(e) => e.target.removeAttribute("readOnly")}
                  required
                  className="block w-full bg-theme-secondary rounded-full border-0 outline-0 py-1.5 text-white placeholder:text-gray-400 sm:text-sm sm:leading-6 pl-8"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="font-bold rounded-full px-10 py-1 pb-2 text-medium leading-6 text-white border-2 border-blue hover:text-primary-bg hover:bg-blue transition-colors duration-300"
              >
                Sign Up!
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
