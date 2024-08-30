import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignUp } from "@clerk/clerk-expo";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Feather } from "@expo/vector-icons";
import Verification from "@/components/Verification";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignUpScreen = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  //   const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const onSignUpPress = useCallback(async () => {
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert("Error", JSON.stringify(err.errors[0].longMessage, null, 2));
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  }, [
    isLoaded,
    firstName,
    lastName,
    emailAddress,
    password,
    confirmPassword,
    signUp,
  ]);

  const handleEmailChange = (text: string) => {
    setEmailAddress(text);
    if (emailRegex.test(text)) {
      setError(""); // Clear error if email is valid
    } else {
      setError("Invalid email address"); // Set error if email is invalid
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={30} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sign Up</Text>
      </View>

      <View style={styles.formContainer}>
        {!pendingVerification ? (
          <View style={{ gap: 10 }}>
            <TextInput
              autoCapitalize="none"
              placeholder="First Name"
              style={defaultStyles.inputField}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              autoCapitalize="none"
              placeholder="Last Name"
              style={defaultStyles.inputField}
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              autoCapitalize="none"
              placeholder="Email"
              style={defaultStyles.inputField}
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
                onChangeText={setPassword}
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
                placeholder="Confirm Password"
                secureTextEntry={!confirmPasswordVisible}
                style={{ flex: 1, paddingRight: 10 }}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                <Feather
                  name={confirmPasswordVisible ? "eye-off" : "eye"}
                  size={26}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={defaultStyles.btn}
              onPress={onSignUpPress}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size={25} color={Colors.grey} />
              ) : (
                <Text style={defaultStyles.btnText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {/* <TextInput
              placeholder="Verification Code"
              style={defaultStyles.inputField}
              value={code}
              onChangeText={setCode}
            />
            <TouchableOpacity
              style={defaultStyles.btn}
              onPress={onPressVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size={25} color={Colors.grey} />
              ) : (
                <Text style={defaultStyles.btnText}>Verify Email</Text>
              )}
            </TouchableOpacity> */}
            <Verification />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  formContainer: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "jakata-sb",
  },
});

export default SignUpScreen;
