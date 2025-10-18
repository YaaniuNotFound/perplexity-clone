import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Globe, Cpu, Paperclip, RotateCcw, ArrowRight, Menu } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <img src="/perplexity-logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              perplexity
            </span>
          </div>
        </div>
        <Button 
          variant="default" 
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6"
        >
          Open in App
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-center mb-16 text-slate-900 dark:text-slate-100">
            What do you want to know?
          </h1>

          {/* Search Box */}
          <div className="relative">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Input Area */}
              <div className="p-4">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none outline-none text-base min-h-[60px]"
                  rows={2}
                />
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between px-4 pb-4 gap-1 sm:gap-2">
                <div className="flex items-center gap-1">
                  {/* Search Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1 sm:gap-2 rounded-full px-2 sm:px-3 ${
                      isSearchOpen 
                        ? "bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400" 
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                  >
                    <svg 
                      className="h-4 w-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" strokeWidth="2" />
                      <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-sm">Search</span>
                    <svg 
                      className={`h-3 w-3 transition-transform ${isSearchOpen ? "rotate-180" : ""}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>

                  {/* Icon Buttons */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Cpu className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Submit Button */}
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-400"
                  disabled={!query.trim()}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

