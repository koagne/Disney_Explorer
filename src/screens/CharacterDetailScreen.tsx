import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getCharacterById } from '../services/character.service';
import { Character } from '../types/api.types';
import { DetailRouteProp, HomeNavigationProp } from '../types/navigation.types';

const CharacterDetailScreen = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<HomeNavigationProp>();
  const { id } = route.params;

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getCharacterById(id);
        setCharacter(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching character detail:', err);
        setError('Impossible de charger les détails du personnage.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !character) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Personnage non trouvé'}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {character.imageUrl && (
        <Image source={{ uri: character.imageUrl }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{character.name}</Text>
        
        {character.films && character.films.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Films</Text>
            {character.films.map((film, index) => (
              <Text key={`film-${index}`} style={styles.item}>• {film}</Text>
            ))}
          </View>
        )}

        {character.tvShows && character.tvShows.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Séries TV</Text>
            {character.tvShows.map((show, index) => (
              <Text key={`show-${index}`} style={styles.item}>• {show}</Text>
            ))}
          </View>
        )}

        {character.allies && character.allies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alliés</Text>
            {character.allies.map((ally, index) => (
              <Text key={`ally-${index}`} style={styles.item}>• {ally}</Text>
            ))}
          </View>
        )}

        {character.enemies && character.enemies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ennemis</Text>
            {character.enemies.map((enemy, index) => (
              <Text key={`enemy-${index}`} style={styles.item}>• {enemy}</Text>
            ))}
          </View>
        )}

        {character.videoGames && character.videoGames.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jeux Vidéo</Text>
            {character.videoGames.map((game, index) => (
              <Text key={`game-${index}`} style={styles.item}>• {game}</Text>
            ))}
          </View>
        )}

        {character.parkAttractions && character.parkAttractions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attractions</Text>
            {character.parkAttractions.map((attr, index) => (
              <Text key={`attr-${index}`} style={styles.item}>• {attr}</Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0066cc',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  item: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CharacterDetailScreen;
