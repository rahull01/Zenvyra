import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AiActPage from '../../page';

describe('AiActPage', () => {
  it('renders the dashboard title', () => {
    render(<AiActPage />);
    expect(screen.getByText('EU AI Act Readiness')).toBeInTheDocument();
  });
});