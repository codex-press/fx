import './carousel.js'

describe('Carousel', () => {

  beforeEach(() => {
    document.body.innerHTML = '<fx-carousel><img src=""></fx-carousel>'
  }) 


  it('has a shadowDOM', () => {
    assert(document.querySelector('fx-carousel').shadowRoot)
  })

})
