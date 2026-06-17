import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '../page-header';
import { PageContainer } from '../page-container';

describe('PageHeader', () => {
  it('renders the title as a level-1 heading', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard');
  });

  it('renders the eyebrow and description when provided', () => {
    render(<PageHeader title="Courses" eyebrow="Catalog" description="Browse all tracks" />);
    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.getByText('Browse all tracks')).toBeInTheDocument();
  });

  it('omits the description node when not provided', () => {
    const { container } = render(<PageHeader title="Profile" />);
    expect(container.querySelector('p')).toBeNull();
  });
});

describe('PageContainer', () => {
  it('constrains width and renders children', () => {
    const { container } = render(<PageContainer>content</PageContainer>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('max-w-7xl');
    expect(root).toHaveTextContent('content');
  });
});
