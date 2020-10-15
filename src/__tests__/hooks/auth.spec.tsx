import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '../../hooks/auth';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    apiMock.onPost('/sessions').reply(200, {
      user: { id: '123user', name: 'John Doe', email: 'johndoe@example.com' },
      token: '123token',
    });

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({ email: 'johndoe@example.com', password: '123456' });

    await waitForNextUpdate();

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should store user in local storage after sign in', async () => {
    const apiResponse = {
      user: { id: '123user', name: 'John Doe', email: 'johndoe@example.com' },
      token: '123token',
    };

    apiMock.onPost('/sessions').reply(200, apiResponse);

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );
  });

  it('should store token in local storage after sign in', async () => {
    const apiResponse = {
      user: { id: '123user', name: 'John Doe', email: 'johndoe@example.com' },
      token: '123token',
    };

    apiMock.onPost('/sessions').reply(200, apiResponse);

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );
  });

  it('should restore saved user from storage when exists and auth initializes', () => {
    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation((key: string) => {
        switch (key) {
          case '@GoBarber:token':
            return '123token';
          case '@GoBarber:user':
            return JSON.stringify({
              id: '123user',
              name: 'John Doe',
              email: 'johndoe@example.com',
            });
          default:
            return null;
        }
      });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should be able to sign out', () => {
    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation((key: string) => {
        switch (key) {
          case '@GoBarber:token':
            return '123token';
          case '@GoBarber:user':
            return JSON.stringify({
              id: '123user',
              name: 'John Doe',
              email: 'johndoe@example.com',
            });
          default:
            return null;
        }
      });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: '123user',
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatar_url: '',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
  });
});
