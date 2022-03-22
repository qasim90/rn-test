const get = (url, callback) => {
    fetch('https://currencyapi.com/api/v2/latest?apikey=0bbbb6a0-8958-11ec-98c5-296619e599cd')
    .then(response => response.json())
    .then(json => {
      if(json['data']) {
        // Success. invoke callback passing data recieved from api
          callback({
              success: true,
              data: json['data']
          });
      } else {
        // Api was successful but doesn't has required data or has some error message
        callback({
            success: false,
            error: json
        });
      }
    })
    .catch(error => {
        // Api call failed with an exception e.g. an http error
        console.log(error);
        callback({
            success: false,
            error: error
        });
    })
}

export default {get}