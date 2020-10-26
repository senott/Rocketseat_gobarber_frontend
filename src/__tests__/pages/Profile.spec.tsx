import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import Profile from '../../pages/Profile';

const mockedHistoryPush = jest.fn();
const mockedUsersPut = jest.fn();
const mockedUpdateUser = jest.fn();
const mockedAddToast = jest.fn();
const mockedUsersPatch = jest.fn();

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      updateUser: () => mockedUpdateUser(),
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar_url: 'http://avatar.address.com',
      },
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
    put: () => mockedUsersPut(),
    patch: () => mockedUsersPatch(),
  };
});

describe('Profile Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedUsersPut.mockClear();
    mockedUpdateUser.mockClear();
    mockedUsersPatch.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to update profile with valid user name and email', async () => {
    mockedUsersPut.mockResolvedValue({
      data: {
        user: {
          name: 'John Doe II',
          email: 'johnII@example.com',
          avatar_url: 'http://avatar.address.com',
        },
      },
    });
    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Confirmar mudanças');

    act(() => {
      fireEvent.change(nameField, { target: { value: 'John Doe II' } });
      fireEvent.change(emailField, {
        target: { value: 'johndoeII@example.com' },
      });

      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedUsersPut).toHaveBeenCalledTimes(1);
      expect(mockedUpdateUser).toHaveBeenCalledTimes(1);
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
    });
  });

  it('should be able to update user password', async () => {
    mockedUsersPut.mockResolvedValue({
      data: {
        user: {
          name: 'John Doe II',
          email: 'johnII@example.com',
          avatar_url: 'http://avatar.address.com',
        },
      },
    });
    const { getByPlaceholderText, getByText } = render(<Profile />);

    const currentPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationdField = getByPlaceholderText(
      'Confirmação senha',
    );

    const buttonElement = getByText('Confirmar mudanças');

    act(() => {
      fireEvent.change(currentPasswordField, {
        target: { value: '123456' },
      });
      fireEvent.change(passwordField, {
        target: { value: '123123' },
      });
      fireEvent.change(passwordConfirmationdField, {
        target: { value: '123123' },
      });

      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedUsersPut).toHaveBeenCalledTimes(1);
      expect(mockedUpdateUser).toHaveBeenCalledTimes(1);
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
    });
  });

  it('should be able to update user avatar', async () => {
    mockedUsersPatch.mockResolvedValue({
      data: {
        user: {
          name: 'John Doe II',
          email: 'johnII@example.com',
          avatar_url: 'http://avatar.address.com',
        },
      },
    });
    const { getByTestId } = render(<Profile />);

    const file = new File(['dummy content'], 'avatar.png', {
      type: 'image/png',
    });

    const avatarField = getByTestId('avatar');

    Object.defineProperty(avatarField, 'files', { value: [file] });

    act(() => {
      fireEvent.change(avatarField);
    });

    await waitFor(() => {
      expect(mockedUsersPatch).toHaveBeenCalledTimes(1);
      expect(mockedUpdateUser).toHaveBeenCalledTimes(1);
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
    });
  });

  it('should not be able to update user avatar', async () => {
    mockedUsersPatch.mockResolvedValue({
      data: {
        user: {
          name: 'John Doe II',
          email: 'johnII@example.com',
          avatar_url: 'http://avatar.address.com',
        },
      },
    });
    const { getByTestId } = render(<Profile />);

    const avatarField = getByTestId('avatar');

    Object.defineProperty(avatarField, 'files', { value: [] });

    act(() => {
      fireEvent.change(avatarField);
    });

    await waitFor(() => {
      expect(mockedUsersPatch).not.toHaveBeenCalled();
      expect(mockedUpdateUser).not.toHaveBeenCalled();
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });

  it('should not be able to update user password with wrong password confirmation', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />);

    const currentPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationdField = getByPlaceholderText(
      'Confirmação senha',
    );

    const buttonElement = getByText('Confirmar mudanças');

    act(() => {
      fireEvent.change(currentPasswordField, {
        target: { value: '123456' },
      });
      fireEvent.change(passwordField, {
        target: { value: '123123' },
      });
      fireEvent.change(passwordConfirmationdField, {
        target: { value: '123122' },
      });

      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedUsersPut).not.toHaveBeenCalled();
      expect(mockedUpdateUser).not.toHaveBeenCalled();
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should not be able to update profile with invalid user email', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Confirmar mudanças');

    act(() => {
      fireEvent.change(nameField, { target: { value: 'John Doe II' } });
      fireEvent.change(emailField, {
        target: { value: 'johndoeIIexample.com' },
      });

      fireEvent.click(buttonElement);
    });

    await waitFor(() => {
      expect(mockedUsersPut).not.toHaveBeenCalled();
      expect(mockedUpdateUser).not.toHaveBeenCalled();
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display error when profile update fails', async () => {
    mockedUsersPut.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Confirmar mudanças');

    act(() => {
      fireEvent.change(nameField, { target: { value: 'John Doe II' } });
      fireEvent.change(emailField, {
        target: { value: 'johndoeII@example.com' },
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
