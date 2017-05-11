const fs = require('fs')
describe('post-install.js', () => {
  let fsExistsSync
  let fsWriteFileSync
  let fsReadFileSync
  let fsUnlinkSync

  it('should require without error', () => {
    expect(() => require('../post-install')).not.toThrow()
  })

  describe('after require (writeBackupConfig)', () => {
    const postInstall = require('../post-install')

    beforeEach(() => {
      fsExistsSync = spyOn(fs, 'existsSync')
      fsWriteFileSync = spyOn(fs, 'writeFileSync')
      fsReadFileSync = spyOn(fs, 'readFileSync')
      fsUnlinkSync = spyOn(fs, 'unlinkSync')
    })

    it('should not call fsWriteFileSync on require only', () => {
      require('../post-install')
      expect(fsWriteFileSync).not.toHaveBeenCalled()
    })

    it('should check if a bbpr.backup.config.js file exists', () => {
      postInstall.writeBackupConfig()
      expect(fsExistsSync.calls.mostRecent().args[0]).toContain(postInstall.srcPath)
    })

    it('should do nothing else if bbpr.backup.config.js file does not exists', () => {
      fsExistsSync.and.returnValue(false)
      postInstall.writeBackupConfig()
      expect(fsWriteFileSync).not.toHaveBeenCalled()
      expect(fsReadFileSync).not.toHaveBeenCalled()
      expect(fsUnlinkSync).not.toHaveBeenCalled()
    })

    describe('if file exists', () => {
      beforeEach(() => {
        fsExistsSync.and.returnValue(true)
      })

      it('should write the config file with the existing backup config file', () => {
        fsReadFileSync.and.returnValue(postInstall.srcFileName)
        postInstall.writeBackupConfig()
        expect(fsWriteFileSync.calls.mostRecent().args).toEqual([postInstall.destPath, postInstall.srcFileName])
      })

      it('should delete the backup config file', () => {
        fsReadFileSync.and.returnValue(postInstall.srcFileName)
        postInstall.writeBackupConfig()
        expect(fsUnlinkSync.calls.mostRecent().args).toEqual([postInstall.srcPath])
      })
    })
  })
})
