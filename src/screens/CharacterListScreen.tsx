import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import CharacterCard from '../component/CharacterCard';
import { Character } from '../types/api.types';
import { getCharacters } from '../services/character.service';

const CharacterListScreen = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getCharacters(1);
                // On prend les 10 premiers pour le test de navigation
                setCharacters(response.data.slice(0, 10));
            } catch (err) {
                console.error('Error fetching characters:', err);
                setError('Erreur lors de la récupération des personnages.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#004a99" />
                <Text style={styles.loadingText}>Chargement des personnages depuis l'API...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Disney Explorer - Mode API</Text>
            <FlatList
                data={characters}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => <CharacterCard item={item} />}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
        paddingTop: 10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        textAlign: 'center',
        marginVertical: 15,
        color: '#004a99',
        letterSpacing: 1,
    },
    list: {
        paddingBottom: 20,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default CharacterListScreen;
