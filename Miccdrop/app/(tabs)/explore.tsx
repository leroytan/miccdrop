import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Animated } from "react-native";
const { width, height } = Dimensions.get("window");
const AnimatedLinearGradient =
  Animated.createAnimatedComponent<any>(LinearGradient);
const Card = ({ title, imageSource }: any) => {
  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.cardImage} />
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
        location={[0.25, 0.4, 1]}
      />
      <View style={styles.container}>
        {/* Level and Settings */}
        <View style={styles.topBar}>
          <View style={styles.levelIndicator}>
            <Text style={styles.levelText}>Level 8</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.verticalCardsLayout}>
          {/* Top and Trending Row */}
          <View style={styles.horizontalRowLayout}>
            <Card
              title="Top Picks"
              imageSource={require("@/assets/images/topSongs.jpg")}
            />
            <Card
              title="Trending Now"
              imageSource={require("@/assets/images/trendingSongs.jpg")}
            />
          </View>
          {/* Recents */}
          <View style={styles.fullWidthCard}>
            <Card
              title="Recents"
              imageSource={require("@/assets/images/recentSongs.jpg")}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
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
    justifyContent: "space-evenly",
  },
  levelIndicator: {
    backgroundColor: "#fff7ad",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  levelText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsIcon: {
    fontSize: 24,
    color: "#fff",
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
    aspectRatio: 1, // Makes the card square
  },
  fullWidthCard: {
    flexBasis: "100%", // Ensures the card takes the full width
    marginTop: 16,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
});

export default App;
