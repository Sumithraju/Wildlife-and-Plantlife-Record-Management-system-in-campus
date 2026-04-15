/**
 * Frontend Test Cases – Wildlife List & Form (FE-04, FE-05, FE-06, FE-07, FE-09)
 * Jest + React Testing Library
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WildlifeList from '../src/pages/WildlifeList';
import WildlifeForm from '../src/pages/WildlifeForm';
import Navbar from '../src/components/Navbar';
import { AuthContext } from '../src/context/AuthContext';

jest.mock('../src/api/axios', () => ({ get: jest.fn(), post: jest.fn(), delete: jest.fn() }));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
}));

import api from '../src/api/axios';

const adminCtx = { user: { id: 1, full_name: 'Admin', role: 'admin' }, login: jest.fn(), logout: jest.fn(), isAdmin: true, isResearcher: true };
const viewerCtx = { user: { id: 5, full_name: 'Viewer', role: 'viewer' }, login: jest.fn(), logout: jest.fn(), isAdmin: false, isResearcher: false };

const renderWithAuth = (ctx, Component, props = {}) =>
  render(
    <AuthContext.Provider value={ctx}>
      <MemoryRouter>
        <Component {...props} />
      </MemoryRouter>
    </AuthContext.Provider>
  );

beforeEach(() => jest.clearAllMocks());

// FE-04: Wildlife list renders records from API
test('FE-04: renders 3 wildlife record rows from API response', async () => {
  api.get.mockResolvedValueOnce({
    data: {
      records: [
        { id: 1, species_name: 'Passer domesticus',  common_name: 'House Sparrow',  category: 'bird',   observation_date: '2026-01-05', status: 'verified', observer_name: 'Dr. Sarah Chen', user_id: 2 },
        { id: 2, species_name: 'Corvus splendens',   common_name: 'House Crow',     category: 'bird',   observation_date: '2026-01-08', status: 'verified', observer_name: 'Dr. Sarah Chen', user_id: 2 },
        { id: 3, species_name: 'Varanus salvator',   common_name: 'Water Monitor',  category: 'reptile',observation_date: '2026-01-15', status: 'verified', observer_name: 'James Okonkwo',  user_id: 3 },
      ],
      total: 3,
    }
  });

  renderWithAuth(adminCtx, WildlifeList);
  await waitFor(() => {
    expect(screen.getByText('Passer domesticus')).toBeInTheDocument();
    expect(screen.getByText('Corvus splendens')).toBeInTheDocument();
    expect(screen.getByText('Varanus salvator')).toBeInTheDocument();
  });
});

// FE-06: Search filter narrows wildlife list
test('FE-06: search input filters displayed records', async () => {
  api.get
    .mockResolvedValueOnce({ data: { records: [
      { id: 1, species_name: 'Passer domesticus', common_name: 'House Sparrow', category: 'bird', observation_date: '2026-01-05', status: 'verified', observer_name: 'Dr. Sarah', user_id: 2 },
    ], total: 1 } })
    .mockResolvedValueOnce({ data: { records: [
      { id: 1, species_name: 'Passer domesticus', common_name: 'House Sparrow', category: 'bird', observation_date: '2026-01-05', status: 'verified', observer_name: 'Dr. Sarah', user_id: 2 },
    ], total: 1 } });

  renderWithAuth(adminCtx, WildlifeList);
  await waitFor(() => screen.getByText('Passer domesticus'));

  fireEvent.change(screen.getByPlaceholderText(/search species/i), { target: { value: 'Sparrow' } });

  await waitFor(() => {
    expect(api.get).toHaveBeenCalledTimes(2);
  });
});

// FE-07: Admin-only menu item not visible to Viewer
test('FE-07: "Users" nav link is not visible to a viewer role', () => {
  render(
    <AuthContext.Provider value={viewerCtx}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </AuthContext.Provider>
  );
  expect(screen.queryByText('Users')).not.toBeInTheDocument();
});

test('FE-07b: "Users" nav link IS visible to admin role', () => {
  render(
    <AuthContext.Provider value={adminCtx}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </AuthContext.Provider>
  );
  expect(screen.getByText('Users')).toBeInTheDocument();
});

// FE-09: Plant create form rejects height < 0
test('FE-09: PlantForm shows validation error for negative height', async () => {
  const PlantForm = require('../src/pages/PlantForm').default;
  renderWithAuth(adminCtx, PlantForm);

  fireEvent.change(screen.getByPlaceholderText(/latin binomial/i), { target: { value: 'Test plant' } });
  fireEvent.change(screen.getByLabelText(/observation date/i), { target: { value: '2026-04-01' } });
  fireEvent.change(screen.getByPlaceholderText(/approximate height/i), { target: { value: '-5' } });
  fireEvent.click(screen.getByText(/create record/i));

  await waitFor(() => {
    expect(screen.getByText(/height must be a positive number/i)).toBeInTheDocument();
  });
});
