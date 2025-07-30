"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./input";
import { Label } from "./label";

interface SummaryResult {
  summary: string;
  originalLength: number;
  summaryLength: number;
  reduction: number;
  source?: string;
}

type InputMode = "text" | "url" | "post";

export default function SummarizerTab() {
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [inputText, setInputText] = useState("");
  const [url, setUrl] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          <div>
            <Label htmlFor="text-input">Text to Summarize</Label>
            <textarea
              id="text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your text here..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        );
      case "url":
        return (
          <div>
            <Label htmlFor="url-input">Website URL</Label>
            <Input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              disabled={isLoading}
            />
          </div>
        );
      case "post":
        return (
          <div>
            <Label htmlFor="post-input">Farcaster Post URL</Label>
            <Input
              id="post-input"
              type="url"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://warpcast.com/username/0x..."
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">TLDR</h2>
        <p className="text-sm text-gray-600">
          Summarize text, websites, or Farcaster posts instantly
        </p>
      </div>

      {/* Input Mode Selection */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setInputMode("text")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            inputMode === "text"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          📝 Text
        </button>
        <button
          onClick={() => setInputMode("url")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            inputMode === "url"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          🌐 Website
        </button>
        <button
          onClick={() => setInputMode("post")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            inputMode === "post"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          🚀 Post
        </button>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        {renderInputField()}

        <div>
          <Label htmlFor="length-select">Summary Length</Label>
          <select
            id="length-select"
            value={summaryLength}
            onChange={(e) => setSummaryLength(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="flex-1"
          >
            {isLoading ? "Generating..." : "Summarize"}
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            disabled={isLoading}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold mb-2">TLDR</h3>
            <p className="text-gray-800 mb-3">{result.summary}</p>
            {result.source && (
              <p className="text-xs text-gray-500 mb-2">Source: {result.source}</p>
            )}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Original: {result.originalLength} characters</span>
              <span>Summary: {result.summaryLength} characters</span>
              <span>{result.reduction}% reduction</span>
            </div>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Copy Summary
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your TLDR...</p>
        </div>
      )}
    </div>
  );
} 