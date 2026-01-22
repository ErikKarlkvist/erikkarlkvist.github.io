import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

export interface BaseProps {
    className?: string;
    variant?: 'primary' | 'secondary' | 'accent';
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseProps {
    children: ReactNode;
    isLoading?: boolean;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseProps {
    label?: string;
    error?: string;
}

export interface FormProps extends BaseProps {
    children: ReactNode;
    title?: string;
    onSubmit?: (e: React.FormEvent) => void;
}
