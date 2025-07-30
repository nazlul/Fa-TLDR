"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface SummaryResult {
  summary: string;
  originalLength: number;
  summaryLength: number;
  reduction: number;
  source?: string;
}

type InputMode = "text" | "url" | "post";

export default function TLDRApp() {
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [inputText, setInputText] = useState("");
  const [url, setUrl] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('tldr-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('tldr-theme', newTheme ? 'dark' : 'light');
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSummarize = async () => {
    let content = "";
    let source = "";

    // Validate input based on mode
    if (inputMode === "text") {
      if (!inputText.trim()) {
        setError("Please enter some text to summarize");
        return;
      }
      content = inputText;
      source = "Direct text input";
    } else if (inputMode === "url") {
      if (!url.trim()) {
        setError("Please enter a URL to summarize");
        return;
      }
      content = url;
      source = url;
    } else if (inputMode === "post") {
      if (!postUrl.trim()) {
        setError("Please enter a Farcaster post URL");
        return;
      }
      content = postUrl;
      source = postUrl;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          mode: inputMode,
          length: summaryLength,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate summary");
      }

      const data = await response.json();
      setResult({ ...data, source });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setUrl("");
    setPostUrl("");
    setResult(null);
    setError(null);
  };

  const handleCopy = async () => {
    if (result?.summary) {
      try {
        await navigator.clipboard.writeText(result.summary);
        // You could add a toast notification here
      } catch (err) {
        console.error("Failed to copy text");
      }
    }
  };

  const renderInputField = () => {
    switch (inputMode) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor="text-input" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Text to Summarize
            </Label>
            <textarea
              id="text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your text here..."
              className="w-full h-32 p-4 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />
          </div>
        );
      case "url":
        return (
          <div className="space-y-2">
            <Label htmlFor="url-input" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Website URL
            </Label>
            <Input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />
          </div>
        );
      case "post":
        return (
          <div className="space-y-2">
            <Label htmlFor="post-input" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Farcaster Post URL
            </Label>
            <Input
              id="post-input"
              type="url"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://warpcast.com/username/0x..."
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />
          </div>
        );
    }
  };

  const isInputValid = () => {
    switch (inputMode) {
      case "text":
        return inputText.trim().length > 0;
      case "url":
        return url.trim().length > 0;
      case "post":
        return postUrl.trim().length > 0;
      default:
        return false;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Header */}
      <div className={`transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50' 
          : 'bg-white/80 backdrop-blur-sm border-b border-gray-200/50'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  TLDR
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Summarize anything instantly
                </p>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className={`transition-colors duration-300 rounded-2xl border shadow-xl p-8 ${
          isDarkMode 
            ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700/50' 
            : 'bg-white/80 backdrop-blur-sm border-gray-200/50'
        }`}>
          {/* Input Mode Selection */}
          <div className={`flex gap-2 p-1 rounded-xl mb-6 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
          }`}>
            <button
              onClick={() => setInputMode("text")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                inputMode === "text"
                  ? isDarkMode 
                    ? 'bg-gray-600 text-purple-400 shadow-sm' 
                    : 'bg-white text-purple-600 shadow-sm'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-600/50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              📝 Text
            </button>
            <button
              onClick={() => setInputMode("url")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                inputMode === "url"
                  ? isDarkMode 
                    ? 'bg-gray-600 text-purple-400 shadow-sm' 
                    : 'bg-white text-purple-600 shadow-sm'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-600/50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              🌐 Website
            </button>
            <button
              onClick={() => setInputMode("post")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                inputMode === "post"
                  ? isDarkMode 
                    ? 'bg-gray-600 text-purple-400 shadow-sm' 
                    : 'bg-white text-purple-600 shadow-sm'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-600/50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              🚀 Post
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-6">
            {renderInputField()}

            <div className="space-y-2">
              <Label htmlFor="length-select" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Summary Length
              </Label>
              <select
                id="length-select"
                value={summaryLength}
                onChange={(e) => setSummaryLength(e.target.value)}
                className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-colors duration-300 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800/80 text-gray-100' 
                    : 'border-gray-200 bg-white/80 text-gray-900'
                }`}
                disabled={isLoading}
              >
                <option value="short">Short (1-2 sentences)</option>
                <option value="medium">Medium (2-3 sentences)</option>
                <option value="long">Long (3-4 sentences)</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSummarize}
                disabled={isLoading || !isInputValid()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  "Generate TLDR"
                )}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                disabled={isLoading}
                className={`px-6 py-4 rounded-xl transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-gray-100' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className={`mt-6 p-4 rounded-xl transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-red-900/50 border border-red-700' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-red-300' : 'text-red-600'
              }`}>{error}</p>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="mt-8 space-y-4">
              <div className={`rounded-xl p-6 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-700/50' 
                  : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
              }`}>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">⚡</span>
                  </div>
                  <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>TLDR</h3>
                </div>
                <p className={`mb-4 leading-relaxed transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>{result.summary}</p>
                {result.source && (
                  <p className={`text-xs mb-3 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Source: {result.source}</p>
                )}
                <div className={`flex justify-between items-center text-sm mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <span>Original: {result.originalLength} characters</span>
                  <span>Summary: {result.summaryLength} characters</span>
                  <span className="font-medium text-purple-400 dark:text-purple-300">{result.reduction}% reduction</span>
                </div>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className={`rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'border-purple-600 text-purple-300 hover:bg-purple-900/50' 
                      : 'border-purple-200 text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  Copy TLDR
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mt-8 text-center py-12">
              <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-700 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className={`font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Generating your TLDR...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Powered by AI • Built for Farcaster
          </p>
        </div>
      </div>
    </div>
  );
} 