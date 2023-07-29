import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import useFetch from "../../useFetch";

const BlogDetails = () => {
  const { BlogId } = useParams();
  const history = useHistory();
  const { data: blog, isPending, error } = useFetch(
    `/api/data/${BlogId}`
  );
  const authors = [
    { value: "mario", label: "Mario" },
    { value: "luigi", label: "Luigi" }
  ]

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState(authors[0].value);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  // Update state with blog data once it is fetched
  useEffect(() => {
    if (blog) {
      setTitle(blog.Title);
      setBody(blog.Body);
      setAuthor(blog.Author);
    }
  }, [blog]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedBlog = { title, body, author };

    setIsPendingUpdate(true);

    fetch("/api/data/" + BlogId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBlog),
    })
      .then(() => {
        setIsPendingUpdate(false);
        setIsEditing(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating blog:", error);
        setIsPendingUpdate(false);
      });
  };

  const handleClick = () => {
    fetch("/api/data/" + BlogId, {
      method: "DELETE",
    })
      .then(() => {
        history.push("/BlogHome");
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
      });
  };

  return (
    <div className="blog-details">
      {isPending && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {blog && (
        <article>
          {!isEditing && <h2>{blog.data[0].Title}</h2>}
          {!isEditing && <p>Written by {blog.data[0].Author}</p>}
          {!isEditing && <div>{blog.data[0].Body}</div>}

          {isEditing && (
            <div className="create">
            <form onSubmit={handleSubmit}>
              <label>Blog Title:</label>
              <input
                type="text"
                required
                value={blog.data[0].Title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Blog body:</label>
              <textarea
                required
                value={blog.data[0].Body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
              <label>Blog author:</label>
              <select
                value={blog.data[0].Author}
                onChange={(e) => setAuthor(e.target.value)}
              >
                   {authors.map((author) => (
              <option key={author.value} value={author.value}>
                {author.label}
              </option>
          ))}
              </select>
              <button type="submit" disabled={isPendingUpdate}>
                {isPendingUpdate ? "Updating..." : "Update"}
              </button>
            </form>
            </div>
          )}

          {!isEditing && (
            <div>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleClick}>Delete</button>
            </div>
          )}
        </article>
      )}
    </div>
  );
};

export default BlogDetails;