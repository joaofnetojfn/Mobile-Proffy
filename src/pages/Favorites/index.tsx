import React, { useState } from 'react';
import { View, ScrollView, AsyncStorage } from 'react-native';
import PageHeader from '../../componnents/PageHeader';
import TeacherItem, { Teacher } from '../../componnents/TeacherItem';
import { useFocusEffect } from '@react-navigation/native';

import styles from './styles';

function Favorites(){
      
    const [favorites, setFavorites] = useState([]);

    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(response => {
            if ( response){
                const favotedTeachers = JSON.parse(response);
                setFavorites(favotedTeachers);
            }
        });
    }

    useFocusEffect(() => {
        loadFavorites();
    });

    return (
        <View style={styles.container}>
            <PageHeader title="Meus proffys favoritos"/>
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                
                {favorites.map((teacher: Teacher) => {
                    return ( 
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher}
                            favorited={true}
                        />
                    )
                })}
            </ScrollView>
        </View>
    )
}

export default Favorites;