import { type HTMLProps } from 'react';

type Props = Omit<HTMLProps<HTMLButtonElement>, 'type'> & { type?: ButtonType; 'data-testid'?: string };

type ButtonType = 'button' | 'submit' | 'reset' | undefined;

export function Button({ children, ...props }: Props) {
    return (
        <button className='bg-red-900 px-8 py-4 text-white' {...props}>
            {children}
        </button>
    );
}
