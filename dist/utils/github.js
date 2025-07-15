"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContent = getContent;
exports.getFileContent = getFileContent;
exports.createOrUpdateFile = createOrUpdateFile;
exports.deleteFile = deleteFile;
const rest_1 = require("@octokit/rest");
const env_1 = require("./env");
const octokit = new rest_1.Octokit({
    auth: env_1.ENV.GITHUB_TOKEN,
});
const REPO_PARAMS = {
    owner: env_1.ENV.REPO_OWNER,
    repo: env_1.ENV.REPO_NAME,
    branch: env_1.ENV.BRANCH || 'main',
};
async function getContent(folder) {
    const path = `${env_1.ENV.CONTENT_PATH}/${folder}`;
    const { data } = await octokit.rest.repos.getContent({
        ...REPO_PARAMS,
        path,
        ref: REPO_PARAMS.branch,
    });
    if (!Array.isArray(data))
        throw new Error('Unexpected data structure from GitHub');
    return data.filter(file => file.type === 'file' && file.name.endsWith('.md'));
}
async function getFileContent(path) {
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
async function createOrUpdateFile(path, content, message, sha) {
    await octokit.rest.repos.createOrUpdateFileContents({
        ...REPO_PARAMS,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        branch: REPO_PARAMS.branch,
        ...(sha ? { sha } : {}),
    });
}
async function deleteFile(path, sha, message) {
    await octokit.rest.repos.deleteFile({
        ...REPO_PARAMS,
        path,
        message,
        sha,
        branch: REPO_PARAMS.branch,
    });
}
