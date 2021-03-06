import { Blockchain, Wallet, Block, Bank } from "../index.js";

const walletSato = new Wallet();
const walletDolores = new Wallet();
const walletKub = new Wallet();

const chain = Blockchain.init({
  BLOCK_MIN_DIFFICULTY: 2,
  BLOCK_MAX_DIFFICULTY: 3,
  GENESIS_BLOCK: {
    publisher: walletSato.publicKey,
  },
});

// console.log(chain);
const transaction1 = walletSato.createTransaction({
  sender: walletSato.publicKey,
  content: "https://pbs.twimg.com/media/EwxqyQdXMAAlqIb?format=jpg&name=medium",
});
const block1 = new Block({
  height: chain.lastBlock.height + 1,
  publisher: walletSato.publicKey,
  prevHash: chain.lastBlock.hash,
  transactions: JSON.stringify([transaction1]),
});
block1.sign(walletSato);
block1.mine();
chain.addBlock(block1);

const transaction2 = walletSato.createTransaction({
  sender: walletSato.publicKey,
  content:
    "https://resize-parismatch.lanmedia.fr/img/var/news/storage/images/paris-match/culture/cinema/elle-etait-la-lolita-de-stanley-kubrick-l-actrice-sue-lyon-est-morte-1666818/27181746-1-fre-FR/Elle-etait-la-Lolita-de-Stanley-Kubrick-l-actrice-Sue-Lyon-est-morte.jpg",
});

const block2 = new Block({
  height: chain.lastBlock.height + 1,
  publisher: walletDolores.publicKey,
  prevHash: chain.lastBlock.hash,
  transactions: JSON.stringify([transaction2]),
});
block2.sign(walletDolores);
block2.mine();
chain.addBlock(block2);

const transaction3 = walletDolores.createTransaction({
  sender: block1.publisher,
  ownership: block1.hash,
  receiver: walletKub.publicKey,
  amount: 0.5,
});

transaction3.sign(walletSato);

const block3 = new Block({
  height: chain.lastBlock.height + 1,
  publisher: walletSato.publicKey,
  prevHash: chain.lastBlock.hash,
  transactions: JSON.stringify([transaction3]),
});
block3.sign(walletSato);
block3.mine();
chain.addBlock(block3);
chain.getBank().log();

console.log(
  "Ownerships for block 1",
  chain.getBank().getAllOwnershipsForToken(block1.hash)
);
console.log(
  "Ownerships for Public key SATO",
  chain.getBank().getOwnershipsForSender(walletSato.publicKey)
);

console.log(
  "Ownerships for Public key KUBRICK",
  chain.getBank().getOwnershipsForSender(walletKub.publicKey)
);
