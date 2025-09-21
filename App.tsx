import React, { useState } from 'react';
import { UserInput, Advice } from './types';
import { getHealthAdvice } from './services/geminiService';
import Header from './components/Header';
import SymptomForm from './components/SymptomForm';
import AdviceCard from './components/AdviceCard';
import LoadingSpinner from './components/LoadingSpinner';
import Disclaimer from './components/Disclaimer';

const App: React.FC = () => {
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (userInput: UserInput) => {
    setIsLoading(true);
    setError(null);
    setAdvice(null);
    try {
      const result = await getHealthAdvice(userInput);
      setAdvice(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyan-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <p className="text-center text-gray-600 mb-8">
          Enter your symptoms and details below to receive AI-powered health advice. This tool is for informational purposes only.
        </p>
        <SymptomForm onSubmit={handleSubmit} isLoading={isLoading} />
        <div className="mt-8">
          {isLoading && <LoadingSpinner />}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}
          {advice && <AdviceCard advice={advice} />}
          {!isLoading && !advice && <Disclaimer />}
        </div>
      </main>
       <footer className="text-center p-4 mt-8 text-sm text-gray-500">
        <p>&copy; 2024 Cura Gennie. All information is AI-generated and not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
};

export default App;