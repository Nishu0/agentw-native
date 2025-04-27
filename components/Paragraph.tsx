import React from "react";
import { Text, TextProps } from "react-native";

export const Paragraph: React.FC<TextProps> = (props) => {
  const getFontFamily = (fontWeight: string | undefined) => {
    if (fontWeight === undefined) {
      return "Inter_Regular";
    }

    switch (fontWeight) {
      case "900":
        return "Inter_Black";
      case "800":
        return "Inter_ExtraBold";
      case "700":
      case "bold":
        return "Inter_Bold";
      case "600":
        return "Inter_SemiBold";
      case "500":
        return "Inter_Medium";
      default:
        return "Inter_Regular";
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
