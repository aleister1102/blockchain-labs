const Voting = artifacts.require('../contracts/Voting.sol');

contract("Voting", function(accounts) {
  let voting;

  it("initializes with six candidates", function() {
      return Voting.deployed().then(function(instance) {
      return instance.candidateCount();
    }).then(function(count) {
      assert.equal(count, 6);
    });
  });
  
  it("it initializes the candidates with the correct values", function() {
      return Voting.deployed().then(function(instance) {
      voting = instance;
      return voting.getCandidate(0);
    }).then(function(candidate) {
      assert.equal(candidate[0], 0, "contains the correct id");
      assert.equal(candidate[1], "Cat 🐈", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return voting.getCandidate(1);
    }).then(function(candidate) {
      assert.equal(candidate[0], 1, "contains the correct id");
      assert.equal(candidate[1], "Dog 🐕", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return voting.getCandidate(2);
    }).then(function(candidate) {
      assert.equal(candidate[0], 2, "contains the correct id");
      assert.equal(candidate[1], "Turtle 🐢", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return voting.getCandidate(3);
    }).then(function(candidate) {
      assert.equal(candidate[0], 3, "contains the correct id");
      assert.equal(candidate[1], "Fish 🐟", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return voting.getCandidate(4);
    }).then(function(candidate) {
      assert.equal(candidate[0], 4, "contains the correct id");
      assert.equal(candidate[1], "Bird 🐦", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return voting.getCandidate(5);
    }).then(function(candidate) {
      assert.equal(candidate[0], 5, "contains the correct id");
      assert.equal(candidate[1], "Snake 🐍", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
    })
  });

  it("allows a voter to cast a vote", function() {
      return Voting.deployed().then(function(instance) {
      voting = instance;
      candidateId = 0;
      return voting.vote(candidateId, { from: accounts[0], value: 1e12});
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "an event was triggered");
      assert.equal(receipt.logs[0].event, "VoteEvent", "the event type is correct");
      assert.equal(receipt.logs[0].args.candidateId.toNumber(), candidateId, "the candidate id is correct");
      return voting.voterLookup(receipt.logs[0].args.voter);
    }).then(function(voted) {
      assert(voted, true);
      return voting.getCandidate(candidateId);
    }).then(function(candidate) {
      let voteCount = candidate[2];
      assert.equal(voteCount, 1, "increments the candidate's vote count");
    })
  });

  it("throws an exception for invalid candiates", function() {
      return Voting.deployed().then(function(instance) {
      voting = instance;
      return voting.vote(99, { from: accounts[1], value: 1e12 });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return voting.getAllCandidates();
    }).then(function(candidates) {
      let voteCount = candidates.voteCounts[0].toNumber();
      assert.equal(voteCount, 1, "Cat 🐈 did not receive any votes");
      voteCount = candidates.voteCounts[1].toNumber();
      assert.equal(voteCount, 0, "Dog 🐕 did not receive any votes");
      voteCount =candidates.voteCounts[2].toNumber();
      assert.equal(voteCount, 0, "Turtle 🐢 did not receive any votes");
      voteCount =candidates.voteCounts[3].toNumber();
      assert.equal(voteCount, 0, "Fish 🐟 did not receive any votes");
      voteCount =candidates.voteCounts[4].toNumber();
      assert.equal(voteCount, 0, "Bird 🐦 did not receive any votes");
      voteCount =candidates.voteCounts[5].toNumber();
      assert.equal(voteCount, 0, "Snake 🐍 did not receive any votes");
    });
  });

  it("throws an exception for double voting", function() {
      return Voting.deployed().then(async function(instance) {
      voting = instance;
      candidateId = 2;
      await voting.vote(candidateId, { from: accounts[2], value: 1e12 });
      return voting.getCandidate(candidateId);
    }).then(async function(candidate) {
      let voteCount = candidate[2];
      assert.equal(voteCount, 1, "accepts first vote");
      // Try to vote again
      return await voting.vote(candidateId, { from: accounts[2], value: 1e12 });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return voting.getAllCandidates();
    }).then(function(candidates) {
      let voteCount = candidates.voteCounts[0].toNumber();
      assert.equal(voteCount, 1, "Cat 🐈 did not receive any votes");
      voteCount = candidates.voteCounts[1].toNumber();
      assert.equal(voteCount, 0, "Dog 🐕 did not receive any votes");
      voteCount =candidates.voteCounts[2].toNumber();
      assert.equal(voteCount, 1, "Turtle 🐢 did not receive any votes");
      voteCount =candidates.voteCounts[3].toNumber();
      assert.equal(voteCount, 0, "Fish 🐟 did not receive any votes");
      voteCount =candidates.voteCounts[4].toNumber();
      assert.equal(voteCount, 0, "Bird 🐦 did not receive any votes");
      voteCount =candidates.voteCounts[5].toNumber();
      assert.equal(voteCount, 0, "Snake 🐍 did not receive any votes");
    });
  });
});