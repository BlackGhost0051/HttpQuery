import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

export default function ResponseScreen() {
    const { response } = useLocalSearchParams();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <ScrollView style={styles.responseBox}>
                <Text style={styles.responseText}>{response || 'No response available'}</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#000000',
    },
    backButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,

        marginTop: 30,
        marginBottom: 10,

        backgroundColor: '#000',
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    responseBox: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 4,
    },
    responseText: {
        fontSize: 14,
        fontFamily: 'Courier New',
    },
});
