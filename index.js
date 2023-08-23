/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, @oawu/queue
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Queue = function(...params) {
  if (!(this instanceof Queue)) {
    return new Queue(...params)
  }

  this.closures = []
  this.params = params
  this.isWorking = false
}

Queue.prototype = {
  ...Queue.prototype, 

  enqueue (closure) {
    this.closures.push(closure)
    this.dequeue(...this.params)
    return this
  },
  dequeue (...params) {
    if (this.isWorking) {
      return this;
    } else {
      this.isWorking = true
    }

    if (this.closures.length) {
      const next = (...params) => {
        this.params = params
        this.closures.shift()
        this.isWorking = false
        this.dequeue(...this.params)
      }

      next.params = this.params

      this.closures[0](next, ...params)
    } else {
      this.isWorking = false
    }

    return this
  },
  push (closure) {
    return this.enqueue(closure)
  },
  pop (...params) {
    return this.dequeue(...params)
  },
  clean () {
    this.closures = []
    this.params = []
    this.isWorking = false
  }
}

Queue.create = function(...closures) {
  return new Queue(...closures)
}

let main = null

Object.defineProperty(Queue, 'main', {
  get: _ => main || (main = new Queue()) })

Object.defineProperty(Queue.prototype, 'size', {
  get () { return this.closures.length } })

module.exports = Queue
