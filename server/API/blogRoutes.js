const express = require('express');
module.exports = (db, jwt, SECRET,  authenticate) => {
  const router = express.Router();
  router.get('/', authenticate, async (req, res) => {
    const blogs = await db.Blog.findAll();
    res.status(200).json(blogs);
  });

  router.get('/:id', authenticate, async (req, res) => {
    const blog = await db.Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }
    res.status(200).json(blog);
  });

  router.post('/', authenticate, async (req, res) => {
    const { title, description } = req.body;
    const blog = await db.Blog.create({ title, description, userId: req.userId });
    res.status(201).json(blog);
  });

  router.put('/:id', authenticate, async (req, res) => {
    const blog = await db.Blog.findByPk(req.params.id);

    if (blog.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to edit this blog.' });
    }

    blog.title = req.body.title;
    blog.description = req.body.description;
    await blog.save();

    res.status(200).json(blog);
  });

  router.delete('/:id', authenticate, async (req, res) => {
    const blog = await db.Blog.findByPk(req.params.id);

    if (blog.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this blog.' });
    }

    await blog.destroy();
    res.status(204).json({ success: true });
  });
  return router;
};
