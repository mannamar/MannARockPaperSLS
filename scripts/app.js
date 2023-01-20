// Declare global variables
// let oneBtn = document.getElementById('oneBtn');
// let twoBtn = document.getElementById('twoBtn');
// let rulesBtn = document.getElementById('rulesBtn');
let startBtn = document.getElementById('startBtn');
let btnCont = document.getElementById('btnCont');
let goBtnCont = document.getElementById('goBtnCont');
let gameTxt = document.getElementById('gameTxt');
let picksTxt = document.getElementById('picksTxt');
let winTxt = document.getElementById('winTxt');
let score1 = document.getElementById('score1');
let score2 = document.getElementById('score2');
let apiUrl = 'https://scottsrpsls.azurewebsites.net/api/RockPaperScissors/GetRandomOption';
let cpuPick, userPick, maxWins, thisRound, activePlayer, playerName;
let userScore = 0;
let cpuScore = 0;
let cpuWinners;
let twoPlayer = false;
let p1Name = 'Player 1';
let p2Name = 'CPU';
let isDraw, winner;

// Function to simplify button creation
function CreateBtn(btnID='', btnText='Primary', btnClass='btn-primary') {
    let btn = document.createElement('button');
    btn.id = btnID;
    btn.type = 'button';
    btn.className = 'btn ' + btnClass;
    btn.textContent = btnText;
    return btn;
}

// Function to simplify img creation
function CreateImg(imgID='', imgScr='', extraClass=true) {
    let img = document.createElement('img');
    img.id = imgID;
    img.src = imgScr;
    img.className = 'gameImg';
    if (extraClass) {
        img.classList.add('hoverable');
    }
    return img;
}

// Function to trigger round options to show
function ShowRoundOptions() {
    activePlayer = 1;
    ClearGame();
    gameTxt.textContent = 'How many rounds?';
    let oneRndBtn = CreateBtn('oneRndBtn', '1');
    oneRndBtn.addEventListener('click', StartGame.bind(null, 1));
    let fiveRndBtn = CreateBtn('fiveRndBtn', '5');
    fiveRndBtn.addEventListener('click', StartGame.bind(null, 3));
    let sevenRndBtn = CreateBtn('sevenRndBtn', '7');
    sevenRndBtn.addEventListener('click', StartGame.bind(null, 4));
    btnCont.append(oneRndBtn, fiveRndBtn, sevenRndBtn);
}

// Sets initial round and max wins
function StartGame(num=1) {
    thisRound = 1;
    maxWins = num;
    console.log('maxWins: ' + maxWins);
    ShowPictures();
}

// Function to trigger game icons to show
function ShowPictures() {
    console.log('ap: '+ activePlayer);
    ClearGame();

    if (activePlayer === 1) {
        playerName = p1Name;
    } else {
        playerName = p2Name;
    }

    gameTxt.textContent = `Round ${thisRound}`;
    winTxt.textContent = `${playerName}  pick  your  champion`;

    let rockImg = CreateImg('rockImg', './assets/alt/rock.png');
    rockImg.addEventListener('click', PickRock);
    let paperImg = CreateImg('paperImg', './assets/alt/paper.png');
    paperImg.addEventListener('click', PickPaper);
    let scissorsImg = CreateImg('scissorsImg', './assets/alt/scissors.png');
    scissorsImg.addEventListener('click', PickScissors);
    let lizardImg = CreateImg('lizardImg', './assets/alt/lizard.png');
    lizardImg.addEventListener('click', PickLizard);
    let spockImg = CreateImg('spockImg', './assets/alt/spock.png');
    spockImg.addEventListener('click', PickSpock);

    btnCont.append(rockImg, paperImg, scissorsImg, lizardImg, spockImg);

    UpdateScores();
}

function UpdateScores() {
    score1.innerText = `${p1Name}:  ${userScore}/${maxWins}`;
    score2.innerText = `${p2Name}:  ${cpuScore}/${maxWins}`;
}

async function PickRock() {
    if (activePlayer === 1) {
        userPick = 'Rock';
        cpuWinners = ['Paper', 'Spock'];
    } else {
        cpuPick = 'Rock';
    }
    CheckWinner();
}

async function PickPaper() {
    if (activePlayer === 1) {
        userPick = 'Paper';
        cpuWinners = ['Scissors', 'Lizard'];
    } else {
        cpuPick = 'Paper';
    }
    CheckWinner();
}

async function PickScissors() {
    if (activePlayer === 1) {
        userPick = 'Scissors';
        cpuWinners = ['Rock', 'Spock'];
    } else {
        cpuPick = 'Scissors';
    }
    CheckWinner();
}

async function PickLizard() {
    if (activePlayer === 1) {
        userPick = 'Lizard';
        cpuWinners = ['Rock', 'Scissors'];
    } else {
        cpuPick = 'Lizard';
    }
    CheckWinner();
}

async function PickSpock() {
    if (activePlayer === 1) {
        userPick = 'Spock';
        cpuWinners = ['Paper', 'Lizard'];
    } else {
        cpuPick = 'Spock';
    }
    CheckWinner();
}

// Calls API to set CPU pick
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

// Compares user pick to cpu pick
async function CheckWinner() {
    if (twoPlayer && activePlayer === 1) {
        console.log('Show pictures again - ap: ' + activePlayer);
        activePlayer = 2;
        ShowPictures();
        btnCont.classList.add('slideUp');
    } else {
        console.log('\nUser picks: ' + userPick);
        if (!twoPlayer) {
            await CallApi(apiUrl);
        }
        btnCont.classList.remove('slideUp');
        console.log('3. cpuPick pick check: ' + cpuPick);
        // picksTxt.textContent = `${p1Name}  picked:  ${userPick}       ${p2Name}  picked:  ${cpuPick}`;
        if (cpuWinners.includes(cpuPick)) {
            console.log('CPU/P2 wins!');
            winTxt.textContent = `${p2Name}  wins  this  round!`;
            gameTxt.textContent = `Round ${thisRound}`;
            cpuScore++;
            thisRound++;
            isDraw = false;
            winner = p2Name;
        } else if (cpuPick === userPick) {
            console.log('Draw!');
            winTxt.textContent = "Draw!";
            isDraw = true;
            winner = 'draw';
        } else {
            console.log('P1 wins!');
            winTxt.textContent = `${p1Name}  wins  this  round!`;
            gameTxt.textContent = `Round ${thisRound}`;
            userScore++;
            thisRound++;
            isDraw = false;
            winner = p1Name;
        }
        let userPickWord = (userPick === 'Spock') ? 'Brock' : userPick;
        let cpuPickWord = (cpuPick === 'Spock') ? 'Brock' : cpuPick;
        picksTxt.textContent = `${userPickWord}   vs  ${cpuPickWord}`;
        ClearRow();
        PostRound();
        UpdateScores();
        activePlayer = 1;
    }
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

    score1.innerText = '';
    score2.innerText = '';
}

function PostRound() {
    let p1Img = CreateImg(`${userPick.toLowerCase()}`, `./assets/alt/${userPick.toLowerCase()}.png`, false);
    let p2Img = CreateImg(`${cpuPick.toLowerCase()}`, `./assets/alt/${cpuPick.toLowerCase()}.png`, false);
    let vsImg = CreateImg('vsImg', './assets/vs3.png', false);
    let blankImg1 = CreateImg('blankImg1', '', false);
    let blankImg2 = CreateImg('blankImg2', '', false);

    if (winner === p1Name) {
        p1Img.classList.add('pulse', 'winner');
    } else if (winner === p2Name) {
        p2Img.classList.add('pulse', 'winner');
    } else {
    }

    btnCont.append(blankImg1, p1Img, vsImg, p2Img, blankImg2);
    // gameTxt.textContent = 'Game Over';

    if (userScore === maxWins || cpuScore === maxWins) {
        let playBtn = CreateBtn('playBtn', 'Play Again');
        playBtn.addEventListener('click', PlayAgain);
        let exitBtn = CreateBtn('exitBtn', 'Home');
        exitBtn.addEventListener('click', Exit);
        goBtnCont.append(playBtn, exitBtn);
        gameTxt.innerText = 'Game Over';
    } else {
        let nextBtnTxt = 'Next Round';
        if (isDraw) {
            nextBtnTxt = 'Redo';
        }
        let nextBtn = CreateBtn('playBtn', nextBtnTxt);
        nextBtn.addEventListener('click', ShowPictures);
        goBtnCont.append(nextBtn);
    }
}

function PlayAgain() {
    userScore = 0;
    cpuScore = 0;
    thisRound = 1;
    ShowPictures();
}

function Exit() {
    userScore = 0;
    cpuScore = 0;
    ClearGame();
    gameTxt.innerText = 'Select A Game Mode';

    let oneBtn = CreateBtn('oneBtn', '1 Player');
    oneBtn.addEventListener('click', OnePlayerMode);
    let twoBtn = CreateBtn('twoBtn', '2 Player');
    twoBtn.addEventListener('click', TwoPlayerMode);
    let rulesBtn = CreateBtn('rulesBtn', 'Rules');
    // rulesBtn.addEventListener('click', StartGame.bind(null, 4));

    btnCont.append(oneBtn, twoBtn, rulesBtn);
}

// Called once to wake up API
// CallApi(apiUrl);

// oneBtn.addEventListener('click', OnePlayerMode);
// twoBtn.addEventListener('click', TwoPlayerMode);
startBtn.addEventListener('click', Exit);

// Exit();

function OnePlayerMode() {
    twoPlayer = false;
    p2Name = 'Team  Rocket';
    ShowRoundOptions();
}

function TwoPlayerMode() {
    twoPlayer = true;
    p2Name = 'Player 2'
    ShowRoundOptions();
}