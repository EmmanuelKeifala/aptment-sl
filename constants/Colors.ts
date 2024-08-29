const tintColorLight = "#4CAF50"; // A calming green for primary actions.
const tintColorDark = "#BB86FC"; // A vibrant purple for dark mode highlights.

export default {
  light: {
    text: "#333", // Darker gray for better readability.
    background: "#F5F5F5", // Light gray background to reduce strain on the eyes.
    tint: tintColorLight,
    tabIconDefault: "#8E8E8E", // Neutral gray for inactive icons.
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#E0E0E0", // Light gray text for better contrast.
    background: "#121212", // Dark background for true dark mode experience.
    tint: tintColorDark,
    tabIconDefault: "#666666", // Dimmed gray for inactive icons in dark mode.
    tabIconSelected: tintColorDark,
  },
};
