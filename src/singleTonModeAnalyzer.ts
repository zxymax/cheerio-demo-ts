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

