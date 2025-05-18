import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Device {
  ip: string;
  hostname: string;
  mac: string;
  ports: number[];
}

export function DeviceDrawer() {
  const { device } = useParams<{ device: string }>();
  const [info, setInfo] = useState<Device | null>(null);

  useEffect(() => {
    if (!device) return;
    fetch(`/api/lan/devices/${device}`)
      .then((res) => res.json())
      .then(setInfo)
      .catch(() => setInfo(null));
  }, [device]);

  if (!device) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 border-l bg-background p-4 overflow-y-auto">
      {info ? (
        <div className="space-y-2 text-sm">
          <h3 className="font-bold">{info.hostname}</h3>
          <div>IP: {info.ip}</div>
          <div>MAC: {info.mac}</div>
          <div>Ports: {info.ports.join(', ')}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
