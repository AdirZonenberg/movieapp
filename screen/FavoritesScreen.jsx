import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/Firebase"; // Import your Firebase app instance

const FavoritesScreen = ({ route }) => {
  const { favorites, setLikedMovies, setLikedSeries } = route.params;
  const [updatedFavorites, setUpdatedFavorites] = useState(favorites);

  const getImageUrl = (posterPath) =>
    `https://image.tmdb.org/t/p/w500/${posterPath}`;

  const handleAddToFirestore = async (movie) => {
    try {
      // Add the favorite movie to Firestore under the "favorites" collection
      await addDoc(collection(db, "favorites"), movie);
      alert("Movie added to favorites!");
    } catch (error) {
      alert("Failed to add the movie to favorites. " + error.message);
    }
  };

  const handleDelete = (id, movie) => {
    // Filter out the item with the given id from the favorites list
    const updatedList = updatedFavorites.filter((item) => item.id !== id);
    setUpdatedFavorites(updatedList);

    // Add the movie to Firestore favorites collection before removing it from the list
    handleAddToFirestore(movie);

    // Update the likedFilms state in the HomeScreen
    // to remove the deleted item from the liked films
    setLikedFilms((prevLikedFilms) => {
      const updatedLikedFilms = { ...prevLikedFilms };
      delete updatedLikedFilms[id];
      return updatedLikedFilms;
    });
  };

  const handlePressItem = async (item) => {
    const baseWebsiteUrl = "https://www.themoviedb.org/";
    const itemType = item.media_type === "movie" ? "movie" : "tv";
    const itemUrl = `${baseWebsiteUrl}${itemType}/${item.id}`;

    // Check if the URL can be opened
    const supported = await Linking.canOpenURL(itemUrl);
    if (supported) {
      // Open the URL in the user's web browser
      await Linking.openURL(itemUrl);
    } else {
      // If the URL can't be opened, show an error message
      alert("Sorry, this link can't be opened.");
    }
  };

  const handleSendToFirestore = async () => {
    try {
      // Check if the user is authenticated
      const user = auth.currentUser;
      if (!user) {
        alert("User not authenticated. Please log in first.");
        return;
      }

      // Create a reference to the user's document in Firestore
      const userDocRef = doc(db, "users", user.uid);

      // Check if the user's document already exists in Firestore
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        // If the document exists, update the "favorites" field with the updatedFavorites array
        await updateDoc(userDocRef, { favorites: updatedFavorites });
      } else {
        // If the document doesn't exist, create it with the "favorites" field
        await setDoc(userDocRef, { favorites: updatedFavorites });
      }
      alert("Favorites sent to Firestore!");
    } catch (error) {
      alert("Failed to send favorites to Firestore. " + error.message);
    }
  };

  useEffect(() => {
    setUpdatedFavorites(favorites);
  }, [route]);

  return (
    <View style={styles.container}>
      {updatedFavorites.length === 0 ? (
        <Text>No favorites yet.</Text>
      ) : (
        <ScrollView>
          {updatedFavorites.map((item) => (
            <View key={item.id} style={styles.favoriteItem}>
              <Image
                source={{ uri: getImageUrl(item.poster_path) }}
                style={styles.poster}
              />
              <TouchableOpacity onPress={() => handlePressItem(item)}>
                <View>
                  <Text style={styles.title}>
                    {item.media_type === "movie" ? item.title : item.name}
                  </Text>
                  {item.media_type === "tv" && (
                    <Text style={styles.subTitle}>TV Series</Text>
                  )}
                  {item.media_type === "movie" && (
                    <Text style={styles.subTitle}>Movie</Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity
        onPress={handleSendToFirestore}
        style={styles.sendButton}
      >
        <Text style={styles.sendButtonText}>Send Favorites to Firestore</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButton: {
    marginRight: 10,
    padding: 5,
    backgroundColor: "#ff0000",
  },
  deleteButtonText: {
    color: "#fff",
  },
  poster: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
  },
  subTitle: {
    fontSize: 14,
    color: "gray",
  },
  sendButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    alignSelf: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default FavoritesScreen;
