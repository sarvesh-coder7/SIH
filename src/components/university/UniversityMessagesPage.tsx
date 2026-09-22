import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  CheckCheck,
  Building2,
  Users,
  ShieldCheck,
  Sparkles,
  Phone,
  Video,
  Info,
  Clock,
  FileText,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';

interface ChatChannel {
  id: string;
  name: string;
  role: string;
  org: string;
  avatarText: string;
  avatarBg: string;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  online: boolean;
  category: 'Government' | 'Industry' | 'Student' | 'Patent';
}

interface MessageItem {
  id: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  attachment?: {
    name: string;
    size: string;
  };
}

export const UniversityMessagesPage: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const [channels, setChannels] = useState<ChatChannel[]>([
    {
      id: 'chan-01',
      name: 'Dr. Subhashish Mukherjee',
      role: 'Chief Metallurgist & Water CSR Lead',
      org: 'Tata Steel CSR Foundation',
      avatarText: 'SM',
      avatarBg: 'bg-amber-100 text-amber-900 border-amber-300',
      unreadCount: 1,
      lastMessage: 'Tranche-1 disbursement of ₹2.40 Lakhs cleared to BIT Mesra bank account.',
      lastTime: '10:45 AM',
      online: true,
      category: 'Industry',
    },
    {
      id: 'chan-02',
      name: 'State PMU / JSHEC Nodal Cell',
      role: 'State Project Monitoring Unit',
      org: 'Govt. of Jharkhand (Higher Education)',
      avatarText: 'PMU',
      avatarBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      unreadCount: 0,
      lastMessage: 'Milestone 4 spectrometry calibration report validated. Cleared for field pilot.',
      lastTime: 'Yesterday',
      online: true,
      category: 'Government',
    },
    {
      id: 'chan-03',
      name: 'Fluoride Purifier Student Cohort',
      role: 'Capstone Research Team (4 Members)',
      org: 'BIT Mesra &bull; Chemical & IoT Dept',
      avatarText: 'ST',
      avatarBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      unreadCount: 2,
      lastMessage: 'Priya: Sir, the LoRa sensor telemetry is now streaming live data at 0.45 ppm fluoride.',
      lastTime: '2h ago',
      online: true,
      category: 'Student',
    },
    {
      id: 'chan-04',
      name: 'Dr. Sunita Ghosh',
      role: 'Principal Scientist & IP Lead',
      org: 'CSIR - National Metallurgical Laboratory',
      avatarText: 'SG',
      avatarBg: 'bg-purple-100 text-purple-900 border-purple-300',
      unreadCount: 0,
      lastMessage: 'Patent prior-art search report attached with novelty clearance.',
      lastTime: '2d ago',
      online: false,
      category: 'Patent',
    },
  ]);

  const [selectedChannelId, setSelectedChannelId] = useState<string>('chan-01');
  const [messages, setMessages] = useState<Record<string, MessageItem[]>>({
    'chan-01': [
      {
        id: 'm1',
        senderName: 'Dr. Subhashish Mukherjee',
        senderRole: 'Tata Steel CSR Lead',
        text: 'Greetings Dr. Meenakshi. We reviewed the lab test data for the activated alumina column designed by your BIT Mesra student cohort.',
        timestamp: '10:30 AM',
        isSelf: false,
      },
      {
        id: 'm2',
        senderName: 'Dr. Meenakshi Soren (You)',
        senderRole: 'Lead Faculty & Project Director',
        text: 'Thank you Dr. Mukherjee. The sorption capacity was tested against 8.2 mg/L fluoride synthetic water, and residual fluoride stayed below 0.8 mg/L well within BIS IS 10500 limits.',
        timestamp: '10:38 AM',
        isSelf: true,
      },
      {
        id: 'm3',
        senderName: 'Dr. Subhashish Mukherjee',
        senderRole: 'Tata Steel CSR Lead',
        text: 'Outstanding result! Tranche-1 disbursement of ₹2.40 Lakhs has been sanctioned and cleared to BIT Mesra institutional account. We have also opened our Jamshedpur metallurgy lab for your batch.',
        timestamp: '10:45 AM',
        isSelf: false,
        attachment: {
          name: 'Tata_Steel_CSR_Sanction_JH_0042.pdf',
          size: '1.8 MB',
        },
      },
    ],
    'chan-02': [
      {
        id: 'm1',
        senderName: 'Er. Alok Verma',
        senderRole: 'State PMU Nodal Officer',
        text: 'Official notice: Milestone 4 spectrometry calibration report validated. Cleared for field pilot in Torpa Block (Khunti).',
        timestamp: 'Yesterday, 3:15 PM',
        isSelf: false,
        attachment: {
          name: 'PMU_Field_Pilot_Authorization.pdf',
          size: '2.4 MB',
        },
      },
    ],
    'chan-03': [
      {
        id: 'm1',
        senderName: 'Priya Sharma',
        senderRole: 'Student Lead (Chemical Engg)',
        text: 'Sir, we assembled the vortex filtration cartridge and connected the STM32 IoT telemetry board.',
        timestamp: '2h ago',
        isSelf: false,
      },
      {
        id: 'm2',
        senderName: 'Priya Sharma',
        senderRole: 'Student Lead (Chemical Engg)',
        text: 'The LoRa sensor telemetry is now streaming live data at 0.45 ppm fluoride directly to the cloud dashboard!',
        timestamp: '2h ago',
        isSelf: false,
      },
    ],
    'chan-04': [
      {
        id: 'm1',
        senderName: 'Dr. Sunita Ghosh',
        senderRole: 'CSIR-NML IP Coordinator',
        text: 'Patent prior-art search report attached with novelty clearance for Indian Patent Application #202631008472.',
        timestamp: '2d ago',
        isSelf: false,
      },
    ],
  });

  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const activeChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];
  const activeMessages = messages[selectedChannelId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      senderName: currentUser.name || 'Dr. Meenakshi Soren (You)',
      senderRole: 'Lead Faculty & Mentor',
      text: inputMessage.trim(),
      timestamp: 'Just now',
      isSelf: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedChannelId]: [...(prev[selectedChannelId] || []), newMsg],
    }));

    setChannels((prev) =>
      prev.map((c) =>
        c.id === selectedChannelId
          ? { ...c, lastMessage: inputMessage.trim(), lastTime: 'Just now', unreadCount: 0 }
          : c
      )
    );

    setInputMessage('');
    showToast('success', 'Message Sent', `Dispatched to ${activeChannel.name}.`);
  };

  const handleQuickSnippet = (snippet: string) => {
    setInputMessage(snippet);
  };

  const filteredChannels = channels.filter(
    (c) =>
      !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.org.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d6bc] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-900 text-xs font-bold border border-indigo-200">
              Institutional Communications Hub
            </span>
            <span className="text-xs text-slate-500 font-mono">End-to-End Stakeholder Direct Connect</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Messages & Collaboration Channels
          </h1>
          <p className="text-xs text-slate-600 max-w-xl">
            Real-time messaging with State Innovation PMU officials, Corporate CSR co-mentors (Tata Steel, BCCL), CSIR scientists, and student capstone cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <span className="px-3 py-1.5 rounded-xl bg-[#fbf8ee] border border-[#e2d6bc] text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>State Network Online</span>
          </span>
        </div>
      </div>

      {/* Main Split-Pane Messenger */}
      <div className="bg-white rounded-3xl border border-[#e2d6bc] shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Left Channels List */}
        <div className="lg:col-span-4 border-r border-[#e2d6bc]/70 flex flex-col bg-slate-50/50">
          {/* Search Box */}
          <div className="p-4 border-b border-[#e2d6bc]/70 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search mentors, PMU, or student leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0d5c3a]/20 focus:border-[#0d5c3a]"
              />
            </div>
          </div>

          {/* Channels Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredChannels.map((channel) => {
              const isSelected = channel.id === selectedChannelId;
              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => {
                    setSelectedChannelId(channel.id);
                    setChannels((prev) =>
                      prev.map((c) => (c.id === channel.id ? { ...c, unreadCount: 0 } : c))
                    );
                  }}
                  className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                    isSelected ? 'bg-white shadow-xs border-l-4 border-l-[#0d5c3a]' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-bold text-xs ${channel.avatarBg}`}
                    >
                      {channel.avatarText}
                    </div>
                    {channel.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{channel.name}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{channel.lastTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{channel.org}</p>
                    <p className="text-[11px] text-slate-600 truncate mt-1">{channel.lastMessage}</p>
                  </div>

                  {channel.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#0d5c3a] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Conversation Area */}
        <div className="lg:col-span-8 flex flex-col bg-white">
          {/* Active Chat Header */}
          <div className="p-4 border-b border-[#e2d6bc]/70 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-bold text-xs ${activeChannel.avatarBg}`}
              >
                {activeChannel.avatarText}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{activeChannel.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    {activeChannel.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{activeChannel.role} &bull; {activeChannel.org}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => showToast('info', 'Voice Call', `Initiating audio link with ${activeChannel.name}...`)}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 cursor-pointer"
                title="Voice Consultation"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => showToast('info', 'Video Conference', `Opening secure PMU video session with ${activeChannel.name}...`)}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 cursor-pointer"
                title="Video Conference"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Snippet Chips */}
          <div className="px-4 py-2 bg-[#fbf8ee] border-b border-[#e2d6bc]/50 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-500 font-bold shrink-0">Quick Actions:</span>
            {[
              'Send Milestone 4 Spectrometry Report',
              'Share IoT Water Telemetry Log',
              'Request Lab Access for Students',
              'Confirm CSR Review Meeting',
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickSnippet(chip)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-[#e2d6bc] text-slate-700 font-medium whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30 max-h-[420px]">
            {activeMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                  <span className="font-bold text-slate-700">{msg.senderName}</span>
                  <span>&bull;</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs space-y-2 leading-relaxed ${
                    msg.isSelf
                      ? 'bg-[#0d5c3a] text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-900 border border-[#e2d6bc] rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.attachment && (
                    <div
                      className={`p-2.5 rounded-xl flex items-center justify-between gap-3 text-xs cursor-pointer ${
                        msg.isSelf ? 'bg-white/10 text-white' : 'bg-[#fbf8ee] text-slate-900 border border-[#e2d6bc]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 shrink-0 text-amber-400" />
                        <span className="truncate font-semibold text-[11px]">{msg.attachment.name}</span>
                      </div>
                      <span className="text-[10px] opacity-75 shrink-0">{msg.attachment.size}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-[#e2d6bc]/70 bg-white flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast('info', 'Attach File', 'Select milestone report, lab data or patent document.')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
              title="Attach Document / Lab Log"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={`Message ${activeChannel.name}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0d5c3a]/20 focus:border-[#0d5c3a]"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer ${
                inputMessage.trim()
                  ? 'bg-[#0d5c3a] hover:bg-[#0b4d30] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
