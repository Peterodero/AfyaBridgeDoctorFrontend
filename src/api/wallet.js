// src/api/wallet.js
import axios from 'axios'

const WALLET_BASE_URL = 'https://afia-bridge-transactions.onrender.com'

export const walletApi = {
  // Get wallet balance and transaction history
  getWallet: (userId) => {
    return axios.get(`${WALLET_BASE_URL}/wallet/${userId}`)
  },

  // Deposit via M-Pesa STK Push
  depositMPesa: (depositData) => {
    return axios.post(`${WALLET_BASE_URL}/pay-mpesa`, {
      email: depositData.email,
      user_id: depositData.user_id,
      amount: depositData.amount,
      phone: depositData.phone,
    })
  },

  // Withdraw to M-Pesa
  withdraw: (withdrawData) => {
    return axios.post(`${WALLET_BASE_URL}/wallet/withdraw`, {
      user_id: withdrawData.user_id,
      amount: withdrawData.amount,
      phone: withdrawData.phone,
    })
  },
}