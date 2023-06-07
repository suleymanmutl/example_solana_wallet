import { useNotify } from "./useNotify";
import { Button } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import type { FC } from "react";
import React, { useCallback } from "react";
import { sign } from "tweetnacl";

export const SignMessage: FC = () => {
  const { publicKey, signMessage } = useWallet();
  const notify = useNotify();

  const onClick = useCallback(async () => {
    try {
      if (!publicKey) throw new Error("Wallet not connected!");
      if (!signMessage)
        throw new Error("Wallet does not support message signing!");

      const message = new TextEncoder().encode(
        'Verify to play. \n \n Clicking "Sign" or "Approve" only means you have proved this wallet is owned by you. \n\nThis request will not trigger any blockchain transactions or generate a fee.'
      );
      const signature = await signMessage(message);
      if (!sign.detached.verify(message, signature, publicKey.toBytes()))
        throw new Error("Message signature invalid!");

      notify("success", `Message signature: ${bs58.encode(signature)}`);
    } catch (error: any) {
      notify("error", `Message signing failing: ${error?.message}`);
    }
  }, [publicKey, signMessage, notify]);

  return (
    <Button onClick={onClick} disabled={!publicKey || !signMessage}>
      Play Game
    </Button>
  );
};
