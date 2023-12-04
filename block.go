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
	now := time.Now().Unix()
	block := &Block{now, transactions, prevBlockHash, []byte{}}
	block.SetHash()
	return block
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

// HashTransactions tính toán giá trị hash cho tất cả các giao dịch trong block
func (b *Block) HashTransactions() []byte {
	var dataOfTxs []*Transaction
	for _, tx := range b.Transactions {
		dataOfTxs = append(dataOfTxs, tx)
	}
	merkleTree := NewMerkleTree(dataOfTxs)
	return merkleTree.RootNode.Data
}

// NewGenesisBlock tạo một block genesis
func NewGenesisBlock() *Block {
	return NewBlock([]*Transaction{{[]byte("Genesis Block")}}, []byte{})
}
