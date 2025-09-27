import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Switch, Alert } from 'react-native';
import { 
  User, 
  Bell, 
  Shield, 
  Smartphone, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Moon,
  Globe
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useFinancialData } from '@/hooks/useFinancialData';

const SettingsItem = ({ icon: Icon, title, subtitle, onPress, rightElement }) => (
  <Pressable style={styles.settingsItem} onPress={onPress}>
    <View style={styles.settingsLeft}>
      <View style={styles.iconContainer}>
        <Icon size={20} color="#74b9ff" />
      </View>
      <View style={styles.settingsContent}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {rightElement || <ChevronRight size={20} color="#74b9ff" />}
  </Pressable>
);

const SettingsSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

export default function Settings() {
  const { userProfile, setUserProfile } = useFinancialData();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricEnabled, setBiometricEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);

  const handleProfileEdit = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing feature coming soon!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handlePrivacySecurity = () => {
    Alert.alert(
      'Privacy & Security',
      'Manage your account security settings:\n\n• Two-factor authentication\n• Password change\n• Data export\n• Account deletion',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Language Settings',
      'Select your preferred language:',
      [
        { text: 'English', style: 'default' },
        { text: 'Spanish', style: 'default' },
        { text: 'French', style: 'default' },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'How can we help you?',
      [
        { text: 'FAQ', style: 'default' },
        { text: 'Contact Support', style: 'default' },
        { text: 'Report Bug', style: 'default' },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Signed Out', 'You have been signed out successfully.');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userProfile.avatar}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
          </View>
          <Pressable style={styles.editButton} onPress={handleProfileEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>

        <SettingsSection title="Account">
          <SettingsItem
            icon={User}
            title="Profile Settings"
            subtitle="Update your personal information"
            onPress={handleProfileEdit}
          />
          <SettingsItem
            icon={Shield}
            title="Privacy & Security"
            subtitle="Manage your account security"
            onPress={handlePrivacySecurity}
          />
          <SettingsItem
            icon={Bell}
            title="Notifications"
            subtitle={notificationsEnabled ? "Enabled" : "Disabled"}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#16213e', true: '#6c5ce7' }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#74b9ff'}
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="App Preferences">
          <SettingsItem
            icon={Moon}
            title="Dark Mode"
            subtitle="Currently enabled"
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#16213e', true: '#6c5ce7' }}
                thumbColor={darkMode ? '#ffffff' : '#74b9ff'}
              />
            }
          />
          <SettingsItem
            icon={Globe}
            title="Language"
            subtitle="English"
            onPress={handleLanguageChange}
          />
          <SettingsItem
            icon={Smartphone}
            title="Biometric Authentication"
            subtitle={biometricEnabled ? "Face ID enabled" : "Disabled"}
            rightElement={
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: '#16213e', true: '#6c5ce7' }}
                thumbColor={biometricEnabled ? '#ffffff' : '#74b9ff'}
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem
            icon={HelpCircle}
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={handleHelpSupport}
          />
          <SettingsItem
            icon={LogOut}
            title="Sign Out"
            onPress={handleSignOut}
          />
        </SettingsSection>

        <View style={styles.footer}>
          <Text style={styles.footerText}>FinanceAI v1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with AI-powered insights</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1421',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#16213e',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#74b9ff',
  },
  editButton: {
    backgroundColor: '#16213e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c5ce7',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    marginHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#1a1a2e',
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#16213e',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#74b9ff',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#74b9ff',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#74b9ff',
    opacity: 0.7,
  },
});