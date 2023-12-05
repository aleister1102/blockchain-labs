package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
)

const blockchainFile = "blockchain.json"

var (
	command              = flag.String("command", "", "Command to execute (add, read, verify)")
	blockData            = flag.String("blockdata", "", "Data for the block (used in add command)")
	numBlocks            = flag.Int("numblocks", 1, "Number of blocks to add (used in add command)")
	transactionsPerBlock = flag.Int("transactionsperblock", 1, "Number of transactions per block (used in add command)")
	verifyContent        = flag.String("verify", "Genesis Block", "Content of transaction to verify (used in verify command)")
	verifyBlock          = flag.Int("block", -1, "Block number for verification (used in verify command)")
	readBlock            = flag.Int("readblock", -1, "Specify the block number to read")
)

// Lưu blockchain vào file
func SaveBlockchain(bc *Blockchain) error {
	file, err := os.Create(blockchainFile)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	return encoder.Encode(bc)
}

// Load blockchain từ file
func LoadBlockchain() (*Blockchain, error) {
	file, err := os.Open(blockchainFile)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var bc Blockchain
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&bc)
	return &bc, err
}

func main() {
	flag.Parse()

	// Load blockchain
	bc, err := LoadBlockchain()
	if err != nil {
		// Tạo mới một blockchain nếu không load được
		bc = NewBlockchain()
	}

	// Kiểm tra các command và thực hiện các hành động tương ứng
	switch *command {
	case "add":
		// Thêm vào một số block với số lượng transaction cho trước
		for i := 0; i < *numBlocks; i++ {
			transactions := []*Transaction{}
			for j := 0; j < *transactionsPerBlock; j++ {
				// Sử dụng blockData cho trước hoặc sử dụng giá trị mặc định nếu không có
				data := *blockData
				if data == "" {
					data = fmt.Sprintf("Transaction %d", (i*(*transactionsPerBlock))+j+1)
				}
				transactions = append(transactions, &Transaction{[]byte(data)})
			}
			bc.AddBlock(transactions)
		}
		fmt.Printf("Added %d blocks with %d transactions per block.\n", *numBlocks, *transactionsPerBlock)

	case "read":
		// Tạo một block mới với transaction cho trước
		if *readBlock != -1 {
			if *readBlock < 0 || *readBlock >= len(bc.Blocks) {
				fmt.Println("Error: Invalid block number.")
				os.Exit(1)
			}
			fmt.Printf("\nreading Block: %d\n", *readBlock)
			fmt.Printf("\nBlock %d\n", *readBlock)
			fmt.Printf("Prev. hash: %x\n", bc.Blocks[*readBlock].PrevBlockHash)
			for _, tx := range bc.Blocks[*readBlock].Transactions {
				fmt.Printf("> Data: %s ", tx.Data)
			}
			fmt.Printf("\nHash: %x\n", bc.Blocks[*readBlock].Hash)
		} else { // Đọc tất cả các block
			fmt.Printf("\nreading Block: all\n")
			fmt.Printf("\nBlockchain:\n")

			// Đọc thông tin của từng block trong blockchain
			for i, block := range bc.Blocks {
				fmt.Printf("\nBlock %d\n", i)
				fmt.Printf("Prev. hash: %x\n", block.PrevBlockHash)
				for _, tx := range block.Transactions {
					fmt.Printf("> Data: %s ", tx.Data)
				}
				fmt.Printf("\nHash: %x\n", block.Hash)
			}
		}

	case "verify":
		// Xác thực một transaction trong blockchain
		if *verifyBlock != -1 {
			// Xác thực trong một block cụ thể
			if *verifyBlock < 0 || *verifyBlock >= len(bc.Blocks) {
				fmt.Println("Error: Invalid block number.")
				os.Exit(1)
			}
			verifyInBlock(bc, *verifyBlock, *verifyContent)
		} else {
			// Xác thực trong tất cả các block
			for i := range bc.Blocks {
				verifyInBlock(bc, i, *verifyContent)
			}
		}
	case "help":
		fmt.Println("\nAvailable commands:")
		fmt.Println("-command=add -numblocks=<number> -transactionsperblock=<number>")
		fmt.Println("-command=add -blockdata=<data>")
		fmt.Println("-command=read [-readblock=<block number>]")
		fmt.Println("-command=verify -verify=<transaction content> [-block=<block number>]")
		fmt.Println("-command=help")
		fmt.Println("\nFor example: ")
		fmt.Println("+ To add add multiple blocks with a specified number of transactions per block:\n go run . -command=add -numblocks=5 -transactionsperblock=2")
		fmt.Println("+ To add a block with a specific transaction:\n go run . -command=add -blockdata=\"Transaction Content\"")
		fmt.Println("+ To read blocks:\n go run . -command=read")
		fmt.Println("+ To read a specific block:\n go run . -command=read -readblock=2")
		fmt.Println("+ To verify a transaction in a specific block:\n go run . -command=verify -verify=\"Transaction Content\" -block=2")
		fmt.Println("+ To verify a transaction in all blocks:\n go run . -command=verify -verify=\"Transaction Content\"")
		fmt.Println("+ To verify the default transaction in all blocks:\n go run . -command=verify")

	default:
		fmt.Println("No specific command provided. Use 'go run . -command=help' to see available commands.")
	}

	// Lưu blockchain sau khi đã thay đổi
	err = SaveBlockchain(bc)
	if err != nil {
		fmt.Println("Error saving blockchain:", err)
	}
}

// Xác thực một transaction trong một block cụ thể
func verifyInBlock(bc *Blockchain, blockNumber int, verifyContent string) {
	block := bc.Blocks[blockNumber]
	fmt.Printf("\nVerifying transaction in Block %d\n", blockNumber)
	fmt.Printf("Check whether transaction with content '%s' is in block %x\n", verifyContent, block.Hash)
	merkleTree := NewMerkleTree(block.Transactions)
	verifyRes := merkleTree.Verify(*block, Transaction{[]byte(verifyContent)})
	fmt.Printf("Verify result: %v\n", verifyRes)
}
