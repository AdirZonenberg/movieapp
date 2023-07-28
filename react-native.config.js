module.exports = {
  dependencies: {
    "@react-native-firebase/app": {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
    "@react-native-firebase/auth": {
      platforms: {
        android: null,
      },
    },
    "@react-native-firebase/firestore": {
      platforms: {
        android: null,
      },
    },
  },
};
