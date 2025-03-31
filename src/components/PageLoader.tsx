import { LoadingSpinner } from "./ui/loading-spinner";

export const PageLoader = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <LoadingSpinner />
    <p className="mt-4 text-gray-600">Carregando página...</p>
  </div>
);
