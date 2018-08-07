import './carousel.js'
import * as animate from '/parent/core/animate.js'

describe('Carousel', () => {

  const clock = sinon.useFakeTimers()

  it('has a shadow DOM', () => {
    document.body.innerHTML = '<fx-carousel></fx-carousel>'
    assert(document.querySelector('fx-carousel').shadowRoot)
  })


  it('slideIndex starts at 0', () => {
    document.body.innerHTML = '<fx-carousel></fx-carousel>'
    assert.equal(document.querySelector('fx-carousel').slideIndex, 0)
  })


  it('click next button', () => {
    document.body.innerHTML = (`
      <fx-carousel>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    const nextSlide = document.querySelector('fx-carousel div + div')

    assert.isAtLeast(
      nextSlide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().right,
      'second slide starts at the right of carousel'
    )

    const shadowRoot = document.querySelector('fx-carousel').shadowRoot
    shadowRoot.querySelector('.next-slide').click()

    clock.tick(320)

    assert.equal(
      nextSlide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().left,
      'second slide is now in view'
    )
  })


  it('click previous button', () => {
    document.body.innerHTML = (`
      <fx-carousel>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1
    const slide = document.querySelector('fx-carousel div')
    
    clock.tick(320)

    assert.isAtLeast(
      slide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().right,
      'first slide ends at carousel start'
    )

    const shadowRoot = document.querySelector('fx-carousel').shadowRoot
    shadowRoot.querySelector('.previous-slide').click()

    clock.tick(320)

    assert.equal(
      slide.getBoundingClientRect().left,
      carousel.getBoundingClientRect().left,
      'second slide is now in view'
    )
  })


  it('run goToNext()', () => {
    document.body.innerHTML = (`
      <fx-carousel>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.goToNext()
    assert.equal(
      carousel.slideIndex,
      1,
      'increases slideIndex from 0 to 1'
    )
  })


  it('run goToPrevious()', () => {
    document.body.innerHTML = (`
      <fx-carousel>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1
    carousel.goToPrevious()
    assert.equal(
      carousel.slideIndex,
      0,
      'decreases slideIndex from 1 to 0'
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


  it('goToNext() won\'t go beyond max', () => {
    document.body.innerHTML = (`
      <fx-carousel>
        <div></div>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 2
    carousel.goToNext()
    assert.equal(
      carousel.slideIndex,
      2,
      'slideIndex is still 2'
    )
  })


  it('loops from last to first', () => {
    document.body.innerHTML = (`
      <fx-carousel loop>
        <div></div>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 2
    carousel.goToNext()
    assert.equal(
      carousel.slideIndex,
      0,
      'slideIndex loops to 0'
    )
  })


  it('loops from first to last', () => {
    document.body.innerHTML = (`
      <fx-carousel loop>
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
      2,
      'slideIndex loops to 2'
    )
  })


  it('default button is caret', () => {
    document.body.innerHTML = (`
      <fx-carousel>
        <div></div>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1
    const shadowRoot = carousel.shadowRoot
    const previousArrow = shadowRoot.querySelector('.previous-slide')
    const leftCaret = (`<div><svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z" fill="#fff"></path></svg></div>`)
    const nextArrow = shadowRoot.querySelector('.next-slide')
    const rightCaret = (`<div><svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z" fill="#fff"></path></svg></div>`)
    assert.equal(
      previousArrow.innerHTML.trim(),
      leftCaret.trim(),
      'left arrow matches'
    )
    assert.equal(
      nextArrow.innerHTML.trim(),
      rightCaret.trim(),
      'right arrow matches'
    )
  })


  it('button is set to caret', () => {
    document.body.innerHTML = (`
      <fx-carousel button="caret">
        <div></div>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1

    clock.tick(320)

    const shadowRoot = carousel.shadowRoot
    const previousArrow = shadowRoot.querySelector('.previous-slide')
    const leftCaret = (`<div><svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z" fill="#fff"></path></svg></div>`)
    assert.equal(
      previousArrow.innerHTML.trim(),
      leftCaret.trim(),
      'left arrow matches'
    )
    const nextArrow = shadowRoot.querySelector('.next-slide')
    const rightCaret = (`<div><svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z" fill="#fff"></path></svg></div>`)
    assert.equal(
      nextArrow.innerHTML.trim(),
      rightCaret.trim(),
      'right arrow matches'
    )
  })


  it('button is set to circle', () => {
    document.body.innerHTML = (`
      <fx-carousel button="circle">
        <div></div>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1
    const shadowRoot = carousel.shadowRoot
    const previousArrow = shadowRoot.querySelector('.previous-slide')
    const leftCircleArrow = (`
      <div><svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1037 1395l102-102q19-19 19-45t-19-45l-307-307 307-307q19-19 19-45t-19-45l-102-102q-19-19-45-19t-45 19l-454 454q-19 19-19 45t19 45l454 454q19 19 45 19t45-19zm627-499q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" fill="#fff"></path></svg></div>
    `)
    assert.equal(
      previousArrow.innerHTML.trim(),
      leftCircleArrow.trim(),
      'left circle arrow matches'
    )
    const nextArrow = shadowRoot.querySelector('.next-slide')
    const rightCircleArrow = (`
      <div><svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M845 1395l454-454q19-19 19-45t-19-45l-454-454q-19-19-45-19t-45 19l-102 102q-19 19-19 45t19 45l307 307-307 307q-19 19-19 45t19 45l102 102q19 19 45 19t45-19zm819-499q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" fill="#fff"></path></svg></div>
    `)
    assert.equal(
      nextArrow.innerHTML.trim(),
      rightCircleArrow.trim(),
      'right circle arrow matches'
    )
  })


  it('button is set to arrow', () => {
    document.body.innerHTML = (`
      <fx-carousel button="arrow">
        <div></div>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1
    const shadowRoot = carousel.shadowRoot
    const previousArrow = shadowRoot.querySelector('.previous-slide')
    const leftArrow = (`
      <div><svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z" fill="#fff"></path></svg></div>
    `)
    assert.equal(
      previousArrow.innerHTML.trim(),
      leftArrow.trim(),
      'left arrow matches'
    )
    const nextArrow = shadowRoot.querySelector('.next-slide')
    const rightArrow = (`
      <div><svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293h-704q-52 0-84.5-37.5t-32.5-90.5v-128q0-53 32.5-90.5t84.5-37.5h704l-293-294q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z" fill="#fff"></path></svg></div>
    `)
    assert.equal(
      nextArrow.innerHTML.trim(),
      rightArrow.trim(),
      'right arrow matches'
    )
  })


  it('button is set to arrow-circle', () => {
    document.body.innerHTML = (`
      <fx-carousel button="circle-arrow">
        <div></div>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 1
    const shadowRoot = carousel.shadowRoot
    const previousArrow = shadowRoot.querySelector('.previous-slide')
    const leftArrow = (`<div><svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1280 800v192q0 13-9.5 22.5t-22.5 9.5h-352v192q0 14-9 23t-23 9q-12 0-24-10l-319-319q-9-9-9-23t9-23l320-320q9-9 23-9 13 0 22.5 9.5t9.5 22.5v192h352q13 0 22.5 9.5t9.5 22.5zm160 96q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" fill="#fff"></path></svg></div>`)
    assert.equal(
      previousArrow.innerHTML.trim(),
      leftArrow.trim(),
      'left arrow-circle matches'
    )
    const nextArrow = shadowRoot.querySelector('.next-slide')
    const rightArrow = (`<div><svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1280 896q0 14-9 23l-320 320q-9 9-23 9-13 0-22.5-9.5t-9.5-22.5v-192h-352q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h352v-192q0-14 9-23t23-9q12 0 24 10l319 319q9 9 9 23zm160 0q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" fill="#fff"></path></svg></div>`)
    assert.equal(
      nextArrow.innerHTML.trim(),
      rightArrow.trim(),
      'right arrow-circle matches'
    )
  })


  it('default indicator is circles', () => {
    document.body.innerHTML = (`
      <fx-carousel>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    const shadowRoot = carousel.shadowRoot
    const indicators = (
      Array
        .from(
          shadowRoot
            .querySelector('.slide-indicator').children
        )
    )
    const firstSlide = indicators[0]
    const activeCircle = '<svg width="17" height="17" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 896q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" fill="#fff"></path></svg>'
    assert(
      firstSlide.innerHTML,
      activeCircle,
      'active slide indicator is filled circle'
    )
    const secondSlide = indicators[1]
    const inactiveCircle = '<svg width="17" height="17" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M896 256q-130 0-248.5 51t-204 136.5-136.5 204-51 248.5 51 248.5 136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5-51-248.5-136.5-204-204-136.5-248.5-51zm768 640q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" fill="#fff"></path></svg>'
    assert(
      secondSlide.innerHTML,
      inactiveCircle,
      'inactive slide indicator is empty circle'
    )
  })


  it('circles indicator is circles', () => {
    document.body.innerHTML = (`
      <fx-carousel indicator="circles">
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    const shadowRoot = carousel.shadowRoot
    const indicators = (
      Array
        .from(
          shadowRoot
            .querySelector('.slide-indicator').children
        )
    )
    const firstSlide = indicators[0]
    const activeCicle = '<svg width="17" height="17" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 896q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" fill="#fff"></path></svg>'
    assert(
      firstSlide.innerHTML,
      activeCicle,
      'active slider is filled circle'
    )
    const secondSlide = indicators[1]
    const inactiveCicle = '<svg width="17" height="17" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M896 256q-130 0-248.5 51t-204 136.5-136.5 204-51 248.5 51 248.5 136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5-51-248.5-136.5-204-204-136.5-248.5-51zm768 640q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" fill="#fff"></path></svg>'
    assert(
      secondSlide.innerHTML,
      inactiveCicle,
      'active slider is filled circle'
    )
  })


  it('dashes indicator is dashes', () => {
    document.body.innerHTML = (`
      <fx-carousel indicator="dashes">
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    const shadowRoot = carousel.shadowRoot
    const indicators = (
      Array
        .from(
          shadowRoot
            .querySelector('.slide-indicator').children
        )
    )
    const firstSlide = indicators[0]
    const activeDash = '<svg width="25" height="17" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><defs></defs><rect x="100.291" y="175.873" width="400" height="100" style="fill: rgb(255, 255, 255);"></rect></svg>'
    assert(
      firstSlide.innerHTML,
      activeDash,
      'active slider is larger dash'
    )
    const secondSlide = indicators[1]
    const inactiveDash = '<svg width="25" height="17" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><defs></defs><rect x="100.291" y="186.047" width="400" height="20" style="fill: rgb(255, 255, 255);"></rect></svg>'
    assert(
      secondSlide.innerHTML,
      inactiveDash,
      'inactive slider is thinner dash'
    )
  })


  it('rings indicator is rings', () => {
    document.body.innerHTML = (`
      <fx-carousel indicator="rings">
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    const shadowRoot = carousel.shadowRoot
    const indicators = (
      Array
        .from(
          shadowRoot
            .querySelector('.slide-indicator').children
        )
    )
    const firstSlide = indicators[0]
    const activeRing = '<svg width="25" height="25" viewBox="0 0 375 375" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com"><defs></defs><path d="M 500 273 m -95.356 0 a 95.356 95.356 0 1 0 190.712 0 a 95.356 95.356 0 1 0 -190.712 0 Z M 500 273 m -57.214 0 a 57.214 57.214 0 0 1 114.428 0 a 57.214 57.214 0 0 1 -114.428 0 Z" style="fill: rgb(255, 255, 255);" transform="matrix(-0.609711, 0.792624, -0.792624, -0.609711, 675.311538, -45.994699)" bx:shape="ring 500 273 57.214 57.214 95.356 95.356 1@1bc027e7"></path></svg>'
    assert(
      firstSlide.innerHTML,
      activeRing,
      'active slider is white ring'
    )
    const secondSlide = indicators[1]
    const inactiveRing = '<svg width="25" height="25" viewBox="0 0 375 375" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com"><defs></defs><path d="M 500 273 m -95.356 0 a 95.356 95.356 0 1 0 190.712 0 a 95.356 95.356 0 1 0 -190.712 0 Z M 500 273 m -57.214 0 a 57.214 57.214 0 0 1 114.428 0 a 57.214 57.214 0 0 1 -114.428 0 Z" style="fill: rgb(90, 90, 90);" transform="matrix(-0.609711, 0.792624, -0.788997, -0.614426, 674.321279, -44.707442)" bx:shape="ring 500 273 57.214 57.214 95.356 95.356 1@1bc027e7"></path></svg>'
    assert(
      secondSlide.innerHTML,
      inactiveRing,
      'inactive slider is grayer ring'
    )
  })


  it('plus indicator is plus', () => {
    document.body.innerHTML = (`
      <fx-carousel indicator="plus">
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    const shadowRoot = carousel.shadowRoot
    const indicators = (
      Array
        .from(
          shadowRoot
            .querySelector('.slide-indicator').children
        )
    )
    const firstSlide = indicators[0]
    const activePlus = '<svg width="17" height="17" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com"><defs></defs><path d="M 204.059 20.291 H 295.942 V 204.058 H 479.709 V 295.941 H 295.942 V 479.708 H 204.059 V 295.941 H 20.292 V 204.058 H 204.059 Z" style="fill: rgb(255, 255, 255);" bx:shape="cross 20.292 20.291 459.417 459.417 91.883 91.883 0.5 1@1140d8d6"></path></svg>'
    assert(
      firstSlide.innerHTML,
      activePlus,
      'active slider is white plus'
    )
    const secondSlide = indicators[1]
    const inactivePlus = '<svg width="17" height="17" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><defs></defs><rect x="14.201" y="206.563" width="471.599" height="86.873" style="fill: rgb(90, 90, 90);"></rect></svg>'
    assert(
      secondSlide.innerHTML,
      inactivePlus,
      'inactive slider is grayer ring'
    )
  })


  it.only('click indicator to go to image', () => {
    document.body.innerHTML = (`
      <fx-carousel>
        <div></div>
        <div></div>
      </fx-carousel>
    `)
    const carousel = document.querySelector('fx-carousel')
    carousel.slideIndex = 0
    const shadowRoot = carousel.shadowRoot
    const indicators = (
      Array
        .from(
          shadowRoot
            .querySelector('.slide-indicator').children
        )
    )
    const secondIndicator = indicators[1]
    secondIndicator.click()
    assert(carousel.slideIndex, 1, 'slideIndex is 1')
  })

})
