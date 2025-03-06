import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

export default function HistoryScreen() {
    const [history, setHistory] = useState([]);
    const router = useRouter();


    const loadHistory = async () => {
        const storedHistory = await AsyncStorage.getItem('requestHistory');
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        } else {
            setHistory([]);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);


    const handleHistoryClick = (item) => {
        router.push(`/?url=${encodeURIComponent(item.url)}&method=${item.method}&headers=${encodeURIComponent(JSON.stringify(item.headers))}&body=${encodeURIComponent(item.body || '')}`);
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Request History</Text>
                <Button title="Reload" onPress={loadHistory} />
            </View>

            <FlatList
                data={history}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.historyItem} onPress={() => handleHistoryClick(item)}>
                        <Text style={styles.historyText}>{item.method} {item.url}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No history found.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        padding: 16,
        backgroundColor: '#000'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    historyItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    historyText: {
        fontSize: 14,
        color: '#fff'
    },
    emptyText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20,
    },
});
