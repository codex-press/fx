import * as dom from '/parent/core/dom.js'

const decorators = [ ]
export function registerDecorator(selector, klas) {
  const instances = dom.all(selector).map(el => new klas(el))
  decorators.push({ selector, klas, instances })
}


// for the below MutationObserver to work you should not modify this.el
export class Decorator {

  constructor(el) {
    this.el = el
    this.dom = dom.all(el)
  }

  remove() {

  }

}



var observer = new MutationObserver(mutationsList => {
  mutationsList.map(mutation => {
 
    const removed = Array.from(mutation.removedNodes)
      .filter(el => el instanceof HTMLElement)

    const added = Array.from(mutation.addedNodes)
      .filter(el => el instanceof HTMLElement)

    decorators.forEach(d => {

      const toRemove = d.instances.filter(i =>
        removed.includes(i.el) ||
        removed.find(el => el.contains(i.el))
      )

      toRemove.forEach(i => i.remove())

      d.instances = d.instances.filter(i => !toRemove.includes(i))

      // add elements that match
      const childMatched = added.reduce((els, el) =>
        els.concat(Array.from(el.querySelectorAll(d.selector))),
        [ ]
      )

      const parentMatched = added.filter(el => dom.is(el, d.selector))

      const toAdd = parentMatched.concat(childMatched)
        .filter(el =>
          dom.is(el, d.selector) && !d.instances.find(i => i.el === el)
        )

      d.instances = d.instances.concat(toAdd.map(el => new d.klas(el)))
    })

  })
})

observer.observe(document.body, { childList: true, subtree: true })

