import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { FiMail } from 'react-icons/fi';

import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input component', () => {
  it('should be able to render input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should render highlight on input focus', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const containerElement = getByTestId('input-email');

    fireEvent.focus(inputElement);

    waitFor(() => {
      expect(containerElement).toHaveStyle('border-color: #ff9000;');
      expect(containerElement).toHaveStyle('color: #ff9000;');
    });
  });

  it('should be back to normal on input blur', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const containerElement = getByTestId('input-email');

    fireEvent.focus(inputElement);

    fireEvent.blur(inputElement);

    waitFor(() => {
      expect(containerElement).not.toHaveStyle('border-color: #ff9000;');
      expect(containerElement).not.toHaveStyle('color: #ff9000;');
    });
  });

  it('should keep border highlighted when filled', () => {
    const { getByTestId, getByPlaceholderText, debug } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const containerElement = getByTestId('input-email');

    fireEvent.change(inputElement, {
      target: { value: 'johndoe@example.com' },
    });

    fireEvent.blur(inputElement);

    waitFor(() => {
      expect(containerElement).toHaveStyle('color: #ff9000;');
    });
  });

  it('should include icon', () => {
    const { getByTestId } = render(
      <Input name="email" placeholder="E-mail" icon={FiMail} />,
    );

    expect(getByTestId('input-email-icon')).toBeTruthy();
  });
});
