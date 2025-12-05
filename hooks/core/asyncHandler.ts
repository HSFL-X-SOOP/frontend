/**
 * Utility for handling async operations with loading and error states
 */
import React from 'react';

// Legacy pattern: for wrapping functions with parameters
// Returns [executeFunction, statusObject] tuple
export const useAsync = <TArgs extends any[], TReturn, E = string>(
  asyncFunction: (...args: TArgs) => Promise<TReturn>,
  immediate = false
) => {
  const [status, setStatus] = React.useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = React.useState<TReturn | null>(null);
  const [error, setError] = React.useState<E | null>(null);

  const execute = React.useCallback(
    async (...args: TArgs) => {
      setStatus('pending');
      setValue(null);
      setError(null);

      try {
        const response = await asyncFunction(...args);
        setValue(response);
        setStatus('success');
        return response;
      } catch (err) {
        setError(err as E);
        setStatus('error');
        throw err;
      }
    },
    [asyncFunction]
  );

  React.useEffect(() => {
    if (immediate && asyncFunction) {
      execute();
    }
  }, [execute, immediate, asyncFunction]);

  // Return as tuple for destructuring compatibility
  return [execute, { status, value, error }] as const;
};

export default useAsync;
