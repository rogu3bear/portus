import { MainLayout } from '../components/layout/main-layout';
import { DevicesGrid } from '../components/network/devices-grid';
import { DeviceDrawer } from '../components/network/device-drawer';
import { MappingProvider } from '../providers/mapping-provider';

export function NetworkPage() {
  return (
    <MappingProvider>
      <MainLayout>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Network Explorer</h2>
        <div className="relative">
          <DevicesGrid />
          <DeviceDrawer />
        </div>
      </MainLayout>
    </MappingProvider>
  );
}
