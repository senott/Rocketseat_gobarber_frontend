import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import ResetPassword from '../../pages/ResetPassword';

const mockedHistoryPush = jest.fn();
const mockedUsersPost = jest.fn();
const mockedAddToast = jest.fn();
let mockedToken = '?token=valid-token';

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    useLocation: () => ({
      pathname: 'localhost:3000',
      search: mockedToken,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../services/api', () => {
  return {
    post: () => mockedUsersPost(),
  };
});

describe('Reset Password Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedUsersPost.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to reset password', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova Senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = getByText('Alterar senha');

    act(() => {
      fireEvent.change(passwordField, { target: { value: '654321' } });
      fireEvent.change(passwordConfirmationField, {
        target: { value: '654321' },
      });
      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
      expect(mockedUsersPost).toHaveBeenCalledTimes(1);
    });
  });

  it('should not be able to reset password with different passwords', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova Senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = getByText('Alterar senha');

    act(() => {
      fireEvent.change(passwordField, { target: { value: '654321' } });
      fireEvent.change(passwordConfirmationField, {
        target: { value: 'different' },
      });
      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display error when password reset fails', async () => {
    // mockedUsersPost.mockImplementation(() => {
    //   throw new Error();
    // });
    mockedToken = '';

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova Senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = getByText('Alterar senha');

    act(() => {
      fireEvent.change(passwordField, { target: { value: '654321' } });
      fireEvent.change(passwordConfirmationField, {
        target: { value: '654321' },
      });
      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });
});
