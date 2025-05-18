import { useState } from 'react';
import { MainLayout } from '../components/layout/main-layout';
import { MappingGrid } from '../components/mappings/mapping-grid';
import type { DomainMapping } from '../lib/mapping-validators';

export function MappingsPage() {
  const [mappings, setMappings] = useState<DomainMapping[]>([
    { id: 1, domain: 'auchsight.com', aliases: [], path: '/', ip: '10.0.5.9', port: 7802 },
    { id: 2, domain: 'api.auchsight.com', aliases: [], path: '/', ip: '10.0.5.9', port: 7804 },
  ]);

  const handleUpdate = (updated: DomainMapping) => {
    setMappings((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  return (
    <MainLayout>
      <h2 className="mb-4 text-2xl font-bold tracking-tight">Domain Mappings</h2>
      <MappingGrid mappings={mappings} onUpdate={handleUpdate} />
    </MainLayout>
  );
}
