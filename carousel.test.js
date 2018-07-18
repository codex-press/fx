import './carousel.js'

describe('Carousel', () => {

  it('has a shadow DOM', () => {
    document.body.innerHTML = '<fx-carousel></fx-carousel>'
    assert(document.querySelector('fx-carousel').shadowRoot)
  })


  it('slideIndex starts at 0', () => {
    document.body.innerHTML = '<fx-carousel></fx-carousel>'
    assert.equal(document.querySelector('fx-carousel').slideIndex, 0)
  })


  it('click next button', done => {
    document.body.innerHTML = (`
      <fx-carousel>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    const slide = document.querySelector('fx-carousel div + div')
    assert.equal(
      slide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().right,
      'second slide starts at the right'
    )

    const shadowRoot = document.querySelector('fx-carousel').shadowRoot
    shadowRoot.querySelector('.next-slide').click()

    setTimeout(() => {
      assert.equal(
        slide.getBoundingClientRect().left,
        carousel.getBoundingClientRect().left,
        'second slide is now in view'
      )
      done()
    }, 320)
  })


  it('click previous button', () => {
    shadow.querySelector('.previous-slide').click()
    let prevStrip = strip.getBoundingClientRect()
    assert.notEqual(initialRect.left, prevStrip.left)
  })


  it('run goToNext()', () => {

    fxCarousel.goToNext()
    let nextSlideIndex = fxCarousel.slideIndex
    assert.equal(
      nextSlideIndex,
      initialSlideIndex + 1,
      'increases slideIndex by 1'
    )
  })


  it('goToPrevious()', () => {
    document.body.innerHTML = (`
      <fx-carousel>
        <div></div>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 2
    carousel.goToPrevious()
    assert.equal(
      carousel.slideIndex,
      1,
      'decreases slideIndex by 1'
    )
  })


  it('goToPrevious() won\'t go to a negative index', () => {
    document.body.innerHTML = (`
      <fx-carousel>
        <div></div>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 0
    carousel.goToPrevious()
    assert.equal(
      carousel.slideIndex,
      0,
      'slideIndex is still 0'
    )
  })


  it('goToPrevious() won\'t go to a negative index', () => {
    document.body.innerHTML = (`
      <fx-carousel>
        <div></div>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 0
    carousel.goToPrevious()
    assert.equal(
      carousel.slideIndex,
      0,
      'slideIndex is still 0'
    )
  })



})
