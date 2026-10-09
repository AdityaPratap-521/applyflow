import { describe, it, expect } from 'vitest';
import { escapeCSVField } from '../csvExport.js';

describe('escapeCSVField', () => {
  it('wraps text in quotes', () => {
    expect(escapeCSVField('Google')).toBe('"Google"');
  });

  it('escapes double quotes inside fields with pair of quotes', () => {
    expect(escapeCSVField('Software "Senior" Engineer')).toBe('"Software ""Senior"" Engineer"');
  });

  it('handles fields with commas correctly', () => {
    expect(escapeCSVField('San Francisco, CA')).toBe('"San Francisco, CA"');
  });

  it('handles null and undefined safely', () => {
    expect(escapeCSVField(null)).toBe('""');
    expect(escapeCSVField(undefined)).toBe('""');
  });
});
