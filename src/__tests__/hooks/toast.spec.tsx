import { renderHook, act } from '@testing-library/react-hooks';
import { ToastProvider, useToast } from '../../hooks/toast';

describe('Toast hook', () => {
  it('should be able to add toast', () => {
    const { result, waitForNextUpdate } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.addToast({
        type: 'error',
        title: 'Error title',
        description: 'Error message',
      });
    });

    waitForNextUpdate();

    expect(result.current.messages).toHaveLength(1);
  });

  it('should be able to remove toast', () => {
    const { result, waitForNextUpdate } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.addToast({
        type: 'error',
        title: 'Error title',
        description: 'Error message',
      });
    });

    act(() => {
      result.current.removeToast(result.current.messages[0].id);
    });

    waitForNextUpdate();

    expect(result.current.messages).toHaveLength(0);
  });
});
