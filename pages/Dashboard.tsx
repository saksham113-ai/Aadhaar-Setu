
import React, { useState, useMemo } from 'react';
import { 
  Users, FileText, AlertTriangle, TrendingUp, Sparkles, MapPin, 
  ChevronRight, Activity, ShieldCheck, BarChart3, Clock, Info
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { AadhaarTrendChart } from '../components/Charts';
import { AadhaarRecord, AIInsightResponse } from '../types';
import { getAIInsights } from '../services/geminiService';

interface DashboardProps {
  data: AadhaarRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [loadingAI, setLoadingAI] = useState(false);
  const [insights, setInsights] = useState<AIInsightResponse | null>(null);

  const stats = useMemo(() => {
    const enrolled = data.reduce((acc, curr) => acc + curr.enrolled, 0);
    const updates = data.reduce((acc, curr) => acc + curr.updates, 0);
    const rejected = data.reduce((acc, curr) => acc + curr.rejected, 0);
    return {
      enrolled,
      updates,
      rejected,
      rejectionRate: ((rejected / (enrolled + updates + rejected)) * 100).toFixed(2)
    };
  }, [data]);

  const handleFetchInsights = async () => {
    setLoadingAI(true);
    try {
      const sortedByRisk = [...data].sort((a, b) => b.rejected / b.enrolled - a.rejected / a.enrolled).slice(0, 30);
      const result = await getAIInsights(sortedByRisk);
      setInsights(result);
    } catch (error) {
      alert("Analysis engine busy. Please retry in a few moments.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003366]">National Performance Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time monitoring of UIDAI enrolment and update logs</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-md">
          <Activity size={14} className="text-green-500" />
          SYSTEM STATUS: NOMINAL
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Enrolments" value={stats.enrolled.toLocaleString()} icon={<Users size={20} />} trend="+12.4%" />
        <StatCard title="Total Updates" value={stats.updates.toLocaleString()} icon={<FileText size={20} />} trend="+5.1%" />
        <StatCard title="Rejections" value={stats.rejected.toLocaleString()} icon={<AlertTriangle size={20} />} color="bg-orange-50/50" />
        <StatCard title="Rejection Rate" value={`${stats.rejectionRate}%`} icon={<BarChart3 size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-[#003366] mb-6 flex items-center gap-2">
              <TrendingUp size={20} />
              Enrolment vs Update Trends (High Activity Districts)
            </h2>
            <AadhaarTrendChart data={data.slice(0, 10)} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-[#003366] text-sm uppercase tracking-wider">Regional Data Log</h3>
            </div>
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-gray-500 uppercase bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3">District</th>
                    <th className="px-6 py-3">State</th>
                    <th className="px-6 py-3 text-right">Enrolled</th>
                    <th className="px-6 py-3 text-right">Rejected</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{row.district}</td>
                      <td className="px-6 py-4 text-gray-500">{row.state}</td>
                      <td className="px-6 py-4 text-right font-medium">{row.enrolled.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-red-600">{row.rejected.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.rejected > 200 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {row.rejected > 200 ? 'REVIEW' : 'NORMAL'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 text-[#003366] rounded-lg">
                <Sparkles size={20} />
              </div>
              <h2 className="text-lg font-bold text-[#003366]">Administrative Analysis</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Automated data parsing for identifying regional risk factors and administrative improvements.
            </p>

            <button 
              onClick={handleFetchInsights}
              disabled={loadingAI}
              className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                loadingAI 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                  : 'bg-[#003366] text-white hover:bg-[#002244] shadow-md'
              }`}
            >
              {loadingAI ? 'PROCESSING...' : 'GENERATE INSIGHTS'}
              {!loadingAI && <ChevronRight size={16} />}
            </button>

            {insights && (
              <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-1">
                    <AlertTriangle size={12} /> Priority Risk Factors
                  </h4>
                  {insights.riskFactors.map((f, i) => (
                    <div key={i} className="text-xs text-gray-700 bg-red-50 p-3 rounded-lg border border-red-100">
                      • {f}
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck size={12} /> Recommended Measures
                  </h4>
                  {insights.administrativeMeasures.map((m, i) => (
                    <div key={i} className="text-xs text-gray-700 bg-green-50 p-3 rounded-lg border border-green-100">
                      • {m}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {!insights && !loadingAI && (
              <div className="mt-12 py-12 text-center opacity-30">
                <Info size={40} className="mx-auto mb-2" />
                <p className="text-xs">Click the button to start analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
