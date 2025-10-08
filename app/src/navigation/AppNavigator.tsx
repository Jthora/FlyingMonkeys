import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';

import {LockGateScreen} from '@/screens/LockGate/LockGateScreen';
import {ReadyRoomScreen} from '@/screens/ReadyRoom/ReadyRoomScreen';
import {LiveStackScreen} from '@/screens/LiveStack/LiveStackScreen';
import {VaultScreen} from '@/screens/Vault/VaultScreen';

enableScreens();

export type RootStackParamList = {
  LockGate: undefined;
  ReadyRoom: undefined;
  LiveStack: undefined;
  Vault: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = (): React.JSX.Element => (
  <Stack.Navigator
    initialRouteName="LockGate"
    screenOptions={{
      headerShown: false,
      animation: 'fade',
    }}>
    <Stack.Screen name="LockGate" component={LockGateScreen} />
    <Stack.Screen name="ReadyRoom" component={ReadyRoomScreen} />
    <Stack.Screen name="LiveStack" component={LiveStackScreen} />
    <Stack.Screen name="Vault" component={VaultScreen} />
  </Stack.Navigator>
);
