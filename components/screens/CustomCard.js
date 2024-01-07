import { Card } from '@rneui/themed';
import { Animated, View } from 'react-native';
import React, { useEffect } from 'react';

export default function CustomCard({ screen, styles }) {
    // useEffect(() => {
    //     if (styles === undefined) return
    //     console.log(styles.backgroundColor)
    // })
    return (
        <Animated.View 
            style={{
                borderRadius: 10,
                backgroundColor: '#242424',
                padding: 0,
                margin: 15,
                // borderColor: 'grey',
                borderWidth: 0,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.4,
                shadowRadius: 2,
                elevation: 5,
                marginBottom:0,
                ...styles
            }}
        >
            {screen}
        </Animated.View>
    );
}
