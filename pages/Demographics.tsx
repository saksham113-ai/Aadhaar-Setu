
import React, { useState, useMemo } from 'react';
import { 
  Filter, PieChart as PieIcon, BarChart as BarIcon, Grid, 
  BrainCircuit, Database, Target, TrendingUp, Search, 
  Download, Share2, Calculator
} from 'lucide-react';
import { DemographicPieChart, CorrelationScatter, ConfusionMatrix, AgeGroupBarChart } from '../components/Charts';
import { AadhaarRecord, AIStatsRecommendation } from '../types';
import { STATES_DISTRICTS } from '../constants';
import { getAIStatsRecommendation } from '../services/geminiService';

interface DemographicsProps {
  data: AadhaarRecord[];
}

const Demographics: React.FC<DemographicsProps> = ({ data }) => {
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [loadingAI, setLoadingAI] = useState(false);
  const [statsAI, setStatsAI] = useState<AIStatsRecommendation | null>(null);

  const filteredData = useMemo(() => {
    return data.filter(d => 
      (selectedState === 'All' || d.state === selectedState) && 
      (selectedDistrict === 'All' || d.district === selectedDistrict)
    );
  }, [data, selectedState, selectedDistrict]);

  // Real-time Local Statistical Calculations
  const calculatedStats = useMemo(() => {
    if (filteredData.length === 0) return null;
    
    const en = filteredData.map(d => d.enrolled);
    const up = filteredData.map(d => d.updates);
    const n = en.length;

    // Mean
    const mean = en.reduce((a, b) => a + b, 0) / n;

    // Median
    const sorted = [...en].sort((a, b) => a - b);
    const median = n % 2 !== 0 
      ? sorted[Math.floor(n / 2)] 
      : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

    // Mode
    const counts: Record<number, number> = {};
    en.forEach(v => counts[v] = (counts[v] || 0) + 1);
    const mode = Number(Object.keys(counts).reduce((a, b) => counts[Number(a)] > counts[Number(b)] ? a : b));

    // Variance
    const variance = en.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;

    // Covariance (Enrolments vs Updates)
    const meanUp = up.reduce((a, b) => a + b, 0) / n;
    const covariance = en.reduce((a, b, i) => a + (b - mean) * (up[i] - meanUp), 0) / n;

    // Demographics Aggregates
    const male = filteredData.reduce((acc, curr) => acc + curr.gender_m, 0);
    const female = filteredData.reduce((acc, curr) => acc + curr.gender_f, 0);
    const ageGroups: Record<string, number> = { '0-18': 0, '19-45': 0, '46-60': 0, '60+': 0 };
    filteredData.forEach(d => { ageGroups[d.age_group] = (ageGroups[d.age_group] || 0) + d.enrolled; });

    return {
      mean, median, mode, variance, covariance,
      totalEn: en.reduce((a, b) => a + b, 0),
      totalRe: filteredData.reduce((acc, curr) => acc + curr.rejected, 0),
      genderData: [
        { name: 'Male', value: male },
        { name: 'Female', value: female }
      ],
      ageData: Object.entries(ageGroups).map(([name, value]) => ({ name, value }))
    };
  }, [filteredData]);

  const handleStatsAI = async () => {
    if (!calculatedStats) return;
    setLoadingAI(true);
    setStatsAI(null);
    try {
      const result = await getAIStatsRecommendation(filteredData.slice(0, 50), calculatedStats);
      setStatsAI(result);
    } catch (error) {
      alert("AI interpretation cluster offline. Standard calculations active.");
    } finally {
      setLoadingAI(false);
    }
  };

  const availableDistricts = useMemo(() => {
    if (selectedState === 'All') return [];
    return STATES_DISTRICTS[selectedState] || [];
  }, [selectedState]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Filtering Control Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl text-[#003366]">
              <Filter size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#003366]">Regional Analytics Controller</h2>
              <p className="text-xs text-gray-500 font-medium">Define jurisdiction for localized demographic and performance modeling</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Share2 size={18} /></button>
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Download size={18} /></button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Target State / UT</label>
            <select 
              value={selectedState} 
              onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict('All'); setStatsAI(null); }}
              className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 outline-none focus:ring-2 focus:ring-[#003366] text-sm font-semibold text-[#003366] shadow-sm"
            >
              <option value="All">Pan India (Consolidated)</option>
              {Object.keys(STATES_DISTRICTS).sort().map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Administrative District</label>
            <select 
              value={selectedDistrict} 
              disabled={selectedState === 'All'}
              onChange={(e) => { setSelectedDistrict(e.target.value); setStatsAI(null); }}
              className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 outline-none focus:ring-2 focus:ring-[#003366] text-sm font-semibold text-[#003366] disabled:opacity-40 shadow-sm"
            >
              <option value="All">All Jurisdictions</option>
              {availableDistricts.sort().map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={handleStatsAI}
              disabled={loadingAI || filteredData.length === 0}
              className="w-full flex items-center justify-center gap-3 bg-[#FF9933] hover:bg-[#e68a2e] text-white font-bold py-2.5 rounded-lg transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400"
            >
              {loadingAI ? 'INTERPRETING...' : 'AI RECOMMENDATION'}
              {!loadingAI && <BrainCircuit size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Instant Local Stats Display */}
      {calculatedStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Mean Enrolment', value: calculatedStats.mean.toFixed(0), icon: <Calculator size={14}/> },
            { label: 'Median Enrolment', value: calculatedStats.median.toFixed(0), icon: <Calculator size={14}/> },
            { label: 'Mode Frequency', value: calculatedStats.mode.toFixed(0), icon: <Calculator size={14}/> },
            { label: 'Sample Variance', value: calculatedStats.variance.toFixed(1), icon: <Calculator size={14}/> },
            { label: 'E/U Covariance', value: calculatedStats.covariance.toFixed(2), icon: <Calculator size={14}/> }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#003366] transition-colors group">
              <div className="flex items-center gap-2 mb-1 opacity-40 group-hover:opacity-100 transition-opacity">
                {item.icon}
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{item.label}</p>
              </div>
              <p className="text-xl font-black text-[#003366]">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-[#003366] flex items-center gap-2 mb-6 uppercase text-sm tracking-tight">
            <PieIcon size={18} className="text-orange-500" /> Gender Inclusivity
          </h3>
          <DemographicPieChart data={calculatedStats?.genderData || []} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-[#003366] flex items-center gap-2 mb-6 uppercase text-sm tracking-tight">
            <BarIcon size={18} className="text-green-500" /> Age Demographics
          </h3>
          <AgeGroupBarChart data={calculatedStats?.ageData || []} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-[#003366] flex items-center gap-2 mb-6 uppercase text-sm tracking-tight">
            <TrendingUp size={18} className="text-blue-500" /> Service Correlation
          </h3>
          <CorrelationScatter data={filteredData.slice(0, 150)} />
        </div>
      </div>

      {/* Quality Matrix & AI Recommendation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-[#003366] flex items-center gap-2 mb-8 uppercase text-sm tracking-tight border-b border-gray-50 pb-4">
            <Target size={18} className="text-red-500" /> Data Quality (Confusion Matrix)
          </h3>
          <ConfusionMatrix enrolled={calculatedStats?.totalEn || 0} rejected={calculatedStats?.totalRe || 0} />
        </div>

        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
            <h3 className="font-bold text-[#003366] flex items-center gap-2 uppercase text-sm tracking-tight">
              <Database size={18} className="text-[#FF9933]" /> AI-Generated Administrative Report
            </h3>
          </div>

          {statsAI ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="p-5 bg-[#f8fafc] border-l-4 border-[#FF9933] rounded-r-xl">
                <h4 className="text-xs font-bold text-[#003366] uppercase mb-2 flex items-center gap-2">
                  <TrendingUp size={14} /> Intelligence Analysis
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{statsAI.analysis}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Strategic Measures</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {statsAI.measures.map((m, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-all group">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#003366] font-black text-xs group-hover:bg-[#003366] group-hover:text-white transition-colors">
                        0{i + 1}
                      </div>
                      <p className="text-xs text-gray-600 font-semibold leading-relaxed pt-1">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center py-12 text-center">
              {loadingAI ? (
                <div className="space-y-4">
                  <div className="w-12 h-12 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest animate-pulse">Running Deep Neural Analysis...</p>
                </div>
              ) : (
                <div className="max-w-xs opacity-40">
                  <Database size={56} className="mx-auto text-gray-200 mb-4" />
                  <h4 className="text-sm font-bold text-gray-900 uppercase">Analysis Engine Standby</h4>
                  <p className="text-xs text-gray-500 mt-2">Filter the data and click the AI Recommendation button to interpret regional performance trends.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Demographics;
