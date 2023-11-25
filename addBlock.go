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

// SetHash tính toán và thiết lập giá trị hash cho block
func (b *Block) SetHash() {
	timestamp := []byte(time.Unix(b.Timestamp, 0).String())
	headers := bytes.Join([][]byte{b.PrevBlockHash, b.HashTransactions(), timestamp}, []byte{})
	hash := sha256.Sum256(headers)

	b.Hash = hash[:]
}

// HashTransactions tính toán giá trị hash cho tất cả các giao dịch trong block
func (b *Block) HashTransactions() []byte {
	var txHashes [][]byte
	for _, tx := range b.Transactions {
		txHashes = append(txHashes, tx.Data)
	}
	txHash := sha256.Sum256(bytes.Join(txHashes, []byte{}))

	return txHash[:]
}

// Blockchain chứa danh sách tất cả các block
type Blockchain struct {
	blocks []*Block
}

// NewBlockchain tạo một blockchain mới với block genesis
func NewBlockchain() *Blockchain {
	return &Blockchain{[]*Block{NewGenesisBlock()}}
}

// AddBlock thêm một block mới vào blockchain
func (bc *Blockchain) AddBlock(transactions []*Transaction) {
	prevBlock := bc.blocks[len(bc.blocks)-1]
	newBlock := NewBlock(transactions, prevBlock.Hash)
	bc.blocks = append(bc.blocks, newBlock)
}

// NewBlock tạo một block mới với các giao dịch và hash của block trước đó
func NewBlock(transactions []*Transaction, prevBlockHash []byte) *Block {
	block := &Block{time.Now().Unix(), transactions, prevBlockHash, []byte{}}
	block.SetHash()
	return block
}

// NewGenesisBlock tạo một block genesis
func NewGenesisBlock() *Block {
	return NewBlock([]*Transaction{{[]byte("Genesis Block")}}, []byte{})
}

func main() {
	bc := NewBlockchain()

	// Thêm 10 block vào blockchain
	for i := 1; i <= 10; i++ {
		bc.AddBlock([]*Transaction{{[]byte(fmt.Sprintf("Block %d", i))}})
	}

	// In thông tin của mỗi block trong blockchain
	for _, block := range bc.blocks {
		fmt.Printf("Prev. hash: %x\n", block.PrevBlockHash)
		fmt.Printf("Data: %s\n", block.Transactions[0].Data)
		fmt.Printf("Hash: %x\n", block.Hash)
		fmt.Println()
	}
}
