import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { MappingEditor } from './mapping-editor';
import { StatusDot } from './status-dot';
import type { DomainMapping } from '@/lib/mapping-validators';
import { useMappings } from '@/providers/mapping-provider';

interface Props {
  mapping: DomainMapping;
  onSave: (m: DomainMapping) => void;
}

export function MappingCard({ mapping, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [valid, setValid] = useState(true);
  const { validateMapping } = useMappings();

  useEffect(() => {
    validateMapping(mapping).then(setValid);
  }, [mapping, validateMapping]);

  return (
    <div className="rounded-md border p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <StatusDot ok={valid} />
          <span className="font-medium truncate" title={mapping.domain}>
            {mapping.domain}
          </span>
        </div>
        <button
          className="text-sm underline focus:outline-none focus:ring"
          onClick={() => setOpen(true)}
          aria-label="Edit mapping"
        >
          Edit
        </button>
      </div>
      <div className="text-sm text-muted-foreground">
        {mapping.path} → {mapping.ip}:{mapping.port}
      </div>
      {open && (
        <MappingEditor
          mapping={mapping}
          onSave={(m) => {
            onSave(m);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  );
}
