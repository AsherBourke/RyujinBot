// const Discord = require('discord.js');
// const quiz = [
//   { q: "What color is the sky?", a: ["no color", "invisible"] },
//   { q: "Name a soft drink brand.", a: ["pepsi", "coke", "rc", "7up", "sprite", "mountain dew"] },
//   { q: "Name a programming language.", a: ["actionscript", "coffeescript", "c", "c++", "basic", "python", "perl", "javascript", "dotnet", "lua", "crystal", "go", "d", "php", "ruby", "rust", "dart", "java", "javascript"] },
//   { q: "Who's a good boy?", a: ["you are", "sync"] },
//   { q: "Who created me?", a: ["sync", "sync#0666"]},
//   { q: "What programming language am I made in?", a: ["javascript"] },
//   { q: "Name the seventh planet from the Sun.", a: ["uranus"] },
//   { q: "Name the World's biggest island.", a: ["greenland",] },
//   { q: "What's the World's longest river?", a: ["amazon", "amazon river"] },
//   { q: "Name the World's largest ocean.", a: ["pacific", "pacific ocean"] },
//   { q: "Name one of the three primary colors.", a: ["blue", "red", "yellow"] },
//   { q: "How many colors are there in a rainbow?", a: ["7", "seven"] },
//   { q: "What do you call a time span of one thousand years?", a: ["millennium"] },
//   { q: "How many squares are there on a chess board?", a: ["64", "sixty four"] },
//   { q: "How many degrees are found in a circle?", a: ["360", "360 degrees", "three hundred sixty"] },
//   { q: "The Dewey Decimal system is used to categorize what?", a: ["books"] },
//   { q: "How many points does a compass have?", a: ["32", "thirty two"] },
//   { q: "How many strings does a cello have?", a: ["4", "four"] },
//   { q: "How many symphonies did Beethoven compose?", a: ["9", "nine"] },
//   { q: "How many lines should a limerick have?", a: ["5", "five"] },
//   { q: "What is the most basic language Microsoft made?", a: ["visual basic"] },
//   { q: "What is the most complicated language?", a: ["binary"] },
//   { q: "'OS' computer abbreviation usually means?", a: ["operating system"] }
// ];
// const options = {
//   max: 1,
//   time: 300000,
//   errors: ["time"],
// };

// module.exports.run = async (bot, message, args) => {

//   const item = quiz[Math.floor(Math.random() * quiz.length)];
//   await message.channel.send(item.q);
//   try {
//     const collected = await message.channel.awaitMessages(answer => item.a.includes(answer.content.toLowerCase()), options);
//     const winnerMessage = collected.first();
//     return message.channel.send({embed: new Discord.RichEmbed()
//                                  .setAuthor(`Winner: ${winnerMessage.author.tag}`, winnerMessage.author.displayAvatarURL)
//                                  .setTitle(`Correct Answer: \`${winnerMessage.content}\``)
//                                  .setFooter(`Question: ${item.q}`)
//                                  .setColor(`${message.guild.me.displayHexColor!=='#000000' ? message.guild.me.displayHexColor : 0xffffff}`)
//                                 })
//   } catch (_) {
//     if(!await message.channel.awaitMessages(answer => item.a.includes(answer.content.toLowerCase()), options))
//     return message.channel.send({embed: new Discord.RichEmbed()
//                                  .setAuthor("Wrong Answer!")
//                                  .setFooter(`Question: ${item.q}`)
//                                 })
//   }
// }
// module.exports.help = {
// name: "quiz"
// }

const Discord = require("discord.js");
const request = require("node-superfetch");

module.exports.run = async (bot, message, args) => {
  try {
    const { quiz } = await request.get(
      "https://opentdb.com/api.php?amount=50&token=892edf891781a29082ccc990539e5fe880a9a2ae66a548e440cdb864fd7e2e3d"
    );
    console.log(quiz);
  } catch (err) {
    console.error(err);
  }
  const options = {
    max: 1,
    time: 300000,
    errors: ["time"],
  };

  const item = quiz.results[Math.floor(Math.random() * quiz.length)];
  const questionEmbed = new Discord.RichEmbed()
    .setTitle(`**Category: ${item.category}**`)
    .setURL("https://opentdb.com/api_config.php")
    .setColor("#69c")
    .setTimestamp(moment.utc().format())
    .addField("Difficulty", item.difficulty, true)
    .addField("Type", item.type, true)
    .addField("Question:", item.question)
    .setFooter("Questions supplied by Open Trivia DB API.");
  await message.channel.send(questionEmbed);

  try {
    const collected = await message.channel.awaitMessages(
      (answer) => item.correct_answer.includes(answer.content.toLowerCase()),
      options
    );
    const winnerMessage = collected.first();
    return message.channel.send({
      embed: new Discord.RichEmbed()
        .setAuthor(
          `Winner: ${winnerMessage.author.tag}`,
          winnerMessage.author.displayAvatarURL
        )
        .setTitle(`Correct Answer: \`${item.correct_answer}\``)
        .setFooter(`Question: ${item.question}`)
        .setColor(
          `${
            message.guild.me.displayHexColor !== "#000000"
              ? message.guild.me.displayHexColor
              : 0xffffff
          }`
        ),
    });
  } catch (_) {
    if (
      await message.channel.awaitMessages(
        (answer) => !item.a.includes(answer.content.toLowerCase()),
        options
      )
    )
      return message.channel.send({
        embed: new Discord.RichEmbed()
          .setAuthor(
            `Wrong Answer! ${winnerMessage.author.tag}`,
            winnerMessage.author.displayAvatarURL
          )
          .addField(`Correct Answer: \`${item.correct_answer}\``)
          .setFooter(`Question: ${item.question}`)
          .setColor(
            `${
              message.guild.me.displayHexColor !== "#000000"
                ? message.guild.me.displayHexColor
                : 0xffffff
            }`
          ),
      });
  }
};
module.exports.help = {
  name: "quiz",
};
