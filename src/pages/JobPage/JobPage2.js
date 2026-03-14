import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, Linking, Alert } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";

const JobPage2 = ({ route, navigation }) => {
    const { job } = route.params;
    

    const handleApply = () => {
        if (job.apply_link) {
            Linking.openURL(job.apply_link).catch(() =>
                Alert.alert('Error', 'Could not open the application link.')
            );
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#93210A" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                                        style={styles.backBtn}
                                        onPress={() => navigation.goBack()}
                                        activeOpacity={0.75}
                                    >
                                         <Ionicons name="chevron-back" size={22} color="#fff" />
                                    </TouchableOpacity>
                <Text style={styles.headerTitle}>Job Details</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Company Hero Card */}
                <View style={styles.heroCard}>
                    <Image source={{ uri: job.Image }} style={styles.companyImage} resizeMode="cover" />
                    <View style={styles.heroInfo}>
                        <Text style={styles.heroTitle}>{job.title}</Text>
                        <Text style={styles.heroCompany}>{job.company_name}</Text>
                        <Text style={styles.heroLocation}>📍 {job.location}</Text>
                    </View>
                </View>

                {/* Quick Info Row */}
                <View style={styles.quickInfoRow}>
                    <View style={styles.infoChip}>
                        <Text style={styles.infoChipIcon}>💼</Text>
                        <Text style={styles.infoChipText}>{job.job_type}</Text>
                    </View>
                    <View style={styles.infoChip}>
                        <Text style={styles.infoChipIcon}>🎓</Text>
                        <Text style={styles.infoChipText}>{job.experience} yr exp</Text>
                    </View>
                    {job.salary && (
                        <View style={styles.infoChip}>
                            <Text style={styles.infoChipIcon}>💰</Text>
                            <Text style={styles.infoChipText}>{job.salary}</Text>
                        </View>
                    )}
                </View>

                {/* Description Section */}
                {job.description && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Job Description</Text>
                        <Text style={styles.sectionBody}>{job.description}</Text>
                    </View>
                )}

                {/* Skills Section */}
                {job.skills && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Required Skills</Text>
                        <View style={styles.skillsWrap}>
                            {job.skills.split(',').map((skill, i) => (
                                <View key={i} style={styles.skillBadge}>
                                    <Text style={styles.skillBadgeText}>{skill.trim()}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Salary Section */}
                {job.salary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Salary Package</Text>
                        <View style={styles.salaryBox}>
                            <Text style={styles.salaryText}>{job.salary}</Text>
                            <Text style={styles.salaryLabel}>per annum</Text>
                        </View>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Sticky Apply Button */}
            <View style={styles.stickyFooter}>
                <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.85}>
                    <Text style={styles.applyBtnText}>Apply Now 🚀</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F4F2F0',
    },

    // Header
    header: {
        backgroundColor: '#93210A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
     backBtn: {
        padding:10,
        borderRadius:"50%",
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        paddingTop: 15,
    },

    scrollContent: {
        padding: 16,
    },

    // Hero Card
    heroCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#93210A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        marginBottom: 14,
    },
    companyImage: {
        width: '100%',
        height: 160,
        backgroundColor: '#F0EDED',
    },
    heroInfo: {
        padding: 16,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    heroCompany: {
        fontSize: 16,
        fontWeight: '600',
        color: '#93210A',
        marginBottom: 4,
    },
    heroLocation: {
        fontSize: 13,
        color: '#888',
    },

    // Quick Info Row
    quickInfoRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 14,
        flexWrap: 'wrap',
    },
    infoChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    infoChipIcon: {
        fontSize: 14,
    },
    infoChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },

    // Sections
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#93210A',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionBody: {
        fontSize: 14,
        color: '#444',
        lineHeight: 22,
    },

    // Skills
    skillsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillBadge: {
        backgroundColor: '#FFF0EE',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#F5C5BC',
    },
    skillBadgeText: {
        fontSize: 13,
        color: '#93210A',
        fontWeight: '500',
    },

    // Salary Box
    salaryBox: {
        backgroundColor: '#FFF8F7',
        borderRadius: 10,
        padding: 14,
        borderLeftWidth: 4,
        borderLeftColor: '#93210A',
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    salaryText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#93210A',
    },
    salaryLabel: {
        fontSize: 13,
        color: '#888',
    },

    // Sticky Footer
    stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EDE8E6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 10,
    },
    applyBtn: {
        backgroundColor: '#93210A',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    applyBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.4,
    },
});

export default JobPage2;