import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar, TouchableOpacity } from "react-native";
import "react-native-reanimated";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    jakata: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "jakata-sb": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "jakata-b": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "jataka-eb": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack>
      <StatusBar barStyle={"dark-content"} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/login"
        options={{
          presentation: "modal",
          headerShown: false,
          title: "Log in or Sign Up",
          headerTitleStyle: {
            fontFamily: "jakata-sb",
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="listings/[id]"
        options={{ headerTitle: "", headerShown: false }}
      />
      <Stack.Screen
        name="(modals)/search"
        options={{
          headerShown: false,
          animation: "fade",
          presentation: "transparentModal",
          headerLeft: () => (
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
