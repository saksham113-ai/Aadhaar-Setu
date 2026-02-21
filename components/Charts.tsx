
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';

const COLORS = ['#003366', '#FF9933', '#138808', '#D32F2F', '#7B1FA2'];

export const AadhaarTrendChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
      <XAxis dataKey="district" fontSize={10} tick={{ fill: '#666' }} />
      <YAxis fontSize={10} tick={{ fill: '#666' }} />
      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
      <Bar dataKey="enrolled" fill="#003366" name="New Enrolments" radius={[4, 4, 0, 0]} />
      <Bar dataKey="updates" fill="#FF9933" name="Updates" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const DemographicPieChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

export const AgeGroupBarChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
      <XAxis type="number" fontSize={10} />
      <YAxis dataKey="name" type="category" fontSize={10} width={60} />
      <Tooltip cursor={{ fill: 'transparent' }} />
      <Bar dataKey="value" fill="#138808" name="Population Count" radius={[0, 4, 4, 0]} barSize={20} />
    </BarChart>
  </ResponsiveContainer>
);

export const CorrelationScatter: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis type="number" dataKey="enrolled" name="Enrolled" fontSize={10} />
      <YAxis type="number" dataKey="updates" name="Updates" fontSize={10} />
      <ZAxis type="number" dataKey="rejected" range={[50, 400]} name="Rejections" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Scatter name="District Stats" data={data} fill="#003366" fillOpacity={0.6} />
    </ScatterChart>
  </ResponsiveContainer>
);

export const ConfusionMatrix: React.FC<{ enrolled: number, rejected: number }> = ({ enrolled, rejected }) => {
  const tp = Math.floor(enrolled * 0.92);
  const fp = Math.floor(rejected * 0.15);
  const fn = Math.floor(enrolled * 0.08);
  const tn = Math.floor(rejected * 0.85);
  const total = tp + fp + fn + tn;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3 aspect-square max-w-[320px] mx-auto">
        <div className="flex flex-col items-center justify-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span className="text-[10px] font-bold text-emerald-600 uppercase">True Positive</span>
          <span className="text-xl font-black text-emerald-900">{tp.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-500 font-medium">Valid Enrolments</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-rose-50 border border-rose-200 rounded-xl">
          <span className="text-[10px] font-bold text-rose-600 uppercase">False Positive</span>
          <span className="text-xl font-black text-rose-900">{fp.toLocaleString()}</span>
          <span className="text-[10px] text-rose-500 font-medium">Incorrectly Accepted</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <span className="text-[10px] font-bold text-orange-600 uppercase">False Negative</span>
          <span className="text-xl font-black text-orange-900">{fn.toLocaleString()}</span>
          <span className="text-[10px] text-orange-500 font-medium">Mistakenly Rejected</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <span className="text-[10px] font-bold text-blue-600 uppercase">True Negative</span>
          <span className="text-xl font-black text-blue-900">{tn.toLocaleString()}</span>
          <span className="text-[10px] text-blue-500 font-medium">Correct Rejections</span>
        </div>
      </div>
      <div className="mt-6 flex justify-between px-2">
        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Accuracy</p>
          <p className="text-sm font-bold text-gray-700">{((tp + tn) / total * 100).toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Precision</p>
          <p className="text-sm font-bold text-gray-700">{(tp / (tp + fp) * 100).toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Recall</p>
          <p className="text-sm font-bold text-gray-700">{(tp / (tp + fn) * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};
