import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const mockedSignOut = jest.fn();

jest.mock('../../services/api', () => {
  return {
    get: (url: string) => {
      switch (url) {
        case `/providers/user-id/available-days`:
          return Promise.resolve({
            data: [
              { day: 1, available: false },
              { day: 2, available: false },
              { day: 3, available: false },
              { day: 4, available: false },
              { day: 5, available: false },
              { day: 6, available: false },
              { day: 7, available: false },
              { day: 8, available: false },
              { day: 9, available: false },
              { day: 10, available: false },
              { day: 11, available: false },
              { day: 12, available: false },
              { day: 13, available: false },
              { day: 14, available: false },
              { day: 15, available: false },
              { day: 16, available: false },
              { day: 17, available: false },
              { day: 18, available: false },
              { day: 19, available: false },
              { day: 20, available: false },
              { day: 21, available: false },
              { day: 22, available: false },
              { day: 23, available: false },
              { day: 24, available: false },
              { day: 25, available: false },
              { day: 26, available: true },
              { day: 27, available: true },
              { day: 28, available: true },
              { day: 29, available: true },
              { day: 30, available: true },
              { day: 31, available: false },
            ],
          });
        case `/appointments/me`:
          return Promise.resolve({
            data: [
              {
                id: '1',
                date: '2020-10-26T13:00:00.000Z',
                user: {
                  name: 'Paolla Oliveira',
                  avatar_url: 'foto-da-lindeza',
                },
              },
              {
                id: '2',
                date: '2020-10-26T14:00:00.000Z',
                user: {
                  name: 'Grazi Massafera',
                  avatar_url: 'foto-da-lindeza',
                },
              },
              {
                id: '3',
                date: '2020-10-26T17:00:00.000Z',
                user: {
                  name: 'Trapizomba',
                  avatar_url: 'foto-da-bicho-feio',
                },
              },
            ],
          });
      }
    },
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signOut: () => mockedSignOut(),
      user: {
        id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
        avatar_url: 'http://avatar.address.com',
      },
    }),
  };
});

jest.spyOn(Date, 'now').mockImplementation(() => {
  return new Date(2020, 9, 26, 9, 0, 0).getTime();
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    mockedSignOut.mockClear();
  });

  it('should be able to render Dashboard', async () => {
    const { getByText } = render(<Dashboard />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(getByText('Hoje')).toBeTruthy();
      expect(getByText('Outubro 2020')).toBeTruthy();
      expect(getByText('Agendamento a seguir')).toBeTruthy();
      expect(getByText('Dia 26 de outubro')).toBeTruthy();
    });
  });

  it('should be able to change the day in the calendar', async () => {
    const { getByText, queryByText } = render(<Dashboard />, {
      wrapper: MemoryRouter,
    });

    const nextDay = getByText('27');

    act(() => {
      fireEvent.click(nextDay);
    });

    await waitFor(() => {
      expect(queryByText('Hoje')).toBeFalsy();
      expect(getByText('Dia 27 de outubro')).toBeTruthy();
    });
  });

  it('should not be able to select a disabled day', async () => {
    const { getByText } = render(<Dashboard />, { wrapper: MemoryRouter });

    const nextDay = getByText('14');

    act(() => {
      fireEvent.click(nextDay);
    });

    await waitFor(() => {
      expect(nextDay).toHaveClass('DayPicker-Day--disabled');
    });
  });

  it('should be able to change the month in the calendar', async () => {
    const { getAllByRole, getByText } = render(<Dashboard />, {
      wrapper: MemoryRouter,
    });

    const nextMonth = getAllByRole('button');

    act(() => {
      fireEvent.click(nextMonth[2]);
    });

    await waitFor(() => {
      expect(getByText('Novembro 2020')).toBeTruthy();
    });
  });

  it('should be able to navigate to user profile', async () => {
    const history = createMemoryHistory({ initialEntries: ['/dashboard'] });
    const renderResult = render(
      <Router history={history}>
        <Dashboard />
      </Router>,
    );

    const profileLink = renderResult.getByText('John Doe');

    act(() => {
      fireEvent.click(profileLink);
    });

    await waitFor(() => {
      expect(history.location.pathname).toBe('/profile');
    });
  });

  it('should be able to sign out', async () => {
    const { getByTestId } = render(<Dashboard />, { wrapper: MemoryRouter });

    const signOutButton = getByTestId('signOut');

    act(() => {
      fireEvent.click(signOutButton);
    });

    await waitFor(() => {
      expect(mockedSignOut).toHaveBeenCalledTimes(1);
    });
  });
});
