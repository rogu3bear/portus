import { MainLayout } from '../components/layout/main-layout';
import { MappingGrid } from '../components/mappings/mapping-grid';
import type { DomainMapping } from '../lib/mapping-validators';
import { MappingProvider } from '../providers/mapping-provider';
import { PortMapper } from '../components/port-mapper/port-mapper';

export function MappingsPage() {
  const initial: DomainMapping[] = [
    { id: 1, domain: 'auchsight.com', aliases: [], path: '/', ip: '10.0.5.9', port: 7802 },
    { id: 2, domain: 'api.auchsight.com', aliases: [], path: '/', ip: '10.0.5.9', port: 7804 },
  ];

  return (
    <MappingProvider initialMappings={initial}>
      <MainLayout>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Domain Mappings</h2>
          <PortMapper />
        </div>
        <MappingGrid />
      </MainLayout>
    </MappingProvider>
  );
}
