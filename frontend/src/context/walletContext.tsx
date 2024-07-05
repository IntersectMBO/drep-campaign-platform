import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Address,
  PublicKey,
  RewardAddress,
  TransactionUnspentOutput,
  TransactionUnspentOutputs,
  StakeCredential,
  Value,
} from '@emurgo/cardano-serialization-lib-asmjs';
import { Buffer } from 'buffer';
import * as Sentry from '@sentry/react';
import { useDRepContext } from './drepContext';

import {
  getPubDRepID,
  WALLET_LS_KEY,
  getItemFromLocalStorage,
  setItemToLocalStorage,
  removeItemFromLocalStorage,
} from '@/lib';
import { CardanoApiWallet, VoterInfo } from '@/models/wallet';
import { useSharedContext } from './sharedContext';

interface Props {
  children: React.ReactNode;
}

interface EnableResponse {
  status: string;
  stakeKey?: boolean;
  error?: string;
}
const TIME_TO_EXPIRE_TRANSACTION = 3 * 60 * 1000; // 3 MINUTES
const REFRESH_TIME = 15 * 1000; // 15 SECONDS

type TransactionHistoryItem = {
  transactionHash: string;
  time?: Date;
};

interface CardanoContext {
  address?: string;
  balance?: string;
  disconnectWallet: () => Promise<void>;
  enable: (walletName: string) => Promise<EnableResponse>;
  isEnableLoading: string | null;
  isEnabling: boolean;
  error?: string;
  voter: VoterInfo | undefined;
  isEnabled: boolean;
  pubDRepKey: string;
  dRepID: string;
  walletState: {
    usedAddress: string | undefined;
    changeAddress: undefined | string;
  };
  dRepIDBech32: string;
  isMainnet: boolean;
  stakeKey?: string;
  setVoter: (key: undefined | VoterInfo) => void;
  setStakeKey: (key: string) => void;
  loginSignTransaction: () => Promise<any>;
  stakeKeys: string[];
  walletApi?: CardanoApiWallet;
  delegatedDRepID?: string;
  setDelegatedDRepID: (key: string) => void;
}

type Utxos = {
  txid: any;
  txindx: number;
  amount: string;
  str: string;
  multiAssetStr: string;
  TransactionUnspentOutput: TransactionUnspentOutput;
}[];

const CardanoContext = createContext<CardanoContext>({} as CardanoContext);
CardanoContext.displayName = 'CardanoContext';

function CardanoProvider(props: Props) {
  const { sharedState, updateSharedState } = useSharedContext();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnableLoading, setIsEnableLoading] = useState<string | null>(null);
  const [voter, setVoter] = useState<VoterInfo | undefined>(undefined);
  const [walletApi, setWalletApi] = useState<CardanoApiWallet | undefined>(
    undefined,
  );
  const [isEnabling, setIsEnabling] = useState<boolean>(false);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [pubDRepKey, setPubDRepKey] = useState<string>('');
  const [dRepID, setDRepID] = useState<string>('');
  const [dRepIDBech32, setDRepIDBech32] = useState<string>('');
  const [stakeKey, setStakeKey] = useState<string | undefined>(undefined);
  const [stakeKeys, setStakeKeys] = useState<string[]>([]);
  const [isMainnet, setIsMainnet] = useState<boolean>(false);
  const [registeredStakeKeysListState, setRegisteredPubStakeKeysState] =
    useState<string[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [delegatedDRepID, setDelegatedDRepID] = useState<string | undefined>(
    undefined,
  );
  const [walletState, setWalletState] = useState<{
    changeAddress: undefined | string;
    usedAddress: undefined | string;
  }>({
    changeAddress: undefined,
    usedAddress: undefined,
  });
  useEffect(() => {
    const existingWalletAPI = getItemFromLocalStorage(`${WALLET_LS_KEY}_api`);
    const currentWalletEnabled = getItemFromLocalStorage(
      `${WALLET_LS_KEY}_name`,
    );
    const enableCurrentWallet = async () => {
      if (existingWalletAPI && currentWalletEnabled) {
        setWalletApi(existingWalletAPI);
        await enable(currentWalletEnabled);
      }
    };
    enableCurrentWallet();
  }, []);

  const getChangeAddress = async (enabledApi: CardanoApiWallet) => {
    try {
      const raw = await enabledApi.getChangeAddress();
      const changeAddress = Address.from_bytes(
        Buffer.from(raw, 'hex'),
      ).to_bech32();
      setWalletState((prev) => ({ ...prev, changeAddress }));
    } catch (err) {
      Sentry.captureException(err);
      console.log(err);
    }
  };
  const getBalance = async (enabledApi: CardanoApiWallet) => {
    try {
      const balanceCBORHex = await enabledApi.getBalance();

      const balance = Value.from_bytes(Buffer.from(balanceCBORHex, 'hex'))
        .coin()
        .to_str();
      setWalletState((prev) => ({ ...prev, balance }));
    } catch (err) {
      console.log(err);
    }
  };

  const getUsedAddresses = async (enabledApi: CardanoApiWallet) => {
    try {
      const raw = await enabledApi.getUsedAddresses();
      const rawFirst = raw[0];
      const usedAddress = Address.from_bytes(
        Buffer.from(rawFirst, 'hex'),
      ).to_bech32();
      setWalletState((prev) => ({ ...prev, usedAddress }));
    } catch (err) {
      Sentry.captureException(err);
      console.log(err);
    }
  };

  const getUtxos = async (
    enabledApi: CardanoApiWallet,
  ): Promise<Utxos | undefined> => {
    let Utxos = [];

    try {
      const rawUtxos = await enabledApi.getUtxos();

      for (const rawUtxo of rawUtxos) {
        const utxo = TransactionUnspentOutput.from_bytes(
          Buffer.from(rawUtxo, 'hex'),
        );
        const input = utxo.input();
        const txid = Buffer.from(input.transaction_id().to_bytes()).toString(
          'hex',
        );
        const txindx = input.index();
        const output = utxo.output();
        const amount = output.amount().coin().to_str(); // ADA amount in lovelace
        const multiasset = output.amount().multiasset();
        let multiAssetStr = '';

        if (multiasset) {
          const keys = multiasset.keys(); // policy Ids of thee multiasset
          const N = keys.len();

          for (let i = 0; i < N; i++) {
            const policyId = keys.get(i);
            const policyIdHex = Buffer.from(policyId.to_bytes()).toString(
              'hex',
            );
            const assets = multiasset.get(policyId);
            if (assets) {
              const assetNames = assets.keys();
              const K = assetNames.len();

              for (let j = 0; j < K; j++) {
                const assetName = assetNames.get(j);
                const assetNameString = Buffer.from(
                  assetName.name(),
                ).toString();
                const assetNameHex = Buffer.from(assetName.name()).toString(
                  'hex',
                );
                const multiassetAmt = multiasset.get_asset(policyId, assetName);
                multiAssetStr += `+ ${multiassetAmt.to_str()} + ${policyIdHex}.${assetNameHex} (${assetNameString})`;
              }
            }
          }
        }

        const obj = {
          txid: txid,
          txindx: txindx,
          amount: amount,
          str: `${txid} #${txindx} = ${amount}`,
          multiAssetStr: multiAssetStr,
          TransactionUnspentOutput: utxo,
        };
        Utxos.push(obj);
      }

      return Utxos;
    } catch (err) {
      Sentry.captureException(err);
      console.log(err);
    }
  };

  const enable = useCallback(
    async (walletName: string) => {
      setIsEnableLoading(walletName);
      setIsEnabling(true);
      // todo: use .getSupportedExtensions() to check if wallet supports CIP-95
      if (!isEnabled && walletName) {
        try {
          // Check that this wallet supports CIP-95 connection
          if (!window.cardano[walletName].supportedExtensions) {
            throw new Error('errors.walletNoCIP30Support');
          } else if (
            !window.cardano[walletName].supportedExtensions.some(
              (item) => item.cip === 95,
            )
          ) {
            throw new Error('errors.walletNoCIP30Nor90Support');
          }
          // Enable wallet connection
          const enabledApi = await window.cardano[walletName]
            .enable({
              extensions: [{ cip: 95 }],
            })
            .catch((e) => {
              Sentry.captureException(e);
              throw e.info;
            });
          await getChangeAddress(enabledApi);
          await getUsedAddresses(enabledApi);
          setIsEnabled(true);
          setWalletApi(enabledApi);
          // Check if wallet has enabled the CIP-95 extension
          const enabledExtensions = await enabledApi.getExtensions();
          if (!enabledExtensions.some((item) => item.cip === 95)) {
            throw new Error('errors.walletNoCIP95FunctionsEnabled');
          }
          const network = await enabledApi.getNetworkId();
          setIsMainnet(network == 1);
          //Check and set wallet balance
          await getBalance(enabledApi);
          // Check and set wallet address
          const usedAddresses = await enabledApi.getUsedAddresses();
          const unusedAddresses = await enabledApi.getUnusedAddresses();
          if (!usedAddresses.length && !unusedAddresses.length) {
            throw new Error('errors.noAddressesFound');
          }
          if (!usedAddresses.length) {
            const rawFirst = unusedAddresses[0];
            const unusedAddress = Address.from_bytes(
              Buffer.from(rawFirst, 'hex'),
            ).to_bech32();
            setAddress(unusedAddress);
          } else {
            const rawFirst = usedAddresses[0];
            const usedAddress = Address.from_bytes(
              Buffer.from(rawFirst, 'hex'),
            ).to_bech32();
            setAddress(usedAddress);
          }

          const registeredStakeKeysList =
            await enabledApi.cip95.getRegisteredPubStakeKeys();
          setRegisteredPubStakeKeysState(registeredStakeKeysList);

          const unregisteredStakeKeysList =
            await enabledApi.cip95.getUnregisteredPubStakeKeys();

          let stakeKeysList;
          if (registeredStakeKeysList.length > 0) {
            stakeKeysList = registeredStakeKeysList.map((stakeKey) => {
              const stakeKeyHash = PublicKey.from_hex(stakeKey).hash();
              const stakeCredential =
                StakeCredential.from_keyhash(stakeKeyHash);
              if (network === 1)
                return RewardAddress.new(1, stakeCredential)
                  .to_address()
                  .to_hex();
              else
                return RewardAddress.new(0, stakeCredential)
                  .to_address()
                  .to_hex();
            });
          } else {
            console.warn('warnings.usingUnregisteredStakeKeys');
            stakeKeysList = unregisteredStakeKeysList.map((stakeKey) => {
              const stakeKeyHash = PublicKey.from_hex(stakeKey).hash();
              const stakeCredential =
                StakeCredential.from_keyhash(stakeKeyHash);
              if (network === 1)
                return RewardAddress.new(1, stakeCredential)
                  .to_address()
                  .to_hex();
              else
                return RewardAddress.new(0, stakeCredential)
                  .to_address()
                  .to_hex();
            });
          }

          setStakeKeys(stakeKeysList);

          let stakeKeySet = false;
          const savedStakeKey = getItemFromLocalStorage(
            `${WALLET_LS_KEY}_stake_key`,
          );
          if (savedStakeKey && stakeKeysList.includes(savedStakeKey)) {
            setStakeKey(savedStakeKey);
            stakeKeySet = true;
          } else if (stakeKeysList.length === 1) {
            setStakeKey(stakeKeysList[0]);

            setItemToLocalStorage(
              `${WALLET_LS_KEY}_stake_key`,
              stakeKeysList[0],
            );
            stakeKeySet = true;
          }
          const dRepIDs = await getPubDRepID(enabledApi);
          setPubDRepKey(dRepIDs?.dRepKey || '');
          setDRepID(dRepIDs?.dRepID || '');
          setDRepIDBech32(dRepIDs?.dRepIDBech32 || '');
          setItemToLocalStorage(`${WALLET_LS_KEY}_name`, walletName);
          setItemToLocalStorage(`${WALLET_LS_KEY}_api`, enabledApi);
          setIsEnabling(false);
          updateSharedState({ isWalletListModalOpen: false });
          return { status: 'ok', stakeKey: stakeKeySet };
        } catch (e) {
          Sentry.captureException(e);
          console.error(e);
          setError(`${e}`);
          setAddress(undefined);
          setWalletApi(undefined);
          setPubDRepKey('');
          setStakeKey(undefined);
          setIsEnabled(false);
          setIsEnabling(false);
          throw {
            status: 'ERROR',
            error: `${e == undefined ? 'errors.somethingWentWrong' : e}`,
          };
        } finally {
          setIsEnableLoading(null);
        }
      }
      setIsEnabling(false);
      throw { status: 'ERROR', error: 'errors.somethingWentWrong' };
    },
    [isEnabled, stakeKeys],
  );
  //implement sign transaction to determine whether the public key owner is the same owner of the secret key
  const loginSignTransaction = async () => {
    try {
      //get the public key of the wallet
      const drepPubKey = dRepID;
      const payloadBuffer=Buffer.from(`Verify DRep ${dRepIDBech32}`).toString('hex');
      const sign = await walletApi.signData(drepPubKey,payloadBuffer );
      return sign;
    } catch (e) {
      Sentry.captureException(e);
      console.error(e);
      throw e;
    }
  };

  const disconnectWallet = useCallback(async () => {
    removeItemFromLocalStorage(`${WALLET_LS_KEY}_name`);
    removeItemFromLocalStorage(`${WALLET_LS_KEY}_stake_key`);
    removeItemFromLocalStorage(`${WALLET_LS_KEY}_api`);
    setWalletApi(undefined);
    setAddress(undefined);
    setStakeKey(undefined);
    setIsEnabled(false);
  }, []);

  const getTxUnspentOutputs = useCallback(async (utxos: Utxos) => {
    let txOutputs = TransactionUnspentOutputs.new();
    for (const utxo of utxos) {
      txOutputs.add(utxo.TransactionUnspentOutput);
    }
    return txOutputs;
  }, []);
  const value = useMemo(
    () => ({
      address,
      walletState,
      enable,
      voter,
      isEnabled,
      isMainnet,
      disconnectWallet,
      loginSignTransaction,
      dRepID,
      dRepIDBech32,
      pubDRepKey,
      stakeKey,
      setVoter,
      setStakeKey,
      stakeKeys,
      walletApi,
      error,
      delegatedDRepID,
      setDelegatedDRepID,
      isEnableLoading,
      isEnabling,
      sharedState,
    }),
    [
      address,
      enable,
      isEnabling,
      walletState,
      voter,
      isEnabled,
      isMainnet,
      disconnectWallet,
      dRepID,
      dRepIDBech32,
      pubDRepKey,
      stakeKey,
      setVoter,
      setStakeKey,
      stakeKeys,
      walletApi,
      error,
      delegatedDRepID,
      setDelegatedDRepID,
      sharedState,
      isEnableLoading,
    ],
  );

  return <CardanoContext.Provider value={value} {...props} />;
}

function useCardano() {
  const context = useContext(CardanoContext);

  if (context === undefined) {
    throw new Error('errors.useCardano');
  }

  const enable = useCallback(
    async (walletName: string) => {
      try {
        const result = await context.enable(walletName);
        if (!result.error) {
          console.log('No error found!');
          if (result.stakeKey) {
            console.log('alerts.walletConnected', 3000);
          }
          return result;
        }
      } catch (e: any) {
        Sentry.captureException(e);
        await context.disconnectWallet();
        throw e;
      }
    },
    [context, context.isEnabled],
  );

  const disconnectWallet = useCallback(async () => {
    await context.disconnectWallet();
  }, [context]);

  return { ...context, enable, disconnectWallet };
}

export { CardanoProvider, useCardano };
