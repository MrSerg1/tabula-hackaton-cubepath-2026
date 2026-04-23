import { useSearchParams } from 'react-router-dom';
import { MesaContext } from './mesaContext';

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
