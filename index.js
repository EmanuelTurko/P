axios.get('https://api.qweather.com/v7/astronomy/moon?[params]')
    .then((res)=>{
        console.log("RESPONSE: ",res);
        }).catch((e)=>{
            console.log("this is my error ",e);
        })