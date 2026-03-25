import { createContext, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

const MesaContext = createContext(undefined);

export function MesaProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const mesa = searchParams.get('mesa');

  const setMesa = (mesaValue) => {
    const nextParams = new URLSearchParams(searchParams);

    if (mesaValue === null || mesaValue === undefined || mesaValue === '') {
      nextParams.delete('mesa');
    } else {
      nextParams.set('mesa', String(mesaValue));
    }

    setSearchParams(nextParams, { replace: true });
  };

  return <MesaContext.Provider value={{ mesa, setMesa }}>{children}</MesaContext.Provider>;
}

export function useMesa() {
  const context = useContext(MesaContext);

  if (!context) {
    throw new Error('useMesa must be used within MesaProvider');
  }

  return context;
}