import React, { useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (text: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onSearch(text);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Rechercher un personnage..."
        style={styles.input}
        onChangeText={handleChange}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 0,
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});

export default SearchBar;
