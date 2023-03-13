const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document) 
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')
const playlist = $('.playlist')
const PLAYER_STORAGE_KEY = 'THANG_PLAYER'


const isRandom = false
const isRepeat = false
const app = {
    currentIndex: 0,
    isPlaying: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    
    songs : [
        {
            name:'Âm thầm bên em',
            singer:'Sơn Tùng',
            path:"./assets/music/AmThamBenEm.mp3",
            image: './assets/img/AmThamBenEm.jpg'
        },
        {
            name:'2AM',
            singer:'Justatee',
            path:"./assets/music/2AM.mp3",
            image:'./assets/img/2AM.jpg'
        },
        {
            name:'Cứ Thế',
            singer:'Hà Anh Tuấn',
            path:"./assets/music/Cu-The.mp3",
            image:"./assets/img/cuthe.jpg"
        },
        {
            name:'Đi để trở về',
            singer:'Soobin Hoàng Sơn',
            path:"./assets/music/Di-De-Tro-Ve.mp3",
            image:"./assets/img/didetrove.jpg"
        },
        {
            name:'Em không quay về',
            singer:'Hoàng Tôn',
            path:"./assets/music/Em-Khong-Quay-Ve.mp3",
            image:"./assets/img/emkhongquayve.jpg"
        },
        {
            name:'Ghé Qua',
            singer:'Dick x PC x Tofu',
            path:"./assets/music/Ghe-Qua.mp3",
            image:"./assets/img/ghequa.jpg"
        },
        {
            name:'Love you and love me',
            singer:'Nhạc hoa',
            path:"./assets/music/Love-You-And-Love-Me.mp3",
            image:"./assets/img/love-and-love.jpeg"
        },
        {
            name:'Nước ngoài',
            singer:'Phan Mạnh Quỳnh',
            path:"./assets/music/Nuoc-Ngoai.mp3",
            image:"./assets/img/nuocngoai.jpg"
        },
        {
            name:'Thu cuối',
            singer:'Mr.T ft Yanbi & Hằng Bingboong',
            path:"./assets/music/Thu-Cuoi.mp3",
            image:"./assets/img/thucuoi.jpg"
        },
        {
            name:'Xe đạp',
            singer:'Thùy Chi',
            path:"./assets/music/Xe-Dap.mp3",
            image:"./assets/img/xedap.jpg"
        }
    ],
    setConfig: function(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,this.config)
    },
    render: function() {
        const htmls = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
        
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }   
        })
    }, 
    handleEvents: function() {

        const _this = this
        // xu ly CD quay va dung
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
            ],{
                duration:24000, // 10 seconds
                interations:Infinity
            })
        cdThumbAnimate.pause()
        // khi con lăn xuống dưới nó sẽ ẩn cd đi
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = window.scrollY
            const newCdWidth = cdWidth - scrollTop


            cd.style.width = newCdWidth > 0 ?  newCdWidth + 'px' : 0
            cd.style.opcity = newCdWidth / cdWidth
        }
        // xử lý khi cilck play 
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }else{
                audio.play()
            }
        }
        // khi bài hát chạy
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
            
        }
        // khai bài hát bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // thay đổi con chạy khi bài hát chạy

        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPersent = Math.floor(audio.currentTime/audio.duration * 100) 
                progress.value = progressPersent
            }
        }
        //tua bai hat
        progress.oninput = function(e) {
            const time = Math.floor(audio.duration / 100 * e.target.value)
            audio.currentTime = time
        }
        // khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        // khi random song
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle("active",_this.isRandom)
            _this.setConfig('isRandom', _this.isRandom)
        }
        // audio ended next song
        audio.onended = function() {
            if(_this.isRandom){
                _this.randomSong()
            }  else if(_this.isRepeat){
                audio.play()
            }else {
                _this.nextSong()
            }
            audio.play()
        }
        //repeat song
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle("active", _this.isRepeat)
            
        }
        //  click item to choose song
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if( songNode || e.target.closest('.option')) {
                // khi click song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.render()
                    _this.loadCurrentSong()
                    audio.play()
                }

                // khi click song option
                // if(e.target.closet('.option')) {

                // }
            }
        }

    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'nearest'
            })
        },300)
    },

    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // định nghĩa các thuộc tính cho obj
        this.defineProperties()
        // lắng nghe và xử lý sự kiên
        this.handleEvents()
        // tải thông tin bài hát đầu tiên vao UI khi chạy ứng dụng
        this.loadCurrentSong()
        // render playlist
        this.render()
    }
}
app.start()