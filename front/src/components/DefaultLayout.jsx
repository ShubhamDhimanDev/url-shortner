import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import { Bars3Icon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useUserStateContext } from '../views/context/ContextProvider'
import axiosClient from '../axios'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Loading from '../views/Loading'
import VerifyEmail from '../views/VerificationRequired';

const navigation = [
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'My Urls', to: '/my-urls' },
]
const userNavigation = [
  // { name: 'Account Settings', to: '/account-settings' },
  { name: 'Sign out', to: '/log-out', onClick: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DefaultLayout() {
  const { currentUser, setCurrentUser } = useUserStateContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  


  useEffect(() => {
    axiosClient.get('/user')
      .then(({ data }) => {
        setCurrentUser(data);
      })
      .catch((error) => {
        setCurrentUser({});
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setCurrentUser]);

  if (loading) {
    return <Loading/>
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // if (!currentUser.email_verified_at) {
  //   return <VerifyEmail user={currentUser} />;
  // }

  const logout = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosClient.post('/logout').then(() => {
      setCurrentUser({});
      navigate('/login');
    });
  };

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-zinc-900">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-white font-bold text-xl">
                      URL Shortner
                      {/* <img
                        className="h-8 w-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      /> */}
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) => classNames(
                              isActive
                                ? 'text-primary-bg'
                                : 'text-white hover:text-primary-bg',
                              'rounded-md px-3 py-2 text-sm font-medium',
                            )}
                          >
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <MenuButton className="relative flex max-w-xs items-center rounded-full bg-primary-bg text-sm focus:outline-none ">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <UserIcon className='w-8 h-8  rounded-full text-secondary-text p-2' />
                          </MenuButton>
                        </div>
                        <Transition
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-zinc-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <MenuItem key={item.name}>
                                {({ focus }) => (
                                  <NavLink
                                    to={item.to}
                                    onClick={item.onClick ? logout : ""}
                                    className={classNames(
                                      focus ? 'bg-zinc-700' : '',
                                      'block px-4 py-2 text-sm text-white',
                                    )}
                                  >
                                    {item.name}
                                  </NavLink>
                                )}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <DisclosureButton className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </DisclosureButton>
                  </div>
                </div>
              </div>

              <DisclosurePanel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={({ isActive }) => classNames(
                        isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium',
                      )}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={currentUser.imageUrl} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{currentUser.name}</div>
                      <div className="text-sm font-medium leading-none text-gray-400">{currentUser.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <NavLink
                        key={item.name}
                        onClick={item.onClick ? logout : ""}
                        as="a"
                        to={item.to}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
        {currentUser.email_verified_at ? <Outlet /> : <VerifyEmail user={currentUser} />}



      </div>
    </>
  )
}
