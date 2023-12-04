package main

import (
	"fmt"
)

func main() {
	bc := NewBlockchain()

	// Thêm 10 block vào blockchain
	for i := 0; i <= 20; i += 3 {
		transactions := []*Transaction{
			{[]byte(fmt.Sprintf("Transaction %d", i+1))},
			{[]byte(fmt.Sprintf("Transaction %d", i+2))},
			{[]byte(fmt.Sprintf("Transaction %d", i+3))},
		}
		bc.AddBlock(transactions)
	}

	// In thông tin của mỗi block trong blockchain
	for i, block := range bc.blocks {
		fmt.Printf("\nBlock %x\n", i)
		fmt.Printf("Prev. hash: %x\n", block.PrevBlockHash)
		for _, tx := range block.Transactions {
			fmt.Printf("> Data: %s ", tx.Data)
		}
		fmt.Printf("\nHash: %x\n", block.Hash)
	}

}
