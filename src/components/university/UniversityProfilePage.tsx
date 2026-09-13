import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  GraduationCap,
  Award,
  BookOpen,
  Users,
  MapPin,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  Save,
  FlaskConical,
  Sparkles,
  Layers,
} from 'lucide-react';

export const UniversityProfilePage: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const [institutionName, setInstitutionName] = useState(
    currentUser.organization || 'Birla Institute of Technology (BIT Mesra), Ranchi'
  );
  const [aisheCode, setAisheCode] = useState('U-0275');
  const [accreditation, setAccreditation] = useState('NAAC Grade A++ (Score 3.68/4.0)');
  const [nirfRank, setNirfRank] = useState('Rank #48 (Engineering Band)');
  const [district, setDistrict] = useState('Ranchi');
  const [nodalOfficer, setNodalOfficer] = useState('Prof. (Dr.) Alok Verma, Dean R&D');
  const [contactEmail, setContactEmail] = useState('dean.rnd@bitmesra.ac.in');
  const [contactPhone, setContactPhone] = useState('+91 651 2275444');
  const [incubationCentre, setIncubationCentre] = useState('BIT-STEP Incubation & Innovation Foundation');

  const departments = [
    { name: 'Chemical Engineering & Water Treatment Lab', faculty: 14, capstoneProjects: 6 },
    { name: 'Electronics, IoT & Embedded Systems', faculty: 22, capstoneProjects: 9 },
    { name: 'Mechanical & Renewable Thermal Energy', faculty: 18, capstoneProjects: 5 },
    { name: 'Computer Science & AI / ML Lab', faculty: 30, capstoneProjects: 12 },
    { name: 'Bioengineering & Diagnostic Testing', faculty: 12, capstoneProjects: 4 },
    { name: 'Civil & Geo-Informatics / Remote Sensing', faculty: 16, capstoneProjects: 5 },
  ];

  const specializedLabs = [
    'Advanced Spectrometry & Heavy Metal Water Testing Facility',
    'Tribal Agro-Processing & Natural Bio-Extracts Incubator',
    'Solar Photovoltaic & Smart Microgrid Testbed (MNRE Supported)',
    'IoT LoRaWAN Telemetry & Remote Sensor Calibration Center',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Profile Updated', 'Institutional credentials and R&D cell registry updated successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e2d6bc] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 text-2xl font-black shrink-0 shadow-xs">
            <GraduationCap className="w-9 h-9 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                Accredited HEI Profile
              </span>
              <span className="text-xs text-slate-600 font-mono font-semibold">AISHE: {aisheCode}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {institutionName}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Department of Higher Education &bull; Government of Jharkhand Institutional Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>JSHEC Verified</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Info */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-[#e2d6bc]/50 pb-3">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Institutional Details & AISHE Credentials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-700">Institution Official Name</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full p-2.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">AISHE Code</label>
                <input
                  type="text"
                  value={aisheCode}
                  onChange={(e) => setAisheCode(e.target.value)}
                  className="w-full p-2.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">District Headquarter</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">NAAC Accreditation Grade</label>
                <input
                  type="text"
                  value={accreditation}
                  onChange={(e) => setAccreditation(e.target.value)}
                  className="w-full p-2.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">NIRF Ranking Band</label>
                <input
                  type="text"
                  value={nirfRank}
                  onChange={(e) => setNirfRank(e.target.value)}
                  className="w-full p-2.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-700">Incubation & Innovation Centre</label>
                <input
                  type="text"
                  value={incubationCentre}
                  onChange={(e) => setIncubationCentre(e.target.value)}
                  className="w-full p-2.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-[#e2d6bc]/50 pb-3 pt-3">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>R&D Nodal Officer & PMU Point of Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-3 space-y-1.5">
                <label className="font-bold text-slate-700">Nodal Officer & Designation</label>
                <input
                  type="text"
                  value={nodalOfficer}
                  onChange={(e) => setNodalOfficer(e.target.value)}
                  className="w-full p-2.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-700">Official R&D Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Direct Contact Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-2.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#e2d6bc]/50 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

          {/* Department Directory */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Registered Academic Departments ({departments.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {departments.map((dept, idx) => (
                <div key={idx} className="p-3 bg-[#fbf8ee] rounded-xl border border-[#e2d6bc] space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">{dept.name}</span>
                  <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                    <span>{dept.faculty} Faculty Researchers</span>
                    <strong className="text-emerald-800">{dept.capstoneProjects} Active Projects</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Labs & Incubation */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-700" />
              <span>Specialized Research Facilities</span>
            </h3>

            <div className="space-y-2.5">
              {specializedLabs.map((lab, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-slate-800 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="leading-snug">{lab}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span>State Innovation Seed Fund Status</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              BIT Mesra is recognized as a Tier-1 Nodal Hub under Jharkhand State Higher Education Council (JSHEC). Eligible for 100% matching R&D grants up to ₹25 Lakhs per capstone cohort.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
