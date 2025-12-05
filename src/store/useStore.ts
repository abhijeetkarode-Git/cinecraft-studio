import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ShotPlan, CommandHistory, Recommendation } from '@/types/cinematography';
import { processCommand, generateRecommendations } from '@/lib/mockProcessor';

interface AppState {
  // Shot plans
  shotPlans: ShotPlan[];
  currentShotPlan: ShotPlan | null;
  
  // Command history
  commandHistory: CommandHistory[];
  
  // Recommendations
  recommendations: Recommendation[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  notifications: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  
  // Actions
  executeCommand: (command: string) => Promise<ShotPlan>;
  getShotPlan: (id: string) => ShotPlan | undefined;
  deleteShotPlan: (id: string) => void;
  clearHistory: () => void;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      shotPlans: [],
      currentShotPlan: null,
      commandHistory: [],
      recommendations: [],
      isLoading: false,
      error: null,
      notifications: [],
      
      executeCommand: async (command: string) => {
        set({ isLoading: true, error: null });
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        try {
          const shotPlan = processCommand(command);
          const newRecommendations = generateRecommendations(shotPlan);
          
          const historyEntry: CommandHistory = {
            id: Math.random().toString(36).substr(2, 9),
            command,
            timestamp: new Date(),
            shotPlanId: shotPlan.id,
          };
          
          set(state => ({
            shotPlans: [shotPlan, ...state.shotPlans],
            currentShotPlan: shotPlan,
            commandHistory: [historyEntry, ...state.commandHistory].slice(0, 50),
            recommendations: newRecommendations,
            isLoading: false,
          }));
          
          get().addNotification('Shot plan generated successfully!', 'success');
          
          return shotPlan;
        } catch (error) {
          set({ isLoading: false, error: 'Failed to process command' });
          get().addNotification('Failed to process command', 'error');
          throw error;
        }
      },
      
      getShotPlan: (id: string) => {
        return get().shotPlans.find(plan => plan.id === id);
      },
      
      deleteShotPlan: (id: string) => {
        set(state => ({
          shotPlans: state.shotPlans.filter(plan => plan.id !== id),
          commandHistory: state.commandHistory.filter(h => h.shotPlanId !== id),
        }));
        get().addNotification('Shot plan deleted', 'info');
      },
      
      clearHistory: () => {
        set({ commandHistory: [] });
        get().addNotification('History cleared', 'info');
      },
      
      addNotification: (message: string, type: 'success' | 'error' | 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        set(state => ({
          notifications: [...state.notifications, { id, message, type }],
        }));
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },
      
      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'cinecraft-storage',
      partialize: (state) => ({
        shotPlans: state.shotPlans,
        commandHistory: state.commandHistory,
      }),
    }
  )
);
