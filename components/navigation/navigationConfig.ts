import {MapIcon, CloudIcon, BadgeIcon} from '@/components/ui/Icons';
import {LayoutDashboard, BookOpen, User, LogOut} from '@tamagui/lucide-icons';
import type {ComponentType} from 'react';

/**
 * Navigation item configuration
 * Shared across web and native navigation components
 */
export interface NavigationItem {
    key: string;
    label: string; // Translation key
    icon: ComponentType<{ size?: number; color?: string }>; // Icon component (custom or tamagui)
    href: string;
    isExternal?: boolean;
    requiresAuth?: boolean;
}

/**
 * Main navigation items (Map, Dashboard)
 * Shown prominently in both web and native
 */
export const MAIN_NAVIGATION_ITEMS: readonly NavigationItem[] = [
    {
        key: 'map',
        label: 'navigation.map',
        icon: MapIcon,
        href: '/',
    },
    {
        key: 'dashboard',
        label: 'dashboard.dashboard',
        icon: LayoutDashboard,
        href: '/marina/Stadthafen Flensburg "Im Jaich"',
    },
] as const;

/**
 * Secondary navigation items (API, Sensors, Project Website)
 * Shown in menus and as icon buttons
 */
export const SECONDARY_NAVIGATION_ITEMS: readonly NavigationItem[] = [
    {
        key: 'api',
        label: 'navigation.api',
        icon: CloudIcon,
        href: '/(about)/api',
    },
    {
        key: 'sensors',
        label: 'navigation.sensors',
        icon: BadgeIcon,
        href: '/(about)/sensors',
    },
    {
        key: 'project',
        label: 'navigation.projectWebsite',
        icon: BookOpen,
        href: 'https://projekt.marlin-live.com',
        isExternal: true,
    },
] as const;

/**
 * Authentication-related navigation items
 * Shown based on session state
 */
export const AUTH_NAVIGATION_ITEMS = {
    profile: {
        key: 'profile',
        label: 'navigation.profile',
        icon: User,
        href: '/(profile)/profile',
        requiresAuth: true,
    },
    logout: {
        key: 'logout',
        label: 'auth.logout',
        icon: LogOut,
        href: '', // No href, handled by function
        requiresAuth: true,
    },
    login: {
        key: 'login',
        label: 'auth.login',
        icon: User,
        href: '/login',
        requiresAuth: false,
    },
    register: {
        key: 'register',
        label: 'auth.register',
        icon: User,
        href: '/register',
        requiresAuth: false,
    },
} as const;

/**
 * All navigation items combined
 * For easy iteration in components
 */
export const ALL_NAVIGATION_ITEMS = [
    ...MAIN_NAVIGATION_ITEMS,
    ...SECONDARY_NAVIGATION_ITEMS,
] as const;

/**
 * Navigation styling constants
 * Shared across web and native implementations
 */
export const NAVIGATION_STYLES = {
    iconSize: {
        standard: 24,
        large: 26,
        button: 30,
    },
    spacing: {
        itemGap: '$3',
        iconGroupWeb: '$4',
        iconGroupNative: '$6',
    },
    button: {
        size: '$4',
        padding: '$2',
    },
} as const;

/**
 * Helper to determine if a navigation item is external
 */
export function isExternalLink(href: string): boolean {
    return href.startsWith('http://') || href.startsWith('https://');
}

/**
 * Helper to get authenticated navigation items
 * Returns profile and logout items
 */
export function getAuthenticatedItems() {
    return [AUTH_NAVIGATION_ITEMS.profile, AUTH_NAVIGATION_ITEMS.logout];
}

/**
 * Helper to get unauthenticated navigation items
 * Returns login and register items
 */
export function getUnauthenticatedItems() {
    return [AUTH_NAVIGATION_ITEMS.login, AUTH_NAVIGATION_ITEMS.register];
}
