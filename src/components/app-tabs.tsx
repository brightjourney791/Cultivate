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

const TAB_ROUTES = [
  { name: 'index', href: '/' },
  { name: 'tasks', href: '/tasks' },
  { name: 'calendar', href: '/calendar' },
  { name: 'cultivation', href: '/cultivation' },
  { name: 'memoryAlbum', href: '/memoryAlbum' },
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
              <TabButton name={route.name} />
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
      <View style={[styles.circle, isFocused && styles.circleActive]}>
        {name && <Image source={TAB_ICONS[name]} style={styles.icon} resizeMode="contain" />}
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { width: '68%', height: '68%' },
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