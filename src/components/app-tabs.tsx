import { useCultivationStore } from '@/store/cultivationStore';
import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
            <TabTrigger name="cultivation" href="/cultivation" asChild>
              <TabButton name="cultivation">Cultivation</TabButton>
            </TabTrigger>
          ))}
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, name, ...props }: TabTriggerSlotProps & { name?: string }) {
  const totalPoints = useCultivationStore((state) => state.totalPoints);
  const showBadge = name === 'cultivation' && totalPoints > 0;

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View style={{ position: 'relative' }}>
        <ThemedView
          type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
          style={styles.tabButtonView}>
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