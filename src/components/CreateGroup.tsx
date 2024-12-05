import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';

const groupSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters'),
  description: z.string().optional(),
});

export const CreateGroup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = useAuthStore((state) => state.token);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(groupSchema),
  });

  const onSubmit = async (data: z.infer<typeof groupSchema>) => {
    try {
      await axios.post(
        'http://localhost:3000/api/groups',
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Group created successfully');
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error('Failed to create group');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Group Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" {...register('description')} />
          </div>

          <Button type="submit" className="w-full">Create Group</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};