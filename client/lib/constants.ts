import AITRADER_ABI_JSON from "./abi/AITrader.json";
import { Abi } from "viem";

export const AITRADER_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AITRADER_CONTRACT_ADDRESS as `0x${string}`;
export const MARKET_ITEM_ADDRESS = process.env.NEXT_PUBLIC_MARKET_ITEM_ADDRESS as `0x${string}`;

export const AITRADER_ABI: Abi = AITRADER_ABI_JSON as Abi;