import { useCultivationStore } from '@/store/cultivationStore';
import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from 'expo-router/ui';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { MaxContentWidth, Spacing } from '@/constants/theme';

const TAB_ROUTES = [
  { name: 'index', href: '/', label: 'Home' },
  { name: 'tasks', href: '/tasks', label: 'Tasks' },
  { name: 'calendar', href: '/calendar', label: 'Calendar' },
  { name: 'cultivation', href: '/cultivation', label: 'Cultivation' },
  { name: 'memoryAlbum', href: '/memoryAlbum', label: 'Memories' },
] as const;

const TAB_ICONS: Record<string, any> = {
  index: require('../../assets/images/tabIcons/home.png'),
  tasks: require('../../assets/images/tabIcons/tasks.png'),
  calendar: require('../../assets/images/tabIcons/calendar.png'),
  cultivation: require('../../assets/images/tabIcons/cultivation.png'),
  memoryAlbum: require('../../assets/images/tabIcons/memories.png'),
};

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          {TAB_ROUTES.map((route) => (
            <TabTrigger key={route.name} name={route.name} href={route.href} asChild>
              <TabButton name={route.name}>{route.label}</TabButton>
            </TabTrigger>
          ))}
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

function TabButton({ children, isFocused, name, ...props }: TabTriggerSlotProps & { name?: string }) {
  const totalPoints = useCultivationStore((state) => state.totalPoints);
  const showBadge = name === 'cultivation' && totalPoints > 0;

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View style={{ position: 'relative' }}>
        <ThemedView
          type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
          style={styles.tabButtonView}>
          {name && <Image source={TAB_ICONS[name]} style={styles.icon} resizeMode="contain" />}
          <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
            {children}
          </ThemedText>
        </ThemedView>
        {showBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalPoints}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          Cultivate
        </ThemedText>

        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: { marginRight: 'auto' },
  pressed: { opacity: 0.7 },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: 2,
  },
  icon: { width: 20, height: 20 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#B98346',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: 'white', fontSize: 10, fontWeight: '700' },
});