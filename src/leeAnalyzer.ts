import { IAnalyzer } from './crowller'

class LeeAnalyzer implements IAnalyzer {
  public analyze(html: string) {
    return html
  }
}

export default LeeAnalyzer

