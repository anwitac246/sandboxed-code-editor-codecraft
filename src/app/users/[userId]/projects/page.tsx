
import { FC } from "react";

interface PageProps {
  params: {
    userId: string;
  };
}

const UserProjectsPage: FC<PageProps> = ({ params }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">My Projects</h1>
      <p className="text-lg">This page is for user: <span className="font-mono text-green-400">{params.userId}</span></p>
      <p className="mt-8 text-gray-400">This is a placeholder page. The UI will be built out soon.</p>
    </div>
  );
};

export default UserProjectsPage;
