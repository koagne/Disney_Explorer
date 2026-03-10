import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Share, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getCharacterById } from '../services/character.service';
import { Character } from '../types/api.types';
import { DetailRouteProp, HomeNavigationProp } from '../types/navigation.types';

const { width } = Dimensions.get('window');

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

  const handleOpenSource = () => {
    if (character?.url) {
      Linking.openURL(character.url);
    }
  };

  const handleShare = async () => {
    if (character) {
      try {
        await Share.share({
          message: `Découvre ${character.name} sur Disney Explorer !`,
          url: character.url,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Un peu de magie Disney...</Text>
      </View>
    );
  }

  if (error || !character) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Personnage introuvable'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Retourner à la liste</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stats = [
    { label: 'Films', value: character.films.length + character.shortFilms.length, icon: '🎬' },
    { label: 'Séries', value: character.tvShows.length, icon: '📺' },
    { label: 'Jeux', value: character.videoGames.length, icon: '🎮' },
    { label: 'Alliés', value: character.allies.length, icon: '🤝' },
  ];

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Background/Header Image */}
      <View style={styles.imageContainer}>
        {character.imageUrl ? (
          <Image source={{ uri: character.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.placeholderIcon}>🐭</Text>
          </View>
        )}
        <View style={styles.headerOverlay} />
        <View style={styles.headerContent}>
          <Text style={styles.name}>{character.name}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.glassButton} onPress={handleShare}>
              <Text style={styles.glassButtonText}>Partager 📤</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.glassButton} onPress={handleOpenSource}>
              <Text style={styles.glassButtonText}>Source 🌐</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.contentCard}>
        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Section: Biographie / Infos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ À propos</Text>
          <Text style={styles.bioText}>
            {character.name} est un personnage emblématique de l'univers Disney. 
            Il est apparu dans pas moins de {character.films.length + character.shortFilms.length + character.tvShows.length} productions différentes.
          </Text>
        </View>

        {/* Sections conditionally rendered or with empty state */}
        <Section title="🎬 Productions" icon="🎥" data={[...character.films, ...character.shortFilms]} type="tag" />
        <Section title="📺 Séries TV" icon="📺" data={character.tvShows} type="tag" color="#e8f4fd" textColor="#0066cc" />
        <Section title="🤝 Alliés" icon="🤝" data={character.allies} type="list" />
        <Section title="👿 Ennemis" icon="👿" data={character.enemies} type="list" />
        <Section title="🎮 Jeux Vidéo" icon="🎮" data={character.videoGames} type="tag" color="#fff0f0" textColor="#cc0000" />
        <Section title="🎡 Attractions" icon="🎡" data={character.parkAttractions} type="list" />

        <View style={styles.footer}>
          <Text style={styles.footerText}>ID Unique: {character._id}</Text>
          <TouchableOpacity onPress={handleOpenSource}>
            <Text style={styles.footerLink}>Voir les détails officiels sur DisneyAPI.dev</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Reusable Section Component
const Section = ({ title, icon, data, type, color, textColor }: any) => {
  const isEmpty = !data || data.length === 0;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {isEmpty ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucun(e) {title.toLowerCase()} répertorié(e) pour le moment.</Text>
        </View>
      ) : (
        <View style={type === 'tag' ? styles.tagContainer : {}}>
          {data.map((item: string, index: number) => (
            type === 'tag' ? (
              <View key={index} style={[styles.tag, color ? { backgroundColor: color } : {}]}>
                <Text style={[styles.tagText, textColor ? { color: textColor } : {}]}>{item}</Text>
              </View>
            ) : (
              <Text key={index} style={styles.listItem}>• {item}</Text>
            )
          ))}
        </View>
      )}
    </View>
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
    padding: 30,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  imageContainer: {
    height: 450,
    width: width,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: '#004a99',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 80,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  name: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  actionRow: {
    flexDirection: 'row',
  },
  glassButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  glassButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentCard: {
    marginTop: -30,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: '#fff',
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  tag: {
    backgroundColor: '#fff8e1',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    margin: 4,
  },
  tagText: {
    fontSize: 14,
    color: '#b58105',
    fontWeight: '600',
  },
  listItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
    paddingLeft: 4,
  },
  emptyState: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 20,
    paddingTop: 30,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 14,
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 18,
    color: '#cc0000',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    padding: 15,
    backgroundColor: '#0066cc',
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CharacterDetailScreen;
