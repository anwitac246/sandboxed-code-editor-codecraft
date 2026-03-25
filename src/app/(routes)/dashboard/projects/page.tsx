
import { FC } from "react";

// TODO: This page will require fetching user data from a session.
// const session = await getSession();
// const projects = await getProjectsForUser(session.user.id);

const ProjectsDashboardPage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">My Projects</h1>
      <p className="mt-8 text-gray-400">
        This is a placeholder for the projects dashboard.
      </p>
      <p className="text-sm text-gray-500 mt-2">
        User will be inferred from session.
      </p>
    </div>
  );
};

export default ProjectsDashboardPage;
