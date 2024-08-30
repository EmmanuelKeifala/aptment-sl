import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { isLoading } from "expo-font";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Page = () => {
  useWarmUpBrowser();

  const router = useRouter();
  const { startOAuthFlow: googleAuth } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: "oauth_facebook",
  });

  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(false);
  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.back();
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  const onSignInPress = useCallback(async () => {
    setIsLoading(true);
    if (!isLoaded) {
      return;
    }
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        setEmailAddress("");
        setPassword("");
        router.replace("/(tabs)/");
      } else {
        setIsLoading(false);
        Alert.alert("An Error occured");
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      setEmailAddress("");
      setPassword("");
      setIsLoading(false);
      if (err.errors[0].longMessage === "Couldn't find your account.")
        Alert.alert("Wrong Email or Password");
      Alert.alert(JSON.stringify(err, null, 2));
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);
  const handleEmailChange = (text: string) => {
    setEmailAddress(text);
    if (emailRegex.test(text)) {
      setError(""); // Clear error if email is valid
    } else {
      setError("Invalid email address"); // Set error if email is invalid
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          marginBottom: 10,
          gap: 80,
          borderRadius: 5,
          backgroundColor: "#F5F5F5",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={30} />
        </TouchableOpacity>
        <Text style={{ fontFamily: "jakata-b", fontSize: 16 }}>
          Log In or Sign Up
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          style={[defaultStyles.inputField]}
          value={emailAddress}
          onChangeText={handleEmailChange}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View
          style={{
            ...defaultStyles.inputField,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <TextInput
            autoCapitalize="none"
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            style={{ flex: 1, paddingRight: 10 }}
            value={password}
            onChangeText={(passText) => setPassword(passText)}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Feather
              name={passwordVisible ? "eye-off" : "eye"}
              size={26}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={defaultStyles.btn}
        onPress={() => onSignInPress()}
      >
        <Text style={defaultStyles.btnText}>
          {loading ? (
            <ActivityIndicator size={25} color={Colors.grey} />
          ) : (
            <Text>Continue</Text>
          )}
        </Text>
      </TouchableOpacity>

      <View style={styles.seperatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text style={styles.seperator}>OR</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
      <View style={{ gap: 20 }}>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Apple)}
        >
          <Ionicons name="logo-apple" size={24} style={defaultStyles.btnIcon} />
          <Text style={styles.btnOutlineText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Google)}
        >
          <Ionicons
            name="logo-google"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Facebook)}
        >
          <Ionicons
            name="logo-facebook"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{ ...styles.btnOutline, marginTop: 50 }}
        onPress={() => router.navigate("/(auth)/sign-up")}
      >
        <FontAwesome5
          name="sign-in-alt"
          size={24}
          style={defaultStyles.btnIcon}
        />
        <Text style={styles.btnOutlineText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 26,
    marginTop: 10,
  },

  seperatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  seperator: {
    fontFamily: "jakata-sb",
    color: Colors.grey,
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "jakata-sb",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "jakata-sb",
  },
});
export default Page;
