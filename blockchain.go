package main

// Blockchain chứa danh sách tất cả các block
type Blockchain struct {
	Blocks []*Block
}

// NewBlockchain tạo một blockchain mới với block genesis
func NewBlockchain() *Blockchain {
	genesisBlock := NewGenesisBlock()
	return &Blockchain{[]*Block{genesisBlock}}
}

// AddBlock thêm một block mới vào blockchain
func (bc *Blockchain) AddBlock(transactions []*Transaction) {
	prevBlock := bc.Blocks[len(bc.Blocks)-1]
	newBlock := NewBlock(transactions, prevBlock.Hash)
	bc.Blocks = append(bc.Blocks, newBlock)
}
