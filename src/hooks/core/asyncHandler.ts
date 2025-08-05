import {useCallback, useState} from "react";

export type State<R> = {
    loading: boolean;
    error: Error | null;
    data: R | null;
};

export function useAsync<P extends any[], R>(
    fn: (...args: P) => Promise<R>
): readonly [
    (...args: P) => Promise<R | undefined>,
    State<R>,
] {
    const [state, setState] = useState<State<R>>({
        loading: false,
        error: null,
        data: null,
    });

    const execute = useCallback(
        async (...args: P) => {
            setState({loading: true, error: null, data: null});
            try {
                const data = await fn(...args);
                setState({loading: false, error: null, data});
                return data;
            } catch (error) {
                setState({loading: false, error: error as Error, data: null});
                return undefined;
            }
        },
        [fn],
    );

    return [execute, state] as const;
}