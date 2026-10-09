import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ApplicationFormModal } from '../ApplicationFormModal.jsx';

describe('ApplicationFormModal', () => {
  it('renders modal when isOpen is true', () => {
    render(<ApplicationFormModal isOpen={true} onClose={() => {}} onSubmit={() => {}} />);
    expect(screen.getByText('Add New Job Application')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Acme Corp')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty required fields', async () => {
    const handleSubmit = vi.fn();
    render(<ApplicationFormModal isOpen={true} onClose={() => {}} onSubmit={handleSubmit} />);

    const submitBtn = screen.getByText('Save Application');
    fireEvent.click(submitBtn);

    expect(screen.getByText('Company name is required')).toBeInTheDocument();
    expect(screen.getByText('Job title is required')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
