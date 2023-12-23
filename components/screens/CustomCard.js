import { Card } from '@rneui/themed';
import { View, Text, Button } from 'react-native';

export default function CustomCard({screen}) {
    return (
        <Card containerStyle={{
            borderRadius: 10,
            backgroundColor: '#1b1b1b',
            padding: 15,
            // marginTop:50,
            // marginBottom:10,
            // backgroundColor:'#1b1b1b',
            borderWidth:0,
            // marginRight:15,
            // marginLeft:15,
            // paddingTop:15,
            alignItems: 'center'
        }}>
            {screen}
        </Card>
    )
}