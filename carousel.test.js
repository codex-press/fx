import './carousel.js'

describe('Carousel', () => {

  beforeEach(() => {
    document.body.innerHTML = '<fx-carousel><img src=""><img src=""><img src=""></fx-carousel>'
  }) 

  it('has a shadowDOM', () => {
    assert(document.querySelector('fx-carousel').shadowRoot)
  })

  describe('click next and prev buttons', () => {
    let fxCarousel
    let shadow
    let strip
    let initialRect
    let initialSlideIndex

    beforeEach(() => {
      fxCarousel = document.querySelector('fx-carousel')
      shadow = fxCarousel.shadowRoot
      strip = shadow.querySelector('.strip')
      initialRect = strip.getBoundingClientRect()
      initialSlideIndex = fxCarousel.slideIndex
    })

    it('_slideIndex starts at 0', () => {
      assert(initialSlideIndex === 0)
    })

    it('click next button', () => {

      shadow.querySelector('.next-slide').click()
      let nextStrip = strip.getBoundingClientRect()
      assert(initialRect !== nextStrip)

    })

    it('click previous button', () => {

      shadow.querySelector('.previous-slide').click()
      let prevStrip = strip.getBoundingClientRect()
      assert(initialRect !== prevStrip)

    })

    it('run goToNext()', () => {

      fxCarousel.goToNext()
      let nextSlideIndex = fxCarousel.slideIndex
      assert.equal(nextSlideIndex, initialSlideIndex + 1, 'increases slideIndex by 1')

    })

    it('goToPrevious()', () => {

      if(initialSlideIndex <= 0) {
        fxCarousel.slideIndex = 1
        initialSlideIndex = fxCarousel.slideIndex
      }
      fxCarousel.goToPrevious()
      let previousSlideIndex = fxCarousel.slideIndex
      assert.equal(previousSlideIndex, initialSlideIndex - 1, 'decreases slideIndex by 1')

    })
    
  })

})
