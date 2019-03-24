const EventEmitter = require('events')
const homedir = require('os').homedir()
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const { error, done } = require('./utils/logger')

const CONFPATH = path.join(homedir, '.cctrc')
const TEMPLATEURL = 'https://api.github.com/users/mica-templates/repos'
const CACHEDAY = 30

class Conf extends EventEmitter {
  constructor() {
    super()
    // console.log(this);
    this.config = null
    this.CONFPATH = CONFPATH
  }
  async updateConfig(list, cacheDay, msg) {
    const now = Date.now()
    let config = await this.getLocalConfig() || this.config || {}
    let cache = cacheDay || config.cache
    cache = cache != null ? cache : CACHEDAY
    const conf = {
      list: list || config.list,
      version: now,
      cache
    }
    this.config = config = Object.assign(config, conf)
    try {
      await fs.writeFileSync(CONFPATH, JSON.stringify(config, null, 2))
      msg && done(msg)
    } catch (err) {
      error(
        `Error updating config: ` +
        `make sure you have write access to ${CONFPATH}.\n` +
        `(${err.message})`
      )
    }
    return config
  }
  async getConfig(isLatest) {
    return isLatest ? await this.getRemoteConfig() : this.config || await this.getLocalConfig() || await this.getRemoteConfig()
  }
  async getLocalConfig() {
    let config = null
    if (fs.existsSync(CONFPATH)) {
      try {
        config = JSON.parse(await fs.readFileSync(CONFPATH)) || {}
      } catch(err) {
        error(
          `Error getting config: ` +
          `~/.cctrc may be corrupted or have syntax errors.\n` +
          `(${err.message})`
        )
      }
      this.config = config
      const cacheDay = config.cache;
      if (cacheDay === 0) return 
      const cacheStamp = (cacheDay || CACHEDAY) * 86400 * 1000
      const now = Date.now()
      if (!config.list || !config.version || (now - config.version) > cacheStamp) {
        return false
      }
    }
    return config
  }
  async getRemoteConfig() {
    console.log('getRemoteConfig');
    let list = []
    const { status, data } = await axios.get(TEMPLATEURL)
    if (status) {
      list = data.map(val => {
        return {
          name: val.name,
          full_name: val.full_name,
          description: val.description,
          url: val.url
        }
      })
    }
    return await this.updateConfig(list)
  }
}

module.exports = new Conf()