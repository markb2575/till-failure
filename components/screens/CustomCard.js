import { Card } from '@rneui/themed';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';


export default function CustomCard({ screen, marginRight, marginLeft, marginBottom, marginTop }) {
    return (
        <Card containerStyle={{
            borderRadius: 10,
            backgroundColor: '#1b1b1b',
            padding: 0,
            borderWidth: 0,
            // alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.4,
            shadowRadius: 2,
            elevation: 5,
            marginRight: marginRight !== null ? marginRight : null,
            marginLeft: marginLeft !== null ? marginLeft : null,
            marginBottom: marginBottom !== null ? marginBottom : null,
            marginTop: marginTop !== null ? marginTop : null,
        }}>
            {screen}
        </Card>
    )
}