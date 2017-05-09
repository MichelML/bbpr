describe('reviewers.js', () => {
  it('should require without error', () => {
    expect(() => require('../../lib/reviewers')).not.toThrow()
  })

  describe('after require', () => {
    const reviewers = require('../../lib/reviewers')
    const currentUserName = 'testuser'
    let defaultReviewers
    let addedReviewers

    beforeAll(() => {
      defaultReviewers = reviewers.reviewers.default.slice()
      addedReviewers = reviewers.reviewers.potential.slice()
    })

    beforeEach(() => {
      reviewers.reviewers.default = []
      reviewers.reviewers.potential = []
    })

    afterAll(() => {
      reviewers.reviewers.default = defaultReviewers
      reviewers.reviewers.potential = addedReviewers
    })

    describe('getAllReviewers', () => {
      it('should return the default reviewers with the additional reviewers in the properly suited format', () => {
        expect(reviewers.getAllReviewers([])).toEqual([])
        expect(reviewers.getAllReviewers(['testuser'])).toEqual([{username: 'testuser'}])

        reviewers.reviewers.default = ['testuser2']
        expect(reviewers.getAllReviewers(['testuser'])).toEqual([{username: 'testuser2'}, {username: 'testuser'}])
      })

      it('should remove the current user if present in the reviewers', () => {
        expect(reviewers.getAllReviewers([currentUserName], currentUserName)).toEqual([])

        reviewers.reviewers.default = [currentUserName]
        expect(reviewers.getAllReviewers([currentUserName], currentUserName)).toEqual([])

        reviewers.reviewers.default = [currentUserName]
        expect(reviewers.getAllReviewers([currentUserName], currentUserName)).toEqual([])
      })
    })

    describe('retrieveAddedReviewer', () => {
      it('should return an empty array if function takes a falsy value as argument', () => {
        ['', 0, undefined, null, false].forEach((value) => {
          expect(reviewers.retrieveAddedReviewers(value)).toEqual([])
        })
      })

      it('should return an array of one if it takes any string while having no potential reviewers', () => {
        expect(reviewers.retrieveAddedReviewers('')).toEqual([])
        expect(reviewers.retrieveAddedReviewers('anystring')).toEqual([])
        expect(reviewers.retrieveAddedReviewers('anystring,with,comma')).toEqual([])
        expect(reviewers.retrieveAddedReviewers('anystring with spaces')).toEqual([])
      })

      it('should return an array of one reviewer if reviewer provided is in potential reviewers', () => {
        const potentialReviewer = 'potentialReviewer'
        reviewers.reviewers.potential = ['potentialReviewer']

        expect(reviewers.retrieveAddedReviewers(potentialReviewer)).toEqual([potentialReviewer])
      })

      it('should return an array of one reviewer if reviewer provided is in potential reviewers (with spaces in string)', () => {
        const potentialReviewer = 'potentialReviewer'
        reviewers.reviewers.potential = ['potentialReviewer']

        expect(reviewers.retrieveAddedReviewers(` ${potentialReviewer}`)).toEqual([potentialReviewer])
        expect(reviewers.retrieveAddedReviewers(`${potentialReviewer} `)).toEqual([potentialReviewer])
        expect(reviewers.retrieveAddedReviewers(` ${potentialReviewer} `)).toEqual([potentialReviewer])
        expect(reviewers.retrieveAddedReviewers(`    ${potentialReviewer}   `)).toEqual([potentialReviewer])
      })

      it('should return an array of one reviewer if reviewer provided is in potential reviewers (with spaces in string)', () => {
        const potentialReviewer = 'potentialReviewer'
        reviewers.reviewers.potential = [potentialReviewer]

        expect(reviewers.retrieveAddedReviewers(` ${potentialReviewer}`)).toEqual([potentialReviewer])
        expect(reviewers.retrieveAddedReviewers(`${potentialReviewer} `)).toEqual([potentialReviewer])
        expect(reviewers.retrieveAddedReviewers(` ${potentialReviewer} `)).toEqual([potentialReviewer])
        expect(reviewers.retrieveAddedReviewers(`    ${potentialReviewer}   `)).toEqual([potentialReviewer])
      })

      it('should return an array of multiple reviewers if reviewers provided are in potential reviewers', () => {
        const potentialReviewers = ['potentialReviewer', 'potentialReviewer2', 'potentialReviewer3']
        reviewers.reviewers.potential = potentialReviewers

        expect(reviewers.retrieveAddedReviewers('potentialReviewer,potentialReviewer2,potentialReviewer3')).toEqual(potentialReviewers)
        expect(reviewers.retrieveAddedReviewers('potentialReviewer, potentialReviewer2, potentialReviewer3')).toEqual(potentialReviewers)
        expect(reviewers.retrieveAddedReviewers('   potentialReviewer  ,   potentialReviewer2,  potentialReviewer3  ')).toEqual(potentialReviewers)
      })

      it('should filter out users not in potential reviewers (test with multiple reviewers)', () => {
        const potentialReviewers = ['potentialReviewer', 'potentialReviewer2', 'potentialReviewer3']
        reviewers.reviewers.potential = potentialReviewers

        expect(reviewers.retrieveAddedReviewers('potentialReviewer,potentialReviewer2,potentialReviewer3, filteredOut')).toEqual(potentialReviewers)
        expect(reviewers.retrieveAddedReviewers('potentialReviewer, filteredOut, filteredOut, potentialReviewer2, , filteredOut, potentialReviewer3')).toEqual(potentialReviewers)
      })
    })
  })
})
