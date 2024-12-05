import { Home, Users, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import useAuthStore from '@/store/authStore';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: 'home' | 'friends' | 'profile') => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="w-20 border-r bg-card flex flex-col items-center py-4 gap-4">
      <div className="w-12 h-12 rounded-full overflow-hidden mb-4">
        <img
          src={user?.profilePic}
          alt={user?.username}
          className="w-full h-full object-cover"
        />
      </div>

      <Button
        variant={activeTab === 'home' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onTabChange('home')}
      >
        <Home className="h-5 w-5" />
      </Button>

      <Button
        variant={activeTab === 'friends' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onTabChange('friends')}
      >
        <Users className="h-5 w-5" />
      </Button>

      <Button
        variant={activeTab === 'profile' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onTabChange('profile')}
      >
        <User className="h-5 w-5" />
      </Button>

      <div className="mt-auto flex flex-col gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={logout}>
          <User className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};