import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Edit, Setting2 } from 'iconsax-react-native';
import React, { useEffect, useState, useCallback } from 'react';
import FastImage from 'react-native-fast-image';
import { ProfileData } from '../../../data';
import { ItemSmall } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { fontType, colors } from '../../assets/theme';
import firestore from '@react-native-firebase/firestore';
import { formatNumber } from '../../utils/formatNumber';

const Profile = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [blogData, setBlogData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        const subscriber = firestore()
            .collection('blog')
            .onSnapshot(querySnapshot => {
                const blogs = [];
                querySnapshot.forEach(documentSnapshot => {
                    blogs.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setBlogData(blogs);
                setLoading(false);
            });
        return () => subscriber();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            firestore()
                .collection('blog')
                .onSnapshot(querySnapshot => {
                    const blogs = [];
                    querySnapshot.forEach(documentSnapshot => {
                        blogs.push({
                            ...documentSnapshot.data(),
                            id: documentSnapshot.id,
                        });
                    });
                    setBlogData(blogs);
                });
            setRefreshing(false);
        }, 1500);
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Setting2 color={colors.black()} variant="Linear" size={24} />
                </TouchableOpacity>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    gap: 10,
                    paddingVertical: 20,
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={{ gap: 15, alignItems: 'center' }}>
                    <FastImage
                        style={profile.pic}
                        source={{
                            uri: ProfileData.profilePict,
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <View style={{ gap: 5, alignItems: 'center' }}>
                        <Text style={profile.name}>{ProfileData.name}</Text>
                        <Text style={profile.info}>
                            Member since {ProfileData.createdAt}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                        <View style={{ alignItems: 'center', gap: 5 }}>
                            <Text style={profile.sum}>{ProfileData.blogPosted}</Text>
                            <Text style={profile.tag}>Posted</Text>
                        </View>
                        <View style={{ alignItems: 'center', gap: 5 }}>
                            <Text style={profile.sum}>
                                {formatNumber(ProfileData.following)}
                            </Text>
                            <Text style={profile.tag}>Following</Text>
                        </View>
                        <View style={{ alignItems: 'center', gap: 5 }}>
                            <Text style={profile.sum}>
                                {formatNumber(ProfileData.follower)}
                            </Text>
                            <Text style={profile.tag}>Follower</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={profile.buttonEdit}>
                        <Text style={profile.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingVertical: 10, gap: 10 }}>
                    {loading ? (
                        <ActivityIndicator size={'large'} color={colors.blue()} />
                    ) : (
                        blogData.map((item, index) => <ItemSmall item={item} key={index} />)
                    )}
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => navigation.navigate('AddBlog')}>
                <Edit color={colors.white()} variant="Linear" size={20} />
            </TouchableOpacity>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white(),
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    header: {
        paddingHorizontal: 24,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        height: 52,
        elevation: 8,
        paddingTop: 8,
        paddingBottom: 4,
    },
    title: {
        fontSize: 20,
        fontFamily: fontType['Pjs-ExtraBold'],
        color: colors.black(),
    },
    floatingButton: {
        backgroundColor: colors.blue(),
        padding: 15,
        position: 'absolute',
        bottom: 24,
        right: 24,
        borderRadius: 10,
        shadowColor: colors.blue(),
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,

        elevation: 8,
    },
});
const profile = StyleSheet.create({
    pic: { width: 100, height: 100, borderRadius: 15 },
    name: {
        color: colors.black(),
        fontSize: 20,
        fontFamily: fontType['Pjs-ExtraBold'],
    },
    info: {
        fontSize: 12,
        fontFamily: fontType['Pjs-Regular'],
        color: colors.grey(),
    },
    sum: {
        fontSize: 16,
        fontFamily: fontType['Pjs-SemiBold'],
        color: colors.black(),
    },
    tag: {
        fontSize: 14,
        fontFamily: fontType['Pjs-Regular'],
        color: colors.grey(0.5),
    },
    buttonEdit: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: colors.grey(0.1),
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 14,
        fontFamily: fontType['Pjs-SemiBold'],
        color: colors.black(),
    },
});