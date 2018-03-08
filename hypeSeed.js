const { MotivationalWords } = require('./server/db/models');
const db = require('./server/db');



function CreatePhrase(keyword, phrase){
  this.keyWord = keyword;
  this.motivationalWords = phrase;
}

let phraseArr = [];
phraseArr.push(new CreatePhrase('happy', 'Good'));
phraseArr.push(new CreatePhrase('sad', 'Stop being sad'));
phraseArr.push(new CreatePhrase('angry', 'Stop being angry'));
phraseArr.push(new CreatePhrase('nervous', 'Stop being nervous'));
phraseArr.push(new CreatePhrase('tired', 'Stop being tired'));



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


