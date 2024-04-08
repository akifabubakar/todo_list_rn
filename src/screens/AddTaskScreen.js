import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { useTasksStore } from '../services/zustand/store';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { toast, Toasts } from '@backpackapp-io/react-native-toast';
import dayjs from 'dayjs';

function Header() {
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
        Add New Task
      </Text>
    </View>
  );
}

function Input(props) {
  return (
    <TextInput
      {...props}
      style={{
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        paddingTop: 15,
        fontWeight: 'bold',
      }}
    />
  );
}

export default function AddTaskScreen() {
  const addTask = useTasksStore(state => state.addTask);
  const [picker, setpicker] = useState(false);
  const [dateString, setDateString] = useState('Today');

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      date: new Date().toISOString(),
      important: false,
    },
  });

  const important = watch('important');

  const onSubmit = data => {
    let end = dayjs(data.date).endOf('day');

    addTask({
      ...data,
      date: end,
      timestamp: new Date().valueOf(),
    });

    setDateString('Today');
    toast('New task added');
    reset();
  };

  const onSelectDate = date => {
    let today = dayjs().endOf('day').toISOString();
    let selected = dayjs(date).endOf('day').toISOString();

    selected === today
      ? setDateString('Today')
      : setDateString(new Date(selected).toLocaleDateString());

    setValue('date', date);
    setpicker(false);
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#35395B', flex: 1 }}>
      <Header />
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 10,
        }}>
        {/* Title */}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Title"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="title"
        />

        <View style={{ paddingVertical: 5 }} />

        {/* Description */}
        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={4}
            />
          )}
          name="description"
        />

        <View style={{ paddingVertical: 5 }} />

        {/* Date Field */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            flexDirection: 'row',
            overflow: 'hidden',
          }}>
          <View
            style={{ flex: 0.5, paddingHorizontal: 10, paddingVertical: 15 }}>
            <Text style={{ fontWeight: 'bold' }}>Date</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setpicker(true);
            }}
            style={{
              flex: 0.5,
              alignItems: 'center',
              backgroundColor: '#397CFF',
              paddingHorizontal: 10,
              paddingVertical: 15,
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {dateString}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingVertical: 5 }} />

        {/* Important Checkbox */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Text
            style={{ color: 'white', fontWeight: 'bold', paddingRight: 10 }}>
            Important
          </Text>

          <TouchableOpacity
            onPress={() => {
              setValue('important', !important);
            }}
            style={!important ? styles.checkbox : styles.tickCheckbox}
          />
        </View>
      </ScrollView>

      {/* Clear & Add Button */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          paddingVertical: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            setDateString('Today');
            reset();
          }}
          style={{
            backgroundColor: '#FF9D9D',
            paddingVertical: 15,
            paddingHorizontal: 10,
            flex: 0.4,
            borderRadius: 10,
          }}>
          <Text
            style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
            Clear
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!dirtyFields?.title}
          onPress={handleSubmit(onSubmit)}
          style={{
            backgroundColor: dirtyFields?.title ? '#397CFF' : '#CACACA',
            paddingVertical: 15,
            paddingHorizontal: 10,
            flex: 0.4,
            borderRadius: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Add
          </Text>
        </TouchableOpacity>
      </View>

      <DatePicker
        modal
        open={picker}
        date={new Date(getValues('date'))}
        onConfirm={onSelectDate}
        onCancel={() => {
          setpicker(false);
        }}
        mode="date"
      />
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
  tickCheckbox: {
    backgroundColor: '#99BBFF',
    width: 40,
    height: 40,
    borderRadius: 5,
    borderColor: '#397CFF',
    borderWidth: 1,
  },
});
