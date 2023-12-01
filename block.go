package main

import (
	"bytes"
	"crypto/sha256"
	"fmt"
	"time"
)

// Transaction chứa dữ liệu của một giao dịch
type Transaction struct {
	Data []byte
}

// Block chứa thông tin của một block trong blockchain
type Block struct {
	Timestamp     int64
	Transactions  []*Transaction
	PrevBlockHash []byte
	Hash          []byte
}

// NewBlock tạo một block mới với các giao dịch và hash của block trước đó
func NewBlock(transactions []*Transaction, prevBlockHash []byte) *Block {
	block := &Block{time.Now().Unix(), transactions, prevBlockHash, []byte{}}
	block.SetHash()
	return block
}

// HashTransactions tính toán giá trị hash cho tất cả các giao dịch trong block
func (b *Block) HashTransactions() []byte {
	var txHashes [][]byte
	for _, tx := range b.Transactions {
		txHashes = append(txHashes, tx.Data)
	}
	merkleTree := NewMerkleTree(txHashes)
	return merkleTree.RootNode.Data
}

// SetHash tính toán và thiết lập giá trị hash cho block
func (b *Block) SetHash() {
	timestamp := []byte(time.Unix(b.Timestamp, 0).String())
	merkleRoot := b.HashTransactions()
	headers := bytes.Join([][]byte{b.PrevBlockHash, merkleRoot, timestamp}, []byte{})
	hash := sha256.Sum256(headers)

	b.Hash = hash[:]
	fmt.Printf("Merkle root of Block %s is: %x \n", fmt.Sprintf("%x...", hash[0:3]), merkleRoot)
}

// NewGenesisBlock tạo một block genesis
func NewGenesisBlock() *Block {
	return NewBlock([]*Transaction{{[]byte("Genesis Block")}}, []byte{})
}
