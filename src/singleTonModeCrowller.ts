// 翻译文件 ts -> .d.ts 翻译文件 > .js

// 单例模式不能被外部实例化

import superagent from 'superagent'
import fs from 'fs'
import path from 'path'
import Analyzer from './singleTonModeAnalyzer'

export interface IAnalyzer {
  analyze: (html: string, filePath: string) => string
}

class Crowller {
  private filePath = path.resolve(__dirname, '../data/course.json')

  private async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }

  private async initSpiderProcess() {
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
const analyzer = Analyzer.getInstance()
new Crowller(url, analyzer)

