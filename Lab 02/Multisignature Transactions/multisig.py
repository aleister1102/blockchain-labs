from bitcoinlib.wallets import wallet_exists, Wallet, wallet_delete_if_exists
from bitcoinlib.keys import HDKey

WALLET_NAME = "Multisig_2of2"
NETWORK = 'testnet'
WITNESS_TYPE = 'p2sh-segwit'
SIGS_N = 2
SIGS_REQUIRED = 2

#wallet_delete_if_exists(WALLET_NAME)

# COSIGNER DICTIONARY
# Create keys with mnemonic_key_create.py on separate instances and insert public or private key in dict
#
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
COSIGNER_NAME_THIS_WALLET = 'Boby'

# wallet_delete_if_exists(WALLET_NAME)
if not wallet_exists(WALLET_NAME):
    # This wallets key list, use tools/mnemonic_key_create.py to create your own.
    #
    cosigners_private = []
    key_list = []
    for cosigner in cosigners:
        if not cosigner['key']:
            raise ValueError("Please create private keys with mnemonic_key_create.py and add to COSIGNERS definitions")
        if len(cosigner['key'].split(" ")) > 1:
            hdkey = HDKey.from_passphrase(cosigner['key'], key_type=cosigner['key_type'], witness_type=WITNESS_TYPE,
                                          network=NETWORK)
        else:
            hdkey = HDKey(cosigner['key'], key_type=cosigner['key_type'], witness_type=WITNESS_TYPE, network=NETWORK)
        if cosigner['name'] != COSIGNER_NAME_THIS_WALLET:
            hdkey = hdkey.public_master_multisig()
        cosigner['hdkey'] = hdkey
        key_list.append(hdkey)

    if len(key_list) != SIGS_N:
        raise ValueError("Number of cosigners (%d) is different then expected. SIG_N=%d" % (len(key_list), SIGS_N))
    wallet2o2 = Wallet.create(WALLET_NAME, key_list, sigs_required=SIGS_REQUIRED, witness_type=WITNESS_TYPE,
                              network=NETWORK)
    wallet2o2.new_key()
    print("\n\nA multisig wallet with 1 key has been created on this system")
else:
    wallet2o2 = Wallet(WALLET_NAME)

print("\nUpdating UTXO's...")
wallet2o2.utxos_update()
wallet2o2.info()
print(wallet2o2.get_key().address)
