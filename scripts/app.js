let oneBtn = document.getElementById('oneBtn');
let twoBtn = document.getElementById('twoBtn');
let rulesBtn = document.getElementById('rulesBtn');
let btnCont = document.getElementById('btnCont');
let goBtnCont = document.getElementById('goBtnCont');
let gameTxt = document.getElementById('gameTxt');
let picksTxt = document.getElementById('picksTxt');
let winTxt = document.getElementById('winTxt');
let apiUrl = 'https://scottsrpsls.azurewebsites.net/api/RockPaperScissors/GetRandomOption';
let cpuPick, userPick;
let userScore = 0;
let cpuScore = 0;
let cpuWinners;

// Function to simplify button creation
function CreateBtn(btnID='', btnText='Primary', btnClass='btn-primary') {
    let btn = document.createElement('button');
    btn.id = btnID;
    btn.type = 'button';
    btn.className = 'btn ' + btnClass;
    btn.textContent = btnText
    return btn;
}

// Function simplify img creation
function CreateImg(imgID='', imgScr='') {
    let img = document.createElement('img');
    img.id = imgID;
    img.src = imgScr;
    img.className = 'gameImg';
    // img.width = 200;
    return img;
}

// Function to trigger round options to show
function ShowRounds() {
    ClearGame();
    gameTxt.textContent = 'How many rounds would you like to play?';
    let oneRndBtn = CreateBtn('oneRndBtn', '1');
    oneRndBtn.addEventListener('click', ShowPictures);
    let fiveRndBtn = CreateBtn('fiveRndBtn', '5');
    let sevenRndBtn = CreateBtn('sevenRndBtn', '7');
    // console.log(oneRndBtn);
    btnCont.append(oneRndBtn, fiveRndBtn, sevenRndBtn);
}

// Function to trigger game icons to show
function ShowPictures() {

    ClearGame();
    gameTxt.textContent = 'Pick your poison';

    let rockImg = CreateImg('rockImg', './assets/rock.png');
    rockImg.addEventListener('click', PickRock);
    let paperImg = CreateImg('paperImg', './assets/paper.png');
    paperImg.addEventListener('click', PickPaper);
    let scissorsImg = CreateImg('scissorsImg', './assets/scissors.png');
    scissorsImg.addEventListener('click', PickScissors);
    let lizardImg = CreateImg('lizardImg', './assets/lizard.png');
    lizardImg.addEventListener('click', PickLizard);
    let spockImg = CreateImg('spockImg', './assets/spock.png');
    spockImg.addEventListener('click', PickSpock);

    btnCont.append(rockImg, paperImg, scissorsImg, lizardImg, spockImg);

    UpdateScores();
}

function UpdateScores() {
    score1.innerText = 'Your Score: ' + userScore;
    score2.innerText = 'CPU Score: ' + cpuScore;
}

async function PickRock() {
    userPick = 'Rock'
    cpuWinners = ['Paper', 'Spock'];
    CheckWinner();
}

async function PickPaper() {
    userPick = 'Paper';
    cpuWinners = ['Scissors', 'Lizard'];
    CheckWinner();
}

async function PickScissors() {
    userPick = 'Scissors';
    cpuWinners = ['Rock', 'Spock'];
    CheckWinner();
}

async function PickLizard() {
    userPick = 'Lizard';
    cpuWinners = ['Rock', 'Scissors'];
    CheckWinner();
}

async function PickSpock() {
    userPick = 'Spock';
    cpuWinners = ['Paper', 'Lizard'];
    CheckWinner();
}

async function CheckWinner() {
    console.log('\nUser picks: ' + userPick);
    await CallApi(apiUrl);
    console.log('3. cpuPick pick check: ' + cpuPick);
    picksTxt.textContent = `You picked: ${userPick} . . . . CPU picked: ${cpuPick}`;
    if (cpuWinners.includes(cpuPick)) {
        console.log('CPU wins!');
        winTxt.textContent = "CPU wins!";
        cpuScore++;
    } else if (cpuPick === userPick) {
        console.log('Draw!');
        winTxt.textContent = "Draw!";
    } else {
        console.log('You win!');
        winTxt.textContent = "You win!";
        userScore++;
    }
    ClearRow();
    PostRound();
    UpdateScores();
}

// Clears btnCont
function ClearRow() {
    btnCont.innerHTML = '';
    goBtnCont.innerHTML = '';
}

function ClearGame() {
    btnCont.innerHTML = '';
    goBtnCont.innerHTML = '';
    picksTxt.innerText = '';
    winTxt.innerText = '';
}

// Sets cpuPick randomly
async function CallApi(url){
    await fetch(url).then(
        response => response.text()
    ).then(
        data => {
            console.log('1. data (in API call): ' + data);
            cpuPick = data;
            console.log('2. cpuPick (in API call): ' + cpuPick);
        }
    )
}

function PostRound() {
    let p1Img = CreateImg(`${userPick.toLowerCase()}`, `./assets/${userPick.toLowerCase()}.png`);
    let p2Img = CreateImg(`${cpuPick.toLowerCase()}`, `./assets/${cpuPick.toLowerCase()}.png`);

    btnCont.append(p1Img, p2Img);
    gameTxt.textContent = 'Game Over';

    let playBtn = CreateBtn('playBtn', 'Play Again');
    playBtn.addEventListener('click', ShowPictures);
    let exitBtn = CreateBtn('exitBtn', 'Exit');

    goBtnCont.append(playBtn, exitBtn);

}

// Called once to wake up API
// CallApi(apiUrl);

oneBtn.addEventListener('click', ShowRounds);