import { Request, Response } from 'express';
import * as github from '../utils/github';

export async function getAllContent(req: Request, res: Response) {
  try {
    const posts = await github.getContent('posts');
    const pages = await github.getContent('pages');
    res.json({ success: true, data: [...posts, ...pages] });
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch content' });
  }
}

export async function createContent(req: Request, res: Response) {
  const { type, content, message, filename } = req.body;
  if (!type || !content || !message || !filename) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const path = `content/${type}/${filename}`;
    const result = await github.createOrUpdateFile(path, content, message);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).json({ success: false, error: 'Failed to create content' });
  }
}

export async function updateContent(req: Request, res: Response) {
  const { type, content, message, filename, sha } = req.body;
  if (!type || !content || !message || !filename || !sha) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const path = `content/${type}/${filename}`;
    const result = await github.createOrUpdateFile(path, content, message, sha);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error updating content:', err);
    res.status(500).json({ success: false, error: 'Failed to update content' });
  }
}

export async function deleteContent(req: Request, res: Response) {
  const { type, filename, message, sha } = req.body;
  if (!type || !filename || !message || !sha) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const path = `content/${type}/${filename}`;
    const result = await github.deleteFile(path, message, sha);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error deleting content:', err);
    res.status(500).json({ success: false, error: 'Failed to delete content' });
  }
}
