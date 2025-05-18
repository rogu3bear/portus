import type { DomainMapping } from '@/lib/mapping-validators';
import { MappingCard } from './mapping-card';

interface Props {
  mappings: DomainMapping[];
  onUpdate: (m: DomainMapping) => void;
}

export function MappingGrid({ mappings, onUpdate }: Props) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))' }}>
      {mappings.map((m) => (
        <MappingCard key={m.id} mapping={m} onSave={onUpdate} />
      ))}
    </div>
  );
}
