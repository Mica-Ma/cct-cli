const EventEmitter = require('events')
const homedir = require('os').homedir()
const path = require('path')
const fs = require('fs')
const axios = require('axios')

const CONFPATH = path.join(homedir, '.cctrc')

class Conf extends EventEmitter {
  constructor() {
    super()
    // console.log(this);
    this.config = null
    this.CONFPATH = CONFPATH
  }
  setConfig(){
    this.config = {
      aaa: 111
    }
  }
  async getConfig() {
    return this.config || await this.getLocalConfig() || await this.getRemoteConfig()
  }
  async getLocalConfig() {
    let config = null
    if (fs.existsSync(this.CONFPATH)) {
      try {
        config = await fs.readJson(file)
      } catch(err) {
      }
      this.config = config
    }
    return config
  }
  async getRemoteConfig() {
    const res = await axios.get('https://api.github.com/users/mica-templates/repos')
    return res
  }
}

module.exports = new Conf()