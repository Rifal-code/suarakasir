export default function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h2 className="text-2xl font-bold text-text-primary">Dashboard</h2>
      
      <div className="flex items-center gap-3">
        <div className="relative w-64 hidden sm:block">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">search</span>
          <input 
            type="text" 
            placeholder="Search product..." 
            className="w-full bg-white pl-10 pr-4 py-2 rounded-full border border-border-default focus:outline-none focus:border-primary text-sm shadow-sm"
          />
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-default rounded-full text-sm font-semibold hover:bg-background transition-colors text-text-primary">
          <span className="material-symbols-outlined text-sm">upload</span>
          Export CSV
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-default rounded-full text-sm font-semibold hover:bg-background transition-colors text-text-primary">
          <span className="material-symbols-outlined text-sm">download</span>
          Download Report
        </button>
      </div>
    </div>
  );
}
