import React from 'react';
import Layout from '@/components/layout/Layout';
import AiResponseGenerator from '@/components/ai/AiResponseGenerator';

const SimpleAI = () => {
  return (
    <Layout title="الذكاء الاصطناعي البسيط">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">الذكاء الاصطناعي مع Gemini</h1>
        <p className="text-gray-light mb-8">
          استخدم الذكاء الاصطناعي من Google Gemini للحصول على إجابات ومساعدة في إنشاء محتوى مناسب.
        </p>
        
        <div className="space-y-8">
          <AiResponseGenerator />
          
          <div className="bg-dark-lighter p-6 rounded-lg border border-[#2A2A2A]">
            <h2 className="text-xl font-bold mb-4">حول Gemini AI</h2>
            <p className="text-gray-light mb-4">
              Gemini هو نموذج متقدم للذكاء الاصطناعي من Google، مصمم لفهم وإنشاء محتوى نصي بطريقة تشبه البشر.
              يمكنه الإجابة على الأسئلة، وإنشاء محتوى إبداعي، وتلخيص النصوص، وأكثر من ذلك.
            </p>
            <h3 className="text-lg font-semibold mb-2">استخدامات مقترحة:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-light">
              <li>كتابة رسائل ورسائل بريد إلكتروني</li>
              <li>إنشاء محتوى للمنشورات الاجتماعية</li>
              <li>تلخيص النصوص الطويلة</li>
              <li>البحث عن معلومات وشرح المفاهيم</li>
              <li>المساعدة في كتابة الشيفرات البرمجية</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SimpleAI;