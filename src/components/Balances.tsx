import { Box, CircularProgress, Paper, Stack, Typography, styled } from '@mui/material';
import { AppContext } from 'contexts';
import useGetMyBalances from 'hooks/useGetMyBalances';
import { useMintTestToken } from 'hooks/useMintTestToken';
import { TokenType } from 'interfaces';
import { useContext, useState } from 'react';
import { ButtonPrimary } from './Buttons/Button';
import { WalletButton } from './Buttons/WalletButton';
import { MintCustomToken } from './MintCustomToken';
import BalancesTable from './BalancesTable/BalancesTable';

const PageWrapper = styled(Paper)`
  background: ${({ theme }) => `linear-gradient(${theme.palette.customBackground.bg2}, ${
    theme.palette.customBackground.bg2
  }) padding-box,
              linear-gradient(150deg, rgba(136,102,221,1) 0%, rgba(${
                theme.palette.mode == 'dark' ? '33,29,50,1' : '255,255,255,1'
              }) 35%, rgba(${
                theme.palette.mode == 'dark' ? '33,29,50,1' : '255,255,255,1'
              }) 65%, rgba(136,102,221,1) 100%) border-box`};
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 32px 48px;
  width: 100%;
  max-width: 860px;
`;

export function Balances() {
  const { sorobanContext, refetch } = useGetMyBalances();

  const mintTestTokens = useMintTestToken();
  const { ConnectWalletModal } = useContext(AppContext);
  const { isConnectWalletModalOpen, setConnectWalletModalOpen } = ConnectWalletModal;

  const [currentMintingToken, setCurrentMintingToken] = useState<TokenType | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = () => {
    setIsMinting(true);
    mintTestTokens({
      onTokenMintedStart(token) {
        setCurrentMintingToken(token);
      },
      onTokenMintedSuccess(token) {
        setCurrentMintingToken(null);
        refetch();
      },
      onTokenMintedError(token) {
        setCurrentMintingToken(null);
      },
    }).finally(() => {
      setIsMinting(false);
    });
  };

  const getButtonTxt = () => {
    if (isMinting)
      return (
        <Box display="flex" alignItems="center" gap="6px">
          Minting {currentMintingToken?.symbol} <CircularProgress size="18px" />
        </Box>
      );
    return `Mint test tokens`;
  };

  const isButtonDisabled = () => {
    if (isMinting) return true;
    return false;
  };

  return (
    <PageWrapper>
      {!sorobanContext.address ? (
        <>
          <Typography gutterBottom variant="h5">
            {"Your test token's balance:"}
          </Typography>
          <Typography gutterBottom>Connect your wallet to see your test tokens balances</Typography>
          <WalletButton/>
        </>
      ) : (
        <>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography gutterBottom variant="h5">
              {"Your test token's balance:"}
            </Typography>
            <ButtonPrimary
              onClick={handleMint}
              disabled={isButtonDisabled()}
              style={{ maxWidth: 250 }}
            >
              {getButtonTxt()}
            </ButtonPrimary>
          </Box>
          <Box>
            <BalancesTable />
          </Box>
        </>
      )}

      {sorobanContext.address && <MintCustomToken />}
    </PageWrapper>
  );
}
