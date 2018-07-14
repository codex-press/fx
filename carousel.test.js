import * as carousel from './carousel.js'

describe('Carousel', () => {
  let fxCarousel

  beforeEach(() => {
    fxCarousel = '<fx-carousel><img src=""></fx-carousel>'

    document.body.innerHTML = '<fx-carousel><img src=""></fx-carousel>'
  }) 

  it('createElement', () => {
    expect(document.body.innerHTML).to.equal(fxCarousel)
  })

  it('checkShadow', done => {
    console.log(document.body)

    let shadow = document.querySelector('#shadow-root')

    expect(shadow).to.exist

    done()
  })

})