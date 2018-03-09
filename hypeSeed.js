const { MotivationalWords } = require('./server/db/models');
const db = require('./server/db');



function CreatePhrase(keyword, phrase, videoUrl){
  this.keyWord = keyword;
  this.motivationalWords = phrase;
  this.videoUrl = videoUrl;
}

let phraseArr = [];
phraseArr.push(new CreatePhrase('happy', 'Good', 'https://www.youtube.com/embed/1Bix44C1EzY'));
phraseArr.push(new CreatePhrase('sad', 'Stop being sad', 'https://www.youtube.com/embed/rmL1D_aWTAY'));
phraseArr.push(new CreatePhrase('angry', 'Stop being angry', 'https://www.youtube.com/embed/pQChpBgqEg8'));
phraseArr.push(new CreatePhrase('nervous', 'Stop being nervous', 'https://www.youtube.com/embed/WWloIAQpMcQ'));
phraseArr.push(new CreatePhrase('tired', 'Stop being tired', 'https://www.youtube.com/embed/KxGRhd_iWuE'));





const seed = () => {
  Promise.all(phraseArr.map(phraseObj =>
    MotivationalWords.create(phraseObj))
  )
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


