import { render } from '@testing-library/react';
import { MappingEditor } from '../src/components/mappings/mapping-editor';

test('renders MappingEditor', () => {
  const mapping = { id: 1, domain: 'example.com', aliases: [], path: '/', ip: '1.1.1.1', port: 80 };
  render(<MappingEditor mapping={mapping} onSave={() => {}} onCancel={() => {}} />);
});
