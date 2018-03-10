const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { MotivationalWords } = require('../db/models');
const axios = require('axios');
const ImageApi = require('gettyimages-api');




module.exports = router;


router.post('/', asyncHandler(async (req, res, next) => {


  //get definition
  let value = await axios.get(`https://owlbot.info/api/v2/dictionary/${req.body.word}/?format=json`);
  //res.json(value.data);

  console.log('req.body.word', req.body.word);
  let client = new ImageApi(imageCreds);
  client.search().images().withPage(1).withPageSize(1).withPhrase(`${req.body.word}`)
      .execute(function(err, response) {
          if (err) throw err
          console.log('response is .images', response.images);
          value.data[0].image = response.images[0].display_sizes[0].uri; //.images[0].displaySizes[0].uri;
          //console.log(JSON.stringify(response));
          //value.data.image = response;
          console.log('value.data[0]', value.data[0]);
          res.json(value.data);
      });
}));

//res.json(value.data);


//let axios = require('axios');

// export const getWords = async (apiUrl) => {
//   let value = await axios.get(apiUrl);
//   return value.data;
// }
