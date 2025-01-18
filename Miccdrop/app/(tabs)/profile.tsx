import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const ProfilePage = () => {
  return (
    <AnimatedLinearGradient
      colors={['#FFDEE9', '#B5FFFC', '#FCE1FF']}
      style={styles.background}
      start={[0, 0]}
      end={[1, 1]}
      
    >
      <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
				<Image
					source={require('../../assets/images/backIcon.png')}
					style={styles.backIcon}
				/>
			</Pressable>
        <Image
          source={require('@/assets/images/profile_pic.jpeg')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.bio}>Music lover. Avid concert-goer. Always exploring new tunes.</Text>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Level</Text>
            <Text style={styles.cardContent}>8</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Songs Sung</Text>
            <Text style={styles.cardContent}>25</Text>
          </View>
        </View>
        <LinearGradient colors={['#f04be5', '#FFB6B6']} start={[0, 0]}
        end={[1, 2]} style={styles.editButton}>
        <TouchableOpacity>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        </LinearGradient>
      </View>
    </AnimatedLinearGradient>
  );
};

const styles = StyleSheet.create({
  backButton: {
		position: 'absolute',
		top: 20,
		left: 20,
		zIndex: 1,
		backgroundColor: '#ffffff',
		borderRadius: 15,
		padding: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	backIcon: {
		width: 20,
		height: 20,
		tintColor: '#344e76',
	},
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#ff6f61',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfilePage;