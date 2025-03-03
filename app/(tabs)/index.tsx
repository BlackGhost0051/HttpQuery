import React, { useState, useRef } from 'react';
import { Button, TextInput, View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('Headers');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);

  const scrollViewRef = useRef(null);

  const methods = ['GET', 'POST', 'PUT', 'DELETE'];

  const makeRequest = async () => {
    // request logic
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const deleteHeader = (index) => {
    if (headers.length > 1) {
      setHeaders(headers.filter((_, i) => i !== index));
    }
  };

  const updateHeader = (index, field, value) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][field] = value;
    setHeaders(updatedHeaders);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'Headers') {
      // Scroll to the headers section
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  return (
      <View style={styles.container}>
        <ThemedView style={styles.section}>
          <ThemedText type="title">HTTP Request</ThemedText>

          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.methodButton} onPress={() => setShowDropdown(!showDropdown)}>
              <Text style={styles.methodText}>{method} ▼</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Enter URL"
                value={url}
                onChangeText={setUrl}
            />
          </View>

          {showDropdown && (
              <View style={styles.dropdownMenu}>
                <FlatList
                    data={methods}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.methodOption}
                            onPress={() => {
                              setMethod(item);
                              setShowDropdown(false);
                            }}
                        >
                          <Text style={styles.methodText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                />
              </View>
          )}

          <View style={styles.tabContainer}>
            <TouchableOpacity
                style={[styles.tabButton, activeTab === 'Headers' && styles.activeTab]}
                onPress={() => handleTabChange('Headers')}
            >
              <Text style={styles.tabText}>Headers</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tabButton, activeTab === 'Body' && styles.activeTab]}
                onPress={() => handleTabChange('Body')}
            >
              <Text style={styles.tabText}>Body</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.content}>
              {activeTab === 'Headers' ? (
                  <>
                    <Text style={styles.sectionTitle}>Headers</Text>
                    {headers.map((header, index) => (
                        <View key={index} style={styles.headerRow}>
                          <TextInput
                              style={styles.headerInput}
                              placeholder="Key"
                              value={header.key}
                              onChangeText={(text) => updateHeader(index, 'key', text)}
                          />
                          <TextInput
                              style={styles.headerInput}
                              placeholder="Value"
                              value={header.value}
                              onChangeText={(text) => updateHeader(index, 'value', text)}
                          />
                          {headers.length > 1 && (
                              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteHeader(index)}>
                                <Text style={styles.deleteButtonText}>✕</Text>
                              </TouchableOpacity>
                          )}
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addHeaderButton} onPress={addHeader}>
                      <Text style={styles.addHeaderText}>+ Add Header</Text>
                    </TouchableOpacity>
                  </>
              ) : (
                  <>
                    <Text style={styles.sectionTitle}>Body</Text>
                    <TextInput style={styles.bodyInput} multiline placeholder="Enter request body" />
                  </>
              )}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button title="Send" onPress={makeRequest} disabled={loading} />
          </View>
        </ThemedView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    padding: 16,
  },
  section: {
    marginBottom: 16,
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  methodButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  methodText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    minWidth: 100,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: '#000',
    borderRadius: 4,
    elevation: 3,
    zIndex: 1,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  methodOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    marginRight: 5,
    borderRadius: 4,
    minWidth: 100,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addHeaderButton: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    borderRadius: 4,
  },
  addHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bodyInput: {
    flex: 1,
    height: 100,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
