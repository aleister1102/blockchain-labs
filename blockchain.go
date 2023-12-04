package main

// Blockchain chứa danh sách tất cả các block
type Blockchain struct {
	blocks []*Block
}

// NewBlockchain tạo một blockchain mới với block genesis
func NewBlockchain() *Blockchain {
	genesisBlock := NewGenesisBlock()
	return &Blockchain{[]*Block{genesisBlock}}
}

// AddBlock thêm một block mới vào blockchain
func (bc *Blockchain) AddBlock(transactions []*Transaction) {
	prevBlock := bc.blocks[len(bc.blocks)-1]
	newBlock := NewBlock(transactions, prevBlock.Hash)
	bc.blocks = append(bc.blocks, newBlock)
}
