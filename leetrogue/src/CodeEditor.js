import React, { useState, useEffect } from 'react';
import { AlertCircle, Play } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Alert, AlertDescription } from './components/ui/alert';

const CodeEditor = () => {
  const [code, setCode] = useState('print("Hello, World!")');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check if backend is running when component mounts
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/test');
      const data = await response.json();
      setBackendStatus('connected');
      console.log('Backend status:', data.message);
    } catch (error) {
      setBackendStatus('disconnected');
      console.error('Backend connection failed:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const executeCode = async () => {
    setIsLoading(true);
    setError('');
    setOutput('');

    try {
      console.log('Sending code to backend:', code); // Debug log
      
      const response = await fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response from backend:', data); // Debug log
      
      if (data.error) {
        setError(data.error);
      } else {
        setOutput(data.output || 'Code executed successfully with no output');
      }
    } catch (error) {
      console.error('Error executing code:', error); // Debug log
      setError(`Connection error: ${error.message}. Make sure the Flask backend is running on port 5000.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Python Code Editor</span>
            <div className="flex items-center gap-4">
              <span className={`text-sm ${
                backendStatus === 'connected' ? 'text-green-500' : 'text-red-500'
              }`}>
                {backendStatus === 'connected' ? 'Backend Connected' : 'Backend Disconnected'}
              </span>
              <button
                onClick={executeCode}
                disabled={isLoading || backendStatus !== 'connected'}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                {isLoading ? 'Running...' : 'Run Code'}
              </button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-64 bg-gray-900 text-gray-100 font-mono p-4 rounded-lg focus:outline-none resize-none mb-4"
            spellCheck="false"
            placeholder="Enter your Python code here..."
          />

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="bg-gray-900 text-white p-4 rounded-lg font-mono whitespace-pre-wrap">
            {output || 'Output will appear here...'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeEditor;