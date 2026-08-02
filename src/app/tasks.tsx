import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import ScreenSignHeader from '../components/ScreenSignHeader';
import { useTaskStore } from '../store/taskStore';

export default function TasksScreen() {
  const [inputText, setInputText] = useState('');
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const handleAdd = () => {
    const trimmed = inputText.trim();
    if (trimmed.length === 0) return;
    addTask(trimmed);
    setInputText('');
  };

  return (
    <View style={styles.screen}>
      <Image
        source={require('../../assets/images/tasks/background.png')}
        style={styles.background}
        resizeMode="contain"
      />

      <Image
        source={require('../../assets/images/tasks/lantern.png')}
        style={styles.lantern}
        resizeMode="contain"
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <ScreenSignHeader title="Tasks" />
        
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

        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks yet — add one above.</Text>
        ) : (
          tasks.map((item) => (
            <View key={item.id} style={styles.taskRow}>
              <Pressable onPress={() => toggleTask(item.id)} style={styles.taskMain}>
                <View style={[styles.checkbox, item.completed && styles.checkboxChecked]} />
                <Text style={[styles.taskText, item.completed && styles.taskTextDone]}>
                  {item.title}
                </Text>
              </Pressable>
              <Pressable onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>×</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EAE3D2' },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  lantern: {
    position: 'absolute',
    top: 90,
    right: 20,
    width: 56,
    height: 56 / (315 / 1005),
  },
  scroll: { flex: 1 },
  container: { paddingTop: 170, paddingHorizontal: 20, paddingBottom: 60, maxWidth: 700, width: '100%', alignSelf: 'center', gap: 10 },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#3E3A34',
  },
  addButton: { backgroundColor: '#A8C3A0', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 12 },
  addButtonText: { color: '#3E3A34', fontWeight: '600' },
  emptyText: { color: '#5C5648', textAlign: 'center', marginTop: 20 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  taskMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  deleteButton: { paddingHorizontal: 8, paddingVertical: 4 },
  deleteButtonText: { color: '#B98346', fontSize: 20, fontWeight: '300' },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#A8C3A0' },
  checkboxChecked: { backgroundColor: '#A8C3A0' },
  taskText: { color: '#3E3A34', fontSize: 16, flexShrink: 1 },
  taskTextDone: { textDecorationLine: 'line-through', color: '#9A9184' },
});