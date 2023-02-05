import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import StarContext from './StarsContext';

export default function StarsProvider({ children }) {
  const [data, setData] = useState([]);
  const [name, setNameFilter] = useState('');
  const [value, setValue] = useState(0);
  const [column, setColumn] = useState('population');
  const [comparison, setComparison] = useState('maior que');
  const [filter, setFilter] = useState([]);
  const [allFilters, setAllFilters] = useState([]);

  const contextValue = {
    setFilter,
    allFilters,
    setAllFilters,
    filter,
    data,
    filterByName: {
      name,
      setNameFilter,
    },
    filterByNumericValues:
      {
        column,
        comparison,
        value,
      },
    setValue,
    setComparison,
    setColumn,
  };

  useEffect(() => {
    const url = 'https://swapi.dev/api/planets/';
    const getStarWarsData = async () => {
      const { results } = await fetch(url)
        .then((response) => response.json());
      const sortResults = results.sort((a, b) => {
        const magicNumber = -1;
        if (a.name > b.name) { return 1; }
        return magicNumber;
      });
      setData(sortResults);
      setFilter(sortResults);
    };
    getStarWarsData();
  },
  []);

  return (
    <StarContext.Provider value={ contextValue }>
      {children}
    </StarContext.Provider>
  );
}

StarsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
