import {PaymentSheetResponse} from '@/api/models/subscription';

interface WebPaymentDialogProps {
    params: PaymentSheetResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function WebPaymentDialog(_props: WebPaymentDialogProps) {
    return null;
}
