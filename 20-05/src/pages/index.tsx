import type { NextPage } from "next";
import { FC } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import { Button } from "@mui/material";
import styles from "../styles/Home.module.css";
import { SignMessage } from "../components/SignMessage";
import { SendTransaction } from "../components/SendTransaction";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Donut ME</title>
        <meta name="description" content="" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.walletButtons}>
          <WalletMultiButtonDynamic />
          <SignMessage />
          <SendTransaction />
        </div>
      </main>
    </div>
  );
};

export default Home;
