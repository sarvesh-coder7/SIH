import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  Briefcase,
  Mail,
  Award,
  CheckCircle2,
  Calendar,
  Building2,
  MessageSquare,
} from 'lucide-react';

export const StudentTeamPage: React.FC = () => {
  const { setCurrentView } = useApp();

  const team = [
    {
      name: 'Dr. Meenakshi Soren',
      role: 'Principal Investigator & Faculty Mentor',
      dept: 'Dept of Chemical Engineering, BIT Mesra',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      expertise: 'Adsorption Nanomaterials & Fluoride Remediation',
      email: 'm.soren@bitmesra.ac.in',
    },
    {
      name: 'Rohan Kumar Verma',
      role: 'Student Co-Lead & IoT Telemetry Lead',
      dept: 'B.Tech Electrical & Electronics (8th Sem), BIT Mesra',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      expertise: 'ESP32 Firmware, Spectrometer Calibration, CAD',
      email: 'rohan.verma@bitmesra.ac.in',
    },
    {
      name: 'Pooja Kumari Soren',
      role: 'Student Researcher (Materials)',
      dept: 'M.Tech Environmental Engineering, BIT Mesra',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      expertise: 'Fly-ash Alumina Composite Column Synthesis',
      email: 'pooja.soren@bitmesra.ac.in',
    },
    {
      name: 'Dr. Subhashish Mukherjee',
      role: 'Industry Mentor (Co-Guide)',
      dept: 'Tata Steel CSR & Sustainability Division',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      expertise: 'Industrial Scaling, Metallurgy, Rapid Field Deployment',
      email: 's.mukherjee@tatasteel.com',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
            Multidisciplinary R&D Cohort
          </span>
          <span className="text-xs font-mono text-slate-500 font-bold">
            Torpa Clean Water Taskforce
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          My Research Team & Mentors
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
          Collaborative squad composed of faculty principal investigators, student researchers across engineering disciplines, and dedicated industry co-mentors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {team.map((member, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex items-start gap-4"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
            />
            <div className="space-y-1 text-xs truncate w-full">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                {member.role}
              </span>
              <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
              <p className="text-slate-600 font-medium">{member.dept}</p>
              <p className="text-slate-500 text-[11px]">
                <strong>Focus:</strong> {member.expertise}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`mailto:${member.email}`}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
