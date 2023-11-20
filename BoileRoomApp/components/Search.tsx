import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';


interface SearchProps {
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}


const Search: React.FC<SearchProps> = ({ setSearchTerm }) => {

    return(
        <View style={styles.container} >
            <TextInput style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }} placeholder='Search: Part Name/Number'
            onChangeText={(text) => setSearchTerm(text)}
            />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        top: 0,
        width: '70%',
        height: 30,
        borderRadius: 10
    },
});

export default Search;