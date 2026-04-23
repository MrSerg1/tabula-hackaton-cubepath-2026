import { createContext } from 'react';
import type { MesaContextValue } from '../types';

export const MesaContext = createContext<MesaContextValue | undefined>(undefined);
