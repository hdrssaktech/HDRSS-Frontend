import {
    View, Text, Image, TouchableOpacity, FlatList,
    StyleSheet, SafeAreaView, StatusBar, TextInput,
    Platform, Dimensions
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, useMemo } from 'react';
import { fetchJobs } from '../../api/api.js';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const isTablet = SCREEN_WIDTH >=600;
const numColumns = isTablet ? 2 : 1;
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

const JobPage1 = ({ navigation }) => {
    const [jobs, setJobs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchJobData = async () => {
        try {
            const res = await fetchJobs();
            setJobs(res.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    useEffect(() => {
        fetchJobData();
    }, []);

    const filteredJobs = useMemo(() => {
        if (!searchQuery.trim()) return jobs;
        const q = searchQuery.toLowerCase();
        return jobs.filter(job =>
            job.title?.toLowerCase().includes(q) ||
            job.company_name?.toLowerCase().includes(q) ||
            job.location?.toLowerCase().includes(q) ||
            job.job_type?.toLowerCase().includes(q) ||
            job.skills?.toLowerCase().includes(q)
        );
    }, [searchQuery, jobs]);

    const renderJobCard = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, isTablet && styles.cardTablet]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('JobPage2', { job: item })}
        >
            {/* Top Row */}
            <View style={styles.cardTop}>
                <Image
                    source={{ uri: item.Image }}
                    style={[styles.companyLogo, isTablet && styles.companyLogoTablet]}
                    resizeMode="cover"
                />
                <View style={styles.cardTitleBlock}>
                    <Text
                        style={[styles.jobTitle, isTablet && styles.jobTitleTablet]}
                        numberOfLines={1}
                    >
                        {item.title}
                    </Text>
                    <Text style={[styles.companyName, isTablet && styles.companyNameTablet]}>
                        {item.company_name}
                    </Text>
                    <Text style={styles.location}>📍 {item.location}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Tags */}
            <View style={styles.tagsRow}>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.job_type}</Text>
                </View>
                <View style={[styles.tag, styles.tagSecondary]}>
                    <Text style={[styles.tagText, { color: '#555' }]}>
                        🎓 {item.experience} yr{item.experience > 1 ? 's' : ''} exp
                    </Text>
                </View>
            </View>

            {/* Button */}
            <View style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>View Details →</Text>
            </View>
        </TouchableOpacity>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>
                Try searching by title, company, location or skills
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#93210A" barStyle="light-content" />

            {/* ── HEADER ── */}
            <View style={styles.header}>
                <View style={styles.headerTopRow}>

                    {/* Back Arrow */}
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.75}
                    >
                         <Ionicons name="chevron-back" size={isTablet ? 30 : 22} color="#fff" />
                    </TouchableOpacity>

                    {/* Title */}
                    <View style={styles.headerTitleBlock}>
                        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
                            Job Openings
                        </Text>
                    </View>

                   
                </View>
            </View>

            {/* ── SEARCH BAR — floats just below header ── */}
            <View style={styles.searchContainer}>
                <View style={styles.searchWrapper}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by title, company, location..."
                        placeholderTextColor="#AAAAAA"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                        clearButtonMode="while-editing"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery('')}
                            style={styles.clearBtn}
                        >
                            <Text style={styles.clearBtnText}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* ── JOB LIST ── */}
            <FlatList
                data={filteredJobs}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderJobCard}
                numColumns={numColumns}
                key={numColumns}
                columnWrapperStyle={isTablet ? styles.columnWrapper : null}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                ListEmptyComponent={renderEmpty}
                keyboardShouldPersistTaps="handled"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F4F2F0',
    },

    /* ── Header ── */
    header: {
        backgroundColor: '#93210A',
        paddingTop: STATUSBAR_HEIGHT + 12,
        paddingHorizontal: 16,
        paddingBottom: 18,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    backBtn: {
        padding:10,
        borderRadius:"50%",
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleBlock: {
        flex: 1,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize:18,
        fontWeight: '800',
        letterSpacing: 0.3,
        marginRight:isTablet ? 40 : 35,
        textAlign: 'center',
    },
    headerTitleTablet: {
        fontSize: 26,
    },
    headerSubtitle: {
        color: '#FFD0C8',
        fontSize: 11,
        marginTop: 1,
    },
    /* ── Search Container (below header) ── */
    searchContainer: {
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 6,
        backgroundColor: '#F4F2F0',
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
    },
    searchIcon: {
        fontSize: 15,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1A1A1A',
        paddingVertical: 0,
    },
    clearBtn: {
        padding: 4,
    },
    clearBtnText: {
        color: '#999',
        fontSize: 13,
        fontWeight: '600',
    },

    /* ── List ── */
    listContainer: {
        padding: isTablet ? 20 : 14,
        paddingTop: 10,
        paddingBottom: 36,
        flexGrow: 1,
    },
    columnWrapper: {
        gap: 14,
    },

    /* ── Card ── */
    card: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: isTablet ? 20 : 15,
        shadowColor: '#93210A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTablet: {
        padding: 20,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    companyLogo: {
        width: 54,
        height: 54,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#EDE8E6',
        backgroundColor: '#F0EDED',
    },
    companyLogoTablet: {
        width: 68,
        height: 68,
        borderRadius: 14,
    },
    cardTitleBlock: {
        flex: 1,
    },
    jobTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    jobTitleTablet: {
        fontSize: 18,
    },
    companyName: {
        fontSize: 13,
        color: '#93210A',
        fontWeight: '600',
        marginBottom: 2,
    },
    companyNameTablet: {
        fontSize: 15,
    },
    location: {
        fontSize: 11,
        color: '#888',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0EDED',
        marginVertical: 11,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 7,
        flexWrap: 'wrap',
        marginBottom: 13,
    },
    tag: {
        backgroundColor: '#FFF0EE',
        borderRadius: 20,
        paddingHorizontal: 11,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#F5C5BC',
    },
    tagSecondary: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E0E0E0',
    },
    tagText: {
        fontSize: 11,
        color: '#93210A',
        fontWeight: '500',
    },
    applyBtn: {
        backgroundColor: '#93210A',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    applyBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13,
        letterSpacing: 0.3,
    },

    /* ── Empty ── */
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#888',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});

export default JobPage1;