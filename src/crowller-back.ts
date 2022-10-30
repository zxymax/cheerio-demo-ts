// 翻译文件 ts -> .d.ts 翻译文件 > .js

import superagent from 'superagent'
import * as cherrio from 'cheerio'
import fs from 'fs'
import path from 'path'

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

class Crowller {
  private secret = 'secretKey'
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`
  private filePath = path.resolve(__dirname, '../data/course.json')

  private rawHtml = ''

  getCourseInfo(html: string) {
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

  async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }

  generateJsonContent(courseInfo: CourseResult) {
    let fileContent: Content = {}
    if (fs.existsSync(this.filePath)) { // filePath 对应的 course.json 文件路径 是否存在
      fileContent = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'))
    } 
    fileContent[courseInfo.time] = courseInfo.data
    return fileContent
  }

  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }

  async initSpiderProcess() {
    const html = await this.getRawHtml()
    const courseInfo = this.getCourseInfo(html)
    const fileContent = this.generateJsonContent(courseInfo)
    this.writeFile(JSON.stringify(fileContent))
  }

  constructor() {
    this.initSpiderProcess()
  }
}

const crowller = new Crowller()
