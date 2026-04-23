import { useContext } from 'react';
import { MesaContext } from './mesaContext';

export function useMesa() {
  const context = useContext(MesaContext);

  if (!context) {
    throw new Error('useMesa must be used within MesaProvider');
  }

  return context;
}
