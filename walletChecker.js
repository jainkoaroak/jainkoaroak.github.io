// Array of wallet addresses
const walletAddresses = [
    "8GXLZ45rs12XNDfhotptgPcqCxjXdAWZTQ4oq2FytYNx",
    "6exdeJpSwbwU7kF31PuPaTHQsparyd5P3Etk1gxH6Fn4",
    "FXzPE8DoP3wDjWUF7AasQZYmNdkWTqu8vQMALEo9TFJV",
    "D3K4ELAuYxK9HF93LNQ8uJi281xwMtoGG9fTnx7HyQBS"
];

// QuickNode RPC Endpoint
const QUICKNODE_RPC = 'https://g.w.lavanet.xyz:443/gateway/solana/rpc-http/631c5a1be220a15e4e51c2cd2ab1955b';

// Token Mint Addresses
const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const WSOL_MINT_ADDRESS = 'So11111111111111111111111111111111111111112';

// Create a connection to the Solana network
const connection = new solanaWeb3.Connection(QUICKNODE_RPC, 'confirmed');

// Function to fetch SOL balance
async function getSolBalance(publicKey) {
    try {
        const balance = await connection.getBalance(publicKey);
        return balance / solanaWeb3.LAMPORTS_PER_SOL; // Convert lamports to SOL
    } catch (error) {
        console.error(`Error fetching SOL balance for ${publicKey.toString()}:`, error);
        return 'Error';
    }
}

// Function to fetch WSOL balance
async function getWsolBalance(publicKey) {
    try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            publicKey,
            { mint: new solanaWeb3.PublicKey(WSOL_MINT_ADDRESS) }
        );
        if (tokenAccounts.value.length > 0) {
            const wsolAccountInfo = tokenAccounts.value[0].account.data.parsed.info;
            return wsolAccountInfo.tokenAmount.uiAmount;
        } else {
            return 0; // No WSOL token account found
        }
    } catch (error) {
        console.error(`Error fetching WSOL balance for ${publicKey.toString()}:`, error);
        return 'Error';
    }
}

// Function to fetch USDC balance
async function getUsdcBalance(publicKey) {
    try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            publicKey,
            { mint: new solanaWeb3.PublicKey(USDC_MINT_ADDRESS) }
        );
        if (tokenAccounts.value.length > 0) {
            const usdcAccountInfo = tokenAccounts.value[0].account.data.parsed.info;
            return usdcAccountInfo.tokenAmount.uiAmount;
        } else {
            return 0; // No USDC token account found
        }
    } catch (error) {
        console.error(`Error fetching USDC balance for ${publicKey.toString()}:`, error);
        return 'Error';
    }
}

// Function to display wallet balances on each page
async function displayWalletBalances(walletAddress, walletContainerId) {
    const walletPublicKey = new solanaWeb3.PublicKey(walletAddress);

    // Fetch the balances
    const solBalance = await getSolBalance(walletPublicKey);
    const wsolBalance = await getWsolBalance(walletPublicKey);
    const usdcBalance = await getUsdcBalance(walletPublicKey);

    // Display balances in the provided container
    const walletContainer = document.getElementById(walletContainerId);
    walletContainer.innerHTML = `
        <strong>Wallet:</strong> ${walletAddress} <br>
        <strong>SOL Balance:</strong> ${solBalance} SOL <br>
        <strong>WSOL Balance:</strong> ${wsolBalance} WSOL <br>
        <strong>USDC Balance:</strong> ${usdcBalance} USDC
    `;
}

// Utility function to get the wallet ID from the URL (for individual wallet pages)
function getWalletIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('walletId'); // Assuming the URL contains ?walletId=<index>
}

// Initialize wallet page
function initWalletPage() {
    const walletId = getWalletIdFromURL();
    if (walletId !== null && walletAddresses[walletId]) {
        displayWalletBalances(walletAddresses[walletId], 'wallet-balances');
    } else {
        document.getElementById('wallet-balances').innerHTML = 'Wallet not found!';
    }
}

// Initialize on page load
window.onload = function() {
    initWalletPage();
};
