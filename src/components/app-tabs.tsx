import ProfileModal from '@/features/profile/ProfileModal';
import { useCultivationStore } from '@/store/cultivationStore';
import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from 'expo-router/ui';
import { useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';

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

const lanternImage = require('../../assets/images/profile/lantern.png');
const LANTERN_WIDTH = 90;
const LANTERN_ASPECT_RATIO = 1024 / 1536; // width / height

export default function AppTabs() {
  const [profileOpen, setProfileOpen] = useState(false);
  const swing = useRef(new Animated.Value(0)).current;

  const handleLanternPress = () => {
    swing.setValue(0);
    Animated.sequence([
      Animated.timing(swing, { toValue: 1, duration: 90, useNativeDriver: true }),
      Animated.spring(swing, { toValue: 0, useNativeDriver: true, friction: 3, tension: 120 }),
    ]).start();
    setProfileOpen(true);
  };

  const rotate = swing.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-12deg'] });

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

      <Pressable onPress={handleLanternPress} style={styles.lanternButton}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Image source={lanternImage} style={styles.lanternImage} resizeMode="contain" />
        </Animated.View>
      </Pressable>

      <ProfileModal visible={profileOpen} onClose={() => setProfileOpen(false)} />
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
  innerContainer: { flexDirection: 'row', gap: 20 },
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
  lanternButton: {
    position: 'absolute',
    top: 0,
    right: 16,
    zIndex: 10,
  },
  lanternImage: {
    width: LANTERN_WIDTH,
    height: LANTERN_WIDTH / LANTERN_ASPECT_RATIO,
  },
});