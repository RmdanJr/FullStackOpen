import React from 'react'

const BlogForm = ({
  onSubmit,
  newTitle,
  handleTitleChange,
  newAuthor,
  handleAuthorChange,
  newUrl,
  handleUrlChange,
}) => (
  <>
    <h2>Add new blog</h2>
    <form id='blog-form' onSubmit={onSubmit}>
      <div>
        Title: <input value={newTitle} onChange={handleTitleChange} />
      </div>
      <div>
        Author: <input value={newAuthor} onChange={handleAuthorChange} />
      </div>
      <div>
        Url: <input value={newUrl} onChange={handleUrlChange} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  </>
)

export default BlogForm
