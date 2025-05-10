import React, { useState } from 'react';
import { askGemini } from '@/ai/geminiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const AiResponseGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateResponse = async () => {
    if (!prompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'الرجاء إدخال سؤال',
        description: 'يجب إدخال نص للحصول على رد من الذكاء الاصطناعي'
      });
      return;
    }

    try {
      setLoading(true);
      const result = await askGemini(prompt);
      setResponse(result);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ في الاتصال',
        description: 'حدث خطأ أثناء الاتصال بـ Gemini AI. الرجاء المحاولة مرة أخرى.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>مولد الردود الذكية</CardTitle>
        <CardDescription>
          استخدم الذكاء الاصطناعي Gemini لإنشاء ردود ذكية
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">سؤالك أو الموضوع</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="اكتب سؤالك أو وصف الموضوع هنا..."
            className="min-h-[120px]"
          />
        </div>

        <Button 
          onClick={handleGenerateResponse} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'جاري الإنشاء...' : 'إنشاء الرد'}
        </Button>

        {response && (
          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium">الرد المقترح</label>
            <div className="p-4 rounded-md bg-dark-lighter border border-[#2A2A2A]">
              {response}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiResponseGenerator;