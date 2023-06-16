/*axios.get('https://api.qweather.com/v7/astronomy/moon?[params]')
    .then((res)=>{
        console.log("RESPONSE: ",res);
        }).catch((e)=>{
            console.log("this is my error ",e);
        })

*/

const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://moon-phase.p.rapidapi.com/emoji',
  headers: {
    'X-RapidAPI-Key': 'e060649f2emshe1bac1d643d11a2p1bf81ajsn718e20a19e8b',
    'X-RapidAPI-Host': 'moon-phase.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}