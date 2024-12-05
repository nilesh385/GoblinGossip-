import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, UserMinus, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from 'axios';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';

interface GroupChatProps {
  groupId: string;
  members: any[];
  isAdmin: boolean;
}

export const GroupChat = ({ groupId, members, isAdmin }: GroupChatProps) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const token = useAuthStore((state) => state.token);
  const { register, handleSubmit, reset } = useForm();

  const addMember = async (data: { username: string }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/search?username=${data.username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.user) {
        await axios.post(
          `http://localhost:3000/api/groups/${groupId}/members/${response.data.user._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success('Member added successfully');
        setShowAddMember(false);
        reset();
      }
    } catch (error) {
      toast.error('Failed to add member');
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/groups/${groupId}/members/${memberId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Group Members</h2>
        {isAdmin && (
          <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Group Member</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(addMember)} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    {...register('username', { required: true })}
                  />
                </div>
                <Button type="submit">Add Member</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={member.profilePic} alt={member.username} />
                  <AvatarFallback>
                    <Users className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    @{member.username}
                  </p>
                </div>
              </div>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMember(member._id)}
                >
                  <UserMinus className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};