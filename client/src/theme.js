// // color design tokens export
// export const colorTokens = {
//   grey: {
//     0: "#FFFFFF",
//     10: "#F6F6F6",
//     50: "#F0F0F0",
//     100: "#E0E0E0",
//     200: "#C2C2C2",
//     300: "#A3A3A3",
//     400: "#858585",
//     500: "#666666",
//     600: "#4D4D4D",
//     700: "#333333",
//     800: "#1A1A1A",
//     900: "#0A0A0A",
//     1000: "#000000",
//   },
//   primary: {
//     50: "#E6FBFF",
//     100: "#CCF7FE",
//     200: "#99EEFD",
//     300: "#66E6FC",
//     400: "#33DDFB",
//     500: "#00D5FA",
//     600: "#00A0BC",
//     700: "#006B7D",
//     800: "#00353F",
//     900: "#001519",
//   },
// };

// // mui theme settings
// export const themeSettings = (mode) => {
//   return {
//     palette: {
//       mode: mode,
//       ...(mode === "dark"
//         ? {
//             // palette values for dark mode
//             primary: {
//               dark: colorTokens.primary[200],
//               main: colorTokens.primary[500],
//               light: colorTokens.primary[800],
//             },
//             neutral: {
//               dark: colorTokens.grey[100],
//               main: colorTokens.grey[200],
//               mediumMain: colorTokens.grey[300],
//               medium: colorTokens.grey[400],
//               light: colorTokens.grey[700],
//             },
//             background: {
//               default: colorTokens.grey[900],
//               alt: colorTokens.grey[800],
//             },
//           }
//         : {
//             // palette values for light mode
//             primary: {
//               dark: colorTokens.primary[700],
//               main: colorTokens.primary[500],
//               light: colorTokens.primary[50],
//             },
//             neutral: {
//               dark: colorTokens.grey[700],
//               main: colorTokens.grey[500],
//               mediumMain: colorTokens.grey[400],
//               medium: colorTokens.grey[300],
//               light: colorTokens.grey[50],
//             },
//             background: {
//               default: colorTokens.grey[10],
//               alt: colorTokens.grey[0],
//             },
//           }),
//     },
//     typography: {
//       fontFamily: ["Rubik", "sans-serif"].join(","),
//       fontSize: 12,
//       h1: {
//         fontFamily: ["Rubik", "sans-serif"].join(","),
//         fontSize: 40,
//       },
//       h2: {
//         fontFamily: ["Rubik", "sans-serif"].join(","),
//         fontSize: 32,
//       },
//       h3: {
//         fontFamily: ["Rubik", "sans-serif"].join(","),
//         fontSize: 24,
//       },
//       h4: {
//         fontFamily: ["Rubik", "sans-serif"].join(","),
//         fontSize: 20,
//       },
//       h5: {
//         fontFamily: ["Rubik", "sans-serif"].join(","),
//         fontSize: 16,
//       },
//       h6: {
//         fontFamily: ["Rubik", "sans-serif"].join(","),
//         fontSize: 14,
//       },
//     },
//   };
// };

// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff", // manually adjusted
    10: "#f6f6f6", // manually adjusted
    50: "#f0f0f0", // manually adjusted
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000", // manually adjusted
  },
  primary: {
    // light green
    100: "#d0fcf4",
    200: "#a0f9e9",
    300: "#71f5de",
    400: "#41f2d3",
    500: "#12efc8",
    600: "#0ebfa0",
    700: "#0b8f78",
    800: "#076050",
    900: "#043028",
  },
  secondary: {
    // yellow
    50: "#f0f0f0", // manually adjusted
    100: "#fff6e0",
    200: "#ffedc2",
    300: "#ffe3a3",
    400: "#ffda85",
    500: "#ffd166",
    600: "#cca752",
    700: "#997d3d",
    800: "#665429",
    900: "#332a14",
  },
  
};

// function that reverses the color palette
function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.primary[800],
              alt: tokensDark.primary[900],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[0],
              alt: tokensDark.grey[50],
            },
          }),
    },
  };
};
