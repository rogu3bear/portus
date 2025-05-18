import { MappingCard } from './mapping-card';
import { useMappings } from '@/providers/mapping-provider';

export function MappingGrid() {
  const { mappings, updateMapping } = useMappings();
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))' }}>
      {mappings.map((m) => (
        <MappingCard key={m.id} mapping={m} onSave={updateMapping} />
      ))}
    </div>
  );
}
