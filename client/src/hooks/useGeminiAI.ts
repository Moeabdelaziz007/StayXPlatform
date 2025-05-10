import { useState } from 'react';
import geminiClient, { 
  SummarizeThreadParams, 
  SuggestResponseParams, 
  GenerateInsightsParams 
} from '@/ai/geminiClient';

interface UseGeminiAIOptions {
  onError?: (error: unknown) => void;
}

export const useGeminiAI = (options?: UseGeminiAIOptions) => {
  const [summarizing, setSummarizing] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  const { onError } = options || {};
  
  const handleError = (error: unknown) => {
    console.error('Gemini AI error:', error);
    if (onError) {
      onError(error);
    }
  };
  
  const summarizeThread = async (params: SummarizeThreadParams) => {
    setSummarizing(true);
    try {
      return await geminiClient.summarizeThread(params);
    } catch (error) {
      handleError(error);
      return 'Could not generate summary at this time.';
    } finally {
      setSummarizing(false);
    }
  };
  
  const suggestResponses = async (params: SuggestResponseParams) => {
    setSuggesting(true);
    try {
      return await geminiClient.suggestResponses(params);
    } catch (error) {
      handleError(error);
      const { options = 3 } = params;
      return Array(options).fill('Could not generate suggestions at this time.');
    } finally {
      setSuggesting(false);
    }
  };
  
  const generateInsights = async (params: GenerateInsightsParams) => {
    setGenerating(true);
    try {
      return await geminiClient.generateInsights(params);
    } catch (error) {
      handleError(error);
      return Array(3).fill({
        title: 'Insights Unavailable',
        content: 'Could not generate insights at this time.'
      });
    } finally {
      setGenerating(false);
    }
  };
  
  const analyzeConnectionMatch = async (userProfile: any, potentialMatch: any) => {
    setAnalyzing(true);
    try {
      return await geminiClient.analyzeConnectionMatch(userProfile, potentialMatch);
    } catch (error) {
      handleError(error);
      return {
        score: 50,
        reasons: ['Could not analyze compatibility at this time.']
      };
    } finally {
      setAnalyzing(false);
    }
  };
  
  return {
    summarizeThread,
    suggestResponses,
    generateInsights,
    analyzeConnectionMatch,
    summarizing,
    suggesting,
    generating,
    analyzing
  };
};