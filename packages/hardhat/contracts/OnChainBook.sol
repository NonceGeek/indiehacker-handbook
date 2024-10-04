// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OnChainBook {
    struct Book {
        string name;
        string description;
        address author;
        string[] fullContentArweaveIds;
    }

    struct Comment {
        address author;
        uint256 lineNum;
        string referWord;
        string content;
    }

    Book public book;
    Comment[] public comments;
    uint256 public commentCount;

    event BookCreated(string name, address author);
    event BookUpdated(string description, string[] fullContentArweaveIds);
    event CommentAdded(address author, uint256 lineNum, string referWord, string content);

    function createBook(string memory _name, string memory _description, string[] memory _fullContentArweaveIds) public {
        require(book.author == address(0), "Book already exists");
        book = Book(_name, _description, msg.sender, _fullContentArweaveIds);
        emit BookCreated(_name, msg.sender);
    }

    function updateBook(string memory _description, string[] memory _fullContentArweaveIds) public {
        require(msg.sender == book.author, "Only the author can update the book");
        book.description = _description;
        book.fullContentArweaveIds = _fullContentArweaveIds;
        emit BookUpdated(_description, _fullContentArweaveIds);
    }

    function addComment(uint256 lineNum, string memory referWord, string memory content) public {
        commentCount++;
        comments.push(Comment(msg.sender, lineNum, referWord, content));
        emit CommentAdded(msg.sender, lineNum, referWord, content);
    }
}