import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import testData from '../../cypress/mocks/testData';

const eleven = 11;
const four = 4;
const five = 5;
const three = 3;
const eight = 8;
const planetName = screen.findAllByTestId('planet-name');
const columnFilter = screen.getByTestId('column-filter');
const comparisonFilter = screen.getByTestId('comparison-filter');
const valueFilter = screen.getByTestId('value-filter');
const filterButton = screen.getByTestId('button-filter');

const mockFetch = () => {
  jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve(testData),
    }));
};
describe('Testa todas as funções relacionadas a aplicação', () => {
  beforeEach(mockFetch);
  afterEach(() => jest.clearAllMocks());

  test('Realiza uma requisição para a API; ', async () => {
    render(<App />);
    const url = 'https://swapi-trybe.herokuapp.com/api/planets/';
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toBeCalledWith(url);
    });
  });

  test('Preenche a tabela com os dados retornados e se contem todas as tabelas ',
    async () => {
      render(<App />);
      expect(screen.getByRole('columnheader', { name: /Name/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Rotation Period/i }))
        .toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Orbital Period/i }))
        .toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Diameter/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Climate/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Gravity/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Terrain/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Surface Water/i }))
        .toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Population/i }))
        .toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Films/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Created/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Edited/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Url/i })).toBeInTheDocument();

      const lengthValue = 13;
      const getAllcolumnheader = [];
      getAllcolumnheader
        .map((name) => expect(screen.getByRole('columnheader', { name }))
          .toHaveLength(lengthValue));
    });
  test.only('Testa filtro de nomes', async () => {
    render(<App />);

    const allPlanetsWithO = ['Coruscant', 'Dagobah', 'Endor',
      'Hoth', 'Kamino', 'Naboo', 'Tatooine'];

    const alderaan = await screen.findByText(/alderaan/i);
    const filterNameInput = screen.getByTestId('name-filter');
    expect(filterNameInput).toBeInTheDocument();
    const tr = document.getElementsByTagName('tr');
    expect(tr).toHaveLength(eleven);
    expect(alderaan).toBeInTheDocument();
    userEvent.type(filterNameInput, 'o');
    allPlanetsWithO.map((o) => expect(screen.getByText(o)).toBeInTheDocument());
    expect(tr).toHaveLength(eight);

    const alderan2 = screen.queryByText(/alderaan/i);
    expect(alderan2).not.toBeInTheDocument();

    userEvent.clear(filterNameInput);
    const allPlanets = ['Tatooine', 'Alderaan', 'Yavin IV', 'Hoth', 'Dagobah', 'Bespin',
      'Endor', 'Naboo', 'Coruscant', 'Kamino'];
    allPlanets.map((all) => expect(screen.getByText(all)).toBeInTheDocument());
    expect(tr).toHaveLength(eleven);
    userEvent.type(filterNameInput, 'lalaland');
    expect(tr).toHaveLength(1);
  });
  it.only('Testa filtros de numeros', async () => {
    render(<App />);
    const removeFilters = screen.getByRole('button', { name: /Remover Filtros/i });
    const inputAsc = screen.findAllByTestId('column-sort-input-asc');
    const inputDesc = screen.findAllByTestId('column-sort-input-desc');
    const sortButton = screen.findAllByTestId('column-sort-button');
    const tr = document.getElementsByTagName('tr');

    expect(inputAsc).toBeInTheDocument();
    expect(inputDesc).toBeInTheDocument();
    expect(sortButton).toBeInTheDocument();
    expect(columnFilter).toBeInTheDocument();
    expect(comparisonFilter).toBeInTheDocument();
    expect(valueFilter).toBeInTheDocument();
    expect(filterButton).toBeInTheDocument();
    expect(removeFilters).toBeInTheDocument();

    userEvent.selectOptions(comparisonFilter, 'menor que');
    userEvent.selectOptions(columnFilter, 'surface_water');
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '40');
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(tr).toHaveLength(eleven);
    });
    userEvent.selectOptions(comparisonFilter, 'menor que');
    userEvent.selectOptions(columnFilter, 'population');
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '5');
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(tr).toHaveLength(1);
    });
    userEvent.click(removeFilters);
    userEvent.selectOptions(comparisonFilter, 'maior que');
    userEvent.selectOptions(columnFilter, 'diameter');
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '8900');
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(tr).toHaveLength(eight);
    });
    userEvent.click(removeFilters);
    await waitFor(() => {
      expect(tr).toHaveLength(eleven);
    });
    userEvent.selectOptions(comparisonFilter, 'igual a');
    userEvent.selectOptions(columnFilter, 'population');
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '200000');
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(tr).toHaveLength(2);
    });
  });
  test('Testa multiplos filtros', async () => {
    render(<App />);
    const tr = document.getElementsByTagName('tr');
    const removeFilters = screen.getByRole('button', { name: /Remover Filtros/i });

    userEvent.selectOptions(columnFilter, 'diameter');
    userEvent.selectOptions(comparisonFilter, 'maior que');
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '9000');
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(tr).toHaveLength(eleven);
    });
    userEvent.click(removeFilters);
    await waitFor(() => {
      expect(tr).toHaveLength(eleven);
    });
    userEvent.selectOptions(comparisonFilter, 'menor que');
    userEvent.selectOptions(columnFilter, 'population');
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '1000000');
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(tr).toHaveLength(three);
    });
    userEvent.click(removeFilters);
    userEvent.selectOptions(comparisonFilter, 'igual a');
    userEvent.selectOptions(columnFilter, 'rotation_period');
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '23');
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(tr).toHaveLength(four);
    });
    const xButton = screen.getByText(/x/i);
    expect(xButton).toBeInTheDocument();
    userEvent.click(xButton);
    expect(xButton).not.toBeInTheDocument();
    await waitFor(() => {
      expect(tr).toHaveLength(eleven);
    });
  });
  test('Testa o x button', async () => {
    render(<App />);
    const tr = document.getElementsByTagName('tr');
    await waitFor(() => {
      expect(tr).toHaveLength(eleven);
    });
    userEvent.selectOptions(comparisonFilter, 'maior que');
    userEvent.selectOptions(columnFilter, 'diameter');
    userEvent.clear(valueFilter);
    userEvent.type(valueFilter, '8900');
    userEvent.click(filterButton);
    await waitFor(() => {
      expect(tr).toHaveLength(eight);
    });
    expect(columnFilter).toHaveLength(four);
    expect(columnFilter).not.toContain('diameter');
    const xButton = screen.getByText(/x/i);
    expect(xButton).toBeInTheDocument();
    userEvent.click(xButton);
    expect(xButton).not.toBeInTheDocument();
    expect(columnFilter).toContainHTML('diameter');
    await waitFor(() => {
      expect(columnFilter).toHaveLength(five);
    });
    await waitFor(() => {
      expect(tr).toHaveLength(eleven);
    });
  });
  test('testa resto ', async () => {
    render(<App />);
    const expectedPlanets = ['Alderaan',
      'Bespin', 'Coruscant', 'Dagobah', 'Endor', 'Hoth', 'Kamino',
      'Naboo', 'Tatooine', 'Yavin IV'];
    const inputAsc = screen.getByTestId('column-sort-input-asc');
    const inputDesc = screen.getByTestId('column-sort-input-desc');
    const sortButton = screen.getByTestId('column-sort-button');
    const columnSort = screen.getByTestId('column-sort');

    expect(planetName[0].innerHTML).toEqual(expectedPlanets[0]);

    userEvent.click(inputAsc);
    userEvent.click(sortButton);
    userEvent.selectOptions(columnSort, 'population');

    expect((await screen
      .findAllByTestId(planetName))[0].innerHTML).toEqual(expectedPlanets[9]);

    userEvent.click(inputDesc);
    userEvent.click(sortButton);
    expect((await screen
      .findAllByTestId(planetName))[0].innerHTML).toEqual(expectedPlanets[2]);
  });
});
