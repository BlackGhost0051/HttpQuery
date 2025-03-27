import React, {useState, useRef, useEffect} from 'react';
import { Button, TextInput, View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';


import axios from 'axios';
import {useRouter, useLocalSearchParams} from "expo-router";

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();


  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('Headers');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [responseData, setResponseData] = useState('');
  const [history, setHistory] = useState([]);

  const scrollViewRef = useRef(null);

  const methods = ['GET', 'POST', 'PUT', 'DELETE'];

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (params.url) {
      setUrl(decodeURIComponent(params.url));
    }
    if (params.method) {
      setMethod(decodeURIComponent(params.method));
    }
    if (params.headers) {
      setHeaders(JSON.parse(decodeURIComponent(params.headers)));
    }
    if (params.body) {
      setBody(decodeURIComponent(params.body));
    }
  }, [params.url, params.method, params.headers, params.body]);

  const loadHistory = async () => {
    const storedHistory = await AsyncStorage.getItem('requestHistory');
    if(storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  };

  const saveToHistory = async (request) => {
    const updatedHistory = [request, ...history].slice(0, 10); // Limit to 10 items
    setHistory(updatedHistory);
    await AsyncStorage.setItem('requestHistory', JSON.stringify(updatedHistory));
  };


  const makeRequest = async () => {
    if (!url.trim()) {
      console.error('URL cannot be empty.');
      return;
    }

    if (method !== 'GET' && !body.trim()) {
      console.error('Body cannot be empty for POST/PUT requests.');
      return;
    }

    const validHeaders = headers.reduce((acc, { key, value }) => {
      if (key.trim() && value.trim()) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const options = {
      method,
      url,
      headers: Object.keys(validHeaders).length > 0 ? validHeaders : undefined,
      data: method !== 'GET' && body.trim() ? body : undefined,
    };

    setLoading(true);
    try {
      const response = await axios(options);
      if (response.status >= 200 && response.status < 300) {
        // console.log('Response:', response.data);
        // setResponseData(JSON.stringify(response.data, null, 2));
        const responseString = JSON.stringify(response.data, null, 2);

        await saveToHistory({ url, method, headers, body });

        // router.push(`/response?response=${encodeURIComponent(responseString)}`);
        router.push(`/response?status=${response.status}&response=${encodeURIComponent(responseString)}`);
      } else {
        console.error('Failed request with status:', response.status);
        // setResponseData(`Error: Request failed with status ${response.status}`);
        router.push(`/response?status=${response.status}&response=${encodeURIComponent(`Error: Request failed with status ${response.status}`)}`);
      }
    } catch (error) {
      console.error('Error making request:', error);
      // setResponseData(`Error: ${error.message}`);
      // router.push(`/response?response=${encodeURIComponent(`Error: ${error.message}`)}`);
      const errorMessage = `Error: ${error.message}`;
      router.push(`/response?status=Error&response=${encodeURIComponent(errorMessage)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (item) => {
    setUrl(item.url);
    setMethod(item.method);
    setHeaders(item.headers);
    setBody(item.body || '');
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
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  return (
      <View style={styles.container}>
        <ThemedView style={styles.section}>
          <ThemedText type="title">HTTP Request</ThemedText>

          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.methodButton} onPress={() => setShowDropdown(!showDropdown)}>
              <ThemedText style={styles.methodText}>{method} ▼</ThemedText>
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

          <ScrollView ref={scrollViewRef} contentContainerStyle={styles.contentContainer}>
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
                    <TextInput
                        style={styles.bodyInput}
                        multiline
                        placeholder="Enter request body"
                        value={body}
                        onChangeText={setBody}
                    />
                  </>
              )}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button title="Send" onPress={makeRequest} disabled={loading} />
          </View>

          {/* Response Window */}
          {responseData && (
              <View style={styles.responseContainer}>
                <Text style={styles.responseTitle}>Response:</Text>
                <ScrollView style={styles.responseWindow}>
                  <Text style={styles.responseText}>{responseData}</Text>
                </ScrollView>
              </View>
          )}
        </ThemedView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
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
  responseContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  responseTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  responseWindow: {
    maxHeight: 200,
    marginTop: 5,
  },
  responseText: {
    fontFamily: 'Courier New',
    fontSize: 14,
    whiteSpace: 'pre-wrap',
  },
});
