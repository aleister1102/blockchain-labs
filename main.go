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

		// Kiểm tra xem tx có nội dung là "Transaction 1" có trong block hay không sử dụng Merkle Path
		// Có thể cho phép người dùng nhập nội dung transaction cần kiểm tra
		fmt.Printf("Check whether transaction with content 'Trasaction 1' is in block %x\n", block.Hash)

		// Xây dựng lại cây merkle từ các transactions (cách làm này chưa tối ưu)
		merkleTree := NewMerkleTree(block.Transactions)

		// Xác thực transaction
		verifyRes := merkleTree.Verify(*block, Transaction{[]byte("Transaction 1")})

		fmt.Printf("Verify result: %v\n", verifyRes)
	}

}
