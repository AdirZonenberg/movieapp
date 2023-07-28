import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [likedMovies, setLikedMovies] = useState({});
  const [likedSeries, setLikedSeries] = useState({});
  const [favorites, setFavorites] = useState([]);

  const handleSearch = async () => {
    if (searchText.trim() === "") return;

    try {
      const apiKey = "2a9b021c25bee7d8daea244797ae0917"; // Replace with your The Movie Database API key
      const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(
        searchText
      )}&page=1&include_adult=false`;

      const seriesUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(
        searchText
      )}&page=1&include_adult=false`;

      const [movieResponse, seriesResponse] = await Promise.all([
        axios.get(movieUrl),
        axios.get(seriesUrl),
      ]);

      const movies = movieResponse.data.results.map((item) => ({
        ...item,
        media_type: "movie",
      }));
      const series = seriesResponse.data.results.map((item) => ({
        ...item,
        media_type: "tv",
      }));

      setSearchResults([...movies, ...series]);
      setIsSearching(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikeMovie = (movie) => {
    if (!likedMovies[movie.id]) {
      setLikedMovies((prevLikedMovies) => ({
        ...prevLikedMovies,
        [movie.id]: 1,
      }));
      setFavorites((prevFavorites) => [...prevFavorites, movie]);
    }
  };

  const handleLikeSeries = (series) => {
    if (!likedSeries[series.id]) {
      setLikedSeries((prevLikedSeries) => ({
        ...prevLikedSeries,
        [series.id]: 1,
      }));
      setFavorites((prevFavorites) => [...prevFavorites, series]);
    }
  };

  const renderHeartIcon = (item) => {
    if (item.media_type === "movie") {
      return likedMovies[item.id] ? (
        <FontAwesome name="heart" size={14} color="red" />
      ) : (
        <FontAwesome name="heart-o" size={14} color="red" />
      );
    } else if (item.media_type === "tv") {
      return likedSeries[item.id] ? (
        <FontAwesome name="heart" size={14} color="red" />
      ) : (
        <FontAwesome name="heart-o" size={14} color="red" />
      );
    }
  };

  const renderItemLabel = (item) => {
    return item.media_type === "movie" ? (
      <Text style={styles.labelMovie}>Movie</Text>
    ) : (
      <Text style={styles.labelSeries}>TV Series</Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.heartContainer}
          onPress={() =>
            navigation.navigate("Favorites", {
              favorites,
              setLikedMovies,
              setLikedSeries,
            })
          }
        >
          <FontAwesome name="heart-o" size={24} color="red" />
          <Text style={styles.heartCount}>
            {Object.keys(likedMovies).length + Object.keys(likedSeries).length}
          </Text>
        </TouchableOpacity>
      </View>

      {!isSearching && (
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setIsSearching(true)}
        >
          <Text style={styles.searchButtonText}>Enter movie/series name</Text>
        </TouchableOpacity>
      )}

      {isSearching && (
        <>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            placeholder="Enter movie/series name"
            onSubmitEditing={() => handleSearch()}
          />
          <Button title="Search" onPress={handleSearch} />
          <Button title="Hide Search" onPress={() => setIsSearching(false)} />
        </>
      )}

      {searchResults.length > 0 && (
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Movies</Text>
          <FlatList
            data={searchResults.filter((item) => item.media_type === "movie")}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleLikeMovie(item)}>
                <View style={styles.resultItemContainer}>
                  {renderItemLabel(item)}
                  <Text style={styles.resultItem}>
                    {item.title} {renderHeartIcon(item)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            numColumns={1} // Display items in 2 columns (grid format)
          />

          <Text style={styles.sectionTitle}>TV Series</Text>
          <FlatList
            data={searchResults.filter((item) => item.media_type === "tv")}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleLikeSeries(item)}>
                <View style={styles.resultItemContainer}>
                  {renderItemLabel(item)}
                  <Text style={styles.resultItem}>
                    {item.name} {renderHeartIcon(item)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            numColumns={1} // Display items in 2 columns (grid format)
          />
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchButton: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 16,
    color: "#555",
  },
  searchInput: {
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
  },
  resultItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelMovie: {
    backgroundColor: "green",
    color: "#fff",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  labelSeries: {
    backgroundColor: "blue",
    color: "#fff",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  resultItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  heartCount: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "red",
    color: "#fff",
    fontSize: 12,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    textAlign: "center",
    paddingHorizontal: 2,
    zIndex: 1,
  },
});
