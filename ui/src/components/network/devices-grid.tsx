import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Device {
  ip: string;
  hostname: string;
  mac: string;
}

export function DevicesGrid() {
  const [devices, setDevices] = useState<Device[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/lan/devices')
      .then((res) => res.json())
      .then((d) => setDevices(d))
      .catch(() => setDevices([]));
  }, []);

  return (
    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-muted">
          <th className="px-2 py-1 text-left">Hostname</th>
          <th className="px-2 py-1 text-left">IP</th>
        </tr>
      </thead>
      <tbody>
        {devices.map((d) => (
          <tr
            key={d.ip}
            className="cursor-pointer hover:bg-accent"
            onClick={() => navigate(`/network/${encodeURIComponent(d.ip)}`)}
          >
            <td className="px-2 py-1">{d.hostname}</td>
            <td className="px-2 py-1">{d.ip}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
