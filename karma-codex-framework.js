var path = require('path')

// Make sure this is run before other frameworks so that it doesn't remove
// their scripts from config.files

function factory(emitter, fileList, config) {

  config.client.codex = { files: [] }

  // Set all the patterns that are { included: true } to false, but then later
  // the adapter will use System.import to load them
  const includedPatterns = 
  config.files.filter(f => f.included).map(f => {
    f.included = false
    return f.pattern
  })

  var sliceCount = path.join(config.basePath, '..').length

  emitter.on('file_list_modified', files => {
    config.client.codex.files = includedPatterns.reduce((files, pattern) => {
      var matched = fileList.buckets.get(pattern)
      var paths = matched.map(f => f.path.slice(sliceCount))
      return files.concat(paths)
    }, [ ])
  })

  config.files.unshift({
    pattern: path.join(__dirname, 'karma-codex-adapter.js'),
    included: true,
    served: true,
    watched: false,
  })

  config.files.unshift({
    pattern: path.join( __dirname, 'lib', 'system-register-loader.js'),
    included: true,
    served: true,
    watched: false,
  })

}

factory.$inject = [ 'emitter', 'fileList', 'config' ]


module.exports = {
  'framework:codex' : [ 'factory', factory ],
}

