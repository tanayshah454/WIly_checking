import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Transaction from './screens/TransactionScreen'
import Search from './screens/SearchScreen'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';

export default function App() {
  return (
    <AppContainer/>
  );
}
const TabNavigator=createBottomTabNavigator({
  Transaction:{screen:Transaction},
  Search:{screen:Search}
})
const AppContainer=createAppContainer(TabNavigator)