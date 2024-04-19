// Project 1 Script 
// (You Need To add Function To convert hsl to rgb and hex Color)
const containerBoxs = document.querySelector(".container");

for (let i = 0; i < 20; i++){
    const box = document.createElement("div");
    box.classList.add("box");
    containerBoxs.appendChild(box);
}
randomColorBlock();

const btn = document.querySelector(".btn");

btn.addEventListener("click", () => {
    randomColorBlock();
});

function randomColorBlock() {
    const boxs = containerBoxs.querySelectorAll(".box");
    boxs.forEach(box => {
        const randomNum = Math.floor(Math.random() * 360);
        const randomColor = `hsl(${randomNum}, 50%, 50%)`;
        box.style.backgroundColor = randomColor;
        box.innerHTML = randomColor;
    });
}



// Project 2 Script
const wrapper_2 = document.querySelector(".project-2 .wrapper");
const form_2 = wrapper_2.querySelector("form");
const fileInput_2 = form_2.querySelector("input");
const infoText_2 = form_2.querySelector("p");
const image_2 = wrapper_2.querySelector("img");
const textArea_2 = wrapper_2.querySelector("textarea");
const copyBtn_2 = wrapper_2.querySelector(".copy");
const closeBtn_2 = wrapper_2.querySelector(".close");

function fetchRequest_2(formData, file) {
    infoText_2.innerText = "Scanning QR Code...";
    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: "POST", body: formData
    }).then(res => res.json()).then(result => {
        result = result[0].symbol[0].data;
        // console.log(result);
        infoText_2.innerText = result ? "Update QR Code to Scan" : "Couldn't Scan QR Code";
        if (!result) return;
        textArea_2.innerText = result;            // Change Text in Text Area
        image_2.src = URL.createObjectURL(file);  // Change Image Source
        wrapper_2.classList.add("active");        // Change Style "Dynamic"
    }).catch(() => {
        infoText_2.innerText = "Couldn't Scan QR Code";
    });
}

fileInput_2.addEventListener("change", (e) => {
    let QRfile = e.target.files[0]; // Get User Selected File
    if (!QRfile) return;
    let formData = new FormData();
    formData.append("file", QRfile);
    fetchRequest_2(formData, QRfile);
});

form_2.addEventListener("click", () => fileInput_2.click());

copyBtn_2.addEventListener("click", () => {
    let text = textArea_2.textContent;
    navigator.clipboard.writeText(text);
    // console.log(text);
});

closeBtn_2.addEventListener("click", () => {
    wrapper_2.classList.remove("active");
});




// Project 3 Script

const wrapper_3 = document.querySelector(".project-3 .wrapper");
const qrInput_3 = wrapper_3.querySelector(".form input");
const generateBtn_3 = wrapper_3.querySelector(".form button");
const qrImage_3 = wrapper_3.querySelector(".qr-code img");

generateBtn_3.addEventListener("click", () => {
    let qrValue = qrInput_3.value;
    if (!qrValue) return;
    generateBtn_3.innerText = "Generate QR Code...";
    let link = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${qrValue}`;
    qrImage_3.src = link;
    qrImage_3.addEventListener("load", () => { 
        wrapper_3.classList.add("active");
        generateBtn_3.innerText = "Generate QR Code";
    });
});

qrInput_3.addEventListener("keyup", () => {
    if (!qrInput_3.value) {
        wrapper_3.classList.remove("active");
    }
})






// Project 4 Script
const project_4 = document.querySelector(".project-4");
const wrapper_4 = project_4.querySelector(".project-4 .wrapper");
const from_text_4 = wrapper_4.querySelector(".from-text");
const to_text_4 = wrapper_4.querySelector(".to-text");
const exchangeBtn = wrapper_4.querySelector(".exchange");
const selectTag_4 = wrapper_4.querySelectorAll(".controls select");
const icons_4 = wrapper_4.querySelectorAll(".icons");
const translateBtn_4 = project_4.querySelector("button");

selectTag_4.forEach((tag, id) => {
    for (const country_code in countries) {
        // console.log(countries[country_code]);
        // Select English By Default as From Language and Arabic To Language.
        let selected;
        if (id == 0 && country_code == "en-GB") {
            selected = "selected";
        } else if (id == 1 && country_code == "ar-SA"){
            selected = "selected";
        }
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        // tag.innerHTML += option;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

function fetchRequest_4(url) {
    to_text_4.setAttribute("placeholder", "Translate...");
    fetch(url).then(res => res.json()).then(data => {
        // console.log(data);
        to_text_4.value = data.responseData.translatedText;
        to_text_4.setAttribute("placeholder", "Translate");
    }).catch(() => {
        to_text_4.setAttribute("placeholder", "Couldn't Translate Network Faild.");
    });
}

translateBtn_4.addEventListener("click", () => {
    let text = from_text_4.value;
    let translateFrom = selectTag_4[0].value;
    let translateTo = selectTag_4[1].value;
    if (!text) return;
    
    let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetchRequest_4(apiURL);
});

exchangeBtn.addEventListener("click", () => {
    let tempText = from_text_4.value;
    from_text_4.value = to_text_4.value;
    to_text_4.value = tempText;

    let tempLang = selectTag_4[0].value;
    selectTag_4[0].value = selectTag_4[1].value;
    selectTag_4[1].value = tempLang;
});

icons_4.forEach((icon) => {
    icon.addEventListener("click", ({ target }) => {
        if (target.classList.contains("fa-copy")) {
            if (target.classList.contains("from")) {
                navigator.clipboard.writeText(from_text_4.value);
            } else {
                navigator.clipboard.writeText(to_text_4.value);
            }
        } else if (target.classList.contains("fa-microphone")) {
            let speech = true;
            window.SpeechRecognition = window.webkitSpeechRecognition;
            const recongnition = new SpeechRecognition();
            recongnition.interimResult = true;

            recongnition.addEventListener("result", (e) => {
                const transcript = Array.from(e.results)
                    .map(result => result[0])
                    .map(result => result.transcript);
                
                from_text_4.value = transcript;
            });

            if (speech == true) {
                recongnition.start();
            }

        } else {
            if (!from_text_4.value) return;
            let utterance;
            if (target.classList.contains("from")) {
                utterance = new SpeechSynthesisUtterance(from_text_4.value);
                utterance.lang = selectTag_4[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(to_text_4.value);
                utterance.lang = selectTag_4[1].value;
            }
            speechSynthesis.speak(utterance); // Speak the pass utterance
        }
    });
});



// Project 5 Script
const wrapper_5 = document.querySelector(".project-5 .wrapper");
const textarea_5 = wrapper_5.querySelector("textarea");
const voiceList_5 = wrapper_5.querySelector(".outer select");
const speechBtn_5 = wrapper_5.querySelector("button");

const synth = window.speechSynthesis;
let isSpeaking = true;

function voices() {
    for (let voice of synth.getVoices()) {
        // Selected "Google US English" as Default Voice
        let selected = voice.name === "Google US English" ? "selected" : "";
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList_5.insertAdjacentHTML("beforeend", option);
    }
}

voices();
synth.addEventListener("voiceschanged", voices);

function textToSpeech(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    for (let voice of synth.getVoices()) { 
        if (voice.name === voiceList_5.value) {
            utterance.voice = voice;
        }
    }
    speechSynthesis.speak(utterance);
    // utterance.rate = 1;
    // utterance.pitch = 1;
}

speechBtn_5.addEventListener("click", (e) => {
    e.preventDefault();
    if (textarea_5.value !== "") {
        if (!synth.speaking) { // If not Speaking
            textToSpeech(textarea_5.value);
        }
        
        if (textarea_5.value.length > 80) {
            if (isSpeaking) {
                synth.resume();
                isSpeaking = false;
                speechBtn_5.innerText = "Pause Speech";
            } else {
                synth.pause();
                isSpeaking = true;
                speechBtn_5.innerText = "Resume Speech";
            }

            setInterval(() => {
                if (!synth.speaking && !isSpeaking) {
                    isSpeaking = true;
                    speechBtn_5.innerText = "Convert To Speech";
                }
            });

        } else {
            speechBtn_5.innerText = "Convert To Speech";
        }
    }
});







// Project 6 Script
const wrapper_6 = document.querySelector(".project-6 .wrapper");
const cards_6 = wrapper_6.querySelectorAll(".card");
const details_6 = wrapper_6.querySelector(".details");
const timerTag_6 = details_6.querySelector(".timer b");
const flipsTag_6 = details_6.querySelector(".flips b");
const refreshBtn_6 = details_6.querySelector(".refresh-btn");

const maxTime_6 = 30;
let cardOne_6, cardTwo_6;   // Default value : ""
let disableDeck, isPlaying; // Default value : false
let matchedCard, timerLeft , flips;
let timer_6;

function initTimer() {
    if (timerLeft <= 0) {
        return clearInterval(timer_6);
    }
    timerLeft--;
    timerTag_6.innerText = timerLeft;
}

function flipCard(e) {
    if (!isPlaying) {
        isPlaying = true;
        timer_6 = setInterval(initTimer, 1000);
    }

    let clickedCard = e.target;
    if (clickedCard !== cardOne_6 && !disableDeck && timerLeft > 0) {
        flips++;
        flipsTag_6.innerText = flips;

        clickedCard.classList.add("flip");
        if (!cardOne_6) {
            return cardOne_6 = clickedCard;
        }
        cardTwo_6 = clickedCard;
        disableDeck = true;

        let cardOneImg = cardOne_6.querySelector("img").src;
        let cardTwoImg = cardTwo_6.querySelector("img").src;

        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1 , img2) {
    if (img1 === img2) {
        matchedCard++;

        if (matchedCard === 8 && timerLeft > 0) {
            return clearInterval(timer_6);
        }

        cardOne_6.removeEventListener("click", flipCard);
        cardTwo_6.removeEventListener("click", flipCard);
        cardOne_6 = cardTwo_6 = "";
        return disableDeck = false;
    }
    // if two card not matched
    setTimeout(() => {
        cardOne_6.classList.add("shake");
        cardTwo_6.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne_6.classList.remove("shake", "flip");
        cardTwo_6.classList.remove("shake", "flip");
        cardOne_6 = cardTwo_6 = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCard() {
    timerLeft = maxTime_6;

    matchedCard = flips = 0;
    cardOne_6 = cardTwo_6 = "";
    disableDeck = isPlaying = false;
    clearInterval(timer_6);

    timerTag_6.innerText = timerLeft;
    flipsTag_6.innerText = flips;

    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);

    // removing flip class from all cards and passing random image to each card
    cards_6.forEach((card, id) => {
        if (card.classList.contains("flip")) {
            card.classList.remove("flip");
        }
        let imgTag = card.querySelector("img");
        
        setTimeout(() => {
            imgTag.src = `imgs/img-${arr[id]}.png`;
        }, 500);

        card.addEventListener("click", flipCard);
    });
}

shuffleCard();

refreshBtn_6.addEventListener("click", shuffleCard);

// cards_6.forEach((card, id) => {
//     card.classList.add("flip");
//     card.addEventListener("click", flipCard);
// });









// Project 7 Script
// You Need Write "WPM Function"

const wrapper_7 = document.querySelector(".project-7 .wrapper");
const typingText_7 = wrapper_7.querySelector(".typing-text p");
const inputField_7 = wrapper_7.querySelector(".input-field");
const timeTag_7 = wrapper_7.querySelector(".time span b");
const mistakeTag_7 = wrapper_7.querySelector(".mistake span b");
const wpmTag_7 = wrapper_7.querySelector(".wpm span b");
const cpmTag_7 = wrapper_7.querySelector(".cpm span b");
const tryAgainBtn = wrapper_7.querySelector("button");

const maxTime_7 = 60;
let charIndex = mistakes = 0;
let isTyping = false;
let timeLeft = maxTime_7;
let timer_7;

function randomParagraph() {
    const randomIdx = Math.floor(Math.random() * paragraphs.length);
    typingText_7.innerHTML = "";

    paragraphs[randomIdx].split("").forEach((span) => {
        let spanTag = `<span>${span}</span>`;
        typingText_7.innerHTML += spanTag;
    });
    typingText_7.querySelector("span").classList.add("active");

    // Focus input field on keydown or click event
    wrapper_7.addEventListener("keydown", () => inputField_7.focus());
    typingText_7.addEventListener("click", () => inputField_7.focus());
}

function initTyping() {
    const characters = typingText_7.querySelectorAll("span");
    let typedChar = inputField_7.value.split("")[charIndex];

    if (charIndex < characters.length - 1 && timeLeft > 0) {
        if (!isTyping) {
            timer_7 = setInterval(initTimer_7 , 1000);
            isTyping = true;
        }
    
        if (typedChar == null) {
            charIndex--;
            if (characters[charIndex].classList.contains("incorect")) {
                mistakes--;
            }
            characters[charIndex].classList.remove("correct", "incorrect");
    
        } else {
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");
    
        let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime_7 - timeLeft)) * 60);
        wpm = (wpm < 0 || !wpm || wpm === Infinity) ? 0 : wpm;
    
        mistakeTag_7.innerText = mistakes;
        wpmTag_7.innerText = wpm;
        cpmTag_7.innerText = charIndex - mistakes; /// Character Per Min (Correct Character)
    } else {
        inputField_7.value = "";
        clearInterval(timer_7);
    }
}

function initTimer_7() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag_7.innerText = timeLeft;
    } else {
        clearInterval(timer_7);
    }
}

function resetGame() {
    randomParagraph();

    inputField_7.value = "";
    clearInterval(timer_7);

    charIndex = mistakes = 0;
    isTyping = false;
    timeLeft = maxTime_7;

    timeTag_7.innerText = timeLeft;
    mistakeTag_7.innerText = 0;
    wpmTag_7.innerText = 0;
    cpmTag_7.innerText = 0;

}

randomParagraph();
inputField_7.addEventListener("input", initTyping);

tryAgainBtn.addEventListener("click" , resetGame);

// Project 10 Script

const project_10 = document.querySelector(".project-10");
const detect_10 = project_10.querySelector(".detect-ad-block");
const wrapper_10 = project_10.querySelector(".wrapper");
const close_Adblockdetect_Btn_10 = wrapper_10.querySelector(".hide-adblock-detect-btn"); 

let adClasses = ["ad", "ads", "adsbox", "ad-placement", "doubleclick", "ad-placeholder", "ad-badge"];

for (let item of adClasses) {
    detect_10.classList.add(item);
}

function hide_AdBlockDetect() {
    let getProperty = window.getComputedStyle(detect_10).getPropertyValue("display");
    if (getProperty != "none") {
        wrapper_10.classList.add("hide");
    }
}

window.addEventListener("load", hide_AdBlockDetect);;

close_Adblockdetect_Btn_10.addEventListener("click", hide_AdBlockDetect);