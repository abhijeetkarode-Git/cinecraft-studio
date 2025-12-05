import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ShotPlanCard } from '@/components/cinematography/ShotPlanCard';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { 
  Search, Filter, Grid3X3, List, 
  FolderOpen, Plus, SlidersHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const filterOptions = {
  mood: ['dramatic', 'romantic', 'noir', 'tense', 'serene', 'mysterious'],
  sceneType: ['interior', 'exterior'],
  movement: ['static', 'dolly', 'handheld', 'steadicam', 'tracking'],
  framing: ['close-up', 'medium', 'wide', 'extreme-wide'],
};

export default function Library() {
  const { shotPlans, deleteShotPlan } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredPlans = useMemo(() => {
    return shotPlans.filter(plan => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          plan.command.toLowerCase().includes(query) ||
          plan.shotType.toLowerCase().includes(query) ||
          plan.mood.toLowerCase().includes(query) ||
          plan.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      
      // Active filters
      for (const [key, values] of Object.entries(activeFilters)) {
        if (values.length === 0) continue;
        
        if (key === 'mood' && !values.includes(plan.mood.toLowerCase())) return false;
        if (key === 'sceneType' && !values.includes(plan.sceneType)) return false;
        if (key === 'movement' && !values.some(v => plan.camera.movement.toLowerCase().includes(v))) return false;
        if (key === 'framing' && !values.includes(plan.camera.framing)) return false;
      }
      
      return true;
    });
  }, [shotPlans, searchQuery, activeFilters]);
  
  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };
  
  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };
  
  const hasActiveFilters = Object.values(activeFilters).some(v => v.length > 0) || searchQuery;
  
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Shot Library</h1>
              <p className="text-muted-foreground">
                {shotPlans.length} shot plan{shotPlans.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            
            <Link to="/create">
              <Button variant="amber">
                <Plus className="h-4 w-4 mr-2" />
                New Shot Plan
              </Button>
            </Link>
          </div>
          
          {/* Search and Filters Bar */}
          <div className="glass-card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by command, mood, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
              
              {/* Filter Toggle */}
              <div className="flex items-center gap-2">
                <Button 
                  variant={showFilters ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary-foreground text-primary rounded">
                      {Object.values(activeFilters).flat().length + (searchQuery ? 1 : 0)}
                    </span>
                  )}
                </Button>
                
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                )}
                
                {/* View Toggle */}
                <div className="flex items-center border border-border/50 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-1.5 rounded",
                      viewMode === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-1.5 rounded",
                      viewMode === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(filterOptions).map(([category, options]) => (
                  <div key={category}>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {options.map(option => (
                        <button
                          key={option}
                          onClick={() => toggleFilter(category, option)}
                          className={cn(
                            "px-2 py-1 text-xs rounded-full border transition-colors",
                            activeFilters[category]?.includes(option)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border/50 text-muted-foreground hover:border-primary/50"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Results */}
          {filteredPlans.length === 0 ? (
            <div className="text-center py-20">
              <FolderOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              {shotPlans.length === 0 ? (
                <>
                  <h2 className="text-xl font-semibold mb-2">No shot plans yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Create your first shot plan to get started
                  </p>
                  <Link to="/create">
                    <Button variant="amber">
                      Create Shot Plan
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-2">No results found</h2>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                : "space-y-4"
            )}>
              {filteredPlans.map(plan => (
                <ShotPlanCard
                  key={plan.id}
                  shotPlan={plan}
                  onDelete={deleteShotPlan}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
