
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { APP_NAME } from '../constants';
import { ArrowLeft } from 'lucide-react'; // Import an icon for the link

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-primary via-slate-900 to-brand-secondary p-4">
       <Link to="/" className="text-4xl font-bold text-white flex items-center mb-12">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 mr-3 text-brand-accent-blue">
              <path d="M12.378 1.602a.75.75 0 00-.756 0L3.366 6.026A.75.75 0 003 6.632v10.736c0 .27.135.518.366.654l8.256 4.424a.75.75 0 00.756 0l8.256-4.424a.75.75 0 00.366-.654V6.632a.75.75 0 00-.366-.606L12.378 1.602zM12 15.93a.75.75 0 00.378-.102l7.122-3.82V7.77L12 11.502V15.93zm0-5.62L19.122 6.5 12 2.77 4.878 6.5 12 10.31zm-.378.102L4.5 6.59v4.232l7.122 3.82V10.412z" />
            </svg>
            {APP_NAME}
        </Link>
      <div className="w-full max-w-md bg-brand-glass backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl p-8 md:p-10">
        <Outlet />
      </div>
      <Link
        to="/"
        className="mt-8 group inline-flex items-center text-sm text-brand-accent-blue hover:text-sky-300 transition-colors duration-200"
      >
        <ArrowLeft size={16} className="mr-1.5 transition-transform duration-200 ease-in-out group-hover:-translate-x-1" />
        Return to Homepage
      </Link>
      <p className="mt-4 text-sm text-slate-500">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </p>
    </div>
  );
};

export default AuthLayout;
