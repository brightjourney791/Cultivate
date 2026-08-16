import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useTodayDate } from '../../hooks/useTodayDate';
import { daysBetween } from '../../services/dayService';
import { getCurrentRealm, useCultivationStore } from '../../store/cultivationStore';
import { useUserStore } from '../../store/userStore';

const backgroundImage = require('../../../assets/images/profile/background.png');
const lanternKeeperImage = require('../../../assets/images/companion/lantern_keeper_open.png');

export default function ProfileModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const userName = useUserStore((state) => state.name);
  const setName = useUserStore((state) => state.setName);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName ?? '');

  const todayDate = useTodayDate();
  const totalPoints = useCultivationStore((state) => state.totalPoints);
  const startDate = useCultivationStore((state) => state.startDate);
  const daysSinceStart = startDate ? daysBetween(startDate, todayDate) : 0;
  const currentRealm = getCurrentRealm(totalPoints, daysSinceStart);

  const scale = useRef(new Animated.Value(0.85)).current;
  const translateY = useRef(new Animated.Value(-24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setNameInput(userName ?? '');
      setEditingName(false);
      scale.setValue(0.85);
      translateY.setValue(-24);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7, tension: 80 }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 7, tension: 80 }),
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleSaveName = () => {
    if (nameInput.trim()) setName(nameInput.trim());
    setEditingName(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={[styles.panel, { opacity, transform: [{ scale }, { translateY }] }]}
          >
            <Image source={backgroundImage} style={styles.background} resizeMode="cover" />

            <ScrollView contentContainerStyle={styles.content}>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>

              <Text style={styles.sectionLabel}>Cultivator</Text>
              {editingName ? (
                <View style={styles.nameEditRow}>
                  <TextInput
                    style={styles.nameInput}
                    value={nameInput}
                    onChangeText={setNameInput}
                    onSubmitEditing={handleSaveName}
                    returnKeyType="done"
                    autoFocus
                  />
                  <Pressable onPress={handleSaveName} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable onPress={() => setEditingName(true)} style={styles.nameRow}>
                  <Text style={styles.nameText}>{userName ?? 'Unnamed'}</Text>
                  <Text style={styles.editHint}>tap to edit</Text>
                </Pressable>
              )}

              <Text style={styles.statLine}>
                {currentRealm.name} · {totalPoints} points · {daysSinceStart} days together
              </Text>

              <View style={styles.divider} />

              <Text style={styles.sectionLabel}>Companion</Text>
              <View style={styles.companionRow}>
                <View style={styles.companionCard}>
                  <Image source={lanternKeeperImage} style={styles.companionImage} resizeMode="contain" />
                  <Text style={styles.companionName}>Lantern Keeper</Text>
                </View>
                <View style={[styles.companionCard, styles.companionCardLocked]}>
                  <Text style={styles.lockedText}>More companions{'\n'}coming soon</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionLabel}>About</Text>
              <Text style={styles.infoLine}>Cultivate v1.0</Text>
              <Pressable onPress={() => {}}>
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Pressable>
              <Pressable onPress={() => {}}>
                <Text style={styles.linkText}>Terms of Service</Text>
              </Pressable>
              <Pressable onPress={() => {}}>
                <Text style={styles.linkText}>Send Feedback</Text>
              </Pressable>
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  panel: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#EAE3D2',
  },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  content: { padding: 24, paddingTop: 60, gap: 6 },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  closeButtonText: { fontSize: 18, color: '#3E3A34', lineHeight: 18 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#8A6A3C', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  nameText: { fontSize: 22, fontWeight: '600', color: '#3E3A34' },
  editHint: { fontSize: 12, color: '#8A8272' },
  nameEditRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  nameInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, color: '#3E3A34' },
  saveButton: { backgroundColor: '#A8C3A0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  saveButtonText: { color: '#2C2A24', fontWeight: '600' },
  statLine: { fontSize: 12, color: '#5C5648', marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 14 },
  companionRow: { flexDirection: 'row', gap: 12 },
  companionCard: { width: 110, backgroundColor: 'rgba(255,255,255,0.55)', borderRadius: 14, padding: 10, alignItems: 'center', gap: 6 },
  companionCardLocked: { justifyContent: 'center', minHeight: 100 },
  companionImage: { width: '100%', height: 80 },
  companionName: { fontSize: 12, fontWeight: '600', color: '#3E3A34', textAlign: 'center' },
  lockedText: { fontSize: 11, color: '#9A9184', textAlign: 'center' },
  infoLine: { fontSize: 12, color: '#5C5648' },
  linkText: { fontSize: 13, color: '#5C7A52', textDecorationLine: 'underline', marginTop: 4 },
});