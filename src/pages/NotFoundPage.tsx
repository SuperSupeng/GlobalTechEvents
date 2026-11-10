import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center px-4 py-16 text-white">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary-light">GlobalTechEvents</p>
      <h1 className="mb-4 font-serif text-4xl italic leading-tight sm:text-5xl">Page not found</h1>
      <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/75">
        That address is not a page on this site.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a href="/" className="btn-primary text-center">
          Back to the calendar
        </a>
        <a href="/events" className="btn-secondary text-center">
          Events directory
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
