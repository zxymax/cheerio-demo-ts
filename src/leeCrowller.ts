// 翻译文件 ts -> .d.ts 翻译文件 > .js

import superagent from 'superagent'
import fs from 'fs'
import path from 'path'
import LeeAnalyzer from './leeAnalyzer'

export interface IAnalyzer {
  analyze: (html: string, filePath: string) => string
}

class LeeCrowller {
  private filePath = path.resolve(__dirname, '../data/course.json')

  async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }

  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }

  async initSpiderProcess() {
    const html = await this.getRawHtml()
    const fileContent = this.analyzer.analyze(html, this.filePath)
    this.writeFile(fileContent)
  }

  constructor(private url: string, private analyzer: IAnalyzer) {
    this.initSpiderProcess()
  }
}


const secret = 'secretKey'
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`
const analyzer = new LeeAnalyzer()
new LeeCrowller(url, analyzer)

