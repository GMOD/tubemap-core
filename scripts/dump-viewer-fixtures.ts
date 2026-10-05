// Writes the layout inputs test/layout.golden.test.ts reads, built through a
// sequenceTubeMap checkout's data pipeline. Copy into that checkout as
// src/util/dump-fixtures.test.ts and run
// `FIXTURE_DIR=<this repo>/test/fixtures pnpm vitest run src/util/dump-fixtures.test.ts`

import { readFileSync, writeFileSync } from 'node:fs'
import '../config-client.js'
import { GBZBaseAPI } from '../api/GBZBaseAPI.ts'
import {
  computeExampleData,
  parseChunkedData,
} from '../components/tubeMapData.ts'
import { dataOriginTypes } from '../enums.ts'
import type { Tracks } from '../Types.ts'
import * as demo from './demo-data.js'

const dir = process.env.FIXTURE_DIR!

function write(name: string, data: { nodes: object; tracks: object; reads: object }) {
  const { nodes, tracks, reads } = data
  writeFileSync(`${dir}/${name}.json`, `${JSON.stringify({ nodes, tracks, reads })}\n`)
}

function upload(api: GBZBaseAPI, type: 'graph' | 'read', path: string) {
  const name = path.split('/').pop()!
  const file = new window.File([readFileSync(path)], name)
  return api.putFile(type, file, null)
}

async function mounted(
  graph: string,
  region: string,
  opts: { index?: string; gam?: string; allHaplotypes?: boolean },
) {
  const api = new GBZBaseAPI()
  const tracks: Tracks = [
    {
      trackFile: await upload(api, 'graph', graph),
      trackType: 'graph',
      ...(opts.index !== undefined && {
        haplotypeIndexFile: await upload(api, 'graph', opts.index),
      }),
    },
  ]
  if (opts.gam !== undefined) {
    const readId = await upload(api, 'read', opts.gam)
    await upload(api, 'read', `${opts.gam}.gai`)
    tracks.push({ trackFile: readId, trackType: 'read' })
  }
  return parseChunkedData(
    await api.getChunkedData(
      {
        dataType: 'mounted files',
        tracks,
        region,
        ...(opts.allHaplotypes === true && { allHaplotypes: true }),
      },
      null,
    ),
    tracks,
  )
}

it('dumps layout inputs', async () => {
  for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    const key = `EXAMPLE_${n}` as keyof typeof dataOriginTypes
    write(`example-${n}`, computeExampleData(dataOriginTypes[key], demo))
  }
  write(
    'brca1',
    await mounted('exampleData/internal/snp1kg-BRCA1.gbz.db', '17:1-100', {
      gam: 'exampleData/internal/NA12878-BRCA1.sorted.gam',
    }),
  )
  write(
    'hprc-chrM',
    await mounted('exampleData/hprc-chrM.gbz.db', 'GRCh38#chrM:245-255', {
      index: 'exampleData/hprc-chrM.haplotype-index.db',
      gam: 'exampleData/hprc-chrM-3samples.sorted.gam',
      allHaplotypes: true,
    }),
  )
  write(
    'micb-kir3dl1',
    await mounted(
      'exampleData/micb-kir3dl1.gbz.db',
      'GRCh38#chr6:31500700-31500949',
      {
        index: 'exampleData/micb-kir3dl1.haplotype-index.db',
        allHaplotypes: true,
      },
    ),
  )
})
