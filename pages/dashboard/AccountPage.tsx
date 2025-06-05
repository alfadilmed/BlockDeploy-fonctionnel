
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { UserCircle, Mail, Shield, Edit3, Save, Camera } from 'lucide-react';

const AccountPage: React.FC = () => {
  const { user, login: updateUserContext } = useAppContext(); // Assuming login can also update user
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    // Add other fields like company, bio, etc.
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);


  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    // Simulate API call to update profile
    console.log('Updating profile with:', formData, avatarFile);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = { ...user!, ...formData, avatarUrl: avatarPreview || user?.avatarUrl };
    updateUserContext(updatedUser); // Update context
    localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage

    setFeedback({type: 'success', message: 'Profile updated successfully!'});
    setIsEditing(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (newPassword !== confirmNewPassword) {
      setFeedback({type: 'error', message: 'New passwords do not match.'});
      return;
    }
    if (newPassword.length < 6) {
      setFeedback({type: 'error', message: 'Password must be at least 6 characters long.'});
      return;
    }
    // Simulate API call to update password
    console.log('Updating password to:', newPassword);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setFeedback({type: 'success', message: 'Password updated successfully!'});
    setNewPassword('');
    setConfirmNewPassword('');
  };


  if (!user) {
    return <div className="text-center p-8">Loading user data...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>
      
      {feedback && (
        <div className={`p-3 mb-6 rounded-md text-sm ${feedback.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information Card */}
        <Card className="lg:col-span-2 bg-brand-secondary border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Profile Information</h2>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} iconLeft={<Edit3 size={16}/>}>
                Edit Profile
              </Button>
            )}
          </div>

          <form onSubmit={handleProfileUpdate}>
            <div className="flex flex-col items-center md:flex-row md:items-start mb-6">
                <div className="relative mb-4 md:mb-0 md:mr-6">
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-brand-accent-blue"/>
                    ) : (
                        <UserCircle size={96} className="text-slate-500" />
                    )}
                    {isEditing && (
                        <label htmlFor="avatarUpload" className="absolute bottom-0 right-0 bg-brand-accent-blue p-1.5 rounded-full cursor-pointer hover:bg-sky-500 transition-colors">
                            <Camera size={16} className="text-white"/>
                            <input type="file" id="avatarUpload" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    )}
                </div>
                <div className="flex-grow space-y-4 w-full">
                    <Input
                        id="name"
                        name="name"
                        label="Full Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        iconLeft={<UserCircle size={18} />}
                    />
                    <Input
                        id="email"
                        name="email"
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing} // Or make email non-editable
                        iconLeft={<Mail size={18} />}
                    />
                </div>
            </div>
            
            {isEditing && (
              <div className="flex justify-end space-x-3 mt-6">
                <Button type="button" variant="ghost" onClick={() => {setIsEditing(false); setFormData({name: user.name, email: user.email}); setAvatarPreview(user.avatarUrl || null); setAvatarFile(null);}}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" iconLeft={<Save size={16}/>} glowEffect="blue">
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Card>

        {/* Change Password Card */}
        <Card className="lg:col-span-1 bg-brand-secondary border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <Input
              id="newPassword"
              name="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              iconLeft={<Shield size={18} />}
            />
            <Input
              id="confirmNewPassword"
              name="confirmNewPassword"
              label="Confirm New Password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••"
              iconLeft={<Shield size={18} />}
            />
            <Button type="submit" variant="secondary" className="w-full" glowEffect="purple">
              Update Password
            </Button>
          </form>
        </Card>
      </div>
      {/* Add sections for API Keys, Preferences, etc. as needed */}
    </div>
  );
};

export default AccountPage;
