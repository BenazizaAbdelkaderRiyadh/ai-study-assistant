import React from 'react';
import { LoaderIcon } from './Icons';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
      <LoaderIcon className="w-12 h-12 text-cyan-500 animate-spin" />
      <p className="mt-4 text-slate-600">{message}</p>
    </div>
  );
};

export default Loader;