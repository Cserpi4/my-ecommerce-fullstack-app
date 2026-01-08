import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/common/Button.jsx'; // Ellenőrizd az útvonalat
import '@testing-library/jest-dom';

describe('Button component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByText('Click me');
    expect(btn).toBeInTheDocument(); // jest-dom matcher
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const btn = screen.getByText('Click me');
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('has the correct className', () => {
    render(<Button className="primary">Click me</Button>);
    const btn = screen.getByText('Click me');
    expect(btn).toHaveClass('primary');
  });
});
