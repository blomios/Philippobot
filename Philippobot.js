const prefix = "?";
var fs = require('fs');

const tmi = require('tmi.js');

const tmiConfig = {
    options: {
        debug: true
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "philippobottest",
        password: "oauth:3l93201zmzuxmrfgxvqpqt468rxxyn"
    },
    channels: [
        "Blomios"
    ]
};

/*
const tmiConfig = {
    options: {
        debug: true
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "philippobot",
        password: "oauth:v1038g33j64y6yisi5aek84n5ogabl"
    },
    channels: [
        "Taikumiz"
    ]
};
*/

let client = new tmi.client(tmiConfig);

client.connect();

let format = /[ !@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/;

function parseWord(word){

    while(format.test(word)){
        word = word.replace(format,'');
    }

    return word;
}

function alreadyExistInFile(file, word, callback){

    fs.readFile("ressources/dico.txt", function(err, cont){
        if (err){
            throw err;
            console.log("error");
            callback(-1);
        }
        else{
            if(cont.includes(word)){
                console.log(1);
                callback(1);
            }
            else{
                console.log(2);
                callback(0);
            }
        }
    });
}

function checkForSeveralLetters(word, nbMaxLetters){

    let lastLetter = word[0];
    let nb = 1;

    for(let i = 1; i < word.length; i++){

        if(word[i] == lastLetter){
            nb++;
            lastLetter = word[i];

            if(nb == nbMaxLetters){
                console.log(true);
                return true;
            }
        }
        else
            nb = 0;

    }
    console.log(false);
    return false;

}

client.on('chat', (channel, user, message, isSelf) => {

    let words = message.toLowerCase().split(" ");

    for(let word of words) {

        if(word.includes("phili")){

            alreadyExistInFile("ressources/dico.txt", word, function(exist){

                word = parseWord(word);

                console.log(word);

            	if(exist == 0 && !checkForSeveralLetters(word,3)){

    	        	fs.appendFile("ressources/dico.txt", word + "\n", function (err) {

    				    if (err) throw err;
    				    console.log('It\'s saved!');
    				});
            	}
            });
        }
    }
});

