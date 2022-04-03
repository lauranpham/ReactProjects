import React, { useState, useContext, useEffect } from 'react'
import { useCallback } from 'react'

const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('a')
  const [cocktails, setCocktails] = useState([]);
  
  const fetchDrinks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${url}${searchTerm}`);
      const data = await res.json();
      const {drinks} = data;
      if (!drinks) {
        setCocktails([])
      } else {
        // map over api array and construct a new array to simplify cocktail fields
        const newCocktails = drinks.map((drink) =>{
          const {idDrink, strDrink, strDrinkThumb, strAlcoholic, strGlass} = drink;
          return {
            id: idDrink,
            name: strDrink,
            image: strDrinkThumb,
            info: strAlcoholic,
            glass: strGlass
          }
        })
        setCocktails(newCocktails);
      }
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  }, [searchTerm])
  
  useEffect(() => {
    fetchDrinks();
  }, [searchTerm, fetchDrinks])

  return <AppContext.Provider value={{
    loading, cocktails, setSearchTerm
  }}>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
