import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import PageHeader from '../../componnents/PageHeader';
import { Feather } from '@expo/vector-icons';
import TeacherItem, { Teacher } from '../../componnents/TeacherItem';
import { TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';


import styles from './styles';

function TeacherList(){
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isFilterVisible, setIsFiltersVisible] = useState(false);

    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(response => {
            if ( response){
                const favotedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favotedTeachers.map( (teacher: Teacher) => {
                    return teacher.id;
                })
                setFavorites(favoritedTeachersIds);
            }
        });
    }

    function handleToggleFiltersVisible() {
        setIsFiltersVisible(!isFilterVisible);
    }

    async function handleFilterSubimit(){
        loadFavorites();

        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time
            }
        });
        setIsFiltersVisible(false);
        setTeachers(response.data);

    }

    return (
        <View style={styles.container}>
            <PageHeader 
                title="Proffys disponíveis" 
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#fff" />
                    </BorderlessButton>
                )}>
                {isFilterVisible && (
                    
                    <View style={styles.searchForm}> 
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                            placeholderTextColor="#c1bccc"
                            style={styles.input}
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            placeholder="Qual a matéria?"
                        />

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput
                                    placeholderTextColor="#c1bccc"
                                    style={styles.input}
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)}
                                    placeholder="Qual o dia?"
                                />
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    placeholderTextColor="#c1bccc"
                                    style={styles.input}
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                    placeholder="Qual o horário?"
                                />
                            </View>
                        </View>
                        <RectButton style={styles.submitButton} onPress={handleFilterSubimit}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return ( 
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                    )
                })}
            </ScrollView>
        </View>
    );
}

export default TeacherList;