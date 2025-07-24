'use client';

import { useState } from 'react';
import { generateImage } from '@/lib/actions/generate.image.actions';
import { Loader2, Sparkles, Image as ImageIcon, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

const suggestedPrompts = [
  "A red-haired anime girl with a glowing sword on a rooftop",
  "A ninja cat fighting robots in a futuristic city",
  "A samurai warrior under a thunderstorm",
  "A cyborg soldier defending a broken fortress",
  "A vampire hunter walking through neon ruins"
];

export default function ComicGenerator() {
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
const [imageloading, setImageloading] = useState(false);
  const handleGenerate = async () => {
    try {
      setLoadingText(true);
      setText('');
      setImageUrl('');
      setError('');

      const res = await generateImage(prompt);
      setText(res.promptText);
      setLoadingText(false);
      setLoadingImage(true);

      setTimeout(() => {
        setImageUrl(res.imageUrl);
        setLoadingImage(false);
      }, 1000);
    } catch (err) {
      console.error('Image generation failed:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoadingText(false);
      setLoadingImage(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !loadingText && !loadingImage && prompt) {
      handleGenerate();
    }
  };

const imageDownload =  async () => {
       try {
        setImageloading(true);
         const response = await fetch(imageUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'comic.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
       } catch (error:any) {
        throw new Error(error);
       }finally{
        setImageloading(false);
       }
      }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">
              AI Comic Generator
            </h1>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Transform your ideas into stunning visual comics with our AI-powered generator
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
              <span className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </span>
              Create Your Comic
            </h2>

            {/* Suggested Prompts */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Try a prompt:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(item)}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-md transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              id="prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="A superhero cat saving the day in a futuristic city..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />

            <Button
              onClick={handleGenerate}
              disabled={loadingText || loadingImage || !prompt}
              className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Generate Comic
            </Button>

            {/* Status Messages */}
            {loadingText && (
              <div className="mt-5 p-4 bg-blue-50 rounded-md border border-blue-100 flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <p className="text-blue-700">Thinking...</p>
              </div>
            )}

            {error && (
              <div className="mt-5 p-4 bg-red-50 rounded-md border border-red-100">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* AI Interpretation */}
            {text && (
              <div className="mt-5">
                <h3 className="text-md font-medium text-gray-700 mb-2">AI Interpretation</h3>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Output Panel */}
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
              <span className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                <ImageIcon className="w-4 h-4 text-blue-600" />
              </span>
              Your Comic
            </h2>

            <div className="aspect-square bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Generated Comic"
                  className="w-full h-full object-contain"
                />
              ) : loadingImage ? (
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
                  <p className="text-gray-700 font-medium">Creating your comic...</p>
                  <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
                </div>
              ) : (
                <div className="text-center p-6">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ImageIcon className="w-7 h-7 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-medium">Your comic will appear here</p>
                  <p className="text-gray-500 text-sm mt-2">Enter a description and generate</p>
                </div>
              )}
            </div>

            {imageUrl && (
              <div className="mt-4 flex justify-between items-center">
                <a 
                  href={imageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 transition-colors"
                >
                  View full size
                </a>
                <Button
                  onClick={imageDownload}
                  disabled={imageloading}
                  className="text-sm bg-blue-600 cursor-pointer hover:to-blue-700 text-white px-3 py-1.5 rounded-md transition-colors "
                >
                  {imageloading ? (
                    <>
                      <span>Downloading</span>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    </>
                  ) : (
                    'Download'
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
