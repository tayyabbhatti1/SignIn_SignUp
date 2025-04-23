import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import Button from '../components/Button';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

const HomeScreen: React.FC = () => {
  const { user, signOut, isAuthenticating } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome</Text>
          <Text style={styles.name}>{user?.name || user?.email}</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => {}}
        >
          <View style={styles.profileImageContainer}>
            <Ionicons name="person" size={24} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Successfully Signed In</Text>
          </View>
          <Text style={styles.cardDescription}>
            You have successfully signed in using AWS Cognito authentication. This is a secure way to authenticate users in your application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Account</Text>
          <View style={styles.accountInfoCard}>
            <View style={styles.accountInfoItem}>
              <Text style={styles.accountInfoLabel}>Email</Text>
              <Text style={styles.accountInfoValue}>{user?.email}</Text>
            </View>
            {user?.name && (
              <View style={styles.accountInfoItem}>
                <Text style={styles.accountInfoLabel}>Name</Text>
                <Text style={styles.accountInfoValue}>{user.name}</Text>
              </View>
            )}
            <View style={styles.accountInfoItem}>
              <Text style={styles.accountInfoLabel}>User ID</Text>
              <Text style={styles.accountInfoValue}>{user?.sub?.substring(0, 10)}...</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AWS Cognito</Text>
          <View style={styles.featureCard}>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Secure Authentication</Text>
                <Text style={styles.featureDescription}>
                  AWS Cognito provides secure authentication with features like MFA.
                </Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="sync-outline" size={24} color={colors.primary} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>User Synchronization</Text>
                <Text style={styles.featureDescription}>
                  Synchronize user data across different devices and platforms.
                </Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="person-add-outline" size={24} color={colors.primary} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>User Management</Text>
                <Text style={styles.featureDescription}>
                  Easily manage users, groups, and permissions.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Button
          title="Sign Out"
          onPress={handleSignOut}
          isLoading={isAuthenticating}
          size="large"
          fullWidth
          variant="outline"
          style={styles.signOutButton}
          leftIcon={<Ionicons name="log-out-outline" size={20} color={colors.primary} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: fontSizes.md,
    color: colors.textLight,
  },
  name: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileButton: {
    padding: spacing.xs,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E8FC',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  cardDescription: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  accountInfoCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  accountInfoItem: {
    marginBottom: spacing.md,
  },
  accountInfoLabel: {
    fontSize: fontSizes.sm,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  accountInfoValue: {
    fontSize: fontSizes.md,
    color: colors.text,
    fontWeight: '500',
  },
  featureCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  featureContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  featureTitle: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: fontSizes.sm,
    color: colors.textLight,
    lineHeight: 20,
  },
  signOutButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
});

export default HomeScreen; 