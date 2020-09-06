pragma solidity >=0.4.21 <0.6.0;

contract IDS {
	string IDSHash;

	//Write Function
	function set(string memory _IDSHash) public {
		IDSHash = _IDSHash;
	}
	
	//Read Function
	function get() public view returns (string memory) {
		return IDSHash;
	}
}