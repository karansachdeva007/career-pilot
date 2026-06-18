"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function KnowledgeBasePage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      toast.error("An error occurred while generating a response.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">RAG Knowledge Base</h1>
        <p className="text-muted-foreground">
          Ask questions about interview prep, DSA, companies, and more.
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <Bot className="h-12 w-12 opacity-20" />
              <p>Hello! I am your advanced RAG Assistant.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-md mt-4">
                <Button variant="outline" className="justify-start" onClick={() => setInput("How should I prepare for Amazon SDE-1?")}>
                  How to prepare for Amazon SDE-1?
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setInput("What are the important DSA topics for Google?")}>
                  DSA topics for Google?
                </Button>
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div key={idx} className={`flex items-start gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`p-2 rounded-full ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${m.role === "user" ? "bg-primary text-primary-foreground whitespace-pre-wrap" : "bg-muted"}`}>
                  {m.role === "user" ? (
                    m.content
                  ) : (
                    <div className="[&>p]:mb-2 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline font-medium">
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-start gap-4 flex-row">
              <div className="p-2 rounded-full bg-muted">
                <Bot className="h-4 w-4" />
              </div>
              <div className="px-4 py-2 rounded-lg bg-muted flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Textarea
              className="min-h-[50px] max-h-[150px] resize-none"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button size="icon" className="h-[50px] w-[50px]" onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
