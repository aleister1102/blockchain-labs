package main

import (
	"bytes"
	"crypto/sha256"
	"fmt"
	"time"
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
func NewMerkleTree(dataOfTxs []*Transaction) *MerkleTree {
	var nodes []MerkleNode
	merkleTree := &MerkleTree{}

	// Nếu số lượng các node là lẻ thì nhân đôi node cuối cùng để thành chẵn (cây nhị phân đầy đủ)
	if len(dataOfTxs)%2 != 0 {
		duplicatedData := dataOfTxs[len(dataOfTxs)-1]
		dataOfTxs = append(dataOfTxs, duplicatedData)
	}

	// Thêm tất cả các node lá vào LeafNodes
	for _, dataOfTx := range dataOfTxs {
		leafNode := NewMerkleNode(nil, nil, *dataOfTx)

		// cập nhật nodes với các node lá
		nodes = append(nodes, *leafNode)
		merkleTree.LeafNodes = append(merkleTree.LeafNodes, *leafNode)
	}

	// Tính toán lại các node mới (branch) dựa vào các child nodes và lưu lại vào NonLeafNodes
	for len(nodes) > 1 {
		var newLevel []MerkleNode

		// Chạy từng cặp node (j, j+1)
		for j := 0; j < len(nodes); j += 2 {
			innerNode := NewMerkleNode(&nodes[j], &nodes[j+1], Transaction{})
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
func NewMerkleNode(left, right *MerkleNode, tx Transaction) *MerkleNode {
	merkleNode := &MerkleNode{}

	// Nếu là node lá thì hash data và lưu lại vào giá trị đã hash
	if left == nil && right == nil {
		hash := sha256.Sum256(tx.Data)
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

func (m *MerkleNode) String() string {
	return fmt.Sprintf("%x", m.Data)
}

// TODO: refactor lại để xóa những dòng code bị thừa
func (mt *MerkleTree) Verify(b Block, tx Transaction) bool {
	merklePath, indexes := mt.getMerklePath(tx)

	// Nếu Merkle path là nil thì không tồn tại transaction trong cây
	if len(merklePath) == 0 {
		return false
	}

	// Tính toán lại hash của transaction
	current := tx
	hashData := sha256.Sum256(tx.Data)
	current.Data = hashData[:]

	// Lặp qua các phần tử trong Merkle path
	for i, node := range merklePath {
		var data []byte

		// Nếu là node bên trái thì nối node bên phải vào và ngược lại
		if indexes[i] == 0 {
			data = append(current.Data, node.Data...)
		} else {
			data = append(node.Data, current.Data...)
		}

		hash := sha256.Sum256(data)
		current.Data = hash[:]
	}

	// Tính toán lại hash của block với Merkle root hash vừa xây dựng được
	timestamp := []byte(time.Unix(b.Timestamp, 0).String())
	merkleRoot := current.Data
	headers := bytes.Join([][]byte{b.PrevBlockHash, merkleRoot, timestamp}, []byte{})
	hash := sha256.Sum256(headers)

	// Kiểm tra hash vừa tính với hash của block
	return bytes.Equal(hash[:], b.Hash)
}

func (mt MerkleTree) getMerklePath(tx Transaction) ([]MerkleNode, []int64) {
	// Lặp qua tất cả các leafNodes và kiểm tra xem có tồn tại transaction trong leafNodes không.
	// (đáng lẽ đã có thể trả về từ lúc này)
	for _, current := range mt.LeafNodes {
		hash := sha256.Sum256(tx.Data)
		hashData := hash[:]
		compareResult := bytes.Compare(current.Data, hashData)

		// Nếu tồn tại thì xây dựng Merkle path
		if compareResult == 0 {
			var merklePath []MerkleNode
			var indexes []int64 // mảng đánh dấu cho biết là node bên trái hay bên phải

			for !mt.isMerkleRoot(current) {

				// TODO: tối ưu vòng lặp này vì nó đang lặp qua tất cả các nonLeafNode
				for _, nonLeafNode := range mt.NonLeafNodes {
					// Nếu là node bên trái thì add node bên phải và ngược lại
					if bytes.Equal(nonLeafNode.LeftNode.Data, current.Data) {
						merklePath = append(merklePath, *nonLeafNode.RightNode)
						indexes = append(indexes, 0) // 0 là node bên trái
						current = nonLeafNode
					} else if bytes.Equal(nonLeafNode.RightNode.Data, current.Data) {
						merklePath = append(merklePath, *nonLeafNode.LeftNode)
						indexes = append(indexes, 1) // 1 là node bên phải
						current = nonLeafNode
					}

				}
			}
			
			return merklePath, indexes
		}
	}

	return nil, nil
}

func (mt *MerkleTree) isMerkleRoot(n MerkleNode) bool {
	return bytes.Equal(n.Data, mt.RootNode.Data)
}
