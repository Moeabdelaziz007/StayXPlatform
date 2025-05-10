import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Google Generative AI with API Key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Set up the model configuration with safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Use the Gemini-1.0-Pro model
const model = genAI.getGenerativeModel({
  model: "gemini-1.0-pro",
  safetySettings,
});

// Types for our Gemini AI functions
export interface SummarizeThreadParams {
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date | string;
  }[];
  maxLength?: number;
}

export interface SuggestResponseParams {
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date | string;
  }[];
  context?: string;
  options?: number;
}

export interface GenerateInsightsParams {
  userData: {
    interests?: string[];
    recentActivity?: string[];
    connections?: number;
    messageCount?: number;
    dropCount?: number;
  };
  timeframe?: 'day' | 'week' | 'month';
}

/**
 * Summarizes a conversation thread using Gemini AI
 */
export const summarizeThread = async (params: SummarizeThreadParams): Promise<string> => {
  try {
    const { messages, maxLength = 150 } = params;
    
    // Format the conversation for the AI
    const formattedConversation = messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');
    
    // Create the prompt for thread summarization
    const prompt = `
      Summarize the following conversation in a concise way. 
      Focus on the main topics and important points discussed.
      Keep the summary under ${maxLength} characters.
      
      Conversation:
      ${formattedConversation}
      
      Summary:
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error) {
    console.error('Error summarizing thread:', error);
    return 'Could not generate summary at this time.';
  }
};

/**
 * Suggests responses based on conversation history using Gemini AI
 */
export const suggestResponses = async (params: SuggestResponseParams): Promise<string[]> => {
  try {
    const { messages, context = '', options = 3 } = params;
    
    // Format the conversation for the AI
    const formattedConversation = messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');
    
    // Create the prompt for response suggestions
    const prompt = `
      Based on the following conversation${context ? ' and context' : ''}, suggest ${options} different possible responses.
      Make the responses engaging, helpful, and conversational. Each response should be different in tone and approach.
      Keep responses concise (1-2 sentences each).
      
      ${context ? `Context: ${context}\n` : ''}
      
      Conversation:
      ${formattedConversation}
      
      ${options} suggested responses (separate each with "###"):
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Split the suggestions using the "###" separator
    const suggestions = text.split('###').map(suggestion => suggestion.trim()).filter(Boolean);
    
    // Ensure we have the requested number of options, using empty placeholders if needed
    const formattedSuggestions = suggestions.slice(0, params.options || 3);
    while (formattedSuggestions.length < (params.options || 3)) {
      formattedSuggestions.push("Let me think about that...");
    }
    
    return formattedSuggestions;
  } catch (error) {
    console.error('Error generating response suggestions:', error);
    return Array(options).fill('Could not generate suggestions at this time.');
  }
};

/**
 * Generates AI insights for the user based on their data
 */
export const generateInsights = async (params: GenerateInsightsParams): Promise<{ title: string, content: string }[]> => {
  try {
    const { userData, timeframe = 'week' } = params;
    
    // Format the user data for the AI
    const formattedUserData = Object.entries(userData)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: ${value.join(', ')}`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');
    
    // Create the prompt for insights generation
    const prompt = `
      Based on the following user data, generate 3 insightful observations or recommendations for the user.
      Each insight should have a short title and a brief explanation or recommendation (1-2 sentences).
      The insights should be relevant to a crypto/tech social platform user for the past ${timeframe}.
      
      User data:
      ${formattedUserData}
      
      Generate 3 insights with titles and content in this format:
      Title 1: [short title]
      Content 1: [brief explanation]
      
      Title 2: [short title]
      Content 2: [brief explanation]
      
      Title 3: [short title]
      Content 3: [brief explanation]
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the insights from the response
    const insightPattern = /Title (\d+): (.*?)\nContent \d+: (.*?)(?=\n\nTitle \d+:|$)/gs;
    const matches = Array.from(text.matchAll(insightPattern));
    
    const insights = matches.map(match => ({
      title: match[2].trim(),
      content: match[3].trim()
    }));
    
    // Ensure we have 3 insights, using placeholders if needed
    const formattedInsights = insights.slice(0, 3);
    while (formattedInsights.length < 3) {
      formattedInsights.push({
        title: 'Insight Not Available',
        content: 'We could not generate this insight at the moment.'
      });
    }
    
    return formattedInsights;
  } catch (error) {
    console.error('Error generating insights:', error);
    return Array(3).fill({
      title: 'Insights Unavailable',
      content: 'Could not generate insights at this time.'
    });
  }
};

/**
 * Generates an analysis of potential connections based on user profiles
 */
export const analyzeConnectionMatch = async (
  userProfile: any, 
  potentialMatch: any
): Promise<{ score: number; reasons: string[] }> => {
  try {
    // Format the profiles for the AI
    const formatProfile = (profile: any) => {
      return Object.entries(profile)
        .filter(([key]) => !key.startsWith('_') && key !== 'password' && key !== 'photoURL')
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}: ${value.join(', ')}`;
          }
          return `${key}: ${value}`;
        })
        .join('\n');
    };
    
    const formattedUserProfile = formatProfile(userProfile);
    const formattedPotentialMatch = formatProfile(potentialMatch);
    
    // Create the prompt for connection analysis
    const prompt = `
      Analyze these two user profiles from a crypto/tech social platform and determine their compatibility.
      Calculate a match percentage score (0-100) and provide 2-3 specific reasons for this score.
      
      User Profile:
      ${formattedUserProfile}
      
      Potential Connection Profile:
      ${formattedPotentialMatch}
      
      Respond in this format:
      Score: [0-100]
      
      Reasons:
      1. [First reason]
      2. [Second reason]
      3. [Optional third reason]
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the score and reasons
    const scoreMatch = text.match(/Score:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;
    
    // Clamp score between 0 and 100
    const clampedScore = Math.max(0, Math.min(100, score));
    
    // Extract reasons
    const reasonsSection = text.split('Reasons:')[1]?.trim() || '';
    const reasonsMatch = reasonsSection.match(/\d+\.\s+(.*?)(?=\d+\.|$)/gs);
    
    const reasons = reasonsMatch 
      ? reasonsMatch.map(reason => reason.replace(/^\d+\.\s+/, '').trim()) 
      : ['Compatibility factors could not be determined'];
    
    return {
      score: clampedScore,
      reasons: reasons
    };
  } catch (error) {
    console.error('Error analyzing connection match:', error);
    return {
      score: 50,
      reasons: ['Could not analyze compatibility at this time.']
    };
  }
};

export default {
  summarizeThread,
  suggestResponses,
  generateInsights,
  analyzeConnectionMatch
};