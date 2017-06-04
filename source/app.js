(function () {
  'use strict'

  if (!document.addEventListener) return

  var options = INSTALL_OPTIONS
  var elements = {}
  var prevElements = {}

  function updateElements () {
    options.blocks.reverse().forEach(function (block, index) {
      var locationHash = [block.location.selector, block.location.method, index].join('!')
      var element

      if (elements[locationHash]) {
        element = elements[locationHash]
      } else {
        if (block.location.method === 'replace') {
          prevElements[locationHash] = document.querySelector(block.location.selector)
        }

        element = INSTALL.createElement(block.location)
        elements[locationHash] = element
      }

      element.setAttribute('app', 'rich-text')
      element.setAttribute('data-position', block.position)
      element.foundInBlocks = true
      element.innerHTML = ''

      var contentWrapper = document.createElement('content-wrapper')
      contentWrapper.innerHTML = block.content

      element.appendChild(contentWrapper)
    })

    for (var hash in elements) {
      if (!elements[hash].foundInBlocks) {
        if (prevElements[hash]) {
          elements[hash].parentNode.replaceChild(prevElements[hash], elements[hash])
          delete prevElements[hash]
        } else {
          elements[hash].parentNode.removeChild(elements[hash])
        }

        delete elements[hash]
      } else {
        delete elements[hash].foundInBlocks
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateElements)
  } else {
    updateElements()
  }

  window.INSTALL_SCOPE = {
    setOptions: function (nextOptions) {
      options = nextOptions

      updateElements()
    }
  }
}())
