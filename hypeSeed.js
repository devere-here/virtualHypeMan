const { MotivationalWords, ToDo } = require('./server/db/models');
const db = require('./server/db');



function CreatePhrase(keyword, phrase, videoUrl){
  this.keyWord = keyword;
  this.motivationalWords = phrase;
  this.videoUrl = videoUrl;
}

function CreateTask(task){
  this.task = task;
}

let phraseArr = [];
phraseArr.push(new CreatePhrase('happy', 'I\'m happy that you\'re happy', 'https://www.youtube.com/embed/1Bix44C1EzY'));
phraseArr.push(new CreatePhrase('sad', 'I hope this makes you feel better', 'https://www.youtube.com/embed/rmL1D_aWTAY'));
phraseArr.push(new CreatePhrase('angry', 'Relax', 'https://www.youtube.com/embed/pQChpBgqEg8'));
phraseArr.push(new CreatePhrase('nervous', 'Calm down and take a deep breath', 'https://www.youtube.com/embed/WWloIAQpMcQ'));
phraseArr.push(new CreatePhrase('tired', 'Keep moving forward!', 'https://www.youtube.com/embed/KxGRhd_iWuE'));

let taskArr = [];
taskArr.push(new CreateTask('Do the dishes'));
taskArr.push(new CreateTask('Clean my room'));


const seed = () => {
  Promise.all(phraseArr.map(phraseObj =>
    MotivationalWords.create(phraseObj))
  )
  .then(() => {
    return Promise.all(taskArr.map(taskObj =>
      ToDo.create(taskObj))
    )
  })
  .then(() => db.close())
  .then(() => console.log('db has been closed'))
  .catch((err) => {
      console.log('seeding error');
      console.error(err);
  });

};

console.log('in the seed file');

//syncs db and then run seed function
db.sync({ force: true})
.then(() => seed());


