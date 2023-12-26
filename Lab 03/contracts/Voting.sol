// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) private candidateLookup;
    mapping(address => bool) public voterLookup;

    uint256 public candidateCount = 0;

    event VoteEvent(address indexed voter, uint256 indexed candidateId);

    constructor() {
        addCandidate(unicode"Cat 🐈");
        addCandidate(unicode"Dog 🐕");
        addCandidate(unicode"Turtle 🐢");
        addCandidate(unicode"Fish 🐟");
        addCandidate(unicode"Bird 🐦");
        addCandidate(unicode"Snake 🐍");
    }

    function addCandidate(string memory name) private {
        candidateLookup[candidateCount] = Candidate(candidateCount, name, 0);
        candidateCount += 1;
    }

    function getCandidate(uint256 id)
        external
        view
        returns (Candidate memory candidate)
    {
        require(
            id <= candidateCount,
            "[getCandidate]: ID is greater than candidate count!"
        );
        candidate = candidateLookup[id];
    }

    function getAllCandidates()
        external
        view
        returns (string[] memory names, uint256[] memory voteCounts)
    {
        names = new string[](candidateCount);
        voteCounts = new uint256[](candidateCount);

        for (uint256 i = 0; i < candidateCount; i++) {
            names[i] = candidateLookup[i].name;
            voteCounts[i] = candidateLookup[i].voteCount;
        }
    }

    function vote(uint256 id) external payable {
        require(!voterLookup[msg.sender], "[vote]: You have already voted!");
        require(id <= candidateCount, "[vote]: ID not found!");
        require(
            msg.value == 1000 gwei,
            "[vote]: You need to send 1000 gwei (0.000001 ether) to vote!"
        );

        voterLookup[msg.sender] = true;
        candidateLookup[id].voteCount += 1;

        emit VoteEvent(msg.sender, id);
    }
}
