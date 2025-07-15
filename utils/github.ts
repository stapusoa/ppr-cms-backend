import { Octokit } from '@octokit/rest';
import { ENV } from './env';

const octokit = new Octokit({
  auth: ENV.GITHUB_TOKEN,
});

const REPO_PARAMS = {
  owner: ENV.REPO_OWNER,
  repo: ENV.REPO_NAME,
  branch: ENV.BRANCH || 'main',
};

export async function getContent(folder: 'posts' | 'pages') {
  const path = `${ENV.CONTENT_PATH}/${folder}`;
  const { data } = await octokit.rest.repos.getContent({
    ...REPO_PARAMS,
    path,
    ref: REPO_PARAMS.branch,
  });

  if (!Array.isArray(data)) throw new Error('Unexpected data structure from GitHub');
  return data.filter(file => file.type === 'file' && file.name.endsWith('.md'));
}

export async function getFileContent(path: string): Promise<{ content: string; sha: string }> {
  const { data } = await octokit.rest.repos.getContent({
    ...REPO_PARAMS,
    path,
    ref: REPO_PARAMS.branch,
  });

  if ('content' in data && typeof data.content === 'string') {
    return {
      content: Buffer.from(data.content, 'base64').toString('utf-8'),
      sha: data.sha,
    };
  }
  throw new Error('Invalid file content');
}

export async function createOrUpdateFile(path: string, content: string, message: string, sha?: string) {
  await octokit.rest.repos.createOrUpdateFileContents({
    ...REPO_PARAMS,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    branch: REPO_PARAMS.branch,
    ...(sha ? { sha } : {}),
  });
}

export async function deleteFile(path: string, sha: string, message: string) {
  await octokit.rest.repos.deleteFile({
    ...REPO_PARAMS,
    path,
    message,
    sha,
    branch: REPO_PARAMS.branch,
  });
}