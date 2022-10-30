#cheerio typescript demo

- pnpm install cheerio
- pnpm install @types/cheerio


```typescript

// crowller.ts

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
```

---

```typescript
// analyzer.ts

import fs from 'fs'
import * as cherrio from 'cheerio'
import { IAnalyzer } from './crowller'

interface Course {
  title: string
  count: number
}

interface CourseResult {
  time: number
  data: Course[]
}

interface Content {
  [propName: number]: Course[] 
}


class Analyzer implements IAnalyzer { // 单例模式的Analyzer
  private static instance: Analyzer
  static getInstance() {
    if (!Analyzer.instance) {
      Analyzer.instance = new Analyzer()
    }
    return Analyzer.instance
  }
  private getCourseInfo(html: string) {
    const $ = cherrio.load(html)
    const courseItems = $('.course-item')
    const courseInfos: Course[] = []
    courseItems.map((index, element) => {
      const desc = $(element).find('.course-desc')
      const title = desc.eq(0).text()
      const count = parseInt(desc.eq(1).text().split('：')[1], 10)
      courseInfos.push({ title, count })
    })

    return {
      time: new Date().getTime(),
      data: courseInfos
    }
  }


  private generateJsonContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {}
    if (fs.existsSync(filePath)) { // filePath 对应的 course.json 文件路径 是否存在
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } 
    fileContent[courseInfo.time] = courseInfo.data
    return fileContent
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html)
    const fileContent = this.generateJsonContent(courseInfo, filePath)
    return JSON.stringify(fileContent)
  }

  private constructor() {}
}

export default Analyzer

```
