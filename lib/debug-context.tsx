'use client';

import React, { createContext, useContext, useReducer } from 'react';

export interface DebugLog {
  id: string;
  timestamp: number;
  type: 'info' | 'error' | 'warning' | 'api';
  message: string;
  details?: unknown;
}

interface DebugState {
  logs: DebugLog[];
}

type DebugAction = 
  | { type: 'ADD_LOG'; payload: DebugLog }
  | { type: 'CLEAR_LOGS' };

const DebugContext = createContext<{
  state: DebugState;
  addLog: (log: Omit<DebugLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
} | null>(null);

function debugReducer(state: DebugState, action: DebugAction): DebugState {
  switch (action.type) {
    case 'ADD_LOG':
      return {
        ...state,
        logs: [action.payload, ...state.logs].slice(0, 100) // Keep last 100 logs
      };
    case 'CLEAR_LOGS':
      return {
        ...state,
        logs: []
      };
    default:
      return state;
  }
}

export function DebugProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(debugReducer, { logs: [] });

  const addLog = (log: Omit<DebugLog, 'id' | 'timestamp'>) => {
    dispatch({
      type: 'ADD_LOG',
      payload: {
        ...log,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      }
    });
  };

  const clearLogs = () => {
    dispatch({ type: 'CLEAR_LOGS' });
  };

  return (
    <DebugContext.Provider value={{ state, addLog, clearLogs }}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
}