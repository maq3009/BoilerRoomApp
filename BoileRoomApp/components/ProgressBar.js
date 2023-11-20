import React from 'react';
import { View } from 'react-native';
import { Rect } from 'react-native-svg'

export default function ProgressBar({ progress }) {

    const barWidth = 230;
    const progresssWidth = (progress / 100) * barWidth;

    return (
        <View>
            <Rect width={barWidth} height={"100%"}/>
            <Rect width={progressWidth} height={'100%'} fill={'#eee'}/>
        </View>
    )


}
