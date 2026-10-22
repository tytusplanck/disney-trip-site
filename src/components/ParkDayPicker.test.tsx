import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ParkDayPicker from './ParkDayPicker';

const options = [
  { id: 'mk', label: 'Magic Kingdom', meta: 'Tue Nov 10' },
  { id: 'epcot', label: 'EPCOT', meta: 'Thu Nov 12' },
];

describe('ParkDayPicker', () => {
  it('names each park day chip with its park and date and marks the selected one', () => {
    render(
      <ParkDayPicker label="Park day" options={options} selectedId="epcot" onSelect={vi.fn()} />,
    );

    expect(screen.getByRole('group', { name: 'Park day' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Magic Kingdom Tue Nov 10' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'EPCOT Thu Nov 12' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('offers an optional whole-trip chip that selects no park day', () => {
    const onSelect = vi.fn();
    render(
      <ParkDayPicker
        label="Day scope"
        options={options}
        selectedId={null}
        onSelect={onSelect}
        allOption={{ label: 'All park days', meta: 'Whole trip' }}
      />,
    );

    expect(screen.getByRole('button', { name: 'All park days Whole trip' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Magic Kingdom Tue Nov 10' }));
    expect(onSelect).toHaveBeenLastCalledWith('mk');

    fireEvent.click(screen.getByRole('button', { name: 'All park days Whole trip' }));
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });
});
