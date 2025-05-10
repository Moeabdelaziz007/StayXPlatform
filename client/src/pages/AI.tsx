import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useGeminiAI } from '@/hooks/useGeminiAI';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AI = () => {
  // Thread summarization state
  const [thread, setThread] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  
  // Response suggestions state
  const [conversation, setConversation] = useState<string>('');
  const [context, setContext] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // User insights state
  const [interests, setInterests] = useState<string>('crypto, blockchain, AI, technology');
  const [connections, setConnections] = useState<number>(25);
  const [messages, setMessages] = useState<number>(150);
  const [drops, setDrops] = useState<number>(12);
  const [insights, setInsights] = useState<Array<{ title: string; content: string }>>([]);
  
  const { toast } = useToast();
  const { 
    summarizeThread, 
    suggestResponses, 
    generateInsights,
    summarizing,
    suggesting,
    generating
  } = useGeminiAI({
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'AI Request Failed',
        description: 'There was a problem with the AI request. Please try again.'
      });
    }
  });
  
  const handleSummarize = async () => {
    if (!thread.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Thread',
        description: 'Please enter a conversation to summarize.'
      });
      return;
    }
    
    // Parse the thread into messages format
    const messages = thread.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const isUser = line.toLowerCase().startsWith('user:');
        return {
          role: isUser ? 'user' as const : 'assistant' as const,
          content: line.slice(line.indexOf(':') + 1).trim()
        };
      });
    
    const result = await summarizeThread({ messages });
    setSummary(result);
  };
  
  const handleSuggest = async () => {
    if (!conversation.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Conversation',
        description: 'Please enter a conversation to generate response suggestions.'
      });
      return;
    }
    
    // Parse the conversation into messages format
    const messages = conversation.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const isUser = line.toLowerCase().startsWith('user:');
        return {
          role: isUser ? 'user' as const : 'assistant' as const,
          content: line.slice(line.indexOf(':') + 1).trim()
        };
      });
    
    const result = await suggestResponses({ 
      messages,
      context: context.trim() || undefined,
      options: 3
    });
    
    setSuggestions(result);
  };
  
  const handleGenerateInsights = async () => {
    const interestsArray = interests.split(',').map(item => item.trim()).filter(Boolean);
    
    const userData = {
      interests: interestsArray,
      connections,
      messageCount: messages,
      dropCount: drops
    };
    
    const result = await generateInsights({ userData });
    setInsights(result);
  };
  
  return (
    <Layout title="AI Integration">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">StayX AI Integration</h1>
        </div>
        
        <p className="text-gray-medium">
          This page demonstrates the Gemini AI integration for StayX. Try out the different AI features below.
        </p>
        
        <Tabs defaultValue="summarize" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="summarize">Thread Summarization</TabsTrigger>
            <TabsTrigger value="suggest">Response Suggestions</TabsTrigger>
            <TabsTrigger value="insights">User Insights</TabsTrigger>
          </TabsList>
          
          {/* Thread Summarization */}
          <TabsContent value="summarize">
            <Card>
              <CardHeader>
                <CardTitle>Thread Summarization</CardTitle>
                <CardDescription>
                  Enter a conversation thread to be summarized by the AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Conversation Thread</label>
                  <p className="text-xs text-gray-medium mb-2">
                    Format each line as "User: message" or "Assistant: message"
                  </p>
                  <Textarea
                    value={thread}
                    onChange={(e) => setThread(e.target.value)}
                    placeholder="User: Hi there! I'm looking to learn more about Bitcoin mining.&#10;Assistant: Hello! I'd be happy to explain Bitcoin mining. What specific aspects are you interested in?&#10;User: I'm curious about energy consumption and sustainability."
                    className="min-h-[200px]"
                  />
                </div>
                
                <Button 
                  onClick={handleSummarize} 
                  disabled={summarizing}
                  className="w-full"
                >
                  {summarizing ? 'Summarizing...' : 'Summarize Thread'}
                </Button>
                
                {summary && (
                  <div className="mt-6">
                    <Separator className="my-4" />
                    <label className="block text-sm font-medium mb-2">Summary</label>
                    <div className="p-4 rounded-md bg-dark-lighter border border-[#2A2A2A]">
                      {summary}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Response Suggestions */}
          <TabsContent value="suggest">
            <Card>
              <CardHeader>
                <CardTitle>Response Suggestions</CardTitle>
                <CardDescription>
                  Enter a conversation and get AI-suggested responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Conversation</label>
                  <p className="text-xs text-gray-medium mb-2">
                    Format each line as "User: message" or "Assistant: message"
                  </p>
                  <Textarea
                    value={conversation}
                    onChange={(e) => setConversation(e.target.value)}
                    placeholder="User: What do you think about Ethereum's transition to proof-of-stake?&#10;Assistant: It's a significant change that addresses energy concerns while maintaining security.&#10;User: Are there any downsides to proof-of-stake?"
                    className="min-h-[150px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Additional Context (Optional)</label>
                  <Input
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="User is a software developer interested in blockchain technology"
                  />
                </div>
                
                <Button 
                  onClick={handleSuggest} 
                  disabled={suggesting}
                  className="w-full"
                >
                  {suggesting ? 'Generating Suggestions...' : 'Generate Response Suggestions'}
                </Button>
                
                {suggestions.length > 0 && (
                  <div className="mt-6">
                    <Separator className="my-4" />
                    <label className="block text-sm font-medium mb-2">Suggested Responses</label>
                    <div className="space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          className="p-4 rounded-md bg-dark-lighter border border-[#2A2A2A] hover:border-neon-green transition-colors duration-200"
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* User Insights */}
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>User Insights</CardTitle>
                <CardDescription>
                  Generate AI-powered insights based on user data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Interests</label>
                    <Input
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="crypto, blockchain, AI, technology"
                    />
                    <p className="text-xs text-gray-medium mt-1">Comma-separated list of interests</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Connections</label>
                    <Input
                      type="number"
                      value={connections}
                      onChange={(e) => setConnections(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Messages Count</label>
                    <Input
                      type="number"
                      value={messages}
                      onChange={(e) => setMessages(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Drops Count</label>
                    <Input
                      type="number"
                      value={drops}
                      onChange={(e) => setDrops(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleGenerateInsights} 
                  disabled={generating}
                  className="w-full"
                >
                  {generating ? 'Generating Insights...' : 'Generate User Insights'}
                </Button>
                
                {insights.length > 0 && (
                  <div className="mt-6">
                    <Separator className="my-4" />
                    <label className="block text-sm font-medium mb-2">Generated Insights</label>
                    <div className="grid grid-cols-1 gap-4">
                      {insights.map((insight, index) => (
                        <Card key={index} variant="gradient">
                          <CardHeader>
                            <CardTitle className="text-base">{insight.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{insight.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AI;