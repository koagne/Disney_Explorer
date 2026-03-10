import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CharacterListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Écran de Liste (À implémenter par l'Étudiant C)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CharacterListScreen;
