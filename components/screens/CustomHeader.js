import { Card } from '@rneui/themed';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';


//N
export default function CustomHeader({ leftImage, leftNavigate, rightImage, rightNavigate, titleText, navigation, styles }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15, marginTop: 50, alignItems: 'center', ...styles}}>
            <TouchableOpacity onPress={() => navigation.navigate(leftNavigate)}>
                <View style={{ alignItems: 'flex-end' }}>
                    {leftImage}
                </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>{titleText}</Text>
            <TouchableOpacity onPress={() => navigation.navigate(rightNavigate)}>
                <View style={{ alignItems: 'flex-start' }}>
                    {rightImage}
                </View>
            </TouchableOpacity>
        </View>
    )
}