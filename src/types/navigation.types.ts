import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Detail: { id: number };
};

export type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>;
