import { config } from '../../config';

const bitcoin = require('bitcoingreenjs-lib-test'); // ToDo: This package is test lib. It should be updated with released bitcoingreenjs-lib

function randomStr() {
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyz012345';

  for (let i = 0; i < 32; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return Buffer.from(text);
}

export const generateAddress = () => {
  const keyPair = bitcoin.ECPair.makeRandom({ rng: randomStr });
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
  const { privateKey } = keyPair;
  return { address, privateKey };
};

export const importAddressFromPrivateKey = privateKey => {
  const keyPair = bitcoin.ECPair.fromPrivateKey(privateKey);
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
  return address;
};

export const setTransaction = (txUtxos, txUtxoValue, amount, receiveAddress, senderAddress) => {
  const rawTransaction = new bitcoin.TransactionBuilder();
  for (let i = 0; i < txUtxos.length; i += 1) {
    rawTransaction.addInput(txUtxos[i].txId, txUtxos[i].vout);
  }

  const change = txUtxoValue - amount - config.FEE_AMOUNT;
  rawTransaction.addOutput(receiveAddress, amount);
  rawTransaction.addOutput(senderAddress, change);
  return rawTransaction;
};