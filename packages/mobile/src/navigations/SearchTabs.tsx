import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { X, MagnifyingGlass, CaretLeft } from 'phosphor-react-native';

import {
  BLACK,
  WHITE,
  PRIMARYSTATE,
  WHITE60,
  WHITE12,
} from 'shared/src/colors';
import Funds from '../screens/Search/Funds';
import People from '../screens/Search/People';
import Companies from '../screens/Search/Companies';
import Posts from '../screens/Search/Posts';
import { Body2, Body2Bold, Body3 } from '../theme/fonts';
import PHeader from '../components/common/PHeader';

const Tab = createMaterialTopTabNavigator();

const SearchTabs = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const renderCenter = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <TextInput
            style={styles.textInput}
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.icon}>
            {search ? (
              <TouchableOpacity onPress={() => setSearch('')}>
                <X size={14} color={WHITE} />
              </TouchableOpacity>
            ) : (
              <MagnifyingGlass size={14} color={WHITE} />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.globalContainer}>
      <PHeader
        leftIcon={<CaretLeft size={28} color={WHITE} />}
        onPressLeft={() => navigation.goBack()}
        rightIcon={<View />}
        centerIcon={renderCenter()}
        containerStyle={styles.container}
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.tabBarIndicator,
          tabBarActiveTintColor: WHITE,
          tabBarInactiveTintColor: WHITE60,
          tabBarLabel: ({ focused, color }) => (
            <Text style={[Body2, { color }, focused ? Body2Bold : {}]}>
              {route.name}
            </Text>
          ),
        })}
        initialRouteName="People">
        <Tab.Screen name="People" component={People} />
        <Tab.Screen name="Companies" component={Companies} />
        <Tab.Screen name="Posts" component={Posts} />
        <Tab.Screen name="Funds" component={Funds} />
      </Tab.Navigator>
    </View>
  );
};

export default SearchTabs;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: BLACK,
  },
  tabBar: {
    backgroundColor: BLACK,
    marginTop: 0,
    paddingTop: 0,
    borderBottomColor: WHITE12,
    borderBottomWidth: 1,
  },
  tabBarIndicator: {
    backgroundColor: PRIMARYSTATE,
  },
  textInput: {
    ...Body3,
    color: WHITE,
    height: 34,
    borderColor: WHITE,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    width: '100%',
    alignSelf: 'center',
  },
  headerContainer: {
    alignSelf: 'center',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  textContainer: {
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  icon: {
    position: 'absolute',
    right: 10,
  },
  container: {
    marginTop: 10,
    marginBottom: 0,
  },
});
