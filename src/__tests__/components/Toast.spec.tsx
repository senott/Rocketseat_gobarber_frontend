import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { render, fireEvent, waitFor } from '@testing-library/react';

import Toast from '../../components/ToastContainer/Toast';
import { ToastMessage } from '../../hooks/toast';

const mockRemoveToast = jest.fn();

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      removeToast: mockRemoveToast,
    }),
  };
});

describe('Toast Component', () => {
  beforeEach(() => {
    mockRemoveToast.mockClear();
    jest.useFakeTimers();
  });

  it('should render Info toast', async () => {
    const message: ToastMessage = {
      id: 'toast-id',
      type: 'info',
      title: 'Info Title',
      description: 'Info description',
    };

    const tree = renderer
      .create(<Toast message={message} style={{}} />)
      .toJSON();

    expect(tree).toHaveStyleRule('background', '#ebf8ff');
    expect(tree).toHaveStyleRule('color', '#3172b7');
  });

  it('should render toast without type as Info toast', async () => {
    const message: ToastMessage = {
      id: 'toast-id',
      title: 'Info Title',
      description: 'Info description',
    };

    const tree = renderer
      .create(<Toast message={message} style={{}} />)
      .toJSON();

    expect(tree).toHaveStyleRule('background', '#ebf8ff');
    expect(tree).toHaveStyleRule('color', '#3172b7');
  });

  it('should render Success toast', async () => {
    const message: ToastMessage = {
      id: 'toast-id',
      type: 'success',
      title: 'Success Title',
      description: 'Success description',
    };

    const tree = renderer
      .create(<Toast message={message} style={{}} />)
      .toJSON();

    expect(tree).toHaveStyleRule('background', '#e6fffa');
    expect(tree).toHaveStyleRule('color', '#2e656a');
  });

  it('should render Success toast', async () => {
    const message: ToastMessage = {
      id: 'toast-id',
      type: 'error',
      title: 'Error Title',
      description: 'Error description',
    };

    const tree = renderer
      .create(<Toast message={message} style={{}} />)
      .toJSON();

    expect(tree).toHaveStyleRule('background', '#fddede');
    expect(tree).toHaveStyleRule('color', '#c53030');
  });

  it('should remove toast after click', async () => {
    const message: ToastMessage = {
      id: 'toast-id',
      type: 'info',
      title: 'Info Title',
      description: 'Info description',
    };

    const { findByRole } = render(<Toast message={message} style={{}} />);

    const buttonElement = await findByRole('button');

    await waitFor(() => {
      fireEvent.click(buttonElement);
    });

    expect(mockRemoveToast).toHaveBeenCalledWith(message.id);
  });

  it('should remove toast after 3 seconds', async () => {
    const message: ToastMessage = {
      id: 'toast-id2',
      type: 'info',
      title: 'Info Title',
      description: 'Info description',
    };

    const { getByText } = render(<Toast message={message} style={{}} />);

    let toastElementRemoved: HTMLElement;

    setTimeout(() => {
      toastElementRemoved = getByText('Info Title');
    }, 4000);

    await waitFor(() => {
      expect(toastElementRemoved).not.toBeTruthy();
      expect(mockRemoveToast).toHaveBeenCalledWith(message.id);
    });
  });
});
