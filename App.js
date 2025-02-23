import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Voice from '@react-native-community/voice';

const App = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('Press record to start speaking');
    const [actionItems, setActionItems] = useState(['No actions detected yet.']);
    const [meetingSummary, setMeetingSummary] = useState('No summary available.');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [allTranscripts, setAllTranscripts] = useState([]);

    useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechResults = (e) => {
        setTranscript(e.value[0]);
    };

    const onSpeechEnd = (e) => {
        setIsRecording(false);
        setFinalTranscript(transcript);
        setAllTranscripts([...allTranscripts, transcript]);
    };

    const onSpeechError = (e) => {
        Alert.alert('Error', e.error);
    };

    const startRecording = async () => {
        try {
            await Voice.start('en-US');
            setIsRecording(true);
        } catch (e) {
            console.error(e);
        }
    };

    const stopRecording = async () => {
        try {
            await Voice.stop();
            setIsRecording(false);
        } catch (e) {
            console.error(e);
        }
    };

    const generateActionItems = () => {
        const actionKeywords = ['need to', 'should', 'must', 'will', 'todo', 'action item'];
        const sentences = finalTranscript.split(/[.!?]+/).filter(Boolean);
        const actions = sentences.filter(sentence =>
            actionKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
        );
        setActionItems(actions.length > 0 ? actions : ['No specific actions detected in the transcript.']);
    };

    const generateSummary = () => {
        const summary = `
            Meeting transcript contains ${finalTranscript.split(' ').length} words.
            Full transcript:
            ${finalTranscript}
        `;
        setMeetingSummary(summary);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Smart Voice Assistant</Text>
                <Text style={styles.subtitle}>Your intelligent meeting companion</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.recordingControls}>
                    <TouchableOpacity style={styles.buttonPrimary} onPress={startRecording} disabled={isRecording}>
                        <Icon name="microphone" size={20} color="white" />
                        <Text style={styles.buttonText}>Start Recording</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonDanger} onPress={stopRecording} disabled={!isRecording}>
                        <Icon name="stop" size={20} color="white" />
                        <Text style={styles.buttonText}>Stop Recording</Text>
                    </TouchableOpacity>
                </View>

                {isRecording && (
                    <View style={styles.statusIndicator}>
                        <View style={styles.pulse} />
                        <Text>Recording in progress...</Text>
                    </View>
                )}

                <Text style={styles.sectionTitle}>
                    <Icon name="comment" size={20} color="#4F46E5" />
                    Transcription
                </Text>
                <View style={styles.transcriptContainer}>
                    <Text>{transcript}</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>
                    <Icon name="tasks" size={20} color="#4F46E5" />
                    Action Items
                </Text>
                <TouchableOpacity style={styles.buttonPrimary} onPress={generateActionItems}>
                    <Icon name="list-check" size={20} color="white" />
                    <Text style={styles.buttonText}>Generate Action Items</Text>
                </TouchableOpacity>
                <View style={styles.actionsGrid}>
                    {actionItems.map((item, index) => (
                        <View key={index} style={styles.actionItem}>
                            <Text>{item}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>
                    <Icon name="file-alt" size={20} color="#4F46E5" />
                    Meeting Summary
                </Text>
                <TouchableOpacity style={styles.buttonPrimary} onPress={generateSummary}>
                    <Icon name="magic" size={20} color="white" />
                    <Text style={styles.buttonText}>Generate Summary</Text>
                </TouchableOpacity>
                <View style={styles.summaryContent}>
                    <Text>{meetingSummary}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8FAFC',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    recordingControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    buttonPrimary: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4F46E5',
        padding: 15,
        borderRadius: 12,
        justifyContent: 'center',
    },
    buttonDanger: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        padding: 15,
        borderRadius: 12,
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        marginLeft: 10,
        fontWeight: '600',
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        padding: 10,
        borderRadius: 8,
        borderColor: 'rgba(79, 70, 229, 0.2)',
        borderWidth: 1,
        marginBottom: 20,
    },
    pulse: {
        width: 12,
        height: 12,
        backgroundColor: '#10B981',
        borderRadius: 6,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    transcriptContainer: {
        minHeight: 150,
        padding: 15,
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: 'rgba(249, 250, 251, 0.5)',
        marginBottom: 15,
    },
    actionsGrid: {
        marginTop: 15,
    },
    actionItem: {
        backgroundColor: 'rgba(238, 242, 255, 0.7)',
        padding: 15,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#4F46E5',
        marginBottom: 10,
    },
    summaryContent: {
        marginTop: 15,
        padding: 15,
        backgroundColor: 'rgba(249, 250, 251, 0.5)',
        borderRadius: 12,
        borderColor: '#E2E8F0',
        borderWidth: 1,
    },
});

export default App;