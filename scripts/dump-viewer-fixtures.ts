// Writes the layout inputs test/layout.golden.test.ts reads, built through a
// sequenceTubeMap checkout's data pipeline. Copy into that checkout as
// src/util/dump-fixtures.test.ts and run
// `FIXTURE_DIR=<this repo>/test/fixtures pnpm vitest run src/util/dump-fixtures.test.ts`
//
// Every graph is a gfa-to-tabix walk file. The bundled ones are cut with 100 bp
// of context, the viewer's `context`, where a cut keeps 1,000 by default, so
// each stays the few dozen nodes a golden can pin.

import '../config-client.js'

import { readFileSync, writeFileSync } from 'node:fs'

import { GBZBaseAPI } from '../api/GBZBaseAPI.ts'
import {
  computeExampleData,
  parseChunkedData,
} from '../components/tubeMapData.ts'
import { dataOriginTypes } from '../enums.ts'
import * as demo from './demo-data.js'

import type { Tracks } from '../Types.ts'
import type { TubeMapData } from '../components/tubeMapData.ts'

const dir = process.env.FIXTURE_DIR!

function write(
  name: string,
  data: { nodes: object; tracks: object; reads: object },
) {
  const { nodes, tracks, reads } = data
  writeFileSync(
    `${dir}/${name}.json`,
    `${JSON.stringify({ nodes, tracks, reads })}\n`,
  )
}

function upload(api: GBZBaseAPI, type: 'graph' | 'read', path: string) {
  const name = path.split('/').pop()!
  const file = new window.File([readFileSync(path)], name)
  return api.putFile(type, file, null)
}

async function mounted(
  walks: string,
  region: string,
  opts: { context: number; gam?: string; allHaplotypes?: boolean },
) {
  const api = new GBZBaseAPI()
  const tracks: Tracks = [
    { trackFile: await upload(api, 'graph', walks), trackType: 'graph' },
  ]
  await upload(api, 'graph', `${walks}.idx`)
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
        context: opts.context,
        ...(opts.allHaplotypes === true && { allHaplotypes: true }),
      },
      null,
    ),
    tracks,
  )
}

async function hosted(walks: string, region: string) {
  const api = new GBZBaseAPI()
  const tracks: Tracks = [{ trackFile: walks, trackType: 'graph' }]
  return parseChunkedData(
    await api.getChunkedData(
      { dataType: 'mounted files', tracks, region },
      null,
    ),
    tracks,
  )
}

// The reference walk and the alternate standing for the most haplotypes, with
// the nodes they visit: a window whose every walk would be megabytes
function commonestAlternate(data: TubeMapData) {
  const [reference, ...alternates] = data.tracks
  const commonest = alternates.reduce((best, walk) =>
    (walk.freq ?? 1) > (best.freq ?? 1) ? walk : best,
  )
  const tracks = [reference!, commonest]
  const visited = new Set(
    tracks.flatMap(walk => walk.sequence.map(name => name.replace(/^-/, ''))),
  )
  return {
    nodes: data.nodes.filter(node => visited.has(node.name)),
    tracks,
    reads: data.reads,
  }
}

it('dumps layout inputs', async () => {
  for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    const key = `EXAMPLE_${n}` as keyof typeof dataOriginTypes
    write(`example-${n}`, computeExampleData(dataOriginTypes[key], demo))
  }
  write(
    'brca1',
    await mounted('exampleData/internal/snp1kg-BRCA1.17.walks.gz', '17:1-100', {
      context: 100,
      gam: 'exampleData/internal/NA12878-BRCA1.sorted.gam',
    }),
  )
  write(
    'hprc-chrM',
    await mounted(
      'exampleData/hprc-chrM.GRCh38.walks.gz',
      'GRCh38#chrM:245-255',
      {
        context: 100,
        gam: 'exampleData/hprc-chrM-3samples.sorted.gam',
        allHaplotypes: true,
      },
    ),
  )
  write(
    'micb-kir3dl1',
    await mounted(
      'exampleData/micb-kir3dl1.GRCh38.walks.gz',
      'GRCh38#chr6:31500700-31500949',
      { context: 100, allHaplotypes: true },
    ),
  )
  write(
    'hprc-chr15-sv',
    await hosted(
      'https://jbrowse.org/demos/hprc/hprc-v2.1-mc-grch38-f8.GRCh38.walks.gz',
      'GRCh38#chr15:92768150-92768700',
    ),
  )
  write(
    'hprc-chr16-inversion',
    commonestAlternate(
      await hosted(
        'https://jbrowse.org/demos/hprc/hprc-v2.1-mc-grch38-f8.GRCh38.walks.gz',
        'GRCh38#chr16:75207100-75207400',
      ),
    ),
  )
})
