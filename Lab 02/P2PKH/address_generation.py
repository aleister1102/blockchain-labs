# P2PKH Script

# Use bitcoin and bitcoinlin library for this LAB
from bitcoin import *
from bitcoinlib.wallets import *
from bitcoinlib.keys import Key

# Generate a random private key for BTC Testnet
private_key = Key(network='testnet')

# Derive the public key and Bitcoin address

# Key.public() returns the public key from the private key
public_key = private_key.public()
# Key.address(script_type="p2pkh") returns the address from the public key with P2PKH script
address = public_key.address(script_type="p2pkh")

print("Private Key:", private_key)
print("Public Key:", public_key.hex())
print("Bitcoin Address:", address)