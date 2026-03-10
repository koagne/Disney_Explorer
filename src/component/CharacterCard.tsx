import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '../types/navigation.types';
import { Character } from '../types/api.types';

interface CharacterCardProps {
    item: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ item }) => {
    const navigation = useNavigation<HomeNavigationProp>();

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detail', { id: item._id })}
        >
            {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
            ) : (
                <View style={[styles.image, styles.placeholder]}>
                    <Text style={styles.placeholderText}>?</Text>
                </View>
            )}
            <View style={styles.content}>
                <Text style={styles.name}>{item.name}</Text>
                {item.films && item.films.length > 0 && (
                    <Text style={styles.subText} numberOfLines={1}>
                        {item.films[0]}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    placeholder: {
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 20,
        color: '#999',
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    subText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});

export default CharacterCard;
