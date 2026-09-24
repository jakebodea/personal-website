const output = new Bun.Glob('dist/**/*')
const privateMarkers = [
  '.resume-studio/',
  'career-evidence.md',
  'resume/resume.pdf',
  'resume/cover.tex',
]

let checked = 0
for await (const path of output.scan({ onlyFiles: true })) {
  checked++
  if (privateMarkers.some((marker) => path.includes(marker))) {
    throw new Error(`Private path in deploy output: ${path}`)
  }
  if (!/\.(?:js|json|html|css|txt)$/.test(path)) continue
  const contents = await Bun.file(path).text()
  const marker = privateMarkers.find((value) => contents.includes(value))
  if (marker) throw new Error(`Private marker ${marker} in deploy output: ${path}`)
}

if (!checked) throw new Error('No deploy output found. Run bun run build first.')
console.log(`Checked ${checked} deployment files for private Resume Studio material.`)
