const Discord = require('discord.js')
const bent = require('bent')
const moment = require('moment-timezone')

const getJSON = bent('json')
const client = new Discord.Client()
const token = 'Njc1MjMzNzU3Nzk5NjQ1MTg2.XkwFbw.CQxPzxe0cVf2_03xSzepS9LMNRw'
const url = 'https://codeforces.com/api/contest.list'

var channel

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  setInterval(check, 1000*60*60) // Run every hour
})

client.on('message', msg =>{
  if (msg.content === '!setchannel') {
    msg.channel.send('***CodonaVirus bot channel has been set here***');
  }
  if (msg.content === '!checknow') {
    msg.channel.send('**Checking...**');
    checkingnow(msg.channel)
  }
  if (msg.content === '!website') {
    msg.channel.send('https://codeforces.com');
  }
  if (msg.content === '!contestlist') {
    listcontests(msg.channel)
  }
  if (msg.content.substr(0, 8)===('!profile')) {
    var user = msg.content.substr(8)
    profilecheck('https://codeforces.com/api/user.info?handles=' + user, msg.channel)
  }
  if (msg.content === '!helpme') {
    msg.channel.send('––––––––––––––––––––––––––––––––––––––––––\n**!checknow** → Instantly checks if there is a contest today\n**!website** → Gives instant link to homepage\n**!contestlist** → Gives instant link to list of contests\n**!profile** "codeforces handle" → gives general profile info of given user\n––––––––––––––––––––––––––––––––––––––––––')
  }
});

client.login(token)

async function profilecheck(url, channel) {
  var response = await getJSON(url)
  var data = response.result

  channel.send("–––––––––––––––––––––––\n**Handle:** " + data[0].handle + "\n**Current Rating:** " + data[0].rating + "\n**Current Rank:** " + data[0].rank + "\n**Max Rating:** " + data[0].maxRating + "\n**Max Rank:** " + data[0].maxRank + "\n**# of Friends:** " + data[0].friendOfCount + "\n–––––––––––––––––––––––")
}

async function check() {
  var response = await getJSON(url)
  var data = response.result

  for(var i = 0; i < data.length; i++) {
    if(-21600 <= data[i].relativeTimeSeconds && data[i].relativeTimeSeconds < -18000) {
      var date = new Date(data[i].startTimeSeconds * 1000)
      var time = moment(date).tz("Asia/Seoul").format('ddd, MMM D h:mmA')
      channel.send("@everyone CODEFORCES EVENT: " + data[i].name + ", happening at " + time)
    }
  }
}
//". Register NOW: https://codeforces.com/contests/" + data[i].id

async function checkingnow(channel) {
  var response = await getJSON(url)
  var data = response.result
  var cnt = 0;

  for(var i = 0; i < data.length; i++) {
    if(-43200 <= data[i].relativeTimeSeconds && data[i].relativeTimeSeconds < -0) {
      var date = new Date(data[i].startTimeSeconds * 1000)
      var time = moment(date).tz("Asia/Seoul").format('ddd, MMM D h:mmA')
      channel.send(":exclamation: There **IS** a CodeForces Event TODAY: " + data[i].name + ", happening at " + time + " :exclamation:")
      cnt++
    }
  }
  if(cnt === 0){
    channel.send("No contests currently nearby")
  }
}

async function listcontests(channel) {
  var response = await getJSON(url)
  var data = response.result
  var nums = 1;
  channel.send('––––––––––––––––––––––––––––––––––––––––––\n__**List of Upcoming Contests**__\n');
  for(var i = data.length - 1; i >=0; i--) {
    if(data[i].phase === 'BEFORE') {
      var date = new Date(data[i].startTimeSeconds * 1000)
      var time = moment(date).tz("Asia/Seoul").format('ddd, MMM D h:mmA')
      channel.send(nums + ". **"+data[i].name +"**"+ ", happening at " + time)
      nums++
    }
  }
  channel.send('––––––––––––––––––––––––––––––––––––––––––')
}
