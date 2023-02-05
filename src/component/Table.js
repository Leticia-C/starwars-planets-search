import { React, useContext, useEffect, useState } from 'react';
import StarContext from '../context/StarsContext';
import TableHeader from './TableHeader';

const INICIAL_STATE = ['population', 'orbital_period', 'diameter',
  'rotation_period', 'surface_water'];

const SORT = {
  order: {
    column: 'population',
    sort: 'ASC',
  },
};

export default function Table() {
  const [allColumn, setAllColumn] = useState(INICIAL_STATE);
  const [orderSort, setOrderSort] = useState(SORT.order.sort);
  const [orderColumn, setOrderColumn] = useState(SORT.order.column);
  const [filtroAplicado, setFiltro] = useState(false);

  const { setFilter,
    allFilters, setAllFilters,
    filter, filterByName: { name, setNameFilter },
    filterByNumericValues, setValue, setComparison, setColumn, data,
  } = useContext(StarContext);

  const handleClick = () => {
    setAllFilters([...allFilters, filterByNumericValues]);
    if (allColumn.includes(filterByNumericValues.column)) {
      setAllColumn(allColumn.filter((value) => value !== filterByNumericValues.column));
      setColumn(allColumn[0]);
    }
  };

  useEffect(() => {
    allFilters.forEach(({ value, column, comparison }, index) => {
      const witchValue = index === 0 ? data : filter;
      if (comparison.length && comparison === 'maior que') {
        setFilter(witchValue?.filter((p) => +(p[column]) > +(value)));
      }
      if (comparison.length && comparison === 'menor que') {
        setFilter(witchValue?.filter((p) => +(p[column]) < +(value)));
      }
      if (comparison.length && comparison === 'igual a') {
        setFilter(witchValue?.filter((p) => +(p[column]) === +(value)));
      }
    });
  },
  [allFilters, data, filter, setFilter]);

  const removeFilter = (column) => {
    if (allFilters.length < 2) {
      setFilter(data);
    }
    setAllColumn([...allColumn, column]);
    setAllFilters(allFilters.filter((f) => f.column !== column));
  };

  const removeFilters = () => {
    setAllFilters([]);
    setFilter(data);
    setAllColumn(INICIAL_STATE);
  };

  const handleOrder = () => {
    const magicNumber = -1;
    if (orderSort === 'DESC') {
      setFilter(data.sort((a, b) => {
        if (a[orderColumn] === 'unknown') { return 1; }
        if (b[orderColumn] === 'unknown') { return magicNumber; }
        return b[orderColumn] - a[orderColumn];
      }));
      setFiltro((prev) => (!prev));
    } else {
      setFilter(data.sort((a, b) => {
        if (a[orderColumn] === 'unknown') { return 1; }
        if (b[orderColumn] === 'unknown') { return magicNumber; }
        return a[orderColumn] - b[orderColumn];
      }));
      setFiltro(!filtroAplicado);
    }
  };

  return (
    <div>
      <header>
        <h1>Star Wars Search Planets</h1>
      </header>
      <form>
        <input
           placeholder='Pesquise pelo Nome do Planeta:'
           id='name-filter'
          data-testid="name-filter"
          value={ name }
          onChange={ ({ target }) => setNameFilter(target.value) }
        />
        <br/>
        <label htmlFor="column-filter">
          Ordenar
          <select
            data-testid="column-filter"
            id="column-filter"
            name="column-filter"
            title="column-filter"
            value={ filterByNumericValues.column }
            onChange={ ({ target }) => setColumn(target.value) }
          >
            {allColumn.map((value, index) => (
              <option key={ index }>{value}</option>
            ))}
          </select>

        </label>

        <select
          data-testid="comparison-filter"
          id="comparison-filter"
          name="comparison-filter"
          value={ filterByNumericValues.comparison }
          onChange={ ({ target }) => setComparison(target.value) }
        >
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>

        </select>
        <input
          type="number"
          name="filter"
          id='value-filter'
          data-testid="value-filter"
          value={ filterByNumericValues.value }
          onChange={ ({ target }) => setValue(target.value) }
        />
        <button
          data-testid="button-filter"
          type="button"
          id="button-filter"
          onClick={ handleClick }
        >
          Filtrar
        </button>
  
        {allFilters.map((remove, index) => (
          <div
            data-testid="filter"
            key={ index }
          >
            <span>{removeFilter.column}</span>
            <button
              onClick={ () => removeFilter(remove.column) }
              type="button"
            >
              X
            </button>

          </div>
        ))}
        <br />
        <select
          id='column-sort'
          data-testid="column-sort"
          value={ orderColumn }
          onChange={ ({ target }) => setOrderColumn(target.value) }
        >
          <option value="population">population</option>
          <option value="orbital_period">orbital_period</option>
          <option value="diameter">diameter</option>
          <option value="rotation_period">rotation_period</option>
          <option value="surface_water">surface_water</option>
        </select>
        <input
          id='asc'
          type="radio"
          name="ordem"
          value="ASC"
          data-testid="column-sort-input-asc"
          onChange={ ({ target }) => setOrderSort(target.value) }
        />
        Ascendente
        <input
          id='desc'
          type="radio"
          name="ordem"
          value="DESC"
          data-testid="column-sort-input-desc"
          onChange={ ({ target }) => setOrderSort(target.value) }
        />
        Descendente
        <button
          id='desc'
          type="button"
          data-testid="column-sort-button"
          onClick={ handleOrder }
        >

          Ordenar
        </button>
        <button
        id='remove'
        data-testid="button-remove-filters"
        type="button"
        onClick={ removeFilters }
      >  Remover Filtros
      </button>
      </form>
      <table>
        <TableHeader />
        { filter?.filter((nameValue) => nameValue.name.toLowerCase()
          .includes(name.toLowerCase()))
          .map((product) => (
            <tbody key={ product.name }>
              <tr>
                <td data-testid="planet-name" headers="name">{product.name}</td>
                <td headers="rotation">{product.rotation_period }</td>
                <td headers="orbital">{product.orbital_period }</td>
                <td headers="diameter">{product.diameter }</td>
                <td headers="climate">{product.climate }</td>
                <td headers="gravity">{product.gravity }</td>
                <td headers="terrain">{product.terrain }</td>
                <td headers="surface">{product.surface_water }</td>
                <td headers="population">{product.population }</td>
                <td headers="films">{product.films }</td>
                <td headers="created">{product.created }</td>
                <td headers="edited">{product.edited }</td>
                <td headers="url">{product.url }</td>
              </tr>

            </tbody>
          ))}
      </table>

    </div>
  );
}
