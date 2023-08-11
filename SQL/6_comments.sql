CREATE TABLE comments (
  CommentId INT AUTO_INCREMENT PRIMARY KEY,
  BlogId INT,
  Comment_Author VARCHAR(255),
  Comment_Body VARCHAR(400),
  username VARCHAR (45),
   INDEX (username),
   INDEX (BlogId),
  FOREIGN KEY (username) REFERENCES login_app(username),
  FOREIGN KEY (BlogId) REFERENCES blogs(BlogId) ON DELETE CASCADE
);