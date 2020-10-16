import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Button from '../../components/Button';

describe('Button Component', () => {
  it('should render button', () => {
    const { getByText } = render(<Button type="button">Ok</Button>);

    const buttonElement = getByText('Ok');

    expect(buttonElement).toBeTruthy();
  });

  it('should change button text when clicked', () => {
    const { getByText } = render(
      <Button type="button" loading>
        Ok
      </Button>,
    );

    const buttonElement = getByText('Carregando...');

    expect(buttonElement).toBeTruthy();
  });
});
