import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HelloIsland from './HelloIsland';

describe('HelloIsland', () => {
  it('renders the initial not ready state', () => {
    render(<HelloIsland initialLabel="Planning status:" />);

    expect(screen.getByText(/planning status:/i)).toBeInTheDocument();
    expect(screen.getByText('Not ready', { selector: 'strong' })).toBeInTheDocument();
  });

  it('toggles the status when the button is clicked', () => {
    render(<HelloIsland initialLabel="Planning status:" />);

    fireEvent.click(screen.getByRole('button', { name: /mark ready/i }));

    expect(screen.getByText('Ready', { selector: 'strong' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mark not ready/i })).toBeInTheDocument();
  });
});
