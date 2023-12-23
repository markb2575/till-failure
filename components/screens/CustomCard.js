import { Card } from '@rneui/themed';
import { View, Text, Button } from 'react-native';

export default function CustomCard({screen}) {
    return (
        <Card containerStyle={{
            flex: 1,
            borderRadius: 10,
            marginTop:50,
            marginBottom:10,
            backgroundColor:'#1b1b1b',
            borderWidth:0,
            marginRight:15,
            marginLeft:15,
            paddingTop:15,
            alignItems: 'center'
        }}>
            {screen}
        </Card>
    )
}