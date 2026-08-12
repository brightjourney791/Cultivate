import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ScreenSignHeader from '../components/ScreenSignHeader';
import { useTodayDate } from '../hooks/useTodayDate';
import { useDevDayStore } from '../store/devDayStore';
import { useTaskStore } from '../store/taskStore';
import { useUserStore } from '../store/userStore';

const REPEAT_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'None', value: null },
  { label: 'Daily', value: 1 },
  { label: 'Weekly', value: 7 },
  { label: 'Monthly', value: 30 },
];

export default function TasksScreen() {
  const [inputText, setInputText] = useState('');
  const [repeatValue, setRepeatValue] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editRepeatValue, setEditRepeatValue] = useState<number | null>(null);

  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const advanceDay = useDevDayStore((state) => state.advanceDay);
  const todayDate = useTodayDate();

  const handleAdd = () => {
    const trimmed = inputText.trim();
    if (trimmed.length === 0) return;
    addTask(trimmed, repeatValue);
    setInputText('');
    setRepeatValue(null);
  };

  const startEditing = (id: string, title: string, repeatEveryDays: number | null) => {
    setEditingId(id);
    setEditText(title);
    setEditRepeatValue(repeatEveryDays);
  };

  const saveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed.length === 0 || !editingId) return;
    updateTask(editingId, trimmed, editRepeatValue);
    setEditingId(null);
  };

  return (
    <View style={styles.screen}>
      <Image source={require('../../assets/images/tasks/background.png')} style={styles.background} resizeMode="contain" />
      {/* <Image source={require('../../assets/images/tasks/lantern.png')} style={styles.lantern} resizeMode="contain" /> */}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <ScreenSignHeader title="Tasks" />

        {__DEV__ && (
          <View style={styles.devPanel}>
            <Text style={styles.devText}>Cultivation day: {todayDate}</Text>
            <Pressable onPress={advanceDay} style={styles.devButton}>
              <Text style={styles.devButtonText}>Skip to next day</Text>
            </Pressable>
            <Pressable onPress={() => useUserStore.getState().completeOnboarding()} style={styles.devButton}>
              <Text style={styles.devButtonText}>Test: complete onboarding</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add a task..."
            placeholderTextColor="#9A9184"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <Pressable onPress={handleAdd} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>

        <View style={styles.repeatRow}>
          {REPEAT_OPTIONS.map((option) => (
            <Pressable
              key={option.label}
              onPress={() => setRepeatValue(option.value)}
              style={[styles.repeatChip, repeatValue === option.value && styles.repeatChipActive]}
            >
              <Text style={[styles.repeatChipText, repeatValue === option.value && styles.repeatChipTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks yet — add one above.</Text>
        ) : (
          tasks.map((item) => {
            if (editingId === item.id) {
              return (
                <View key={item.id} style={styles.editCard}>
                  <TextInput
                    style={styles.input}
                    value={editText}
                    onChangeText={setEditText}
                    onSubmitEditing={saveEdit}
                    returnKeyType="done"
                  />
                  <View style={styles.repeatRow}>
                    {REPEAT_OPTIONS.map((option) => (
                      <Pressable
                        key={option.label}
                        onPress={() => setEditRepeatValue(option.value)}
                        style={[styles.repeatChip, editRepeatValue === option.value && styles.repeatChipActive]}
                      >
                        <Text style={[styles.repeatChipText, editRepeatValue === option.value && styles.repeatChipTextActive]}>
                          {option.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <View style={styles.editButtonRow}>
                    <Pressable onPress={saveEdit} style={styles.saveButton}>
                      <Text style={styles.addButtonText}>Save</Text>
                    </Pressable>
                    <Pressable onPress={() => setEditingId(null)} style={styles.cancelButton}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              );
            }

            return (
              <View key={item.id} style={styles.taskRow}>
                <Pressable onPress={() => toggleTask(item.id, todayDate)} style={styles.taskMain}>
                  <View style={[styles.checkbox, item.completed && styles.checkboxChecked]} />
                  <View>
                    <Text style={[styles.taskText, item.completed && styles.taskTextDone]}>{item.title}</Text>
                    {item.repeatEveryDays && (
                      <Text style={styles.repeatLabel}>
                        {item.repeatEveryDays === 1 ? 'Repeats daily' : `Repeats every ${item.repeatEveryDays} days`}
                      </Text>
                    )}
                  </View>
                </Pressable>
                <Pressable onPress={() => startEditing(item.id, item.title, item.repeatEveryDays)} style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>
                <Pressable onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>×</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EAE3D2' },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  lantern: { position: 'absolute', top: 90, right: 20, width: 56, height: 56 / (315 / 1005) },
  scroll: { flex: 1 },
  container: { paddingTop: 170, paddingHorizontal: 20, paddingBottom: 60, maxWidth: 700, width: '100%', alignSelf: 'center', gap: 10 },
  devPanel: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  devText: { color: 'white', fontSize: 12 },
  devButton: { backgroundColor: '#A8C3A0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  devButtonText: { color: '#2C2A24', fontSize: 12, fontWeight: '600' },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: '#3E3A34' },
  addButton: { backgroundColor: '#A8C3A0', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 12 },
  addButtonText: { color: '#3E3A34', fontWeight: '600' },
  repeatRow: { flexDirection: 'row', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  repeatChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.6)' },
  repeatChipActive: { backgroundColor: '#A8C3A0' },
  repeatChipText: { color: '#5C5648', fontSize: 13 },
  repeatChipTextActive: { color: '#2C2A24', fontWeight: '600' },
  emptyText: { color: '#5C5648', textAlign: 'center', marginTop: 20 },
  taskRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, gap: 6 },
  taskMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  editButton: { paddingHorizontal: 8, paddingVertical: 4 },
  editButtonText: { color: '#5C5648', fontSize: 13 },
  deleteButton: { paddingHorizontal: 8, paddingVertical: 4 },
  deleteButtonText: { color: '#B98346', fontSize: 20, fontWeight: '300' },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#A8C3A0' },
  checkboxChecked: { backgroundColor: '#A8C3A0' },
  taskText: { color: '#3E3A34', fontSize: 16 },
  taskTextDone: { textDecorationLine: 'line-through', color: '#9A9184' },
  repeatLabel: { color: '#8A8272', fontSize: 12, marginTop: 2 },
  editCard: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: 12, gap: 8 },
  editButtonRow: { flexDirection: 'row', gap: 8 },
  saveButton: { backgroundColor: '#A8C3A0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  cancelButton: { backgroundColor: 'rgba(0,0,0,0.08)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  cancelButtonText: { color: '#5C5648', fontWeight: '600' },
});