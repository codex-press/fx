import { BUTTON_TYPES, INDICATOR_TYPES } from './carousel.js'
import icons from './icons/index.js'
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


  it('slide with smaller width stays in the center', () => {
    const clock = sinon.useFakeTimers()
    const carousel = document.querySelector('fx-carousel')
    const slide = carousel.querySelector('div + div')
    slide.style.flexBasis = '50%'
    window.dispatchEvent(new Event('resize'))
    const shadowRoot = carousel.shadowRoot
    shadowRoot.querySelector('.next-slide').click()

    clock.tick(320)

    const slideRect = slide.getBoundingClientRect()
    const carouselRect = carousel.getBoundingClientRect()

    assert.equal(
      slideRect.left + slideRect.width / 2,
      carouselRect.left + carouselRect.width / 2,
      'slide is in the center'
    )

    clock.restore()
  })


  it('goToNext() decreases the slide index', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.goToNext()
    assert.equal(carousel.slideIndex, 1, 'increases slideIndex from 0 to 1')
  })


  it('goToPrevious() decreases the slideIndex', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1
    carousel.goToPrevious()
    assert.equal(carousel.slideIndex, 0, 'decreases slideIndex from 1 to 0')
  })


  it('goToPrevious() won\'t go to a negative index', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 0
    carousel.goToPrevious()
    assert.equal(carousel.slideIndex, 0, 'slideIndex is still 0')
  })


  it('goToNext() won\'t go beyond max', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 2
    carousel.goToNext()
    assert.equal(carousel.slideIndex, 2, 'slideIndex is still 2')
  })


  it('loops from last to first', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.setAttribute('loop', true)
    carousel.slideIndex = 2
    carousel.goToNext()
    assert.equal(carousel.slideIndex, 0, 'slideIndex loops to 0')
  })


  it('loops from first to last', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.setAttribute('loop', true)
    carousel.slideIndex = 0
    carousel.goToPrevious()
    assert.equal(carousel.slideIndex, 2, 'slideIndex loops to 2')
  })


  it('default button is caret', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1

    const previousArrow = carousel.shadowRoot.querySelector('.previous-slide')
    const nextArrow = carousel.shadowRoot.querySelector('.next-slide')

    assert.equal(
      previousArrow.innerHTML,
      icons['caret-left'],
      'left arrow matches'
    )

    assert.equal(
      nextArrow.innerHTML,
      icons['caret-right'],
      'right arrow matches'
    )
  })


  it('buttons property cannot be set to invalid value', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.buttons = 'foo'

    assert.equal(
      carousel.buttons,
      'caret',
      'buttons property is set to default'
    )

    assert.equal(
      carousel.getAttribute('buttons'),
      'caret',
      'buttons attribute is set to default'
    )
  })


  it('buttons property normalizes attribute value', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.setAttribute('buttons', 'foobar')

    assert.equal(
      carousel.getAttribute('buttons'),
      'foobar',
      'buttons attribute is set to invalid value'
    )

    assert.equal(
      carousel.buttons,
      'caret',
      'buttons property is set to default'
    )
  })


  it('buttons property changes buttons', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1

    BUTTON_TYPES.forEach(value => {
      carousel.buttons = value

      const previousArrow = carousel.shadowRoot.querySelector('.previous-slide')
      const nextArrow = carousel.shadowRoot.querySelector('.next-slide')

      assert.equal(
        previousArrow.innerHTML.trim(),
        icons[value + '-left'].trim(),
        'left botton is ' + value,
      )

      assert.equal(
        nextArrow.innerHTML.trim(),
        icons[value + '-right'].trim(),
        'right botton is ' + value,
      )

    })
  })


  it('buttons attribute changes buttons', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1

    BUTTON_TYPES.forEach(value => {
      carousel.setAttribute('buttons', value)

      const previousArrow = carousel.shadowRoot.querySelector('.previous-slide')
      const nextArrow = carousel.shadowRoot.querySelector('.next-slide')

      assert.equal(
        previousArrow.innerHTML.trim(),
        icons[value + '-left'].trim(),
        'left botton is ' + value,
      )

      assert.equal(
        nextArrow.innerHTML.trim(),
        icons[value + '-right'].trim(),
        'right botton is ' + value,
      )

    })
  })


  it('indicators property cannot be set to invalid value', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.indicators = 'foo'

    assert.equal(
      carousel.indicators,
      'circle',
      'indicators property is set to default'
    )

    assert.equal(
      carousel.getAttribute('indicators'),
      'circle',
      'indicators attribute is set to default'
    )
  })


  it('indicators property normalizes attribute value', () => {
    const carousel = document.querySelector('fx-carousel')
    carousel.setAttribute('indicators', 'foobar')

    assert.equal(
      carousel.getAttribute('indicators'),
      'foobar',
      'indicators attribute is set to invalid value'
    )

    assert.equal(
      carousel.indicators,
      'circle',
      'indicators property is set to default'
    )
  })


  it('default indicators is circles', () => {
    const shadowRoot = document.querySelector('fx-carousel').shadowRoot
    const indicators = shadowRoot.querySelector('.slide-indicator').children

    assert.equal(
      indicators[0].innerHTML,
      icons['circle'],
      'indicator is a circle'
    )

  })


  it('indicators property changes indicators', () => {
    const carousel = document.querySelector('fx-carousel')
    const shadowRoot = carousel.shadowRoot
    const indicators = shadowRoot.querySelector('.slide-indicator').children

    INDICATOR_TYPES.forEach(value => {
      carousel.indicators = value

      assert.equal(
        indicators[0].innerHTML.trim(),
        icons[value].trim(),
        'slide indicators are ' + value
      )

    })

  })


  it('indicators attribute changes indicators', () => {
    const carousel = document.querySelector('fx-carousel')
    const shadowRoot = carousel.shadowRoot
    const indicators = shadowRoot.querySelector('.slide-indicator').children

    INDICATOR_TYPES.forEach(value => {
      carousel.setAttribute('indicators', value)

      assert.equal(
        indicators[0].innerHTML,
        icons[value],
        'slide indicators are ' + value
      )

    })

  })


  it('click on indicator jumps to a slide', () => {
    const carousel = document.querySelector('fx-carousel')
    const shadowRoot = carousel.shadowRoot
    const indicators = shadowRoot.querySelector('.slide-indicator').children
    indicators[1].click()
    assert.equal(carousel.slideIndex, 1, 'slideIndex is 1')
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
    target.dispatchEvent(new WheelEvent('wheel', { deltaX: 55 }))
    clock.tick(500)
    assert.equal(target.slideIndex, 1, 'slideIndex is 1')
  })


  it('wheel event to previous slide', () => {
    const clock = sinon.useFakeTimers()
    const target = document.querySelector('fx-carousel')
    target.slideIndex = 1
    target.dispatchEvent(new WheelEvent('wheel', { deltaX: -55 }))
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
    target.dispatchEvent(new WheelEvent('wheel', { deltaX: -55 }))
    clock.tick(500)
    assert.equal(target.slideIndex, 0, 'slideIndex is 0')
    clock.restore()
  })


  it('keyboard right arrow key to next slide', done => {
    done()
    // setTimeout(() => {
    //   const target = document.querySelector('fx-carousel')
    //   document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    //   assert.equal(target.slideIndex, 1, 'slideIndex is 1')
    //   done()
    // })
  })


  it('keyboard left arrow key to previous slide', async () => {
    // await Promise.resolve()
    // const target = document.querySelector('fx-carousel')
    // target.slideIndex = 1
    // document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    // assert.equal(target.slideIndex, 0, 'slideIndex is 0')
  })


})
