// Official partners of Rahnuma.
//
// To add a real logo: put the file in /public/partners/ (SVG or PNG, ideally on a
// transparent background) and set `logo` to its path, e.g. '/partners/lrn.svg'.
// Until then a clean name-based tile is shown. Add `website` and `collaboration`
// as each partnership is confirmed — empty fields are simply not shown.

export type PartnerGroup = 'Partner organisations' | 'Consortium partners'

export type Partner = {
  id: string
  name: string
  short: string // shown inside the tile when there is no logo file
  group: PartnerGroup
  logo?: string
  website?: string
  collaboration?: string[]
  about?: string
  hue: number
}

export const partners: Partner[] = [
  { id: 'capital-technologies', name: 'Capital Technologies', short: 'CT', group: 'Partner organisations', hue: 205 },
  { id: 'mit-multan', name: 'Multan Institute of Technology (MIT)', short: 'MIT', group: 'Partner organisations', hue: 160 },
  { id: 'radius', name: 'Radius', short: 'R', group: 'Partner organisations', hue: 260 },
  { id: 'gist-technology', name: 'GIST Technology', short: 'GIST', group: 'Partner organisations', hue: 20 },
  { id: 'lrn', name: 'LRN', short: 'LRN', group: 'Partner organisations', hue: 330 },
  { id: 'ice', name: 'ICE', short: 'ICE', group: 'Partner organisations', hue: 190 },
  { id: 'my-global-mobility', name: 'My Global Mobility', short: 'MGM', group: 'Consortium partners', hue: 45 },
  { id: 'expedra', name: 'Expedra', short: 'EX', group: 'Consortium partners', hue: 120 },
  { id: 'shopin', name: 'Shopin', short: 'S', group: 'Consortium partners', hue: 300 },
  { id: 'wavebyte', name: 'WaveByte', short: 'WB', group: 'Consortium partners', hue: 225 },
]

export const partnerGroups: { name: PartnerGroup; text: string }[] = [
  { name: 'Partner organisations', text: 'Institutions and companies working with Rahnuma on education, skills, certification and technology.' },
  { name: 'Consortium partners', text: 'Members of the Rahnuma consortium delivering services across the platform.' },
]
