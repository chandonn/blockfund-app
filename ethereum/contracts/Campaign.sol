// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;

contract CampaignFactory {
    address[] public deployedCampaigns;

    constructor() {
        
    }

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description; // what is the money for
        uint value; // how much is the manager wants to spend
        address payable recipient; // who is to receive the money
        bool complete; // if the request is completed, can't be reprocessed
        uint approvalCount; // number os approvers in the request
        mapping(address => bool) approvals; // addresses that has voted YES to the request
    }

    address public manager; // the manager of the project
    uint public minimumContribution; // minimum value to be sent as contribution
    mapping(address => bool) public approvers; // list of contributors to approve the requests
    uint public approversCount; // number os contributors, since we are using a mapping to store them
    Request[] public requests; // requests list

    // we usualy place function modifiers above the constructor
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // constructor
    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);

        approvers[msg.sender] = true; // creates a look up to the value passed as the key
        // by doing so, if we were to approvers[msg.sender], the value should return true, 
        // or false if the value is not in the list
        approversCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient) public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        // create a storage variable to reference the request at hand
        Request storage request = requests[index];

        require(approvers[msg.sender]); // the user needs to be in the contributors list: approvers
        require(!request.approvals[msg.sender]); // the user can approve only once per request

        // time to vote!
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));

        request.recipient.transfer(request.value);
        request.complete = true;
    }
}
