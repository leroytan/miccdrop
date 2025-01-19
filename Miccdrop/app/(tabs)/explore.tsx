import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Animated } from "react-native";
import { Link, router } from "expo-router";
const { width, height } = Dimensions.get("window");
const AnimatedLinearGradient =
  Animated.createAnimatedComponent<any>(LinearGradient);

const Card = ({ title, imageSource, href }: any) => {
  return (
    <View style={styles.card}>
      <Link href={href} style={styles.cardImage}>
          <Image source={imageSource} style={styles.cardImage} />
          <Text>{title}</Text>
      </Link>
    </View>
  );
};

const App = () => {
  return (
    <>
      <AnimatedLinearGradient
        colors={['#FFDEE9', '#B5FFFC', '#FCE1FF']}
        style={styles.background}
        start={[0, 0]}
        end={[1, 1]}
      />
      <View style={styles.container}>
        {/* Level and Settings */}
        <View style={styles.topBar}>
          <View style={styles.levelIndicator}>
            <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <Text style={styles.levelText}>Level 8</Text>
            </Pressable>
          </View>
        </View>
        
        <View style={styles.verticalCardsLayout}>
        <View>
          <Text style={styles.headerText}>Choose a category!</Text>
        </View>
          {/* Top and Trending Row */}
          <View style={styles.horizontalRowLayout}>
            {/* Top Picks Card */}
            <Card
              title="Top Picks"
              imageSource={require("@/assets/images/topSongs.jpg")}
              href="/songSelector"
            />
            {/* Trending Now Card */}
            <Card
              title="Trending Now"
              imageSource={require("@/assets/images/trendingSongs.jpg")}
              href="/songSelector"
            />
          </View>
          {/* Recents Card */}
            <Card
              title="Recents"
              imageSource={require("@/assets/images/recentSongs.jpg")}
              href="/songSelector"
              style={styles.fullWidthCard} 
            />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#344e76",
    textAlign: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height,
  },
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    flex: 1,
    //backgroundColor: "#e1b1e8",
    padding: 20,
    paddingVertical: 40,
    paddingTop: 50,
    maxHeight: height,
    
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  horizontalRowLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  verticalCardsLayout: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
  },
  levelIndicator: {
    backgroundColor: "#fff7ad",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 3,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#344e76",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 8,
    flexBasis: "48%",
    maxWidth: "100%",
    aspectRatio: 1, // Makes the card square
  },
  fullWidthCard: {
    flexBasis: "100%", // Ensures the card takes the full width
    marginTop: 16,
    aspectRatio: 2,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    boxShadow: "0px 0px 8px rgb(235, 129, 247)",
    backgroundImage: "linear-gradient(45deg, #ffdeee, #b5fffc)",
    backdropFilter: "blur(4px)",
  },
});

export default App;
