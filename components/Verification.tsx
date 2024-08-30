import React, { useCallback, useState } from "react";
import {
  Animated,
  Image,
  SafeAreaView,
  Text,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Alert,
  ColorValue,
} from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from "@/constants/VerificationStyles";
import { useSignUp } from "@clerk/clerk-expo";
import { router } from "expo-router";

const { Value, Text: AnimatedText } = Animated;

const CELL_COUNT = 6;
const source = {
  uri: "https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png",
};

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));

interface AnimateCellProps {
  hasValue: boolean;
  index: number;
  isFocused: boolean;
}

const animateCell = ({ hasValue, index, isFocused }: AnimateCellProps) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

const Verification: React.FC = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [value, setValue] = useState<string>("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const onPressVerify = useCallback(async () => {
    if (!isLoaded) return;
    try {
      if (!value) {
        Alert.alert("No Code entered");
        return;
      }
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: value,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(tabs)/");
      } else {
        Alert.alert(
          "Verification Failed",
          "The verification code is incorrect."
        );
        console.error(signUpAttempt);
      }
    } catch (err) {
      Alert.alert("Error", "Verification failed. Please try again.");
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, setActive, signUp, value]);

  const renderCell = ({
    index,
    symbol,
    isFocused,
  }: {
    index: number;
    symbol?: string;
    isFocused: boolean;
  }) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle: ViewStyle & TextStyle = {
      backgroundColor: hasValue
        ? (animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }) as unknown as ColorValue)
        : (animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }) as unknown as ColorValue),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }) as unknown as number,
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tick
    setTimeout(() => {
      animateCell({ hasValue, index, isFocused });
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <Image style={styles.icon} source={source} />
      <Text style={styles.subTitle}>
        Please enter the verification code{"\n"}
        we sent to your email address
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
      <TouchableOpacity style={styles.nextButton} onPress={onPressVerify}>
        <Text style={styles.nextButtonText}>Verify</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Verification;
