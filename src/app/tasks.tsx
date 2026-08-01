import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.header}>Tasks</Text>

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

      <FlatList
        data={tasks}
        keyExtractor={(task) => task.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet — add one above.</Text>}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
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
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E6', paddingTop: 80, paddingHorizontal: 20 },
  header: { fontSize: 24, fontWeight: '600', color: '#3E3A34', marginBottom: 16 },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#3E3A34',
  },
  addButton: { backgroundColor: '#A8C3A0', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 12 },
  addButtonText: { color: '#3E3A34', fontWeight: '600' },
  list: { gap: 10 },
  emptyText: { color: '#9A9184', textAlign: 'center', marginTop: 20 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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