
import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from 'recharts';
import { FilterSection } from './components/FilterSection';
import { StatCard } from './components/StatCard';
import { DEPARTMENTS, DOCTORS } from './constants';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

const App: React.FC = () => {
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  // Filter available doctors based on selected departments for the filter list UI
  const availableDoctors = useMemo(() => {
    if (selectedDepts.length === 0) return DOCTORS;
    const deptNames = DEPARTMENTS
      .filter(d => selectedDepts.includes(d.id))
      .map(d => d.name);
    return DOCTORS.filter(doc => deptNames.includes(doc.department));
  }, [selectedDepts]);

  // Final filtered list of doctors used for calculations and aggregation
  const filteredDoctors = useMemo(() => {
    let result = DOCTORS;
    
    // Apply department filter
    if (selectedDepts.length > 0) {
      const deptNames = DEPARTMENTS
        .filter(d => selectedDepts.includes(d.id))
        .map(d => d.name);
      result = result.filter(doc => deptNames.includes(doc.department));
    }
    
    // Apply doctor specific filter
    if (selectedDocs.length > 0) {
      result = result.filter(doc => selectedDocs.includes(doc.id));
    }

    return result;
  }, [selectedDepts, selectedDocs]);

  // Aggregate the filtered doctors into department-level data for the bar chart
  const departmentChartData = useMemo(() => {
    const agg: Record<string, number> = {};
    
    filteredDoctors.forEach(doc => {
      agg[doc.department] = (agg[doc.department] || 0) + doc.noteCount;
    });

    return Object.keys(agg)
      .map(deptName => ({
        department: deptName,
        totalNotes: agg[deptName]
      }))
      .sort((a, b) => b.totalNotes - a.totalNotes);
  }, [filteredDoctors]);

  const toggleDept = (id: string) => {
    const isRemoving = selectedDepts.includes(id);
    const dept = DEPARTMENTS.find(d => d.id === id);

    // If we are unselecting a department, remove its doctors from the doctor filter state
    if (isRemoving && dept) {
      const docsInDept = DOCTORS.filter(doc => doc.department === dept.name).map(doc => doc.id);
      setSelectedDocs(prev => prev.filter(docId => !docsInDept.includes(docId)));
    }

    setSelectedDepts(prev => 
      isRemoving ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleDoc = (id: string) => {
    setSelectedDocs(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const totalNotes = useMemo(() => filteredDoctors.reduce((sum, d) => sum + d.noteCount, 0), [filteredDoctors]);
  const avgNotes = useMemo(() => filteredDoctors.length ? Math.round(totalNotes / filteredDoctors.length) : 0, [totalNotes, filteredDoctors]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-200 p-6 flex flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">MedNotes<span className="text-blue-600">Sync</span></h1>
        </div>

        <FilterSection 
          title="Departments" 
          items={DEPARTMENTS} 
          selectedIds={selectedDepts} 
          onChange={toggleDept}
          onClear={() => { setSelectedDepts([]); setSelectedDocs([]); }}
        />

        <FilterSection 
          title="Practitioners" 
          items={availableDoctors} 
          selectedIds={selectedDocs} 
          onChange={toggleDoc}
          onClear={() => setSelectedDocs([])}
        />

        <div className="mt-auto pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium">System Version: 2.7.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Documentation Analytics</h2>
            <p className="text-gray-500 mt-1">Note volume grouped by Medical Department</p>
          </div>
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Live Data Feed</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            label="Filtered Notes Total" 
            value={totalNotes.toLocaleString()} 
            icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            color="bg-blue-50"
          />
          <StatCard 
            label="Avg Notes per Provider" 
            value={avgNotes.toLocaleString()} 
            icon={<svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            color="bg-emerald-50"
          />
          <StatCard 
            label="Active Departments" 
            value={departmentChartData.length} 
            icon={<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>}
            color="bg-orange-50"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h3 className="text-lg font-bold text-gray-900">Note Volume by Department</h3>
            <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <span className="w-3 h-3 rounded-sm bg-blue-500"></span>
              <span>Total Department Documentation</span>
            </div>
          </div>
          
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentChartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="department" 
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                  stroke="#cbd5e1"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  stroke="#cbd5e1"
                  label={{ value: 'Total Notes', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontWeight: 600 } }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                  itemStyle={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}
                  labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                />
                <Bar dataKey="totalNotes" radius={[6, 6, 0, 0]} barSize={60} name="Notes Total">
                  {departmentChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[DEPARTMENTS.findIndex(d => d.name === entry.department) % COLORS.length] || '#3b82f6'} 
                    />
                  ))}
                </Bar>
                <Legend 
                  layout="horizontal" 
                  verticalAlign="top" 
                  align="right"
                  wrapperStyle={{ paddingBottom: '20px' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {departmentChartData.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">No practitioners match the filter criteria</p>
              <p className="text-sm">Try adjusting your filters in the sidebar</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
