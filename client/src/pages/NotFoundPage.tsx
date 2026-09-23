import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <Compass className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900">404</h1>
      <p className="mt-3 text-lg font-semibold text-slate-700">Page not found</p>
      <p className="mt-1 text-sm text-slate-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Back to home
      </Link>
    </div>
  );
}