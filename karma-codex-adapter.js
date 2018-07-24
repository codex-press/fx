
// XXX quick fix for loading CSS
var base = document.createElement('base')
base.href = 'http://localhost:8000/'
document.head.appendChild(base)

var loader = new SystemRegisterLoader()

// change resolve to always return 
var originalResolve = loader.resolve;
loader.resolve = (key, parent) => {
  if (key[0] === '/')
    return Promise.resolve(key)
  else
    return originalResolve.call(loader, key, parent)
}

// prevent synchronous start
window.__karma__.loaded = () => { }

// import the files and then call start
Promise
.all(window.__karma__.config.codex.files.map(f => loader.import(f)))
.then(() => window.__karma__.start())
.catch(error => console.error(error.stack || error))


