from bitcoinlib.wallets import wallet_exists, Wallet, wallet_delete_if_exists
from bitcoinlib.keys import HDKey

WALLET_NAME = "Multisig_2of2"

cosigners = [
    {
        'name': 'Alice',
        'key_type': 'bip44',
        'key': 'moral juice congress aerobic denial beyond purchase spider slide dwarf yard online'
    },
    {
        'name': 'Boby',
        'key_type': 'bip44',
        'key': 'concert planet pause then raccoon wait security stuff trim guilt deposit ranch'
    }
]

wallet2o2 = Wallet(WALLET_NAME)
utxos = wallet2o2.utxos()
wallet2o2.info()

# Creating transactions just like in a normal wallet, then send raw transaction to other cosigners. They
# can sign the transaction with their own key and pass it on to the next signer or broadcast it to the network.

t = None
if utxos:
    print("\nNew unspent outputs found!")
    print("Now a new transaction will be created to send bitcoins to a wallet")
    send_to_address = 'tb1qx59c5huf3lsaedzl3ng7ea3su3qhfl72fzlzfz' #ví sẵn có
    t = wallet2o2.send_to(send_to_address, 100)
    #print("Now send the raw transaction hex to one of the other cosigners to sign using sign_raw.py")
    #print("Raw transaction: %s" % t.raw_hex())
else:
    print("Please send funds to %s, so we can create a transaction" % wallet2o2.get_key().address)
    print("Restart this program when funds are send...")

# Sign the transaction with 2 cosigner keys and push the transaction
if t:
    t.sign(cosigners[0]['key'])
    t.sign(cosigners[1]['key'])
    t.send()
    t.info()