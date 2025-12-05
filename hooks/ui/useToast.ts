import {useToastController} from '@tamagui/toast';
import {useCallback} from 'react';

interface ToastOptions {
    message?: string;
    duration?: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export function useToast() {
    const toast = useToastController();

    const show = useCallback((title: string, options?: ToastOptions & { type?: ToastType }) => {
        toast.show(title, {
            message: options?.message,
            duration: options?.duration || 3000,
            customData: {
                type: options?.type || 'info'
            }
        });
    }, [toast]);

    const success = useCallback((title: string, options?: ToastOptions) => {
        show(title, {...options, type: 'success'});
    }, [show]);

    const error = useCallback((title: string, options?: ToastOptions) => {
        show(title, {...options, type: 'error'});
    }, [show]);

    const warning = useCallback((title: string, options?: ToastOptions) => {
        show(title, {...options, type: 'warning'});
    }, [show]);

    const info = useCallback((title: string, options?: ToastOptions) => {
        show(title, {...options, type: 'info'});
    }, [show]);

    const hide = useCallback(() => {
        toast.hide();
    }, [toast]);

    return {show, success, error, warning, info, hide};
}
