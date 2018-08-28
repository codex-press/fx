import './carousel.js'
import { arrows, indicators } from './carousel-icons.js'
import * as animate from '/parent/core/animate.js'


describe('Carousel', () => {

  beforeEach(done => {
    document.body.innerHTML = (`
      <fx-carousel>
        <div></div>
        <div></div>
        <div></div>
      </fx-carousel>
    `)

    document
      .querySelector('fx-carousel')
      .shadowRoot
      .querySelector('link')
      .addEventListener('load', () => done())

  })


  it('has a shadow DOM', () => {
    assert(document.querySelector('fx-carousel').shadowRoot)
  })


  it('slideIndex starts at 0', () => {
    assert.equal(document.querySelector('fx-carousel').slideIndex, 0)
  })


  it('click next button', () => {
    const clock = sinon.useFakeTimers()
    const carousel = document.querySelector('fx-carousel')
    const nextSlide = document.querySelector('fx-carousel div + div')
    
    assert.isAtLeast(
      nextSlide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().right,
      'second slide is out of view'
    )

    const shadowRoot = document.querySelector('fx-carousel').shadowRoot
    shadowRoot.querySelector('.next-slide').click()

    clock.tick(320)

    assert.closeTo(
      nextSlide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().left,
      0.5,
      'second slide is in view'
    )

    clock.restore()
  })


  it('click previous button', () => {
    const clock = sinon.useFakeTimers()
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1
    const slide = document.querySelector('fx-carousel div')
    
    clock.tick(320)

    assert.isAtLeast(
      slide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().right,
      'first slide is out of view'
    )

    const shadowRoot = document.querySelector('fx-carousel').shadowRoot
    shadowRoot.querySelector('.previous-slide').click()

    clock.tick(320)

    assert.equal(
      slide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().left,
      'first slide is in view'
    )

    clock.restore()
  })


  it('click next button twice', () => {
    const clock = sinon.useFakeTimers()
    const carousel = document.querySelector('fx-carousel')
    const nextSlide = document.querySelector('fx-carousel div + div + div')
    
    assert.isAtLeast(
      nextSlide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().right,
      'second slide is out of view'
    )

    const shadowRoot = document.querySelector('fx-carousel').shadowRoot
    shadowRoot.querySelector('.next-slide').click()

    clock.tick(320)

    shadowRoot.querySelector('.next-slide').click()

    assert.isAtLeast(
      nextSlide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().right,
      'second slide is out of view'
    )

    clock.tick(320)

    assert.closeTo(
      nextSlide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().left,
      1,
      'second slide is in view'
    )

    clock.restore()
  })


  it('click previous button twice', () => {
    const clock = sinon.useFakeTimers()
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 2
    const slide = document.querySelector('fx-carousel div')
    
    clock.tick(320)

    assert.isAtLeast(
      slide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().right,
      'first slide is out of view'
    )

    const shadowRoot = document.querySelector('fx-carousel').shadowRoot
    shadowRoot.querySelector('.previous-slide').click()

    clock.tick(320)

    assert.isAtLeast(
      slide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().right,
      'first slide is out of view'
    )

    shadowRoot.querySelector('.previous-slide').click()

    clock.tick(320)

    assert.equal(
      slide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().left,
      'first slide is in view'
    )

    clock.restore()
  })


  it('goToNext() decreases the slide index', () => {
    const clock = sinon.useFakeTimers()
    const carousel = document.querySelector('fx-carousel')
    carousel.goToNext()
    clock.tick(320)
    assert.equal(carousel.slideIndex, 1, 'increases slideIndex from 0 to 1')
    clock.restore()
  })


  it('goToPrevious() decreases the slideIndex', () => {
    const clock = sinon.useFakeTimers()
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1
    clock.tick(320)
    carousel.goToPrevious()
    clock.tick(320)
    assert.equal(carousel.slideIndex, 0, 'decreases slideIndex from 1 to 0')
    clock.restore()
  })


  it('goToPrevious() won\'t go to a negative index', () => {
    const clock = sinon.useFakeTimers()
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 0
    carousel.goToPrevious()
    clock.tick(320)
    assert.equal(carousel.slideIndex, 0, 'slideIndex is still 0')
    clock.restore()
  })


  it('goToNext() won\'t go beyond max', () => {
    const clock = sinon.useFakeTimers()
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 2
    clock.tick(320)
    carousel.goToNext()
    clock.tick(320)
    assert.equal(carousel.slideIndex, 2, 'slideIndex is still 2')
    clock.restore()
  })


  it('loops from last to first', () => {
    const clock = sinon.useFakeTimers()
    const carousel = document.querySelector('fx-carousel')
    carousel.setAttribute('loop', true)
    carousel.slideIndex = 2
    clock.tick(320)
    carousel.goToNext()
    clock.tick(320)
    assert.equal(carousel.slideIndex, 0, 'slideIndex loops to 0')
    clock.restore()
  })


  it('loops from first to last', () => {
    const clock = sinon.useFakeTimers()
    const carousel = document.querySelector('fx-carousel')
    carousel.setAttribute('loop', true)
    carousel.slideIndex = 0
    clock.tick(320)
    carousel.goToPrevious()
    clock.tick(320)
    assert.equal(carousel.slideIndex, 2, 'slideIndex loops to 2')
    clock.restore()
  })


  it('default button is caret', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1

    const previousArrow = carousel.shadowRoot.querySelector('.previous-slide')
    const nextArrow = carousel.shadowRoot.querySelector('.next-slide')

    assert.equal(
      previousArrow.innerHTML,
      arrows['caretPrevious'],
      'left arrow matches'
    )

    assert.equal(
      nextArrow.innerHTML,
      arrows['caretNext'],
      'right arrow matches'
    )
  })


  it('button property cannot be set to invalid value', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.button = 'foo'

    assert.equal(
      carousel.button,
      'caret',
      'button property is set to default'
    )

    assert.equal(
      carousel.getAttribute('button'),
      'caret',
      'button attribute is set to default'
    )
  })


  it('button property normalizes attribute value', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.setAttribute('button', 'foobar')

    assert.equal(
      carousel.getAttribute('button'),
      'foobar',
      'button attribute is set to invalid value'
    )

    assert.equal(
      carousel.button,
      'caret',
      'button property is set to default'
    )
  })


  it('button can be set to circle', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1
    carousel.button = 'circle'

    const previousArrow = carousel.shadowRoot.querySelector('.previous-slide')
    const nextArrow = carousel.shadowRoot.querySelector('.next-slide')

    assert.equal(
      previousArrow.innerHTML,
      arrows['circlePrevious'],
      'left circle arrow matches'
    )

    assert.equal(
      nextArrow.innerHTML,
      arrows['circleNext'],
      'right circle arrow matches'
    )
  })


  it('button can be set to arrow', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1
    carousel.button = 'arrow'

    const shadowRoot = carousel.shadowRoot
    const previousArrow = carousel.shadowRoot.querySelector('.previous-slide')
    const nextArrow = carousel.shadowRoot.querySelector('.next-slide')

    assert.equal(
      previousArrow.innerHTML,
      arrows['arrowPrevious'],
      'left circle arrow matches'
    )

    assert.equal(
      nextArrow.innerHTML,
      arrows['arrowNext'],
      'right circle arrow matches'
    )
  })


  it('button can be set to circle-arrow', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1
    carousel.button = 'circle-arrow'

    const previousArrow = carousel.shadowRoot.querySelector('.previous-slide')
    const nextArrow = carousel.shadowRoot.querySelector('.next-slide')

    assert.equal(
      previousArrow.innerHTML,
      arrows['circle-arrowPrevious'],
      'left circle arrow matches'
    )

    assert.equal(
      nextArrow.innerHTML,
      arrows['circle-arrowNext'],
      'right circle arrow matches'
    )
  })


  it('indicator property cannot be set to invalid value', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.indicator = 'foo'

    assert.equal(
      carousel.indicator,
      'circles',
      'indicator property is set to default'
    )

    assert.equal(
      carousel.getAttribute('indicator'),
      'circles',
      'indicator attribute is set to default'
    )
  })


  it('indicator property normalizes attribute value', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.setAttribute('indicator', 'foobar')

    assert.equal(
      carousel.getAttribute('indicator'),
      'foobar',
      'indicator attribute is set to invalid value'
    )

    assert.equal(
      carousel.indicator,
      'circles',
      'indicator property is set to default'
    )
  })


  it('default indicator is circles', () => {
    const shadowRoot = document.querySelector('fx-carousel').shadowRoot
    const indicators = shadowRoot.querySelector('.slide-indicator').children

    assert(
      indicators[0].innerHTML,
      indicators['circleActive'],
      'active slide indicator is filled circle'
    )

    assert(
      indicators[1].innerHTML,
      indicators['circleInactive'],
      'inactive slide indicator is empty circle'
    )
  })


  it('indicator can be set to circles', () => {
    document.querySelector('fx-carousel').indicator = 'circles'
    const shadowRoot = document.querySelector('fx-carousel').shadowRoot
    const indicators = shadowRoot.querySelector('.slide-indicator').children

    assert(
      indicators[0].innerHTML,
      indicators['circlesActive'],
      'active slide indicator is filled circle'
    )

    assert(
      indicators[1].innerHTML,
      indicators['circlesInactive'],
      'inactive slide indicator is empty circle'
    )

  })


  it('indicator can be set to dashes', () => {
    document.querySelector('fx-carousel').indicator = 'dashes'
    const shadowRoot = document.querySelector('fx-carousel').shadowRoot
    const indicators = shadowRoot.querySelector('.slide-indicator').children

    assert(
      indicators[0].innerHTML,
      indicators['dashesActive'],
      'active slide indicator is filled circle'
    )

    assert(
      indicators[1].innerHTML,
      indicators['dashesInactive'],
      'inactive slide indicator is empty circle'
    )
  })


  it('indicator can be set to rings', () => {
    document.querySelector('fx-carousel').indicator = 'rings'
    const shadowRoot = document.querySelector('fx-carousel').shadowRoot
    const indicators = shadowRoot.querySelector('.slide-indicator').children

    assert(
      indicators[0].innerHTML,
      indicators['ringsActive'],
      'active slide indicator is filled circle'
    )

    assert(
      indicators[1].innerHTML,
      indicators['ringsInactive'],
      'inactive slide indicator is empty circle'
    )
  })


  it('indicator can be set to plus', () => {
    document.querySelector('fx-carousel').indicator = 'plus'
    const shadowRoot = document.querySelector('fx-carousel').shadowRoot
    const indicators = shadowRoot.querySelector('.slide-indicator').children

    assert(
      indicators[0].innerHTML,
      indicators['plusActive'],
      'active slide indicator is correct'
    )

    assert(
      indicators[1].innerHTML,
      indicators['plusInactive'],
      'inactive slide indicator is correct'
    )

  })


  it('click on indicator jumps to a slide', () => {
    const clock = sinon.useFakeTimers()
    const carousel = document.querySelector('fx-carousel')
    const shadowRoot = carousel.shadowRoot
    const indicators = shadowRoot.querySelector('.slide-indicator').children
    indicators[1].click()
    clock.tick(320)
    assert(carousel.slideIndex, 1, 'slideIndex is 1')
    clock.restore()
  })


  it('responds to changes in slides', done => {
    const carousel = document.querySelector('fx-carousel')
    const shadowRoot = carousel.shadowRoot
    carousel.appendChild(document.createElement('div'))
    setTimeout(() => {
      assert.equal(
        4,
        shadowRoot.querySelector('.slide-indicator').children.length,
        'has the correct number of indicators'
      )
      done()
    })
  })


  it('touch event to next slide', () => {
    const clock = sinon.useFakeTimers()
    const identifier = 0
    const target = document.querySelector('fx-carousel')
    const clientY = 0

    target.dispatchEvent(new TouchEvent('touchstart', {
      touches: [ new Touch({ identifier, target, clientY, clientX: 100 }) ]
    }))

    target.dispatchEvent(new TouchEvent('touchmove', {
      touches: [ new Touch({ identifier, target, clientY, clientX: 50 }) ]
    }))

    target.dispatchEvent(new TouchEvent('touchend', {
      changedTouches: [ new Touch({ identifier, target, clientX: 40 }) ]
    }))

    clock.tick(320)

    assert.equal(target.slideIndex, 1, 'slideIndex is 1')
    clock.restore()
  })


  it('touch event to previous slide', () => {
    const clock = sinon.useFakeTimers()
    const identifier = 0
    const target = document.querySelector('fx-carousel')
    const clientY = 0
    target.slideIndex = 1
    clock.tick(320)

    target.dispatchEvent(new TouchEvent('touchstart', {
      touches: [ new Touch({ identifier, target, clientY, clientX: 0 }) ]
    }))

    target.dispatchEvent(new TouchEvent('touchmove', {
      touches: [ new Touch({ identifier, target, clientY, clientX: 55 }) ]
    }))

    target.dispatchEvent(new TouchEvent('touchend', {
      changedTouches: [ new Touch({ identifier, target, clientX: 60 }) ]
    }))

    clock.tick(320)
    assert.equal(target.slideIndex, 0, 'slideIndex is 0')
    clock.restore()
  })


  it('doesn\'t move to next slide if within threshold', () => {
    const clock = sinon.useFakeTimers()
    const identifier = 0
    const target = document.querySelector('fx-carousel')

    target.dispatchEvent(new TouchEvent('touchstart', {
      touches: [ new Touch({ identifier, target, clientX: 100 }) ]
    }))

    target.dispatchEvent(new TouchEvent('touchmove', {
      touches: [ new Touch({ identifier, target, clientX: 95 }) ]
    }))

    target.dispatchEvent(new TouchEvent('touchend', {
      changedTouches: [ new Touch({ identifier, target, clientX: 95 }) ]
    }))

    clock.tick(320)
    assert.equal(target.slideIndex, 0, 'slideIndex is 0')
    clock.restore()
  })


  it('doesn\'t move to previous slide if within threshold', () => {
    const clock = sinon.useFakeTimers()
    const identifier = 0
    const target = document.querySelector('fx-carousel')
    target.slideIndex = 1
    clock.tick(320)

    target.dispatchEvent(new TouchEvent('touchstart', {
      touches: [ new Touch({ identifier, target, clientX: 0 }) ]
    }))

    target.dispatchEvent(new TouchEvent('touchmove', {
      touches: [ new Touch({ identifier, target, clientX: 9 }) ]
    }))

    target.dispatchEvent(new TouchEvent('touchend', {
      changedTouches: [ new Touch({ identifier, target, clientX: 9 }) ]
    }))

    clock.tick(320)
    assert.equal(target.slideIndex, 1, 'slideIndex is 1')
    clock.restore()
  })


  it('slide doesn\'t move on downward finger touch', () => {
    const clock = sinon.useFakeTimers()
    const identifier = 0
    const target = document.querySelector('fx-carousel')
    target.slideIndex = 1
    clock.tick(320)

    target.dispatchEvent(new TouchEvent('touchstart', {
      touches: [ new Touch({ identifier, target, clientX: 0, clientY: 0 }) ]
    }))

    target.dispatchEvent(new TouchEvent('touchmove', {
      touches: [ new Touch({ identifier, target, clientX: 55, clientY: 85 }) ]
    }))

    target.dispatchEvent(new TouchEvent('touchend', {
      changedTouches: [
        new Touch({ identifier, target, clientX: 60, clientY: 95 })
      ]
    }))

    clock.tick(320)
    assert.equal(target.slideIndex, 1, 'slideIndex is 1')
    clock.restore()
  })


  it('wheel event to next slide', () => {
    const clock = sinon.useFakeTimers()
    const target = document.querySelector('fx-carousel')

    target.dispatchEvent(new WheelEvent('wheel', {
      deltaX: 55
    }))

    clock.tick(500)

    assert.equal(target.slideIndex, 1, 'slideIndex is 1')
  })


  it('wheel event to previous slide', () => {
    const clock = sinon.useFakeTimers()
    const target = document.querySelector('fx-carousel')
    target.slideIndex = 1

    target.dispatchEvent(new WheelEvent('wheel', {
      deltaX: -55
    }))

    clock.tick(500)

    assert.equal(target.slideIndex, 0, 'slideIndex is 0')
  })


  it('wheel event to next doesn\'t progress on last slide', () => {
    const clock = sinon.useFakeTimers()
    const target = document.querySelector('fx-carousel')
    target.slideIndex = 2
    clock.tick(320)

    target.dispatchEvent(new WheelEvent('wheel', { deltaY: 0, deltaX: 55 }))

    clock.tick(500)

    assert.equal(target.slideIndex, 2, 'slideIndex is 2')
  })


  it('wheel event doesn\'t move before first slide', () => {
    const clock = sinon.useFakeTimers()
    const target = document.querySelector('fx-carousel')

    target.dispatchEvent(new WheelEvent('wheel', {
      deltaX: -55
    }))

    clock.tick(500)
    assert.equal(target.slideIndex, 0, 'slideIndex is 0')
    clock.restore()
  })


  it('keyboard right arrow key to next slide', () => {
    const clock = sinon.useFakeTimers()
    const target = document.querySelector('fx-carousel')

    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'RightArrow'
    }))

    clock.tick(320)
    assert.equal(target.slideIndex, 1, 'slideIndex is 1')
    clock.restore()
  })


  it('keyboard left arrow key to previous slide', () => {
    const clock = sinon.useFakeTimers()
    const target = document.querySelector('fx-carousel')
    target.slideIndex = 1
    clock.tick(320)

    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'LeftArrow'
    }))

    clock.tick(320)
    assert.equal(target.slideIndex, 0, 'slideIndex is 0')
    clock.restore()
  })


})
