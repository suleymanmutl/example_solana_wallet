import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  SystemProgram,
  Transaction,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction
} from "@solana/web3.js";
import { FC, useCallback } from "react";
import { notify } from "../utils/notifications";
import { useNotificationStore } from "../stores/useNotificationStore";
import { PublicKey } from "@solana/web3.js";


export const SendTransaction: FC = () => {
  const { notifications, set: setNotificationStore } = useNotificationStore();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const receiverPublicKey = "FKNNx3M7epDZvXEzceXGV9qEqTVeVQVbaoLxxkYsopAg";
  

  const onClick = useCallback(async () => {
    if (!publicKey) {
      notify({ type: "error", message: `Wallet not connected!` });
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }

    let signature: TransactionSignature = "";
    try {
      // Create instructions to send, in this case a simple transfer

      const instructions = [
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(receiverPublicKey),
          lamports: 10000000   // 9 "zero" = 1 Solana   ||  8 "zero" = 0.1 Solana 
        })
      ];

      // Get the lates block hash to use on our transaction and confirmation
      let latestBlockhash = await connection.getLatestBlockhash();

      // Create a new TransactionMessage with version and compile it to legacy
      const messageLegacy = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions
      }).compileToLegacyMessage();

      // Create a new VersionedTransacction which supports legacy and v0
      const transaction = new VersionedTransaction(messageLegacy);

      // Send transaction and await for signature
      signature = await sendTransaction(transaction, connection);

      // Send transaction and await for signature
      await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed"
      );

      console.log(signature);
      notify({
        type: "success",
        message: "Transaction successful!",
        txid: signature
      });
    } catch (error: any) {
      notify({
        type: "error",
        message: `Transaction failed!`,
        description: error?.message,
        txid: signature
      });
      console.log("error", `Transaction failed! ${error?.message}`, signature);
      return;
    }
  }, [publicKey, notify, connection, sendTransaction]);

  return (
    <div>
      <div>
        <button onClick={onClick} disabled={!publicKey}>
          <span>Send Transaction</span>
        </button>
      </div>
    </div>
    
  );
};
