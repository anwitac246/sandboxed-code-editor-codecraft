export interface ExecutionResult {
  output: string;
  error: string | null;
  exitCode: number;
  duration: number;
}

export interface ExecutionFile {
  name: string;
  content: string;
  language: string;
}

export const runCode = async (
  files: ExecutionFile[]
): Promise<ExecutionResult> => {
  const start = Date.now();
  return new Promise((resolve) => {
    setTimeout(() => {
      const primary = files.find(
        (f) => f.language === 'typescript' || f.language === 'javascript'
      );
      resolve({
        output: primary
          ? `$ run ${primary.name}\n> Compiled successfully.\n> No errors found.\n\nProcess exited with code 0`
          : `> No runnable files found.\n\nProcess exited with code 1`,
        error: null,
        exitCode: primary ? 0 : 1,
        duration: Date.now() - start,
      });
    }, 1200);
  });
};