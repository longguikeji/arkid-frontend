// 获取某个字符串中出现某个字符的索引值集
export function getOneCharacterIndexsInString(str: string, character: string) {
  const indexs: Array<number> = []
  for (let i = 0; i < str.length; i++) {
    if (str[i] === character) {
      indexs.push(i)
    }
  }
  return indexs
}