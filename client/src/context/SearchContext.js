import React, { useState } from 'react'
import { createContext } from "react";

export const SearchContext = createContext();

const SearchProvider = ({children}) => {
  const [searchTerm, setSearchTerm] = useState('');

  return <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>{children}</SearchContext.Provider>
}

export default SearchProvider