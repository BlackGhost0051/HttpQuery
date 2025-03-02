import React, { useState } from 'react';
import { Button, TextInput, View, StyleSheet, Text, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const makeRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method,
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <ScrollView style={styles.container}>
        <ThemedView style={styles.section}>
          <ThemedText type="title">HTTP Request</ThemedText>
          <TextInput
              style={styles.input}
              placeholder="Enter URL"
              value={url}
              onChangeText={setUrl}
          />
          <View style={styles.methodContainer}>
            {['GET', 'POST', 'PUT', 'DELETE'].map((m) => (
                <Button
                    key={m}
                    title={m}
                    onPress={() => setMethod(m)}
                    color={method === m ? '#007AFF' : '#ccc'}
                />
            ))}
          </View>
          <Button title="Send Request" onPress={makeRequest} disabled={loading} />
        </ThemedView>
        <ThemedView style={styles.section}>
          <ThemedText type="title">Response</ThemedText>
          <Text style={styles.responseText}>{response}</Text>
        </ThemedView>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  input: {
    color: '#ffffff',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  responseText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
});