import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  X,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useApp, AppView } from '../../context/AppContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: string;
  isError?: boolean;
  actionChip?: {
    label: string;
    view: AppView;
  };
}

const QUICK_PROMPTS = [
  'Open Report Form',
  'Track My Complaints',
  'Explore Challenges',
  'Go to Dashboard',
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  role: 'assistant',
  content: `Namaste! 🙏 I am **SolveSphere AI**, your assistant for **JH Innovation Connect**.

You can ask me questions or type commands like **"open report"**, **"track complaints"**, or **"dashboard"** to navigate directly. How can I help you?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  provider: 'assistant',
};

export const AIChatWidget: React.FC = () => {
  const { currentRole, switchRole, setCurrentView, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  // Check health on mount
  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      try {
        const h = await aiService.checkHealth();
        if (isMounted) {
          setServerStatus(h && h.status === 'ok' ? 'online' : 'offline');
        }
      } catch {
        if (isMounted) setServerStatus('offline');
      }
    };
    check();
    return () => {
      isMounted = false;
    };
  }, []);

  // Map intents and routing commands to immediate navigation
  const resolveTargetView = (
    command: string
  ): { view: AppView; roleNeeded?: string; label: string; text: string } | null => {
    const c = command.toLowerCase().trim().replace(/[.,!?;:]/g, '');

    // 1. Report problem / submit challenge / open report
    if (
      c === 'open report' ||
      c === 'report problem' ||
      c === 'report a problem' ||
      c === 'submit report' ||
      c === 'submit a report' ||
      c === 'file report' ||
      c === 'file a report' ||
      c === 'file complaint' ||
      c === 'file a complaint' ||
      c === 'lodge complaint' ||
      c === 'submit problem' ||
      c === 'submit challenge' ||
      c === 'submit a challenge' ||
      c === 'new report' ||
      c.includes('open report') ||
      c.includes('file complaint') ||
      c.includes('submit problem') ||
      c.includes('submit challenge')
    ) {
      return {
        view: 'submit-challenge',
        roleNeeded: 'citizen',
        label: '🚀 Open Report Form',
        text: 'Opening the problem reporting form. You can enter details, geotag location, and upload photo or voice evidence.',
      };
    }

    // 2. Track complaints / my challenges
    if (
      c === 'track report' ||
      c === 'track problem' ||
      c === 'track complaint' ||
      c === 'track complaints' ||
      c === 'my challenges' ||
      c === 'my complaints' ||
      c === 'my reports' ||
      c === 'citizen tracking' ||
      c.includes('track complaint') ||
      c.includes('track report') ||
      c.includes('my challenges')
    ) {
      return {
        view: 'citizen-my-challenges',
        roleNeeded: 'citizen',
        label: '📋 View My Challenges',
        text: 'Opening your submitted complaints and real-time status tracker.',
      };
    }

    // 3. Dashboard
    if (
      c === 'dashboard' ||
      c === 'open dashboard' ||
      c === 'go to dashboard' ||
      c === 'my dashboard' ||
      c === 'home' ||
      c === 'open home'
    ) {
      let dashView: AppView = 'citizen-dashboard';
      if (currentRole === 'student') dashView = 'student-dashboard';
      else if (
        currentRole === 'university_admin' ||
        currentRole === 'faculty_mentor'
      )
        dashView = 'university-dashboard';
      else if (
        currentRole === 'industry_msme' ||
        currentRole === 'csr_org' ||
        currentRole === 'research_institute'
      )
        dashView = 'industry-dashboard';
      else if (currentRole === 'govt_department' || currentRole === 'platform_admin')
        dashView = 'government-dashboard';

      return {
        view: dashView,
        label: '📊 Open Dashboard',
        text: 'Taking you to your dashboard.',
      };
    }

    // 4. Explore challenges
    if (
      c === 'explore challenges' ||
      c === 'view challenges' ||
      c === 'browse challenges' ||
      c === 'open challenges' ||
      c === 'challenges'
    ) {
      return {
        view: 'explore-challenges',
        label: '🔍 Explore Challenges',
        text: 'Opening the state-wide civic challenges explorer.',
      };
    }

    // 5. Industry Open Problem Statements
    if (
      c === 'open problem statements' ||
      c === 'industry challenges' ||
      c === 'industry open challenges' ||
      c === 'open problem statement'
    ) {
      return {
        view: 'industry-open-challenges',
        roleNeeded: 'industry_msme',
        label: '🏢 Industry Problem Statements',
        text: 'Opening Open Problem Statements for Industry evaluation & solution upload.',
      };
    }

    // 6. Login
    if (c === 'login' || c === 'sign in' || c === 'open login') {
      return {
        view: 'login',
        label: '🔐 Open Login',
        text: 'Opening the portal login page.',
      };
    }

    // 7. Signup / Register
    if (
      c === 'signup' ||
      c === 'sign up' ||
      c === 'register' ||
      c === 'open register' ||
      c === 'open signup'
    ) {
      return {
        view: 'signup',
        label: '📝 Register Account',
        text: 'Opening the registration and onboarding page.',
      };
    }

    return null;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Check for direct routing commands
    const target = resolveTargetView(query);
    if (target) {
      if (target.roleNeeded && currentRole !== target.roleNeeded) {
        switchRole(target.roleNeeded as any);
      }
      setCurrentView(target.view);
      showToast('info', 'Navigation', target.text);

      const navMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: target.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'assistant',
        actionChip: {
          label: target.label,
          view: target.view,
        },
      };
      setMessages((prev) => [...prev, navMsg]);
      return;
    }

    // Check for simple greetings
    const isGreeting = [
      'hi',
      'hello',
      'hey',
      'namaste',
      'pranam',
      'good morning',
      'good evening',
      'good afternoon',
    ].includes(query.toLowerCase().trim().replace(/[.,!?;:]/g, ''));

    if (isGreeting) {
      const greetingMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: 'Hello! Welcome to JH Innovation Connect. How can I help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'assistant',
      };
      setMessages((prev) => [...prev, greetingMsg]);
      return;
    }

    setIsLoading(true);

    try {
      const result = await aiService.sendChatMessage(query);
      setServerStatus('online');

      let responseText = result.response;
      let actionChipData: { label: string; view: AppView } | undefined = undefined;

      // Check for navigation tags from backend: [NAVIGATE:<view>]
      const navMatch = responseText.match(/\[NAVIGATE:([a-zA-Z0-9_-]+)\]/);
      if (navMatch) {
        const rawTarget = navMatch[1];
        responseText = responseText.replace(/\[NAVIGATE:[a-zA-Z0-9_-]+\]/g, '').trim();

        if (rawTarget === 'submit-challenge') {
          if (currentRole !== 'citizen') switchRole('citizen');
          setCurrentView('submit-challenge');
          actionChipData = { label: '🚀 Open Report Form', view: 'submit-challenge' };
        } else if (rawTarget === 'citizen-my-challenges') {
          if (currentRole !== 'citizen') switchRole('citizen');
          setCurrentView('citizen-my-challenges');
          actionChipData = { label: '📋 View My Challenges', view: 'citizen-my-challenges' };
        } else if (rawTarget === 'industry-open-challenges') {
          if (currentRole !== 'industry_msme') switchRole('industry_msme');
          setCurrentView('industry-open-challenges');
          actionChipData = { label: '🏢 Open Problem Statements', view: 'industry-open-challenges' };
        } else if (rawTarget === 'dashboard') {
          const dash: AppView =
            currentRole === 'student'
              ? 'student-dashboard'
              : currentRole === 'university_admin' || currentRole === 'faculty_mentor'
              ? 'university-dashboard'
              : currentRole === 'industry_msme' || currentRole === 'csr_org'
              ? 'industry-dashboard'
              : currentRole === 'govt_department' || currentRole === 'platform_admin'
              ? 'government-dashboard'
              : 'citizen-dashboard';
          setCurrentView(dash);
          actionChipData = { label: '📊 Go to Dashboard', view: dash };
        } else {
          const safeView = rawTarget as AppView;
          setCurrentView(safeView);
          actionChipData = { label: `Go to ${rawTarget}`, view: safeView };
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: result.provider,
        actionChip: actionChipData,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const isConnectionError =
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('status 502');

      if (isConnectionError) {
        setServerStatus('offline');
      }

      const errorReply: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: isConnectionError
          ? `⚠️ **AI Server Offline.** Make sure the server is running:\n\`uvicorn app:app --reload --port 8001\``
          : `⚠️ **Error:** ${err.message || 'Unable to generate AI response.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };

      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleActionChipClick = (chip: { label: string; view: AppView }) => {
    if (chip.view === 'submit-challenge' && currentRole !== 'citizen') {
      switchRole('citizen');
    }
    setCurrentView(chip.view);
    showToast('info', 'Navigated', `Switched to ${chip.label}`);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Floating Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[520px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-[#e2d6bc] flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200 ring-1 ring-slate-900/10">
          {/* Header */}
          <div className="bg-[#0d5c3a] px-4 py-3 text-white flex items-center justify-between border-b border-emerald-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white shadow-xs">
                  <Bot className="w-4 h-4 text-amber-300" />
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#0d5c3a] ${
                    serverStatus === 'online' ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                  title={`Status: ${serverStatus}`}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white">SolveSphere AI</h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/20 text-emerald-100 font-semibold uppercase">
                    Assistant
                  </span>
                </div>
                <p className="text-[10px] text-emerald-100">JH Innovation Connect</p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClear}
                title="Clear Chat"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/70 text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isUser
                        ? 'bg-amber-500 text-slate-950'
                        : msg.isError
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-700 text-white'
                    }`}
                  >
                    {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`max-w-[82%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3 rounded-2xl leading-relaxed ${
                        isUser
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs shadow-xs'
                          : msg.isError
                          ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-xs shadow-xs whitespace-pre-wrap'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs whitespace-pre-wrap'
                      }`}
                    >
                      <div>{msg.content}</div>

                      {/* Interactive Action Chip */}
                      {msg.actionChip && (
                        <button
                          type="button"
                          onClick={() => handleActionChipClick(msg.actionChip!)}
                          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
                        >
                          <span>{msg.actionChip.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5 px-1 text-[9px] text-slate-400 font-medium">
                      <span>{msg.timestamp}</span>
                      {!isUser && !msg.isError && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="hover:text-slate-700 cursor-pointer ml-1"
                          title="Copy"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-2.5 h-2.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="bg-white border border-slate-200 p-2.5 rounded-2xl rounded-tl-xs shadow-xs text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="ml-1 text-[11px]">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200/80 overflow-x-auto shrink-0">
              <div className="flex items-center gap-1.5 min-w-max">
                {QUICK_PROMPTS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    disabled={isLoading}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 rounded-lg text-[10px] font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="p-2.5 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask a question or type 'open report'..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-xl shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="SolveSphere AI Chatbot"
        aria-label="Toggle SolveSphere AI Chatbot"
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white font-bold rounded-full shadow-2xl border border-emerald-500/50 hover:border-emerald-400 transition-all transform hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-emerald-500/20 select-none"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shadow-xs">
            {isOpen ? <X className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
          {!isOpen && (
            <>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full" />
            </>
          )}
        </div>
        <div className="text-left hidden sm:block pr-1">
          <div className="text-xs font-extrabold text-white flex items-center gap-1">
            <span>{isOpen ? 'Close Chat' : 'Ask AI'}</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </div>
          <div className="text-[10px] text-emerald-100 font-normal">SolveSphere Copilot</div>
        </div>
      </button>
    </div>
  );
};
