const fs = require('fs')
describe('pre-install.js', () => {
  let fsExistsSync
  let fsWriteFileSync
  let fsReadFileSync
  let fsUnlinkSync

  it('should require without error', () => {
    expect(() => require('../pre-install')).not.toThrow()
  })

  describe('after require (writeBackupConfig)', () => {
    const preInstall = require('../pre-install')

    beforeEach(() => {
      fsExistsSync = spyOn(fs, 'existsSync')
      fsWriteFileSync = spyOn(fs, 'writeFileSync')
      fsReadFileSync = spyOn(fs, 'readFileSync')
    })

    it('should not call fsWriteFileSync on require only', () => {
      require('../pre-install')
      expect(fsWriteFileSync).not.toHaveBeenCalled()
    })

    it('should check if a bbpr.backup.config.js file exists', () => {
      preInstall.backupConfig()
      expect(fsExistsSync.calls.mostRecent().args[0]).toContain(preInstall.srcPath)
    })

    it('should do nothing else if no config file exists', () => {
      fsExistsSync.and.returnValue(false)
      preInstall.backupConfig()
      expect(fsWriteFileSync).not.toHaveBeenCalled()
      expect(fsReadFileSync).not.toHaveBeenCalled()
    })

    describe('if file exists', () => {
      beforeEach(() => {
        fsExistsSync.and.returnValue(true)
      })

      it('should write the backup file with the existing sourceFile content', () => {
        fsReadFileSync.and.returnValue(preInstall.srcPath) // fake content
        preInstall.backupConfig()
        expect(fsWriteFileSync.calls.mostRecent().args).toEqual([preInstall.destPath, preInstall.srcPath])
      })
    })
  })
})
