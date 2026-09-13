import React from 'react';
import { useApp } from '../../context/AppContext';
import { JharkhandEmblem } from './JharkhandEmblem';
import {
  MapPin,
  Mail,
  Phone,
  Headphones,
  ChevronRight,
  Droplet,
  Leaf,
  GraduationCap,
  HeartPulse,
  Sun,
  Cone,
  Lightbulb,
  Building2,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  ChevronUp
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#f8f9fa] border-t border-slate-200 relative overflow-hidden font-sans-body">
      {/* Optional faint background mountains/waterfall graphic on the right edge */}
      <div className="absolute right-0 bottom-16 opacity-40 pointer-events-none mix-blend-multiply">
        {/* We can use a subtle background gradient or leave it clean */}
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Col 1: Branding & Social (Spans 3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              <JharkhandEmblem size={52} className="shrink-0 drop-shadow-sm" />
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  JH Innovation Connect
                </h2>
                <h3 className="text-emerald-700 font-semibold text-sm">
                  Government of Jharkhand
                </h3>
              </div>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed pr-4">
              Connecting Citizens, Universities and Industry for a Better Jharkhand.
            </p>

            <div className="w-12 h-0.5 bg-emerald-600"></div>
            
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase italic">
              Ideas today. A stronger tomorrow.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-slate-900 text-base mb-4">Quick Links</h4>
            <ul className="space-y-3 text-[13px] text-slate-600">
              {[
                { label: 'Explore Challenges', view: 'explore-challenges' },
                { label: 'Submit a Challenge', view: 'submit-challenge' },
                { label: 'Jharkhand Map', view: 'map-view' },
                { label: 'Participating Universities', view: 'universities' },
                { label: 'Industry & Partners', view: 'industry' },
                { label: 'Public Impact', view: 'impact' },
                { label: 'How It Works', view: 'landing' },
              ].map((link) => (
                <li key={link.label}>
                  <button 
                    onClick={() => setCurrentView(link.view as any)} 
                    className="group flex items-center justify-between w-full hover:text-emerald-700 transition-colors text-left"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Innovation Domains (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-3 border-l-0 lg:border-l lg:border-slate-200 lg:pl-8">
            <h4 className="font-bold text-slate-900 text-base mb-4">Innovation Domains</h4>
            <ul className="space-y-3 text-[13px] text-slate-600">
              <li className="flex items-center gap-3">
                <Droplet className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Water & Sanitation</span>
              </li>
              <li className="flex items-center gap-3">
                <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Agriculture & Livelihood</span>
              </li>
              <li className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Education</span>
              </li>
              <li className="flex items-center gap-3">
                <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Healthcare</span>
              </li>
              <li className="flex items-center gap-3">
                <Sun className="w-4 h-4 text-green-600 shrink-0" />
                <span>Environment & Energy</span>
              </li>
              <li className="pt-1.5">
                <button 
                  onClick={() => setCurrentView('explore-challenges')} 
                  className="group flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 font-medium transition-colors"
                >
                  <span className="w-4 h-4 flex items-center justify-center space-x-0.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-emerald-600"></span>
                    <span className="w-1 h-1 rounded-full bg-slate-400 group-hover:bg-emerald-600"></span>
                  </span>
                  <span>View All Domains</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Support (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-3 border-l-0 lg:border-l lg:border-slate-200 lg:pl-8">
            <h4 className="font-bold text-slate-900 text-base mb-4">Contact & Support</h4>
            <div className="space-y-3.5 text-[13px] text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Yojana Bhawan, Doranda,<br/>Ranchi, Jharkhand - 834002</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>innovation-he@jharkhand.gov.in</span>
              </div>
              <div className="flex items-start gap-3 py-1">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 text-[17px] tracking-tight">1800-345-6540</span>
                  <span className="text-[11px] text-slate-500 font-medium">Toll-Free PMU Desk</span>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-1">
                <Headphones className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">Help & Support</span>
                  <button className="text-emerald-600 text-[11px] font-semibold hover:text-emerald-700 flex items-center gap-1 mt-0.5">
                    Raise a Query <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Col 5: Our Initiatives (Spans 3 cols) */}
          <div className="lg:col-span-3 space-y-3 border-l-0 lg:border-l lg:border-slate-200 lg:pl-8">
            <h4 className="font-bold text-slate-900 text-base mb-4">Our Initiatives</h4>
            <div className="space-y-3">
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between group hover:border-emerald-200 hover:shadow-xs transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-[13px] leading-tight">Smart India<br/>Hackathon 2026</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">PS #26043</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between group hover:border-emerald-200 hover:shadow-xs transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-slate-700" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-[13px] leading-tight">Jharkhand State Higher<br/>Education Council (JSHEC)</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Decorative Bottom Line (Green, Orange, Gray) */}
      <div className="flex h-1.5 w-full">
        <div className="bg-emerald-600 w-1/3"></div>
        <div className="bg-amber-500 w-1/4"></div>
        <div className="bg-slate-300 w-full"></div>
      </div>

      {/* Copyright and Bottom Meta */}
      <div className="bg-[#f0f2f5] py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-600 font-medium">
          <p>
            &copy; {new Date().getFullYear()} Government of Jharkhand. Designed & Developed for Smart India Hackathon 2026 (Phase 1 - Frontend Prototype).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
            <span className="text-slate-300">|</span>
            <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
            <span className="text-slate-300">|</span>
            <span className="hover:text-slate-900 cursor-pointer">Accessibility Statement</span>
            <span className="text-slate-300">|</span>
            <span className="hover:text-slate-900 cursor-pointer">NIC Guidelines</span>
            
            <button 
              onClick={scrollToTop}
              className="ml-4 flex items-center gap-1.5 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-slate-800 px-3 py-1.5 rounded-full transition-colors font-bold"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
