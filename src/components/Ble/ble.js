/**
 * ble smarttag 解析
 */

//  定义默认字节解析描述对象，后期可扩展
const schemas = {
  smartTag: {
    v1: {
      // 必须有，用于内容版本匹配检测
      $verified: {
        range: [0, 8],
        parser: 'type_4b4a4a4b'
      },
      temperature: {
        range: [8, 4],
        parser: 'reduce100'
      },
      humidity: {
        range: [12, 4],
        parser: 'reduce100'
      }
    }
  }
}

// 定义公共处理函数，提供 schemas 定义中对应的描述调用
const _parser = {
  reduce100 (_in) {
    return parseInt(_in) / 100
  },
  type_4b4a4a4b (_in) {
    return _in === '4b4a4a4b'
  }
}

/**
 * JKBLE 主体构造函数
 *
 * @class JKBLE
 */
export default class JKBLE {
  constructor (option) {
        // TODO 自定义 schema 及 parser 可以通过 option 扩展
    this.option = option || {}

    this.schemaType = this.option.schemaType || 'smartTag'
    this.schemaVersion = this.option.schemaVersion || 'v1'
    this.schema = this.getSchema(this.schemaType, this.schemaVersion)
  }

  static parser (parserName) {
    return _parser[parserName]
  }

  getSchema (schemaType, schemaVersion) {
    if (schemaType && schemaVersion) {
      let schema = schemas[schemaType][schemaVersion]
      if (schema) {
        return schema
      }
      else {
        throw new Error('不是有效的 schema')
      }
    }
    else {
      throw new Error('getSchema 没有获得有效的 schemaType 或 schemaVersion')
    }
  }

  getDataByRange (advStr, range) {
    if (!advStr) throw new Error('getDataByRange 没有获得有效的 originData')
    let result = advStr.substr(...range)

    return result
  }

/**
 * 数据解析
 * schema 参数可选，默认为初始化时定义的
 *
 * @param {array} adv
 * @param {object} [schema=this.schema]
 * @memberof JKBLE
 */
  analyze (adv, schema = this.schema) {
    let _this = this
    let _adv
    let result = {}

    if (adv instanceof ArrayBuffer) {
      _adv = new Uint8Array(adv).reduce((l, r) => l + (+r).toString(16), '')
    }
    else if (adv instanceof Array) {
      _adv = adv.reduce((l, r) => l + (+r).toString(16), '')
    }
    else if (typeof adv === 'string') {
      _adv = adv
    }

    // TODO 前缀校验失败是否继续处理并返回结果呢？
    // let _verifiedKey = '$verified'
    // if (!_analyzeItem(_verifiedKey, schema[_verifiedKey])) {
    //     throw new Error('数据格式不符合');
    // }

    function _analyzeItem (key, schema) {
      var _s = schema
      let _rangeData = _this.getDataByRange(_adv, _s.range)
      return _s.parser ? JKBLE.parser(_s.parser)(_rangeData) : _rangeData
    }

    for (var key in schema) {
      if (schema.hasOwnProperty(key)) {
        result[key] = _analyzeItem(key, schema[key])
      }
    }

    return result
  }
}
