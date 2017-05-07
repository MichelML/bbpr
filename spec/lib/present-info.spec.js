describe('present-info.js', () => {
  const vcs = require('../../lib/vcs')
  const reviewStrings = require('../../lib/strings').infoReview

  beforeEach(() => {
    spyOn(vcs, 'getCurrentBranchName').and.returnValue('feature-branch')
    spyOn(vcs, 'getRepositoryName').and.returnValue('testrepo')
  })

  it('should require without error', () => {
    expect(() => require('../../lib/present-info')).not.toThrow()
  })

  describe('after require', () => {
    const presentInfo = require('../../lib/present-info')
    const reviewer = 'reviewer'
    const args = ['destinationBranch', 'pullRequestTitle', 'pullRequestDescription', ['reviewer'], 'repositoryOwner', 'pullRequestAuthor']
    let log
    beforeEach(() => {
      log = spyOn(console, 'log')
    })

    it('should log only one time to the console', () => {
      presentInfo(...args)
      expect(log).toHaveBeenCalledTimes(1)
    })

    it('should log a string containing all the arguments pass to it', () => {
      presentInfo(...args)
      args.forEach(arg => {
        if (typeof arg === 'string') expect(log.calls.mostRecent().args[0]).toContain(arg)
        if (typeof arg === 'array') expect(log.calls.mostRecent().args[0]).toContain(arg[0])
      })
    })

    it('should log a string containing all the review strings', () => {
      presentInfo(...args)
      for (let str in reviewStrings) {
        expect(log.calls.mostRecent().args[0]).toContain(reviewStrings[str])
      }
    })
  })
})
