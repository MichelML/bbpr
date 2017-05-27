describe('pr.js', () => {
  it('should require without error', () => {
    expect(() => require('../../lib/pr')).not.toThrow()
  })

  describe('after require', () => {
    const pr = require('../../lib/pr')
    const str = require('../../lib/strings')
    const vcs = require('../../lib/vcs')
    const infoMock = {pullRequestAuthor: 'author', passwordBitBucket: 'password', repositoryOwner: 'owner'}

    describe('buildPullRequest', () => {
      it('should return an object with the postRequestUrl and postRequestJSON properties', () => {
        expect(pr.buildPullRequest(infoMock).postRequestUrl).toBeDefined()
        expect(pr.buildPullRequest(infoMock).postRequestJSON).toBeDefined()
      })

      it('should return an object with both properties being strings postRequestUrl and postRequestJSON properties', () => {
        expect(typeof pr.buildPullRequest(infoMock).postRequestUrl).toBe('string')
        expect(typeof pr.buildPullRequest(infoMock).postRequestJSON).toBe('string')
      })

      it('should have a proper postRequestUrl', () => {
        const userNamePassword = `${infoMock.pullRequestAuthor}:${infoMock.passwordBitBucket}`
        const url = `${str.bitBucketAPIUrl.replace('{authentication}', userNamePassword)}/${infoMock.repositoryOwner}/${vcs.getRepositoryName()}/pullrequests`
        expect(pr.buildPullRequest(infoMock).postRequestUrl).toBe(url)
      })

      it('should have a postRequestJSON property that can be parse to an object', () => {
        expect(typeof JSON.parse(pr.buildPullRequest(infoMock).postRequestJSON)).toBe('object')
      })
    })

    describe('getPullRequestJSON', () => {
      it('should return a string', () => {
        expect(typeof pr.getPullRequestJSON({})).toBe('string')
      })

      it('should parse to an object', () => {
        expect(typeof JSON.parse(pr.getPullRequestJSON({}))).toBe('object')
      })

      it('should contain all keys to make a bitbucket valid request', () => {
        const object = JSON.parse(pr.getPullRequestJSON({}))
        const mainKeys = ['title', 'description', 'source', 'destination', 'reviewers', 'close_source_branch'].forEach((prop) => {
          expect(Object.keys(object)).toContain(prop)
        })
      })
    })
  })
})
