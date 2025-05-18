import { createContext, useContext, useState } from 'react';
import {
  type DomainMapping,
  validateDomainSyntax,
  validateIpReachable,
  validatePortClash,
  validatePathOverlap,
} from '../lib/mapping-validators';

interface MappingContextValue {
  mappings: DomainMapping[];
  addMapping: (m: DomainMapping) => void;
  updateMapping: (m: DomainMapping) => void;
  validateMapping: (m: DomainMapping) => Promise<boolean>;
}

const MappingContext = createContext<MappingContextValue | undefined>(undefined);

const RESERVED_PORTS = [
  7801,
  7802,
  7803,
  7804,
  7806,
  7807,
  7808,
  7809,
  7810,
  7811,
  7812,
];

export function MappingProvider({
  children,
  initialMappings = [],
}: {
  children: React.ReactNode;
  initialMappings?: DomainMapping[];
}) {
  const [mappings, setMappings] = useState<DomainMapping[]>(initialMappings);

  const addMapping = (m: DomainMapping) => setMappings((prev) => [...prev, m]);

  const updateMapping = (m: DomainMapping) =>
    setMappings((prev) => prev.map((p) => (p.id === m.id ? m : p)));

  const validateMapping = async (m: DomainMapping) => {
    const portsUsed = [...RESERVED_PORTS, ...mappings.map((mm) => mm.port)];
    const pathsUsed = mappings.map((mm) => mm.path);
    const domainOk = validateDomainSyntax(m.domain);
    const aliasOk = m.aliases.every((a) => validateDomainSyntax(a));
    const ipOk = await validateIpReachable(m.ip);
    const portOk = validatePortClash(m.port, portsUsed);
    const pathOk = validatePathOverlap(m.path, pathsUsed);
    return domainOk && aliasOk && ipOk && portOk && pathOk;
  };

  return (
    <MappingContext.Provider
      value={{ mappings, addMapping, updateMapping, validateMapping }}
    >
      {children}
    </MappingContext.Provider>
  );
}

export function useMappings() {
  const ctx = useContext(MappingContext);
  if (!ctx) throw new Error('useMappings must be within MappingProvider');
  return ctx;
}
