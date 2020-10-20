import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import ForgotPassword from '../../pages/ForgotPassword';

const mockedPasswordForgotPost = jest.fn();
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
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../services/api', () => {
  return {
    post: () => mockedPasswordForgotPost(),
  };
});

describe('Forgot Password Page', () => {
  beforeEach(() => {
    mockedPasswordForgotPost.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to receive e-mail to reset password', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');

    act(() => {
      fireEvent.change(emailField, { target: { value: 'johndoe@gmail.com' } });
      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
      expect(mockedPasswordForgotPost).toHaveBeenCalledTimes(1);
    });
  });

  it('should not be able to receive reset password e-mail with invalid e-mail address', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');

    act(() => {
      fireEvent.change(emailField, { target: { value: 'johndogmail.com' } });
      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedPasswordForgotPost).not.toHaveBeenCalled();
    });
  });

  it('should display error when reset password fails', async () => {
    mockedPasswordForgotPost.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');

    act(() => {
      fireEvent.change(emailField, { target: { value: 'johndoe@gmail.com' } });
      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });
});
