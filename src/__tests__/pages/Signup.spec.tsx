import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import SignUp from '../../pages/SignUp';

const mockedHistoryPush = jest.fn();
const mockedUsersPost = jest.fn();
const mockedAddToast = jest.fn();

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
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../services/api', () => {
  return {
    post: () => mockedUsersPost(),
  };
});

describe('SignUp Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedUsersPost.mockClear();
  });

  it('should be able to sign up', async () => {
    const { getByPlaceholderText, getByText, debug } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    act(() => {
      fireEvent.change(nameField, { target: { value: 'John Doe' } });
      fireEvent.change(emailField, {
        target: { value: 'johndoe@example.com' },
      });
      fireEvent.change(passwordField, { target: { value: '123456' } });

      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
      expect(mockedUsersPost).toHaveBeenCalledTimes(1);
    });
  });

  it('should not be able to sign up with invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    act(() => {
      fireEvent.change(nameField, { target: { value: 'John Doe' } });
      fireEvent.change(emailField, {
        target: { value: 'johndoe@example.com' },
      });
      fireEvent.change(passwordField, { target: { value: '123' } });

      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should not be able to sign up with password length minor then 6 characters', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    act(() => {
      fireEvent.change(nameField, { target: { value: 'John Doe' } });
      fireEvent.change(emailField, {
        target: { value: 'invalid-email' },
      });
      fireEvent.change(passwordField, { target: { value: '123456' } });

      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display error when sign up fails', async () => {
    mockedUsersPost.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    act(() => {
      fireEvent.change(nameField, { target: { value: 'John Doe' } });
      fireEvent.change(emailField, {
        target: { value: 'johndoe@example.com' },
      });
      fireEvent.change(passwordField, { target: { value: '123456' } });

      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });
});
