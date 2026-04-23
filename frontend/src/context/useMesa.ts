import { useContext } from 'react';
import type { MesaContextValue } from '../types';
import { MesaContext } from './mesaContext';

export function useMesa(): MesaContextValue {
  const context = useContext(MesaContext);

  if (!context) {
    throw new Error('useMesa must be used within MesaProvider');
  }

  return context;
}
