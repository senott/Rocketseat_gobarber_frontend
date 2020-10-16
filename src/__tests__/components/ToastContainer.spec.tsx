import { render, waitFor } from '@testing-library/react';
import React from 'react';
import ToastContainer from '../../components/ToastContainer';

import { ToastMessage } from '../../hooks/toast';

describe('Toast Container', () => {
  it('should render one container for each message', async () => {
    const messages: ToastMessage[] = [
      {
        id: 'toast-id',
        type: 'error',
        title: 'Error Title',
        description: 'Error description',
      },
      {
        id: 'toast-id2',
        type: 'error',
        title: 'Error Title',
        description: 'Error description 2',
      },
    ];

    const { getAllByText } = render(<ToastContainer messages={messages} />);

    await waitFor(() => {
      expect(getAllByText('Error Title')).toHaveLength(2);
    });
  });
});
