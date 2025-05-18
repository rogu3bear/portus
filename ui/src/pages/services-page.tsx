import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { servicesApi, type Service } from '../lib/api-client';
import { MainLayout } from '../components/layout/main-layout';
import { Plus, Trash2, Edit } from 'lucide-react';
import { formatDateTime } from '../lib/utils';
import { useState } from 'react';
import { ServiceForm } from '../components/services/service-form';

export function ServicesPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.getAll().then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => servicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingService(null);
    queryClient.invalidateQueries({ queryKey: ['services'] });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Services</h2>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">
                    DNS Name
                  </th>
                  <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">
                    Host
                  </th>
                  <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">
                    Port
                  </th>
                  <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">
                    Protocol
                  </th>
                  <th className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">
                    Created At
                  </th>
                  <th className="h-12 px-4 text-right text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{service.dns_name}</td>
                    <td className="p-4">{service.host}</td>
                    <td className="p-4">{service.port}</td>
                    <td className="p-4 uppercase">{service.proto}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDateTime(service.created_at)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(service)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(service.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No services found. Add your first service to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ServiceForm
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setEditingService(null);
          }
        }}
        service={editingService}
        onSuccess={handleFormSuccess}
      />
    </MainLayout>
  );
}
