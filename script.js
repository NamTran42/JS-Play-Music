// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'KEY_PLAY';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [{
            name: 'Khúc hát chim trời',
            singer: 'Hà Anh Tuấn',
            path: './assets/music/song1.mp3',
            image: './assets/img/1.jpg'
        },
        {
            name: 'Nuối tiếc',
            singer: 'Hà Anh Tuấn',
            path: './assets/music/song2.mp3',
            image: './assets/img/2.jpg'
        },
        {
            name: 'Để dành',
            singer: 'Hà Anh Tuấn',
            path: './assets/music/song3.mp3',
            image: './assets/img/3.jpg'
        },
        {
            name: 'Đêm nằm mơ phố',
            singer: 'Hà Anh Tuấn',
            path: './assets/music/song4.mp3',
            image: './assets/img/4.jpg'
        },
        {
            name: 'Tùy hứng lý qua cầu',
            singer: 'Hà Anh Tuấn',
            path: './assets/music/song5.mp3',
            image: './assets/img/5.jpg'
        },
        {
            name: 'Mưa rừng',
            singer: 'Hà Anh Tuấn',
            path: './assets/music/song6.mp3',
            image: './assets/img/6.jpg'
        },
        {
            name: 'Sao em nỡ vội lấy chồng',
            singer: 'Hà Anh Tuấn',
            path: './assets/music/song7.mp3',
            image: './assets/img/7.jpg'
        },
        {
            name: 'Thành phố buồn',
            singer: 'Hà Anh Tuấn',
            path: './assets/music/song8.mp3',
            image: './assets/img/8.jpg'
        },
    
    
    ],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" 
                style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function () {
        const _this = this;
        const cdWith = cd.offsetWidth;

        //Xử lý CD quay/dừng
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        //Xử lý phóng to, thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWith - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWith;
        }

        //Xử lý khi click Play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //Khi bài hát Play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        //Khi bài hát Pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }

        }

        //Khi tua bài hát
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        //Khi next bài hát
        nextBtn.onclick = function () {
            if(_this.isRandom){
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        
        //Khi next bài hát
        prevBtn.onclick = function () {
            if(_this.isRandom){
                _this.randomSong();
            } else {
                _this.prevSong();                
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Xử lý bật/tắt random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);                             
        }
        
        //Xử lý bật/tắt repeat song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);                 
        }

        //Xử lý next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.onclick();
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            //Xử lý khi click vào bài hát
            if ( songNode || e.target.closest('.option')){
                //Xử lý khi click vào bài hát
                if (songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                //Xử lý khi click vào option
                if(songNode){

                }
            }
        }

    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        
        // Object.assign(this, this.config);
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >=  this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    randomSong: function(){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex == this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function(){
        setTimeout(() =>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',

            });
        }, 500)
    },

    start: function () {
        //gán cấu hình từ config vào ứng dụng gán 
        this.loadConfig();
        
        //định nghĩa các thuộc tính cho object
        this.defineProperties();
        
        // Lắng nghe/ xử lý các sự kiện (DOM events)
        this.handleEvents();
        
        //Tải thông tin các bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        
        //Render playlist
        this.render();

        //hiển thị trạng thái cảu random và repeat 
        randomBtn.classList.toggle('active', this.isRandom);   
        repeatBtn.classList.toggle('active', this.isRepeat);   
    }

    

}

app.start()