import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crown, MoreVertical, Shield, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGroupMembers } from "@/hooks/useGroupMembers";
import { toast } from "sonner";

interface GroupMemberListProps {
  groupId: string;
  isAdmin: boolean;
}

export const GroupMemberList = ({ groupId, isAdmin }: GroupMemberListProps) => {
  const { members, updateMemberRole, removeMember } = useGroupMembers(groupId);
  const [loading, setLoading] = useState(false);

  const handleRoleUpdate = async (
    memberId: string,
    role: "admin" | "member"
  ) => {
    try {
      setLoading(true);
      await updateMemberRole(memberId, role);
      toast.success(`Member role updated to ${role}`);
    } catch (error) {
      toast.error("Failed to update member role");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      setLoading(true);
      await removeMember(memberId);
      toast.success("Member removed from group");
    } catch (error) {
      toast.error("Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member._id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.profilePic} alt={member.username} />
                <AvatarFallback>{member.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{member.fullName}</p>
                  {member.role === "owner" && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                  {member.role === "admin" && (
                    <Shield className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  @{member.username}
                </p>
              </div>
            </div>
            {isAdmin && member.role !== "owner" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={loading}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {member.role === "member" && (
                    <DropdownMenuItem
                      onClick={() => handleRoleUpdate(member._id, "admin")}
                    >
                      Make Admin
                    </DropdownMenuItem>
                  )}
                  {member.role === "admin" && (
                    <DropdownMenuItem
                      onClick={() => handleRoleUpdate(member._id, "member")}
                    >
                      Remove Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleRemoveMember(member._id)}
                  >
                    <UserMinus className="h-4 w-4 mr-2" />
                    Remove from Group
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
