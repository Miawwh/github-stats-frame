import fetch from 'node-fetch'

export default async function handler(req, res) {
  const username = 'Miawwh' // ganti sesuai kebutuhan atau param query
  // 1. Ambil frame
  const frameSvg = await fetch(
    `${process.env.VERCEL_URL}/res/frame.svg`
  ).then(r => r.text())

  // 2. Ambil stats SVG mentah dari GitHub‑readme‑stats
  const statsSvg = await fetch(
    `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight&hide_border=true`
  ).then(r => r.text())

  // 3. Gabungkan: potong frame head dan body, lalu sisipkan <g> stats di tengah
  //    Asumsi frameSvg punya root <svg>…</svg>
  const combined = frameSvg.replace(
    '</svg>',
    // Sisipkan stats sebagai inner raw SVG
    statsSvg
      // hapus header <?xml…> jika ada
      .replace(/<\?xml.*?\?>/, '')
      .replace(/<!DOCTYPE.*?>/, '')
      .replace(/<svg[^>]*>/, '')    // hapus buka tag
      .replace('</svg>', '')        // hapus tutup tag
    + '</svg>'
  )

  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(combined)
}
