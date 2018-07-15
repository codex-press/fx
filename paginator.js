import { addScript } from '/parent/core/dom.js'
import { debounce } from './utility.js'
import * as a from '/parent/core/animate.js'



class Paginator extends HTMLElement {

  constructor() {
    super()
    this.tween = {}
    this.resize = this.resize.bind(this)
    this.wheel = this.wheel.bind(this)
    this.wheelEnd = debounce(500, this.jumpToEdge.bind(this))
    this.keydown = this.keydown.bind(this)
    this.scrollUpdate = this.scrollUpdate.bind(this)
  }


  connectedCallback() {
    window.addEventListener('wheel', this.wheel)
    window.addEventListener('keydown', this.keydown)
    window.addEventListener('resize', this.resize)
    // setTimeout because the article is restoring the scroll
    setTimeout(() => this.scrollUpdate())
  }


  disconnectedCallback() {
    window.removeEventListener('wheel', this.wheel)
    window.removeEventListener('keydown', this.keydown)
    window.removeEventListener('resize', this.resize)
  }


  // the one that's underneath if there are two
  // previousPage() {
  //   return Array.from(this.children).find(el => {
  //     const rect = el.getBoundingClientRect()
  //     return rect.top <= 0 && rect.bottom >= 0 
  //   })
  // }


  // the one on the bottom of the screen, even if by one pixel
  currentPage() {
    return Array.from(this.children).find(el =>
      el.getBoundingClientRect().bottom >= window.innerHeight
    )
  }


  tweenScroll(duration, delta) {
    // console.log('tweenScroll', duration, delta)
    const scroll = this.tween.active ? this.tween.endValue : window.scrollY
    if (this.tween && this.tween.active) this.tween.cancel()
    const ease = a.cubicOut(scroll, scroll + delta)
    this.tween = a.timer({
      duration,
      endValue: scroll + delta,
      tick: time => {
        window.scrollTo(0, ease(time))
        this.scrollUpdate()
      }
    })
  }


  bounceScroll(amount) {
    const scroll = this.tween.active ? this.tween.endValue : window.scrollY
    if (this.tween && this.tween.active) this.tween.cancel()
    let ease = a.cubicOut(scroll, scroll + amount)
    // first duration could be: scrollMax == scrollHeight ? 80 : 300,
    let duration = 80
    let last = this.children[ this.children.length - 1 ]
    const scrollMax = document.body.scrollHeight - window.innerHeight
    const tick = time => {
      window.scrollTo(0, ease(time))
      let y = Math.round(Math.min(0, scrollMax - ease(time)))
      last.style.transform = `translateY(${ y }px)`
    }
    this.tween = a.timer({
      tick,
      duration,
      endValue: scroll + amount,
      done: () => {
        ease = a.cubicOut(scroll + amount, scroll)
        this.tween = a.timer({ tick, duration, endValue: scroll })
      }
    })
  }


  resize(e) {
    this.scrollUpdate()
    this.jumpToEdge()
  }


  keydown(e) {
    if (e.defaultPrevented) return

    const page = this.currentPage()
    const rect = page && page.getBoundingClientRect()
    const scroll = this.tween.active ? this.tween.endValue : window.scrollY
    // console.log(e.key) // , rect)

    switch (e.key) {

      case "ArrowDown":
        e.preventDefault()
        const scrollMax = document.body.scrollHeight - window.innerHeight

        // finish a transition
        if (Math.floor(rect.top) > 0)
          this.tweenScroll(600, rect.top)
        // move as normal down arrow
        else if (Math.floor(rect.bottom) > window.innerHeight)
          this.tweenScroll(100, Math.min(rect.bottom - window.innerHeight, 40))
        // bounce scroll
        else if (scroll >= scrollMax)
          this.bounceScroll(80)
        // transition to next page
        else
          this.tweenScroll(400, window.innerHeight)

        break

      case "ArrowUp":
        e.preventDefault()

        if (Math.floor(rect.top) > 0)
          this.tweenScroll(600, -rect.top)
        else if (Math.floor(rect.top) < 0)
          this.tweenScroll(100, Math.max(rect.top, -40))
        else if (scroll <= 0)
          this.bounceScroll(-80)
        else
          this.tweenScroll(400, -window.innerHeight)

        break


      case "PageDown":
        e.preventDefault()

        break

      case "PageUp":
        e.preventDefault()

        break

      case " ":
        e.preventDefault()
        if (e.shiftKey)
          console.log('shift space')
        break
    }

  }


  wheel(e) {
    if (this.tween && this.tween.active) this.tween.cancel()
    e.preventDefault()
    window.scrollBy(0, e.deltaY)
    this.scrollUpdate()
    this.wheelEnd()
  }


  jumpToEdge(e) {
    if (this.tween.active) return
    const page = this.currentPage()
    if (!page) return

    const duration = 600
    const rect = page.getBoundingClientRect()
    const tolerance = window.innerHeight * .2

    if (window.innerHeight - rect.top < tolerance) {
      const endValue = window.scrollY - (window.innerHeight - rect.top)
      const ease = a.cubicInOut(window.scrollY, endValue)
      this.tween = a.timer({
        duration,
        endValue,
        tick: time => {
          window.scrollTo(0, ease(time))
          this.scrollUpdate()
        }
      })
    }
    else if (rect.top < tolerance) {
      const endValue = window.scrollY + rect.top
      const ease = a.cubicInOut(window.scrollY, endValue)
      this.tween = a.timer({
        duration,
        endValue,
        tick: time => {
          window.scrollTo(0, ease(time))
          this.scrollUpdate()
        }
      })
    }

  }


  scrollUpdate() {
    const children = Array.from(this.children)
    const child = children.find(el => {
      const match  = el.style.transform.match(/translateY\((-?\d*)px\)/)
      const y = match ? match[1] * 1 : 0
      const rect = el.getBoundingClientRect()
      return rect.top - y <= 0 && rect.bottom - y >= 0 
    })

    if (child) {
      const rect = child.getBoundingClientRect()
      const match  = child.style.transform.match(/translateY\((-?\d*)px\)/)
      const y = match ? match[1] * 1 : 0
      const val = -1 * (rect.bottom - window.innerHeight - y)
      const pct = val / window.innerHeight

      if (val > 0) {
        const y = Math.round(val - a.circOut(0, window.innerHeight * .1, pct))
        child.style.transform = `translateY(${ y }px)`
        child.style.opacity = a.quintIn(1, 0, pct)
      }
      else {
        child.style.transform = 'translate3d(0,0,0)'
        child.style.opacity = 1
      }
    }

    children.filter(el => el != child).forEach(el => {
      el.style.transform = 'translate3d(0,0,0)'
      el.style.opacity = 1
    })
  }
 
}

window.customElements.define('fx-paginator', Paginator)

