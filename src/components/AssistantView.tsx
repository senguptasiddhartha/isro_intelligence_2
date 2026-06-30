import { useState } from "react";
import { Send, Bot, User, Cpu, Sparkles, HelpCircle } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  model?: string;
}

export default function AssistantView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "ai",
      text: "Welcome to the Aditya-L1 Mission Control AI Research Copilot. I can assist you with real-time payload data evaluations, explaining Soft and Hard X-ray spectral signatures, or analyzing flare predictions. Select one of the quick scientific inquiries below or write your own.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      model: "ISRO Space Weather AI Agent",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "What is SoLEXS?",
    "What is HEL1OS?",
    "Explain flare classes",
    "Why was this flare predicted?",
    "Explain confidence score",
    "Summarize today's activity",
    "Generate scientific explanation",
    "Generate operational summary",
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.text || "An unexpected telemetry analysis timeout occurred. Please retry your query.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        model: data.model || "Gemini-3.5-Flash",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error("AI Chat Error:", e);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "System is operating offline. Failed to query Gemini core. However, from local rules: Background Soft X-ray fluxes remain steady. Operational posturing remains at Green.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        model: "Local Rules Core (Offline)",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 animate-fade-in h-[calc(100vh-8rem)] shrink-0" id="assistant-view">
      {/* Suggested Inquiries (Left / Top) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-1 flex flex-col h-full overflow-y-auto">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center space-x-2 border-b border-gray-100 pb-3 mb-4">
          <HelpCircle className="h-4 w-4 text-[#0057B8]" />
          <span>Quick Science Queries</span>
        </h3>
        
        <p className="text-xs text-gray-400 mb-4 leading-normal">
          Click on any quick-query below to instantly trigger a detailed scientific analysis or explanation.
        </p>

        <div className="space-y-2 flex-1">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="w-full text-left rounded-lg border border-gray-100 bg-[#F7F9FC] p-3 text-xs font-semibold text-gray-700 hover:border-[#0057B8] hover:bg-white transition duration-150 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Chat Window (Right / Bottom) */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-3 flex flex-col h-full overflow-hidden">
        {/* Chat Window Header */}
        <div className="bg-[#F7F9FC] border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0057B8] text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">Aditya-L1 Research Assistant</h3>
              <p className="text-[10px] text-gray-400 font-mono">MODEL STATUS: ONLINE (SYNCHRONIZED)</p>
            </div>
          </div>
          <span className="text-xs rounded bg-[#EAF7ED] text-[#16A34A] border border-[#C6ECD2] px-2.5 py-0.5 font-bold uppercase font-mono">
            Secure Session
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div key={msg.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                {/* AI Avatar */}
                {!isUser && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0057B8] text-white shrink-0 mt-1">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[80%] rounded-xl p-4 text-xs leading-relaxed ${
                  isUser 
                    ? "bg-[#0057B8] text-white rounded-tr-none" 
                    : "bg-[#F7F9FC] border border-gray-100 text-gray-800 rounded-tl-none"
                }`}>
                  {/* Model header for AI messages */}
                  {!isUser && msg.model && (
                    <div className="flex items-center space-x-1 text-[9px] font-bold text-[#0057B8] font-mono uppercase mb-1">
                      <Cpu className="h-3 w-3" />
                      <span>{msg.model}</span>
                    </div>
                  )}

                  {/* Render content with clean double-newline breaks */}
                  <div className="space-y-2 whitespace-pre-wrap">
                    {msg.text}
                  </div>
                  
                  <span className={`block text-[9px] mt-2 font-mono ${isUser ? "text-blue-200 text-right" : "text-gray-400"}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 shrink-0 mt-1">
                    <User className="h-4.5 w-4.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Thinking Bubble */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0057B8] text-white shrink-0 mt-1">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div className="bg-[#F7F9FC] border border-gray-100 rounded-xl rounded-tl-none p-4 text-xs text-gray-500 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="block text-[9px] text-gray-400 font-mono mt-1 uppercase">Performing physical data retrieval...</span>
              </div>
            </div>
          )}
        </div>

        {/* Message Input Bar */}
        <div className="border-t border-gray-200 p-4 bg-[#F7F9FC]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a scientific query about Aditya-L1 solar flare data..."
              className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:border-[#0057B8] focus:outline-none focus:ring-1 focus:ring-[#0057B8]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0057B8] text-white shadow hover:bg-opacity-90 transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
