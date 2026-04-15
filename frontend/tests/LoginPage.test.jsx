/**
 * Frontend Test Cases – LoginPage (FE-01, FE-02, FE-03, FE-10)
 * Jest + React Testing Library
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage';
import { AuthContext } from '../src/context/AuthContext';

// Mock axios and react-router-dom navigate
jest.mock('../src/api/axios', () => ({
  post: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import api from '../src/api/axios';

const mockLogin = jest.fn();
const renderLogin = () =>
  render(
    <AuthContext.Provider value={{ user: null, login: mockLogin, logout: jest.fn() }}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthContext.Provider>
  );

beforeEach(() => { jest.clearAllMocks(); });

// FE-01: Login form renders correctly
test('FE-01: renders email input, password input, and submit button', () => {
  renderLogin();
  expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
});

// FE-02: Empty form shows validation errors
test('FE-02: shows validation errors when submitting empty fields', async () => {
  renderLogin();
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  await waitFor(() => {
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

// FE-03: Successful login navigates to dashboard
test('FE-03: successful login saves token and navigates to /dashboard', async () => {
  api.post.mockResolvedValueOnce({
    data: { token: 'mock.jwt.token', user: { id: 1, email: 'admin@campus.edu', role: 'admin' } }
  });

  renderLogin();
  fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'admin@campus.edu' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Admin@123' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith('mock.jwt.token', expect.objectContaining({ email: 'admin@campus.edu' }));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});

// FE-10: Wrong credentials shows error
test('FE-10: shows error message when login credentials are wrong', async () => {
  api.post.mockRejectedValueOnce({
    response: { data: { error: 'Invalid credentials' } }
  });

  renderLogin();
  fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'wrong@campus.edu' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

  await waitFor(() => {
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
