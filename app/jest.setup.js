/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

const mockReact = require('react');

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => {
    const Navigator = ({children}) =>
      mockReact.createElement(mockReact.Fragment, null, children);
    const Screen = ({children}) =>
      mockReact.createElement(mockReact.Fragment, null, children);

    return {Navigator, Screen};
  },
}));

const {BackHandler} = require('react-native');

jest.spyOn(BackHandler, 'addEventListener').mockImplementation(() => ({
  remove: jest.fn(),
}));
jest
  .spyOn(BackHandler, 'removeEventListener')
  .mockImplementation(() => undefined);
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');

  return {
    ...actual,
    NavigationContainer: ({children}) =>
      mockReact.createElement(mockReact.Fragment, null, children),
  };
});
