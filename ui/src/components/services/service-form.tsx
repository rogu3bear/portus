import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { servicesApi, type Service } from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const serviceFormSchema = z.object({
  dns_name: z.string().min(3, {
    message: 'DNS name must be at least 3 characters.',
  }),
  host: z.string().min(1, {
    message: 'Host is required.',
  }),
  port: z.coerce.number().int().min(1).max(65535),
  proto: z.enum(['http', 'https', 'tcp', 'udp']).default('http'),
}) as z.ZodType<{
  dns_name: string;
  host: string;
  port: number;
  proto: 'http' | 'https' | 'tcp' | 'udp';
}>;

type ServiceFormValues = {
  dns_name: string;
  host: string;
  port: number;
  proto: 'http' | 'https' | 'tcp' | 'udp';
};

interface ServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  onSuccess?: () => void;
}

export function ServiceForm({
  open,
  onOpenChange,
  service,
  onSuccess,
}: ServiceFormProps) {
  const queryClient = useQueryClient(); // Used by the mutation onSuccess callbacks
  const isEdit = !!service;

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      dns_name: service?.dns_name || '',
      host: service?.host || '',
      port: service?.port || 80,
      proto: (service?.proto as 'http' | 'https' | 'tcp' | 'udp') || 'http',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ServiceFormValues) =>
      servicesApi.create({
        dns_name: data.dns_name,
        host: data.host,
        port: data.port,
        proto: data.proto,
      }),
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ServiceFormValues) =>
      servicesApi.update(service!.id, {
        dns_name: data.dns_name,
        host: data.host,
        port: data.port,
        proto: data.proto,
      }),
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: ServiceFormValues) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Service' : 'Add New Service'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the service details below.'
              : 'Fill in the details to add a new service.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dns_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DNS Name</FormLabel>
                  <FormControl>
                    <Input placeholder="my-service" {...field} />
                  </FormControl>
                  <FormDescription>
                    The DNS name that will be used to access this service.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host</FormLabel>
                    <FormControl>
                      <Input placeholder="localhost" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="proto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protocol</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a protocol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="http">HTTP</SelectItem>
                      <SelectItem value="https">HTTPS</SelectItem>
                      <SelectItem value="tcp">TCP</SelectItem>
                      <SelectItem value="udp">UDP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEdit ? 'Update' : 'Add'} Service
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
