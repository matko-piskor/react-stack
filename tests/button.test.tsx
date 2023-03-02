import { Button } from '../src/components/button';
import { render, screen } from '@testing-library/react';

test('Button should render', () => {
    render(<Button>Test</Button>);

    const btn = screen.getByRole('button');

    expect(btn).toBeInTheDocument();
});

test('Button should match spanshot', () => {
    const { asFragment } = render(<Button>Test</Button>);

    expect(asFragment()).toMatchSnapshot();
});

test('Button should call onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Test</Button>);

    const btn = screen.getByRole('button');
    btn.click();

    expect(onClick).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
});
