describe('pull-request.js', () => {
  const vcs = require('../lib/vcs')
  beforeEach(() => {
    spyOn(vcs, 'handleErrorsOnNonExistingVCSRepository')
  })

  it('should require without error', () => {
    expect(() => require('../pull-request')).not.toThrow()
  })
})
