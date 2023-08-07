import {songs} from './songs.js'

const audio = document.querySelector('.audio')
const controlBtn = document.querySelector('.control__btn')
const footerImg = document.querySelector('.current__music__img img')
const footerText = document.querySelector('.current__music__text')
const footerPlay = document.querySelector('.footer__play')
const nextBtn = document.querySelector('.next__icon')
const backBtn = document.querySelector('.back__icon')
const randomBtn = document.querySelector('.random__icon')
const repeatBtn = document.querySelector('.repeat__icon')
const main = document.querySelector('.main')
const playlist = document.querySelector('.list__music')
const range = document.querySelector('.range')
const rangeBar = document.querySelector('.range__bar')
const currentTime = document.querySelector('.current__time')
const endTime = document.querySelector('.end__time')

let currentSong
let currentProgress
let isPlayed = false

//Start
renderSongs(songs)
//Tao code html cho danh sach bai hat
function renderSongs(songs){
    let htmls = ""
    songs.forEach((song,index) => {
        htmls += `
                    <div class="list__item" data-item=${index}>
                         <div class="list__item__img">
                             <img src=${song.img} alt="">
                             <i class='bx bx-play'></i>
                         </div>
                         <div class="list__item__content">
                             <h4>${song.name}</h4>
                             <p>${song.auth}</p>
                         </div>
                     </div>
        `
    });
    playlist.innerHTML = htmls
    loadCurrentSong(0)
}

//Lấy thông tin bài hát
function loadCurrentSong(index){
    if(currentSong != index){
        audio.src = songs[index].src
        footerImg.src = songs[index].img
        footerText.querySelector('h4').innerText = songs[index].name
        footerText.querySelector('p').innerText = songs[index].auth
        currentSong = index
    }
}


//Điều khiển icon pause/play
function controlPlayIcon(){
    if(isPlayed){
        main.classList.add('playing')
        controlBtn.querySelector('p').innerText = "Tạm Dừng"
    }
    else{
        main.classList.remove('playing')
        controlBtn.querySelector('p').innerText = "Tiếp Tục Phát"
    }
}

//Next Song
function nextSong(){
    let tmp = currentSong
    if(tmp == songs.length-1){
        tmp = 0
    }else tmp++
    loadCurrentSong(tmp)
    audio.play()
    isPlayed = true
    controlPlayIcon()
}

//Previous Song
function previousSong(){
    let tmp = currentSong
    if(tmp == 0){
        tmp = songs.length-1
    }else tmp--
    loadCurrentSong(tmp)
    audio.play()
    isPlayed = true
    controlPlayIcon()
}

//Repeat Mode
function repeatMode(){
    if(repeatBtn.classList.contains('active')) return true
    return false
}

//Random Mode
function randomMode(){
    if(randomBtn.classList.contains('active')) return true
    return false
}

//Chuyển đổi thời gian
function timeConvertToText(time){
    let minute = parseInt(time/60)
    let second = parseInt(time%60)
    return (minute < 10 ? '0' : '')+ minute + ':' + (second < 10 ? '0' : '') + second
}

//Cập nhật thời gian hiện tại
function updateTime(){
    currentTime.innerText = timeConvertToText(audio.currentTime)
}

//Click Play Icon
controlBtn.addEventListener('click', function(){
    if(isPlayed){
        isPlayed = false
        audio.pause()
        controlPlayIcon()
    }
    else{
        isPlayed = true
        audio.play()
        controlPlayIcon()
    }
})

footerPlay.addEventListener('click', function(){
    if(isPlayed){
        isPlayed = false
        audio.pause()
        controlPlayIcon()
    }
    else{
        isPlayed = true
        audio.play()
        controlPlayIcon()
    }
})

//Chọn bài
playlist.addEventListener('click', function(e){
    let songNode = e.target.closest('.list__item')
    loadCurrentSong(Number(songNode.dataset.item))
    audio.play()
    isPlayed = true
    controlPlayIcon()
})

//Next Song
nextBtn.addEventListener('click', nextSong)

//Previous Song
backBtn.addEventListener('click', previousSong)

//Chế độ random
randomBtn.addEventListener('click', function(){
    repeatBtn.classList.remove('active')
    this.classList.toggle('active')
})

//Chế độ repeat
repeatBtn.addEventListener('click', function(){
    randomBtn.classList.remove('active')
    this.classList.toggle('active')
})

//Thanh Progress
audio.addEventListener('timeupdate', function(){
    currentProgress = parseInt(audio.currentTime/audio.duration*100)
    rangeBar.style.width =  currentProgress + '%'
    updateTime()
    if(currentProgress >= 100 && !repeatMode() && !randomMode()){
        setTimeout(nextSong, 2000)
    }
    else if(currentProgress >= 100 && repeatMode()){
        setTimeout(function(){
            currentProgress = 0
            rangeBar.style.width = currentProgress + '%'
            audio.play()
        }, 2000)
    }
    else if(currentProgress >= 100 && randomMode()){
        let tmp = currentSong
        while(tmp == currentSong) tmp = Math.floor(Math.random() * songs.length)
        loadCurrentSong(tmp)
        setTimeout(function(){
            audio.play()
            isPlayed = true
            controlPlayIcon()
        }, 2000)
    }
})

audio.addEventListener('loadedmetadata', function(){
    endTime.innerText = timeConvertToText(audio.duration)
})
//Tua
range.addEventListener('mousemove', function(e){
    let seekProgress = parseInt((e.pageX - this.offsetLeft)/this.offsetWidth*100)
    this.addEventListener('click', function(){
        currentProgress = seekProgress
        rangeBar.style.width =  currentProgress + '%'
        audio.currentTime = currentProgress/100*audio.duration
        audio.play()
        updateTime()
        isPlayed = true
        controlPlayIcon()
    })
})
