import { useSorobanReact } from 'stellar-react';
import useSWRImmutable from 'swr/immutable';
import useGetNativeTokenBalance from './useGetNativeTokenBalance';

const useHorizonLoadAccount = () => {
  const sorobanContext = useSorobanReact();

  const nativeBalance = useGetNativeTokenBalance();

  const isFunded = nativeBalance.data?.validAccount;

  const { data, isLoading, error, mutate } = useSWRImmutable(
    sorobanContext.address && isFunded
      ? ['horizon-account', sorobanContext.address, sorobanContext]
      : null,
    ([_, address]) => sorobanContext.horizonServer?.loadAccount(address),
  );

  return { account: data, isLoading, error, mutate };
};

export default useHorizonLoadAccount;
