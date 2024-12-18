'use strict';
const modeBtn = document.getElementById("mode");
const backgr = document.querySelector(".background");
const video= document.querySelector(".video-bg");
const newGameBtn = document.getElementById("new_Game");
const nexBtn = document.getElementById("next");
const backBtn = document.getElementById("back");
const starBtn = document.getElementById("starBtn");
const pQuestion = document.querySelector("question");

let quizData = [];
let currentQuestionIndex = 0;
//Mode button Dark / Light
modeBtn.addEventListener('click', ()=>{
    document.body.classList.toggle("background-black");
    
    if (document.body.classList.contains("background-black")) {
        video.classList.remove("video-bg-hidden");
        modeBtn.textContent = "Light";
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");
    } else {
        video.classList.add("video-bg-hidden");
        modeBtn.textContent = "Dark";
        document.body.classList.add("light-mode");
        document.body.classList.remove("dark-mode");
    }

});
