import React, { createContext, useState } from 'react';

export const PublicacionContext = createContext();

export const PublicacionProvider = ({ children }) => {
  const [publicaciones, setPublicaciones] = useState([]);

  const agregarPublicacion = (nueva) => {
    setPublicaciones((prev) => [nueva, ...prev]);
  };

  return (
    <PublicacionContext.Provider value={{ publicaciones, agregarPublicacion }}>
      {children}
    </PublicacionContext.Provider>
  );
};
