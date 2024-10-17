export default interface Country {
  flag: string
  name: {
    common: string
    official: string
    nativeName: Object // translations
  }
  population: number
  region: string
}
