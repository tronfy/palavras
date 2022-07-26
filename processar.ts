import fs from 'fs'

const raw = fs.readFileSync('./palavras.txt', 'utf8').split('\n')

const palavras: { [key: string]: { orig: string } } = {}

raw
  .filter(p => p.length >= 2 && !p.match(/.*[-\. ].*/))
  .forEach(
    p =>
      (palavras[
        p
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .split('')
          .filter(c => 'a' <= c && c <= 'z')
          .join('')
      ] = {
        orig: p.toLowerCase(),
      })
  )

fs.writeFileSync('./palavras.json', JSON.stringify(palavras, null, 2))

const letras = 'abcdefghijklmnopqrstuvwxyz'
let slices: { [key: string]: number } = {}

for (let i = 0; i < letras.length; i++) {
  for (let j = 0; j < letras.length; j++) {
    const slice = letras[i] + letras[j]
    const count = Object.keys(palavras).filter(palavra =>
      palavra.includes(slice)
    ).length

    console.log(slice, count)
    slices[slice] = count
  }
}

slices = Object.fromEntries(
  Object.entries(slices).sort(([, b], [, a]) => a - b)
)

fs.writeFileSync('./slices.json', JSON.stringify(slices, null, 2))
