describe('open.js', () => {
  const shell = require('shelljs')
  let exec
  let tempFileName

  beforeEach(() => {
    exec = spyOn(shell, 'exec')
    tempFileName = 'tempFileName'
  })

  it('should require without error', () => {
    expect(() => require('../../lib/open')).not.toThrow()
  })

  describe('after require', () => {
    let open = require('../../lib/open')

    beforeEach(() => {
      open(tempFileName)
    })

    it('should call shell exec with a platform dependent open command and the file name provided', () => {
      if (process.platform === 'darwin') expect(exec).toHaveBeenCalledWith(`open ${tempFileName}`)
      if (process.platform === 'win32') expect(exec).toHaveBeenCalledWith(`start ${tempFileName}`)
      if (process.platform === 'anythingelse') expect(exec).toHaveBeenCalledWith(`xdg-open ${tempFileName}`)
    })
  })
})
