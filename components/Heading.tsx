import React from "react";
import { Text, TextProps } from "react-native";

export const Heading: React.FC<TextProps> = (props) => {
  const getFontFamily = (fontWeight: string | undefined) => {
    if (fontWeight === undefined) {
      return "SF_Regular";
    }

    switch (fontWeight) {
      case "900":
        return "SF_Black";
      case "800":
        return "SF_Heavy";
      case "700":
      case "bold":
        return "SF_Bold";
      case "600":
        return "SF_Semibold";
      case "500":
        return "SF_Medium";
      default:
        return "SF_Regular";
    }
  };

  const passedStyles = Array.isArray(props.style)
    ? Object.assign({}, ...props.style)
    : props.style;

  return (
    <Text
      {...props}
      style={[
        passedStyles,
        {
          fontFamily: getFontFamily(passedStyles?.fontWeight),
        },
      ]}
    >
      {props.children}
    </Text>
  );
};
