import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useMappings } from '@/providers/mapping-provider';

export function PortMapper() {
  const { validateMapping, addMapping } = useMappings();
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState(0);

  const handleSubmit = async () => {
    const m = { id: Date.now(), domain, aliases: [], path: '/', ip, port };
    if (await validateMapping(m)) {
      addMapping(m);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">New Mapping</Button>
      </DialogTrigger>
      <DialogContent className="space-y-2">
        <div className="flex items-center space-x-2">
          <label className="w-16">Domain</label>
          <Input value={domain} onChange={(e) => setDomain(e.target.value)} />
        </div>
        <div className="flex items-center space-x-2">
          <label className="w-16">IP</label>
          <Input value={ip} onChange={(e) => setIp(e.target.value)} />
        </div>
        <div className="flex items-center space-x-2">
          <label className="w-16">Port</label>
          <Input
            type="number"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={handleSubmit}>Map</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
