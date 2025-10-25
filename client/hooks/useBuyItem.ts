"use client";

import { useWriteContract } from 'wagmi';
import { AITRADER_ABI, AITRADER_CONTRACT_ADDRESS } from '@/lib/constants';
import { toast } from 'sonner';

export function useBuyItem() {
  const { writeContract, isPending, isSuccess, isError, error } = useWriteContract();

  const buyItem = async ({ item, qty }: { item: `0x${string}`, qty: number }) => {
    if (!item || qty <= 0) {
      toast.error("Invalid item or quantity.");
      return;
    }

    writeContract({
      address: AITRADER_CONTRACT_ADDRESS,
      abi: AITRADER_ABI,
      functionName: 'buyItem',
      args: [item, BigInt(qty)],
    }, {
      onSuccess: () => {
        toast.success('Purchase successful!');
      },
      onError: (err) => {
        toast.error(`Purchase failed: ${err.message}`);
      }
    });
  };

  return { buyItem, isPending, isSuccess, isError, error };
}
