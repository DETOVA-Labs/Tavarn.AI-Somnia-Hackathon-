"use client"

import { useState, useEffect } from 'react';
import { useReadContract, useWatchContractEvent } from 'wagmi';
import { AITRADER_ABI, AITRADER_CONTRACT_ADDRESS, MARKET_ITEM_ADDRESS } from '@/lib/constants';
import { Asset } from '@/lib/types';

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const { data: inventoryData, isLoading: isInventoryLoading, error: inventoryError, refetch: refetchInventory } = useReadContract({
    address: AITRADER_CONTRACT_ADDRESS,
    abi: AITRADER_ABI,
    functionName: 'getInventory',
    args: [MARKET_ITEM_ADDRESS],

  });

  const { data: priceData, isLoading: isPriceLoading, error: priceError, refetch: refetchPrice } = useReadContract({
    address: AITRADER_CONTRACT_ADDRESS,
    abi: AITRADER_ABI,
    functionName: 'getPrice',
    args: [MARKET_ITEM_ADDRESS],
  });

  useWatchContractEvent({
    address: AITRADER_CONTRACT_ADDRESS,
    abi: AITRADER_ABI,
    onLogs: (logs: any) => {
      const log = logs.find((log: any) => log.args.item === MARKET_ITEM_ADDRESS)
      if (log) {
        refetchPrice();
      }
    },
  });

  useWatchContractEvent({
    address: AITRADER_CONTRACT_ADDRESS,
    abi: AITRADER_ABI,
    eventName: 'ItemBought',
    onLogs: (logs: any) => {
        const log = logs.find((log: any) => log.args.item === MARKET_ITEM_ADDRESS)
        if (log) {
          refetchInventory();
        }
    },
  });

  useWatchContractEvent({
    address: AITRADER_CONTRACT_ADDRESS,
    abi: AITRADER_ABI,
    eventName: 'ItemSold',
    onLogs: (logs: any) => {
        const log = logs.find((log: any) => log.args.item === MARKET_ITEM_ADDRESS)
        if (log) {
          refetchInventory();
        }
    },
  });

  useWatchContractEvent({
    address: AITRADER_CONTRACT_ADDRESS,
    abi: AITRADER_ABI,
    eventName: 'ItemDeposited',
    onLogs: (logs: any) => {
        const log = logs.find((log: any) => log.args.item === MARKET_ITEM_ADDRESS)
        if (log) {
          refetchInventory();
        }
    },
  });

  useWatchContractEvent({
    address: AITRADER_CONTRACT_ADDRESS,
    abi: AITRADER_ABI,
    eventName: 'ItemWithdrawn',
    onLogs: (logs: any) => {
        const log = logs.find((log: any) => log.args.item === MARKET_ITEM_ADDRESS)
        if (log) {
          refetchInventory();
        }
    },
  });

  useEffect(() => {
    if (inventoryData !== undefined && priceData !== undefined) {
      const fetchedAsset: Asset = {
        id: MARKET_ITEM_ADDRESS,
        // MOCK DATA
        name: 'Cyber Katana X-7 (Mock)',
        price: `${Number(priceData) / (10 ** 18)} STT`,
        // MOCK DATA
        image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=600&fit=crop",
        inventory: Number(inventoryData),
      };
      setAssets([fetchedAsset]);
    } else if (!isInventoryLoading && !isPriceLoading) {
      setAssets([]);
    }
  }, [inventoryData, priceData, isInventoryLoading, isPriceLoading]);

  return {
      assets,
      isLoading: isInventoryLoading || isPriceLoading,
      error: inventoryError || priceError
  };
}