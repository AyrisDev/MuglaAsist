import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Map Screen</Text>
            <Text style={styles.subtext}>Coming Soon</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#251B15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: Colors.text,
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtext: {
        color: Colors.textSecondary,
        marginTop: 8,
    },
});
