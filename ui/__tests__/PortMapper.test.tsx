import { render } from '@testing-library/react';
import { MappingProvider } from '../src/providers/mapping-provider';
import { PortMapper } from '../src/components/port-mapper/port-mapper';

test('renders PortMapper', () => {
  render(
    <MappingProvider>
      <PortMapper />
    </MappingProvider>
  );
});
