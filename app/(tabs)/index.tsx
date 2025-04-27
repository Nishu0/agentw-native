import DepositSheet from "@/components/DepositSheet";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { Heading } from "@/components/Heading";
import Sheet from "@/components/Sheet";
import TokenCard from "@/components/TokenCard";
import { black } from "@/constants/Colors";
import useWalletData from "@/hooks/useWallet";
import useWalletStore from "@/store/wallet";
import { IToken } from "@/types/wallet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const { handleTokens } = useWalletData();
  const { balance, tokens } = useWalletStore();
  const depositSheetRef = useRef<BottomSheetModal>(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    try {
      handleTokens();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const _RefreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      progressBackgroundColor={"black"}
    />
  );

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.walletSummary}>
          <Heading style={styles.balance}>${balance || "0"}</Heading>
          <View style={styles.buttonContainer}>
            <Button onPress={() => {}} style={styles.button}>
              Withdraw
            </Button>
            <Button
              onPress={() => {
                depositSheetRef.current?.present();
              }}
              style={styles.button}
            >
              Deposit
            </Button>
          </View>
          <Heading style={styles.assetsHeading}>My Assets</Heading>
        </View>
        <FlatList
          renderItem={renderItem}
          data={tokens}
          refreshControl={_RefreshControl}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 12,
            marginTop: 16,
          }}
        />
      </View>
      <Sheet
        style={{
          margin: 16,
        }}
        ref={depositSheetRef}
        snapPoints={[500]}
        detached={true}
        bottomInset={50}
      >
        <DepositSheet />
      </Sheet>
    </Container>
  );
}

const renderItem = ({ item }: { item: IToken }) => <TokenCard token={item} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  walletSummary: {
    alignItems: "center",
    justifyContent: "center",
  },
  balanceTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  balance: {
    fontSize: 48,
    fontWeight: "700",
  },
  change: {
    fontSize: 16,
    color: "green",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    padding: 12,
    borderRadius: 50,
    paddingVertical: 14,
    fontSize: 12,
    backgroundColor: black[800],
  },
  buttonText: {
    color: "white",
  },
  assetBalance: {
    fontWeight: "500",
    fontSize: 16,
  },
  assetChange: {
    fontSize: 14,
    color: "black",
  },
  assetsHeading: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
  },
});
