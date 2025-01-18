import React, { useState, useEffect } from 'react';
import CodeEditorUI from './components/ui/CodeEditorUI'; // Import the modularized UI

const CodeEditor = () => {
  const [code, setCode] = useState('def Solution(x):\n\t');
  const [question, setQuestion] = useState(0);
  const [points, setPoints] = useState(0);
  const [ifloop, setIfLoop] = useState(0);
  const [forloop, setForLoop] = useState(0);
  const [imports, setImports] = useState(0);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch backend status
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/test');
      const data = await response.json();
      setBackendStatus('connected');
    } catch {
      setBackendStatus('disconnected');
    }
  };

  const executeCode = async () => {
    setIsLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, question, ifloop, forloop, imports }),
      });
      const data = await response.json();
      if (data.error) {
        setError('Level failed...');
      } else {
        setOutput(data.output);
        if (data.output === 'Level passed!') {
          setDialogOpen(true);
          setPoints(100);
        }
      }
    } catch (error) {
      setError('Error: Could not connect to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => setDialogOpen(false);

  const handleConfirm = ({ selectionCounts }) => {
    setIfLoop((prev) => prev + selectionCounts.ifLoop);
    setForLoop((prev) => prev + selectionCounts.forLoop);
    setImports((prev) => prev + selectionCounts.imports);
    setDialogOpen(false);
  };

  return (
    <CodeEditorUI
      code={code}
      setCode={setCode}
      question={question}
      points={points}
      ifloop={ifloop}
      forloop={forloop}
      imports={imports}
      output={output}
      error={error}
      isLoading={isLoading}
      backendStatus={backendStatus}
      dialogOpen={dialogOpen}
      executeCode={executeCode}
      handleDialogClose={handleDialogClose}
      handleConfirm={handleConfirm}
    />
  );
};

export default CodeEditor;
