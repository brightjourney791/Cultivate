import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useCultivationStore } from '../src/store/cultivationStore';

const TAB_ROUTES = [
  { name: 'index', href: '/' },
  { name: 'tasks', href: '/tasks' },
  { name: 'calendar', href: '/calendar' },
  { name: 'cultivation', href: '/cultivation' },
  { name: 'memoryAlbum', href: '/memoryAlbum' },
] as const;

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          {TAB_ROUTES.map((route) => (
            <TabTrigger key={route.name} name={route.name} href={route.href} asChild>
              <TabButton />
            </TabTrigger>
          ))}
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

function TabButton({ isFocused, name, ...props }: TabTriggerSlotProps & { name?: string }) {
  const totalPoints = useCultivationStore((state) => state.totalPoints);
  const showBadge = name === 'cultivation' && totalPoints > 0;

  return (
    <Pressable {...props} style={({ pressed }) => [styles.circleWrap, pressed && styles.pressed]}>
      <View style={[styles.circle, isFocused && styles.circleActive]} />
      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalPoints}</Text>
        </View>
      )}
    </Pressable>
  );
}

function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.innerContainer}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 50,
  },
  innerContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  circleWrap: { padding: 4 },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  circleActive: { backgroundColor: '#A8C3A0' },
  pressed: { opacity: 0.7 },
});