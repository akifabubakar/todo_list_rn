import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTasksStore } from '../services/zustand/store';
import { Toasts } from '@backpackapp-io/react-native-toast';
import dayjs from 'dayjs';

function Header({ navigation, querydate }) {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingBottom: 20,
      }}>
      <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>
        Todo List
      </Text>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DateList');
        }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          {dayjs(querydate).toISOString() === dayjs().endOf('day').toISOString()
            ? 'Today'
            : new Date(querydate).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function Task({ navigation, ...task }) {
  const updateStatus = useTasksStore(state => state.updateTaskStatus);
  const updateTask = useTasksStore(state => state.updateTaskStatus);

  const { _id, title, description, important, date, completed } = task;

  const onPressCheckbox = () => {
    updateStatus({ _id, completed: !completed });
  };

  return (
    <View style={completed ? styles.completeCard : styles.card}>
      {/* Title , Descsiptiont, Checkbox  */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            navigation.navigate('UpdateTask', { ...task });
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              color: completed ? 'grey' : 'black',
            }}>
            {title}
          </Text>
          <Text style={{ fontWeight: '200', fontSize: 14 }}>{description}</Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            onPress={onPressCheckbox}
            style={completed ? styles.completeCheckbox : styles.checkbox}
          />
        </View>
      </View>

      {/* Label */}
      {important && (
        <View
          style={{
            alignSelf: 'flex-end',
            marginTop: 20,
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: '#FF9B9B',
            borderRadius: 5,
          }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>important</Text>
        </View>
      )}
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const tasks = useTasksStore(state => state.tasks);
  const getTasks = useTasksStore(state => state.getTasks);
  const querydate = useTasksStore(state => state.querydate);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getTasks(dayjs(querydate).toISOString());
    }, 2000);
  }, [getTasks, querydate]);

  useEffect(() => {
    getTasks(dayjs(querydate).toISOString());

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: '#35395B', flex: 1 }}>
      <Header navigation={navigation} querydate={querydate} />
      <View style={{ paddingHorizontal: 10, flex: 1 }}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={tasks}
          renderItem={({ item }) => <Task {...item} navigation={navigation} />}
          keyExtractor={item => item._id}
          contentContainerStyle={{
            paddingBottom: 80,
          }}
          ItemSeparatorComponent={<View style={{ padding: 5 }} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Toasts />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    backgroundColor: '#EAEAEA',
    width: 40,
    height: 40,
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 1,
  },
  completeCheckbox: {
    backgroundColor: '#99BBFF',
    width: 40,
    height: 40,
    borderRadius: 5,
    borderColor: '#397CFF',
    borderWidth: 1,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  completeCard: {
    width: '100%',
    backgroundColor: '#CACACA',
    padding: 10,
    borderRadius: 10,
  },
});
