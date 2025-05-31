import { useSuiClient, useCurrentAccount, useSuiClientContext, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useState } from 'react';

export interface TransactionResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  txId?: string;
  rawResponse?: any;
}

export interface AddVideoParams {
  title: string;
  desc: string;
  cid: string;
  owner: string;
  isShort: boolean;
  videoListId: string;
}

export interface TipVideoParams {
  videoId: number;
  amount: number; // SUI
  videoListId: string;
}

export interface ClaimRewardParams {
  videoId: number;
  amount: number; // SUI
  videoListId: string;
}

export function useWalletAdapter() {
  const currentAccount = useCurrentAccount();
  const clientContext = useSuiClientContext();
  const currentNetwork = clientContext.network || 'testnet';
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [txResult, setTxResult] = useState<TransactionResult>({
    loading: false,
    error: null,
    success: false,
  });

  // Lấy packageId từ env hoặc hardcode
  const PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID || "0x3340a548f7a6aa2056261455ed0af02078efc6f174d77459b74af9961647be49";

  // Transaction handler logic (có thể dùng cho mọi hàm)
  const handleTransaction = async (tx: TransactionBlock) => {
    setTxResult({ loading: true, error: null, success: false });
    try {
      const result = await signAndExecute({ transaction: tx.serialize() });
      setTxResult({ loading: false, error: null, success: true, txId: result.digest, rawResponse: result });
      return { digest: result.digest, success: true, rawResponse: result };
    } catch (err: any) {
      setTxResult({ loading: false, error: err.message || "Giao dịch thất bại", success: false });
      throw err;
    }
  };

  // Add Video
  const addVideo = async (params: AddVideoParams) => {
    if (!currentAccount) throw new Error("Vui lòng kết nối ví Sui");
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${PACKAGE_ID}::VideoPlatform::add_video`,
      arguments: [
        tx.object(params.videoListId),
        tx.pure(params.title),
        tx.pure(params.desc),
        tx.pure(params.cid),
        tx.pure(params.owner),
        tx.pure(params.isShort),
      ],
    });
    return handleTransaction(tx);
  };

  // Tip Video
  const tipVideo = async (params: TipVideoParams) => {
    if (!currentAccount) throw new Error("Vui lòng kết nối ví Sui");
    const tx = new TransactionBlock();
    const amountInMist = BigInt(Math.floor(params.amount * 1_000_000_000));
    const [coin] = tx.splitCoins(tx.gas, [amountInMist]);
    tx.moveCall({
      target: `${PACKAGE_ID}::VideoPlatform::tip`,
      arguments: [
        tx.object(params.videoListId),
        tx.pure(params.videoId),
        coin,
        tx.pure(undefined),
      ],
    });
    return handleTransaction(tx);
  };

  // Claim Reward
  const claimReward = async (params: ClaimRewardParams) => {
    if (!currentAccount) throw new Error("Vui lòng kết nối ví Sui");
    const tx = new TransactionBlock();
    const amountInMist = BigInt(Math.floor(params.amount * 1_000_000_000));
    const [rewardCoin] = tx.splitCoins(tx.gas, [amountInMist]);
    tx.moveCall({
      target: `${PACKAGE_ID}::VideoPlatform::claim_reward`,
      arguments: [
        tx.object(params.videoListId),
        tx.pure(params.videoId),
        rewardCoin,
        tx.pure(undefined),
      ],
    });
    return handleTransaction(tx);
  };

  // Hàm gọi move call init_video_list
  const initVideoList = async () => {
    if (!currentAccount) throw new Error("Vui lòng kết nối ví Sui");
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${PACKAGE_ID}::VideoPlatform::init_video_list`,
      arguments: [
        // Không cần truyền gì thêm, TxContext sẽ tự động inject
      ],
    });
    return handleTransaction(tx);
  };

  return {
    isConnected: !!currentAccount,
    walletAddress: currentAccount?.address,
    network: currentNetwork,
    txResult,
    addVideo,
    tipVideo,
    claimReward,
    initVideoList,
  };
} 