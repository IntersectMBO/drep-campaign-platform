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
  Transaction,
  TransactionUnspentOutput,
  TransactionUnspentOutputs,
  Value,
  StakeCredential,
  TransactionBuilder,
  TransactionBuilderConfigBuilder,
  LinearFee,
  BigNum,
  TransactionOutput,
  TransactionWitnessSet,
} from "@emurgo/cardano-serialization-lib-asmjs";
import { Buffer } from 'buffer';

import {
  getPubDRepID,
  WALLET_LS_KEY,
  getItemFromLocalStorage,
  setItemToLocalStorage,
  removeItemFromLocalStorage,
} from '@/lib';
import { CardanoApiWallet, Protocol, VoterInfo } from '@/models/wallet';
import { useSharedContext } from './sharedContext';
import getEpochParams from '@/services/requests/getEpochParams';

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
  latestEpoch?: number;
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
    balance: number | undefined;
  };
  loginCredentials: {
    signature: string | undefined;
    vkey: string | undefined;
  };
  dRepIDBech32: string;
  isGettingSignatures: boolean;
  isMainnet: boolean;
  stakeKey?: string;
  stakeKeyBech32?: string;
  setVoter: (key: undefined | VoterInfo) => void;
  setStakeKey: (key: string) => void;
  loginSignTransaction: () => Promise<any>;
  loginHardwareWalletTransaction: () => Promise<any>;
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
  const [stakeKeyBech32, setStakeKeyBech32] = useState<string | undefined>(
    undefined,
  );
  const [stakeKeys, setStakeKeys] = useState<string[]>([]);
  const [isMainnet, setIsMainnet] = useState<boolean>(false);
  const [isGettingSignatures, setIsGettingSignatures] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState<{
    signature: string;
    vkey: string;
  } | null>(null);

  const [latestEpoch, setLatestEpoch] = useState<number>(0);
  const [registeredStakeKeysListState, setRegisteredPubStakeKeysState] =
    useState<string[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [delegatedDRepID, setDelegatedDRepID] = useState<string | undefined>(
    undefined,
  );
  const [walletState, setWalletState] = useState<{
    changeAddress: undefined | string;
    usedAddress: undefined | string;
    balance: number | undefined;
  }>({
    changeAddress: undefined,
    usedAddress: undefined,
    balance: undefined,
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
    const getLatestEpoch = async () => {
      const protocol = await getEpochParams();
      setLatestEpoch(protocol.epoch);
    };
    getLatestEpoch();
  }, []);
  useEffect(() => {
    if (sharedState?.loginCredentials?.signature) {
      setLoginCredentials({
        signature: sharedState?.loginCredentials?.signature,
        vkey: sharedState?.loginCredentials?.key,
      });
    }
  }, [sharedState?.loginCredentials?.signature]);

  const getChangeAddress = async (enabledApi: CardanoApiWallet) => {
    try {
      const raw = await enabledApi.getChangeAddress();
      const changeAddress = Address.from_bytes(
        Buffer.from(raw, 'hex'),
      ).to_bech32();
      setWalletState((prev) => ({ ...prev, changeAddress }));
    } catch (err) {
      console.log(err);
    }
  };
  const getBalance = async (enabledApi: CardanoApiWallet) => {
    try {
      const balanceCBORHex = await enabledApi.getBalance();
      const balance = Number(
        Value.from_bytes(Buffer.from(balanceCBORHex, 'hex')).coin().to_str(),
      );
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
      console.log(err);
    }
  };
  const setEpochParams = async () => {
    try {
      const protocol = await getEpochParams();
      setItemToLocalStorage('protocolParams', protocol);
      return protocol;
    } catch (err) {
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
            setAddress(unusedAddresses[0]);
          } else {
            setAddress(usedAddresses[0]);
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
            const stakeAddress = Address.from_bytes(
              Buffer.from(savedStakeKey, 'hex'),
            ).to_bech32();
            setStakeKeyBech32(stakeAddress);
            stakeKeySet = true;
          } else if (stakeKeysList.length === 1) {
            setStakeKey(stakeKeysList[0]);
            const stakeAddress = Address.from_bytes(
              Buffer.from(stakeKeysList[0], 'hex'),
            ).to_bech32();
            setStakeKeyBech32(stakeAddress);
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
          await setEpochParams();
          setItemToLocalStorage(`${WALLET_LS_KEY}_name`, walletName);
          setItemToLocalStorage(`${WALLET_LS_KEY}_api`, enabledApi);
          setIsEnabling(false);
          updateSharedState({ isWalletListModalOpen: false });
          return { status: 'ok', stakeKey: stakeKeySet };
        } catch (e) {
          console.error(e);
          setError(`${e}`);
          setAddress(undefined);
          setWalletApi(undefined);
          setPubDRepKey('');
          setStakeKey(undefined);
          setStakeKeyBech32(undefined);
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
    if (!walletApi) return;
    setIsGettingSignatures(true);
    try {
      const payloadBuffer = Buffer.from(`Verify DRep ${dRepIDBech32}`).toString(
        'hex',
      );
      const sign = await walletApi.signData(address, payloadBuffer);
      const { signature, key } = sign;
      setLoginCredentials({ signature, vkey: key });
      setIsGettingSignatures(false);
      return { signature, key };
    } catch (e) {
      console.error(e);
      setIsGettingSignatures(false);
      throw e;
    }
  };
  const initTransactionBuilder = async () => {
    const protocolParams = getItemFromLocalStorage(
      'protocolParams',
    ) as Protocol;
    if (!protocolParams) {
      await getEpochParams();
      throw new Error('No protocol params found');
    }
    const txBuilder = TransactionBuilder.new(
      TransactionBuilderConfigBuilder.new()
        .fee_algo(
          LinearFee.new(
            BigNum.from_str(String(protocolParams.min_fee_a)),
            BigNum.from_str(String(protocolParams.min_fee_b)),
          ),
        )
        .pool_deposit(BigNum.from_str(protocolParams.pool_deposit))
        .key_deposit(BigNum.from_str(protocolParams.key_deposit))
        .coins_per_utxo_byte(
          BigNum.from_str(String(protocolParams.coins_per_utxo_size)),
        )
        .max_value_size(protocolParams.max_val_size)
        .max_tx_size(protocolParams.max_tx_size)
        .prefer_pure_change(true)
        .build(),
    );

    return txBuilder;
  };

  const getTxUnspentOutputs = useCallback(async (utxos: Utxos) => {
    let txOutputs = TransactionUnspentOutputs.new();
    for (const utxo of utxos) {
      txOutputs.add(utxo.TransactionUnspentOutput);
    }
    return txOutputs;
  }, []);
  //creates an expired txn for signing
  const loginHardwareWalletTransaction = async () => {
    if (!walletApi) throw new Error('Wallet not connected');
    setIsGettingSignatures(true);
    try {
      const txBuilder = await initTransactionBuilder();
      //sample recipient address
      const shelleyOutputAddress = Address.from_bech32(
        'addr_test1qrt7j04dtk4hfjq036r2nfewt59q8zpa69ax88utyr6es2ar72l7vd6evxct69wcje5cs25ze4qeshejy828h30zkydsu4yrmm',
      );
      const shelleyChangeAddress = Address.from_bech32(
        walletState.changeAddress,
      );
      // 1 million lovelace
      txBuilder.add_output(
        TransactionOutput.new(
          shelleyOutputAddress,
          Value.new(BigNum.from_str('1000000')),
        ),
      );

      // Find the available UTXOs in the wallet and
      // us them as Inputs
      const utxos = await getUtxos(walletApi);
      const txUnspentOutputs = await getTxUnspentOutputs(utxos);
      txBuilder.add_inputs_from(txUnspentOutputs, 1);
      // calculate the min fee required and send any change to an address
      txBuilder.add_change_if_needed(shelleyChangeAddress);
      //expiry of 1 minute
      txBuilder.set_ttl_bignum(BigNum.from_str((1.5 * 60).toString()));
      // once the transaction is ready, we build it to get the tx body without witnesses
      const txBody = txBuilder.build();
      // Tx witness
      const transactionWitnessSet = TransactionWitnessSet.new();
      const tx = Transaction.new(
        txBody,
        TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes()),
      );

      let txVkeyWitnesses = await walletApi.signTx(
        Buffer.from(tx.to_bytes() as any, 'utf8').toString('hex'),
        true,
      );
      txVkeyWitnesses = TransactionWitnessSet.from_bytes(
        Buffer.from(txVkeyWitnesses, 'hex'),
      );
      transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());
      const signedTx = Transaction.new(tx.body(), transactionWitnessSet);
      const { signature, vkey } = JSON.parse(
        signedTx.witness_set().vkeys().get(0).to_json(),
      );
      setLoginCredentials({ signature, vkey });
      setIsGettingSignatures(false);
      return { signature, vkey };
    } catch (error) {
      setIsGettingSignatures(false);
      throw new Error(error);
    }
  };
  //for hardware wallets, an expired txn is signed to get signature
  const disconnectWallet = useCallback(async () => {
    removeItemFromLocalStorage(`${WALLET_LS_KEY}_name`);
    removeItemFromLocalStorage(`${WALLET_LS_KEY}_stake_key`);
    removeItemFromLocalStorage(`${WALLET_LS_KEY}_api`);
    setWalletApi(undefined);
    setAddress(undefined);
    setStakeKey(undefined);
    setStakeKeyBech32(undefined);
    setVoter(undefined);
    setDelegatedDRepID(undefined);
    setPubDRepKey(undefined);
    setDRepID(undefined);
    setDRepIDBech32(undefined);
    setIsEnabled(false);
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
      loginHardwareWalletTransaction,
      loginCredentials,
      dRepID,
      dRepIDBech32,
      pubDRepKey,
      stakeKey,
      stakeKeyBech32,
      isGettingSignatures,
      setVoter,
      latestEpoch,
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
      latestEpoch,
      pubDRepKey,
      isGettingSignatures,
      stakeKey,
      stakeKeyBech32,
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
