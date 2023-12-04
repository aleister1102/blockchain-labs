package main

import (
	"crypto/sha256"
)

// RootNode: node cao nhất của cây merkle (merkle root), merkleRoot: giá trị hash của RootNode, LeafNode: node lá của cây merkle
type MerkleTree struct {
	LeafNodes    []MerkleNode
	NonLeafNodes []MerkleNode
	RootNode     *MerkleNode
}

type MerkleNode struct {
	LeftNode  *MerkleNode
	RightNode *MerkleNode
	Data      []byte
}

// Tạo mới cây Merkle
func NewMerkleTree(dataOfTransactions [][]byte) *MerkleTree {
	var nodes []MerkleNode
	merkleTree := &MerkleTree{}

	// Nếu số lượng các node là lẻ thì nhân đôi node cuối cùng để thành chẵn (cây nhị phân đầy đủ)
	if len(dataOfTransactions)%2 != 0 {
		duplicatedData := dataOfTransactions[len(dataOfTransactions)-1]
		dataOfTransactions = append(dataOfTransactions, duplicatedData)
	}

	// Thêm tất cả các node lá vào LeafNodes
	for _, dataOfTransaction := range dataOfTransactions {
		leafNode := NewMerkleNode(nil, nil, dataOfTransaction)

		// cập nhật nodes với các node lá
		nodes = append(nodes, *leafNode)
		merkleTree.LeafNodes = append(merkleTree.LeafNodes, *leafNode)
	}

	// Tính toán lại các node mới (branch) dựa vào các child nodes và lưu lại vào NonLeafNodes
	for len(nodes) > 1 {
		var newLevel []MerkleNode

		// Chạy từng cặp node (j, j+1)
		for j := 0; j < len(nodes); j += 2 {
			innerNode := NewMerkleNode(&nodes[j], &nodes[j+1], nil)
			newLevel = append(newLevel, *innerNode)
			merkleTree.NonLeafNodes = append(merkleTree.NonLeafNodes, *innerNode)
		}

		// cập nhật nodes với branches (tập hợp các node mới)
		nodes = newLevel
	}

	// Gán RootNode là giá trị đầu tiên của nodes (node cao nhất trong cây)
	merkleTree.RootNode = &nodes[0]

	return merkleTree
}

// NewMerkleNode: Tạo một merkle node mới
func NewMerkleNode(left, right *MerkleNode, data []byte) *MerkleNode {
	merkleNode := &MerkleNode{}

	// Nếu là node lá thì hash data và lưu lại vào giá trị đã hash
	if left == nil && right == nil {
		hash := sha256.Sum256(data)
		merkleNode.Data = hash[:]
		// Nếu không là node là thì lấy giá trị hash của left + right (left và right đã được hash)
	} else {
		prevHash := append(left.Data, right.Data...)

		// hash(A | B)
		hash := sha256.Sum256(prevHash)
		merkleNode.Data = hash[:]
	}

	// Cập nhật các child nodes
	merkleNode.LeftNode = left
	merkleNode.RightNode = right

	return merkleNode
}
