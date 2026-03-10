import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Character } from "../types/api.types";
import { getCharacters, searchCharacters } from "../services/character.service"; // Utilise le service qui prend la page
import CharacterCard from "../component/CharacterCard";
import SearchBar from "../component/SearchBar";

const CharacterListScreen: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (search.trim() === "") {
      fetchCharacters(1, true);
    } else {
      handleSearch(search);
    }
  }, [search]);

  const fetchCharacters = async (pageToFetch: number, initial = false) => {
    try {
      if (initial) setIsLoading(true);
      else setIsFetchingMore(true);
      setError(null);
      const response = await getCharacters(pageToFetch);
      if (response.data) {
        if (initial) {
          setCharacters(response.data);
        } else {
          setCharacters((prev) => [...prev, ...response.data]);
        }
        setHasMore(response.data.length === 50);
      } else {
        setError("Impossible de récupérer les données.");
      }
    } catch (err: any) {
      setError("Erreur lors du chargement des personnages.");
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };
  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setIsLoading(true);
    setError(null);
    setPage(1);
    setCharacters([]); // Vide la liste
    try {
      const response = await searchCharacters(query);
      setCharacters(response.data);
      setHasMore(false); // Désactive le scroll infini en mode recherche
    } catch (err) {
      setError("Erreur lors de la recherche.");
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleEndReached = () => {
    if (!isFetchingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCharacters(nextPage);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <SearchBar onSearch={setSearch} />
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <CharacterCard item={item} />}
          onEndReached={search ? undefined : handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    textAlign: "center",
    color: "red",
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "bold",
    marginTop: 8,
  },
  value: {
    marginLeft: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default CharacterListScreen;
