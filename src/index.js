import chalk from 'chalk'
import fs from 'fs'
import prompts from 'prompts'

const database = './database/maimai.json'

// Download a file if not exists
if (!fs.existsSync(database)) {
  console.log(`${chalk.black.bgYellow('ERROR')} Database not found! Please download from https://github.com/rayriffy/maimai-json`)
  process.exit(1)
}

console.log(`${chalk.black.bgCyan('WAIT')} Intitializing...`)

// Read data
let json = JSON.parse(fs.readFileSync(database))

// Construct question
const questions = [
  {
    type: 'select',
    name: 'category',
    message: `Which ${chalk.yellow('category')} you need to add song?`,
    choices: [
      {title: 'POPS & ANIME', value: 'pops'},
      {title: 'niconico & VOCALOID™', value: 'nico'},
      {title: 'TOHO Project', value: 'toho'},
      {title: 'SEGA', value: 'sega'},
      {title: 'GAME & VARIETY', value: 'game'},
      {title: 'ORIGINAL & JOYPOLIS', value: 'orig'},
    ],
  },
  {
    type: 'toggle',
    name: 'regionlocked',
    message: `Is this song ${chalk.yellow('region locked')}?`,
    initial: false,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: 'text',
    name: 'nameEnglish',
    message: `What's the song title in ${chalk.yellow('English')}?`,
    validate: value => (value === '' ? `This field is required` : true),
  },
  {
    type: 'text',
    name: 'nameJapanese',
    message: `What's the song title in ${chalk.yellow('Japanese')}?`,
    validate: value => (value === '' ? `This field is required` : true),
  },
  {
    type: 'text',
    name: 'artistEnglish',
    message: `What's the artist name in ${chalk.yellow('English')}?`,
    validate: value => (value === '' ? `This field is required` : true),
  },
  {
    type: 'text',
    name: 'artistJapanese',
    message: `What's the artist name in ${chalk.yellow('Japanese')}?`,
    validate: value => (value === '' ? `This field is required` : true),
  },
  {
    type: 'select',
    name: 'version',
    message: `When it ${chalk.yellow('released')} to the game?`,
    choices: [
      {title: 'FiNALE', value: 'FiNALE'},
      {title: 'MiLK+', value: 'MiLK+'},
      {title: 'MiLK', value: 'MiLK'},
      {title: 'MURASAKi+', value: 'MURASAKi+'},
      {title: 'MURASAKi', value: 'MURASAKi'},
      {title: 'PiNK+', value: 'PiNK+'},
      {title: 'PiNK', value: 'PiNK'},
      {title: 'ORANGE+', value: 'ORANGE+'},
      {title: 'ORANGE', value: 'ORANGE'},
      {title: 'GreeN+', value: 'GreeN+'},
      {title: 'GreeN', value: 'GreeN'},
      {title: 'maimai+', value: 'maimai+'},
      {title: 'maimai', value: 'maimai'},
    ],
  },
  {
    type: 'text',
    name: 'imageUrl',
    message: `What's the ${chalk.yellow('image URL')}?`,
    validate: value => (value === '' ? `This field is required` : true),
  },
  {
    type: 'number',
    name: 'bpm',
    message: `What's the ${chalk.yellow('BPM')}?`,
    style: 'default',
    validate: value => (value === '' ? `This field is required` : true),
  },
  {
    type: 'text',
    name: 'levelEasy',
    message: `What's level of this song in ${chalk.yellow('Easy')} difficulty?`,
    validate: value => (value === '' ? `This field is required` : true),
  },
  {
    type: 'text',
    name: 'levelBasic',
    message: `What's level of this song in ${chalk.yellow('Basic')} difficulty?`,
    validate: value => (value === '' ? `This field is required` : true),
  },
  {
    type: 'text',
    name: 'levelAdvanced',
    message: `What's level of this song in ${chalk.yellow('Advanced')} difficulty?`,
    validate: value => (value === '' ? `This field is required` : true),
  },
  {
    type: 'text',
    name: 'levelExpert',
    message: `What's level of this song in ${chalk.yellow('Expert')} difficulty?`,
    validate: value => (value === '' ? `This field is required` : true),
  },
  {
    type: 'text',
    name: 'levelMaster',
    message: `What's level of this song in ${chalk.yellow('Master')} difficulty?`,
    validate: value => (value === '' ? `This field is required` : true),
  },
  {
    type: 'text',
    name: 'levelReMaster',
    message: `What's level of this song in ${chalk.yellow('Re:Master')} difficulty? (Optional)`,
  },
  {
    type: 'text',
    name: 'listenYoutube',
    message: `What's the ${chalk.yellow('YouTube URL')} to listen this song?`,
    validate: value => (value === '' ? `This field is required` : true),
  },
  {
    type: 'text',
    name: 'listenNiconico',
    message: `What's the ${chalk.yellow('niconico URL')} to listen this song? (Optional)`,
  },
]

addsong()

async function addsong() {
  // Ask for questions
  let response = await prompts(questions)

  console.log(`${chalk.black.bgCyan('WAIT')} Processing data...`)
  // Construct object
  const song = {
    name: {
      en: response.nameEnglish,
      jp: response.nameJapanese,
    },
    artist: {
      en: response.artistEnglish,
      jp: response.artistJapanese,
    },
    image_url: response.imageUrl,
    version: response.version,
    bpm: response.bpm,
    level: {
      easy: response.levelEasy.toString(),
      basic: response.levelBasic.toString(),
      advanced: response.levelAdvanced.toString(),
      expert: response.levelExpert.toString(),
      master: response.levelMaster.toString(),
      remaster: response.levelReMaster === '' ? null : response.levelReMaster.toString(),
    },
    listen: {
      youtube: response.listenYoutube,
      niconico: response.listenNiconico,
    },
    regionlocked: response.regionlocked === true ? 1 : 0,
  }

  // Upload to database
  console.log(`${chalk.black.bgCyan('WAIT')} Writing database...`)
  json[response.category].push(song)
  fs.writeFile(database, JSON.stringify(json, null, 2), err => {
    if (err) {
      console.log(`${chalk.black.bgRed('ERROR')} ${err}`)
      process.exit(1)
    } else {
      console.log(`${chalk.black.bgGreen('DONE')} DONE!`)
    }
  })
}
