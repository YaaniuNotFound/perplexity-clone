import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Chat() {
  const [, setLocation] = useLocation();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createConversationMutation = trpc.chat.createConversation.useMutation();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  
  const { data: conversationData, refetch } = trpc.chat.getConversation.useQuery(
    { conversationId: conversationId! },
    { enabled: !!conversationId }
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationData?.messages]);

  const handleSubmit = async () => {
    if (!query.trim() || isLoading) return;

    const userQuery = query;
    setQuery("");
    setIsLoading(true);

    try {
      let currentConversationId = conversationId;
      
      // Create conversation if it doesn't exist
      if (!currentConversationId) {
        const newConversation = await createConversationMutation.mutateAsync({
          title: userQuery.slice(0, 50),
        });
        currentConversationId = newConversation.id;
        setConversationId(currentConversationId);
      }
      
      // Send message
      await sendMessageMutation.mutateAsync({
        conversationId: currentConversationId,
        content: userQuery,
      });
      
      // Refetch conversation to get new messages
      await refetch();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const messages = conversationData?.messages || [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation("/")}>
          <img src="/perplexity-logo.svg" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            perplexity
          </span>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-slate-500 dark:text-slate-400 mt-20">
              <h2 className="text-2xl font-semibold mb-2">Start a conversation</h2>
              <p>Ask me anything to begin</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-teal-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none outline-none text-base min-h-[60px]"
                rows={2}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-end px-4 pb-4">
              <Button
                size="icon"
                onClick={handleSubmit}
                className="h-10 w-10 rounded-full bg-teal-600 hover:bg-teal-700 text-white"
                disabled={!query.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

