import React, {useEffect} from 'react';
import {ActivityIndicator, DataTable} from 'react-native-paper';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import Theme from '../constants/Theme';

const TopSellingItems = () => {
  const {loading, topItems} = useSelector(state => state.topItems);
  const dealItems =
    Array.isArray(topItems) && topItems.length > 0 ? topItems[0] : [];
  const regularItems =
    Array.isArray(topItems) && topItems.length > 0 ? topItems[1] : [];

  // useEffect(() => {
  //   console.log('TopItems', topItems);
  // }, [topItems]);

  if (loading) {
    return (
      <View style={{margin: 60}}>
        <ActivityIndicator size="large" color="#b23b3b" />
      </View>
    );
  }

  return (
    <ScrollView horizontal={false}>
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            {color: Theme.COLORS.ButtonVariant, margin: 10},
          ]}>
          Top 10 Deal Items
        </Text>
        <DataTable>
          <DataTable.Header style={styles.header}>
            <DataTable.Title textStyle={styles.headerText}>
              Item Name
            </DataTable.Title>
            <DataTable.Title numeric textStyle={styles.headerText}>
              Quantity
            </DataTable.Title>
            <DataTable.Title numeric textStyle={styles.headerText}>
              Amount
            </DataTable.Title>
          </DataTable.Header>

          {dealItems.length > 0 ? (
            dealItems.map((item, index) => (
              <DataTable.Row
                key={index}
                style={[
                  styles.row,
                  index % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}>
                <DataTable.Cell>
                  <Text
                    style={[
                      styles.cellText,
                      {flexWrap: 'wrap', color: 'black', width: 150},
                    ]}>
                    {item.SKU_NAME}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric textStyle={styles.cellText}>
                  {item.TotalOrders}
                </DataTable.Cell>
                <DataTable.Cell numeric textStyle={styles.cellText}>
                  {item.GrossAmount.toLocaleString()}
                </DataTable.Cell>
              </DataTable.Row>
            ))
          ) : (
            <Text
              style={{alignSelf: 'center', marginVertical: 20, color: 'black'}}>
              No Data Found.
            </Text>
          )}
        </DataTable>
      </View>
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            {color: Theme.COLORS.ButtonVariant, marginTop: 15, margin: 10},
          ]}>
          Top Regular Items
        </Text>
        <DataTable>
          <DataTable.Header style={styles.header}>
            <DataTable.Title textStyle={styles.headerText}>
              Item Name
            </DataTable.Title>
            <DataTable.Title numeric textStyle={styles.headerText}>
              Quantity
            </DataTable.Title>
            <DataTable.Title numeric textStyle={styles.headerText}>
              Amount
            </DataTable.Title>
          </DataTable.Header>

          {regularItems.length > 0 ? (
            regularItems.map((item, index) => (
              <DataTable.Row
                key={index}
                style={[
                  styles.row,
                  index % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}>
                <DataTable.Cell>
                  <Text
                    style={[
                      styles.cellText,
                      {flexWrap: 'wrap', color: 'black', width: 150},
                    ]}>
                    {item.SKU_NAME}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric textStyle={styles.cellText}>
                  {item.TotalOrders}
                </DataTable.Cell>
                <DataTable.Cell numeric textStyle={styles.cellText}>
                  {item.GrossAmount.toLocaleString()}
                </DataTable.Cell>
              </DataTable.Row>
            ))
          ) : (
            <Text
              style={{alignSelf: 'center', marginVertical: 20, color: 'black'}}>
              No Data Found.
            </Text>
          )}
        </DataTable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    elevation: 4,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#d3d3d3',
  },
  headerText: {
    color: 'black',
    fontSize: 14,
  },
  row: {
    borderBottomWidth: 1,
    padding: 5,
    borderColor: '#eee',
  },
  evenRow: {
    backgroundColor: '#f0f0f0',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  cellText: {
    fontSize: 14,
  },
});

export default TopSellingItems;
