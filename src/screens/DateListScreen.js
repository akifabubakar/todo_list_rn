import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTasksStore } from '../services/zustand/store';
import dayjs from 'dayjs';

function Header({ navigation }) {
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
        Select Date
      </Text>

      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const Item = ({ item, navigation }) => {
  const setDate = useTasksStore(state => state.setDate);
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setDate(dayjs(item).endOf('day').toISOString());
        navigation.goBack();
      }}>
      <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>
        {dayjs(item).endOf('day').format('DD/MM/YYYY')}
      </Text>
    </TouchableOpacity>
  );
};

export default function DateListScreen({ navigation }) {
  const getTaskDates = useTasksStore(state => state.getTaskDates);
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    async function getDates() {
      let res = await getTaskDates();
      setItemData(res.data);
    }

    getDates();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: '#35395B', flex: 1 }}>
      <Header navigation={navigation} />
      <View style={styles.grid}>
        {itemData.map((item, id) => {
          return <Item key={id} item={item} navigation={navigation} />;
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginHorizontal: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  item: {
    flex: 1,
    minWidth: 100,
    maxWidth: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',

    // my visual styles; not important for grid
    // padding: 10,
    backgroundColor: '#397CFF',
    marginBottom: 15,
    marginHorizontal: 5,
    borderRadius: 10,
  },
});
