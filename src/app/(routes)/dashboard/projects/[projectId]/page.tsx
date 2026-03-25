import { FC } from "react";

interface PageProps {
  params: {
    projectId: string;
  };
}

const ProjectEditorPage: FC<PageProps> = ({ params }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Project Editor</h1>
      <p className="text-lg">
        Editing project: <span className="font-mono text-green-400">{params.projectId}</span>
      </p>
      <p className="mt-8 text-gray-400">This is a placeholder for the main project editor UI.</p>
    </div>
  );
};

export default ProjectEditorPage;
