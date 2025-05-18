import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ValidatorIcon } from './validator-icon';
import type { DomainMapping } from '@/lib/mapping-validators';
import {
  validateDomainSyntax,
  validateIpReachable,
  validatePortClash,
  validatePathOverlap,
} from '@/lib/mapping-validators';

interface Props {
  mapping: DomainMapping;
  onSave: (m: DomainMapping) => void;
  onCancel: () => void;
}

export function MappingEditor({ mapping, onSave, onCancel }: Props) {
  const [current, setCurrent] = useState(mapping);
  const [ipOk, setIpOk] = useState(true);
  const [domainOk, setDomainOk] = useState(true);
  const [aliasOk, setAliasOk] = useState(true);
  const [pathOk, setPathOk] = useState(true);
  const [portOk, setPortOk] = useState(true);

  useEffect(() => {
    setDomainOk(validateDomainSyntax(current.domain));
  }, [current.domain]);

  useEffect(() => {
    validateIpReachable(current.ip).then(setIpOk);
  }, [current.ip]);

  useEffect(() => {
    setPortOk(validatePortClash(current.port, []));
  }, [current.port]);

  useEffect(() => {
    setPathOk(validatePathOverlap(current.path, []));
  }, [current.path]);

  useEffect(() => {
    setAliasOk(current.aliases.every((a) => validateDomainSyntax(a)));
  }, [current.aliases]);

  const handleSave = () => {
    onSave(current);
  };

  return (
    <div className="mt-4 space-y-2 border-t pt-4 text-sm">
      <div className="flex items-center space-x-2">
        <label className="w-20">IP</label>
        <Input
          value={current.ip}
          onChange={(e) => setCurrent({ ...current, ip: e.target.value })}
          aria-label="ip"
        />
        <ValidatorIcon valid={ipOk} />
      </div>
      <div className="flex items-center space-x-2">
        <label className="w-20">Domain</label>
        <Input
          value={current.domain}
          onChange={(e) => setCurrent({ ...current, domain: e.target.value })}
          aria-label="domain"
        />
        <ValidatorIcon valid={domainOk} />
      </div>
      <div className="flex items-center space-x-2">
        <label className="w-20">Aliases</label>
        <Input
          value={current.aliases.join(', ')}
          onChange={(e) =>
            setCurrent({
              ...current,
              aliases: e.target.value.split(/[ ,]+/).filter(Boolean),
            })
          }
          aria-label="aliases"
        />
        <ValidatorIcon valid={aliasOk} />
      </div>
      <div className="flex items-center space-x-2">
        <label className="w-20">Path</label>
        <Input
          value={current.path}
          onChange={(e) => setCurrent({ ...current, path: e.target.value })}
          aria-label="path"
        />
        <ValidatorIcon valid={pathOk} />
      </div>
      <div className="flex items-center space-x-2">
        <label className="w-20">Port</label>
        <Input
          type="number"
          value={current.port}
          onChange={(e) =>
            setCurrent({ ...current, port: Number(e.target.value) })
          }
          aria-label="port"
        />
        <ValidatorIcon valid={portOk} />
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <label className="w-20">Map '/'</label>
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={current.path === '/'}
          onChange={(e) =>
            setCurrent({ ...current, path: e.target.checked ? '/' : current.path })
          }
          aria-label="map root"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} aria-label="cancel">
          Cancel
        </Button>
        <Button onClick={handleSave} aria-label="save">
          Save
        </Button>
      </div>
    </div>
  );
}
