// Global state
let currentTheme = "dark"
let selectedNetwork = "ethereum"
let connectedWallet = null
let currentTokenModal = null

// Network configurations
const networks = {
  ethereum: {
    name: "Ethereum",
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    chainId: 1,
    rpcUrl: "https://mainnet.infura.io/v3/",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  },
  optimism: {
    name: "Optimism",
    icon: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
    chainId: 10,
    rpcUrl: "https://mainnet.optimism.io",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  },
  polygon: {
    name: "Polygon",
    icon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com/",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  },
  arbitrum: {
    name: "Arbitrum",
    icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
    chainId: 42161,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  },
  fantom: {
    name: "Fantom",
    icon: "https://cryptologos.cc/logos/fantom-ftm-logo.png",
    chainId: 250,
    rpcUrl: "https://rpc.ftm.tools/",
    nativeCurrency: { name: "FTM", symbol: "FTM", decimals: 18 },
  },
  avalanche: {
    name: "Avalanche",
    icon: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
    chainId: 43114,
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
  },
  gnosis: {
    name: "Gnosis",
    icon: "https://cryptologos.cc/logos/gnosis-gno-logo.png",
    chainId: 100,
    rpcUrl: "https://rpc.gnosischain.com",
    nativeCurrency: { name: "xDAI", symbol: "xDAI", decimals: 18 },
  },
  bnb: {
    name: "BNB",
    icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    chainId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org/",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  },
}

// Wallet configurations
const wallets = {
  metamask: {
    name: "MetaMask",
    icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    connector: "injected",
  },
  walletconnect: {
    name: "WalletConnect",
    icon: "https://walletconnect.com/walletconnect-logo.svg",
    connector: "walletconnect",
  },
  coinbase: {
    name: "Coinbase Wallet",
    icon: "https://www.coinbase.com/img/favicon.ico",
    connector: "coinbase",
  },
  trust: {
    name: "Trust Wallet",
    icon: "https://trustwallet.com/assets/images/favicon.ico",
    connector: "injected",
  },
  phantom: {
    name: "Phantom",
    icon: "https://phantom.app/img/phantom-logo.png",
    connector: "phantom",
  },
  binance: {
    name: "Binance Wallet",
    icon: "https://www.binance.com/favicon.ico",
    connector: "binance",
  },
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme()
  setupEventListeners()
  checkWalletConnection()
})

// Theme Management
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark"
  currentTheme = savedTheme
  document.body.className = `${currentTheme}-theme`
  updateLogo()
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark"
  document.body.className = `${currentTheme}-theme`
  localStorage.setItem("theme", currentTheme)
  updateLogo()
}

function updateLogo() {
  const logoImage = document.getElementById("logoImage")
  if (logoImage) {
    if (currentTheme === "dark") {
      logoImage.src = "https://i.ibb.co/5gfKPF2S/multichain-logo-noche.png"
    } else {
      logoImage.src = "https://i.ibb.co/99w4fdNR/multichain-logo-dia.png"
    }
  }
}

// Event Listeners
function setupEventListeners() {
  // Close modals when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeAllModals()
    }
  })

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals()
    }
  })
}

// Banner Management
function closeBanner() {
  const banner = document.getElementById("topBanner")
  banner.style.display = "none"
}

// Modal Management
function toggleNetworkModal() {
  const modal = document.getElementById("networkModal")
  modal.classList.toggle("active")
}

function closeNetworkModal() {
  const modal = document.getElementById("networkModal")
  modal.classList.remove("active")
}

function toggleWalletModal() {
  const modal = document.getElementById("walletModal")
  modal.classList.toggle("active")
}

function closeWalletModal() {
  const modal = document.getElementById("walletModal")
  modal.classList.remove("active")
}

function toggleTokenModal(type) {
  currentTokenModal = type
  const modal = document.getElementById("tokenModal")
  modal.classList.toggle("active")
}

function closeTokenModal() {
  const modal = document.getElementById("tokenModal")
  modal.classList.remove("active")
  currentTokenModal = null
}

function closeAllModals() {
  closeNetworkModal()
  closeWalletModal()
  closeTokenModal()
}

// Network Management
function selectNetwork(networkKey) {
  selectedNetwork = networkKey
  const network = networks[networkKey]

  // Update network selector
  const networkSelector = document.querySelector(".network-selector")
  const networkIcon = networkSelector.querySelector(".network-icon")
  const networkText = networkSelector.querySelector("span")

  networkIcon.src = network.icon
  networkIcon.alt = network.name
  networkText.textContent = network.name

  // Update active state in modal
  document.querySelectorAll(".network-item").forEach((item) => {
    item.classList.remove("active")
    const checkmark = item.querySelector(".checkmark")
    if (checkmark) checkmark.remove()
  })

  const selectedItem = document.querySelector(`[onclick="selectNetwork('${networkKey}')"]`)
  if (selectedItem) {
    selectedItem.classList.add("active")
    const checkmark = document.createElement("span")
    checkmark.className = "checkmark"
    checkmark.textContent = "✓"
    selectedItem.appendChild(checkmark)
  }

  closeNetworkModal()

  // Switch network if wallet is connected
  if (connectedWallet && window.ethereum) {
    switchNetwork(network.chainId)
  }
}

async function switchNetwork(chainId) {
  if (!window.ethereum) return

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    })
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        const network = Object.values(networks).find((n) => n.chainId === chainId)
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: network.name,
              rpcUrls: [network.rpcUrl],
              nativeCurrency: network.nativeCurrency,
            },
          ],
        })
      } catch (addError) {
        console.error("Failed to add network:", addError)
      }
    }
  }
}

// Wallet Management
async function connectWallet(walletKey) {
  const wallet = wallets[walletKey]

  try {
    let accounts = []

    switch (walletKey) {
      case "metamask":
        if (typeof window.ethereum !== "undefined") {
          accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
          connectedWallet = {
            type: "metamask",
            address: accounts[0],
            name: wallet.name,
          }
        } else {
          window.open("https://metamask.io/download/", "_blank")
          return
        }
        break

      case "walletconnect":
        // WalletConnect integration would go here
        console.log("WalletConnect integration needed")
        break

      case "coinbase":
        // Coinbase Wallet integration would go here
        console.log("Coinbase Wallet integration needed")
        break

      case "trust":
        if (typeof window.ethereum !== "undefined") {
          accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
          connectedWallet = {
            type: "trust",
            address: accounts[0],
            name: wallet.name,
          }
        } else {
          window.open("https://trustwallet.com/", "_blank")
          return
        }
        break

      case "phantom":
        if (typeof window.solana !== "undefined" && window.solana.isPhantom) {
          const response = await window.solana.connect()
          connectedWallet = {
            type: "phantom",
            address: response.publicKey.toString(),
            name: wallet.name,
          }
        } else {
          window.open("https://phantom.app/", "_blank")
          return
        }
        break

      case "binance":
        if (typeof window.BinanceChain !== "undefined") {
          accounts = await window.BinanceChain.request({ method: "eth_requestAccounts" })
          connectedWallet = {
            type: "binance",
            address: accounts[0],
            name: wallet.name,
          }
        } else {
          window.open("https://www.binance.org/en", "_blank")
          return
        }
        break
    }

    if (connectedWallet) {
      updateWalletUI()
      closeWalletModal()

      // Store connection in localStorage
      localStorage.setItem("connectedWallet", JSON.stringify(connectedWallet))

      console.log("Wallet connected:", connectedWallet)
    }
  } catch (error) {
    console.error("Failed to connect wallet:", error)
  }
}

function updateWalletUI() {
  if (!connectedWallet) return

  const connectButtons = document.querySelectorAll(".connect-wallet-btn, .main-connect-btn")
  connectButtons.forEach((button) => {
    button.textContent = `${connectedWallet.address.slice(0, 6)}...${connectedWallet.address.slice(-4)}`
    button.onclick = disconnectWallet
  })
}

function disconnectWallet() {
  connectedWallet = null
  localStorage.removeItem("connectedWallet")

  const connectButtons = document.querySelectorAll(".connect-wallet-btn, .main-connect-btn")
  connectButtons.forEach((button) => {
    if (button.classList.contains("connect-wallet-btn")) {
      button.textContent = "Connect to a wallet"
    } else {
      button.textContent = "Connect Wallet"
    }
    button.onclick = toggleWalletModal
  })
}

function checkWalletConnection() {
  const savedWallet = localStorage.getItem("connectedWallet")
  if (savedWallet) {
    connectedWallet = JSON.parse(savedWallet)
    updateWalletUI()
  }
}

// Token Management
function selectToken(tokenSymbol) {
  console.log(`Selected token: ${tokenSymbol} for ${currentTokenModal}`)
  closeTokenModal()

  // Update the UI based on which modal was open
  if (currentTokenModal === "from") {
    // Update from token selector
    updateTokenSelector("from", tokenSymbol)
  } else if (currentTokenModal === "to") {
    // Update to token selector
    updateTokenSelector("to", tokenSymbol)
  }
}

function updateTokenSelector(type, tokenSymbol) {
  const selector = document.querySelector(`.${type}-section .token-selector`)
  const placeholder = selector.querySelector(".token-placeholder")
  const text = selector.querySelector(".token-text")

  // You would typically have a tokens database here
  const tokenData = {
    ETH: {
      name: "Ethereum",
      icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    },
    USDT: {
      name: "Tether USD",
      icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    },
    USDC: {
      name: "USD Coin",
      icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    },
  }

  const token = tokenData[tokenSymbol]
  if (token) {
    placeholder.innerHTML = `<img src="${token.icon}" alt="${tokenSymbol}" style="width: 24px; height: 24px; border-radius: 50%;">`
    text.textContent = tokenSymbol
  }
}

// Swap Functions
function swapTokens() {
  console.log("Swapping tokens...")
  // Implement token swap logic here
}

// Utility Functions
function formatAddress(address) {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function formatBalance(balance) {
  if (!balance) return "0"
  return Number.parseFloat(balance).toFixed(4)
}

// Error Handling
window.addEventListener("error", (e) => {
  console.error("Application error:", e.error)
})

// Web3 Event Listeners
if (typeof window.ethereum !== "undefined") {
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else if (connectedWallet) {
      connectedWallet.address = accounts[0]
      updateWalletUI()
      localStorage.setItem("connectedWallet", JSON.stringify(connectedWallet))
    }
  })

  window.ethereum.on("chainChanged", (chainId) => {
    // Handle chain change
    const networkKey = Object.keys(networks).find((key) => networks[key].chainId === Number.parseInt(chainId, 16))
    if (networkKey) {
      selectNetwork(networkKey)
    }
  })
}

// Export functions for global access
window.toggleTheme = toggleTheme
window.closeBanner = closeBanner
window.toggleNetworkModal = toggleNetworkModal
window.closeNetworkModal = closeNetworkModal
window.toggleWalletModal = toggleWalletModal
window.closeWalletModal = closeWalletModal
window.toggleTokenModal = toggleTokenModal
window.closeTokenModal = closeTokenModal
window.selectNetwork = selectNetwork
window.connectWallet = connectWallet
window.selectToken = selectToken
window.swapTokens = swapTokens
