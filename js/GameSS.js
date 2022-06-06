$("window").ready(()=>{
    setInterval(getChat, 5E3);
});

let uNick = 'Unnamed';
let firstMsg = true;

function playButton() {
    let nickVal = $("#nick").val();
    uNick = nickVal;
    if (nickVal == "") {
        $("#alert").show('fast', () => {
            $("#alert").text("Please enter your nick!");
            $("#playBtn").prop("disabled", true);
        });
        return;
    } else

    {
        if (!this.paused)
            cg.unpause();
        else
            cg.init();

        $('#overlays').hide();
    }
}

function getChat(){
    $('.chatBoard').stop(true, true).load("readChat.php");
}

function verifyNick(val) {
    
    var playDis = false;
		if($.trim(val.value).length === 0){
			playDis = true;
		}else{
			playDis = false;
		}
		$("#playBtn").prop("disabled", playDis);
        $("#alert").css("display", "none");       
}

function recordScore(nick, xal) {
    if (xal > 9) {
        $.ajax({
            type: 'POST',
            url: 'insert.php',
            dataType: 'JSON',
            data: ({
                'username': nick,
                'skor': xal
            }),
            beforeSend: function () {
                console.log("checking...");
            },
            success: function (response) {
                console.log("Ok");
            }
        });
    }
    return false;
}

function changeTheme(val) {
    let themeString = (val === true) ? 'Azure' : 'black';
    let fontString = (val === false) ? 'Azure' : 'black';

    $("canvas").css('background-color', themeString);
    $(".score, body").css('color', fontString);
}

function canvas() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.font = "70px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("Hello World", canvas.width / 2, canvas.height / 2);
}


function checkKey(key) {
    if (key.keyCode == 13) {
        sendChat($("#chat_textbox").val());
        $("#chat_textbox").val('');
    }
}

function setHideChat(val)
{
    let allowString = 'block';
    if(val === true)
        allowString = 'none';
    
     $('.chatBoard, #chat_textbox').css('display', allowString);
}

function sendChat(message) {
    $.ajax({
        type: "POST",
        url: "sendchat.php",
        dataType: "JSON",
        data: {
            "nick": uNick,
            "msg": message
        },
        error: function(){
            console.log("Could not send a message!");
        },
        /*beforeSend: function () {
            console.log("Sending: nick=" + nick + ",message=" + message)
        },*/
        success: function (succ) {
            console.log(succ);
            drawChatBoard(message);
        }
    });
}

function drawChatBoard(message){
     $("#chat_textbox").prop("disabled", true);
        setTimeout(()=>{
            $("#chat_textbox").prop("disabled", false);
        }, 1E3);
    
   var now = new Date();
        var dateTime = [
          now.getHours(),
          ':',
          now.getMinutes(),
          ':',
          now.getSeconds()
        ].join('');

    if($(".chatLine" ).length > 11)
        $('.chatLine').first().remove();
    
    if(firstMsg){
        $('.alertMsg').html("<span>Your message will be available for 5 minutes after you sent!</span>").fadeOut(1E4);
        firstMsg = false;    
    }
    
    $('.chatBoard').append('<p class="chatLine">['+dateTime+'] <span class="user">'+uNick+'</span>: '+message+'</p>');
    
}

$(document).on('keydown', function (e) {

    if ((e.keyCode == 13 || e.keyCode == 32) && !$("#helloDialog").is(':visible')) {
        $("#chat_textbox").focus();
    }
});


function setShowMass(val) {
    let valueShow = '';
    if (val)
        valueShow = 'block';
    else
        valueShow = 'none';

    $(".score").css('display', valueShow);
}

let randColors = ['Blue', 'DeepSkyBlue', 'MediumSlateBlue', 'Aquamarine', 'Lime', 'Indigo', 'Red', 'DarkRed', 'Fuchsia', 'Magenta', 'Orange', 'OrangeRed', 'GreenYellow', 'Purple', 'DarkGoldenRod', 'Chartreuse', 'BlueViolet', 'Green', 'SlateGrey', 'Teal', 'YellowGreen'];
//let randColors = ['Chartreuse'];


function getColors() {
    return randColors;
}


function setColors(val) {
    if (val == true)
        return 'White';
    else
        return 'Red';
}

var cg = {

    lastTime: (new Date()).getTime(),
    config: {
        width: 640,
        height: 960,
        autosize: true,
        circle: {
            count: 1.75,
            minRadius: 5,
            maxRadius: 55,
            playerRadius: 10,
            radiusInterval: 10,
            speedScale: 3,
            colors: getColors()
        },
        touchmove: isEventSupported('touchmove')
    },
    circles: [],

    setParameters: function (nick) {
        //alert(nick)
    },

    death: function () {
        pts = cg.player.radius
        this.stop()
        this.dispText = function () {
            this.ctx.font = '50pt Lucida Handwriting'
            this.ctx.fillStyle = 'white'
            w = this.ctx.measureText(t = 'You dead').width
            this.ctx.fillText(t, (this.config.width - w) / 2, cg.config.height / 2)

            w = this.ctx.measureText(t = (pts - cg.config.circle.playerRadius) + ' pts').width
            calcScore(pts - cg.config.circle.playerRadius)
            this.ctx.fillText(t, (this.config.width - w) / 2, cg.config.height / 2 + 60)

            this.ctx.font = '20pt Bradley Hand ITC'
            w = this.ctx.measureText(t = '(click to restart)').width

            this.ctx.fillText(t, (this.config.width - w) / 2, cg.config.height / 2 + 110)

        }

        $(this.canvas).click(function () {

            cg.dispText = function () {}
            cg.start()
        })
    },
    stop: function () {

        $(window).unbind('keydown')
        $(window).unbind('blur')
        $(document).unbind('touchmove')
        $(this.canvas).unbind('mousemove')
        cg.showCursor()
        this.player = false
        recordScore(uNick, (pts - cg.config.circle.playerRadius));
    },
    start: function () {

        cg.dispText = function () {}
        $(cg.canvas).unbind('click')
        cg.player = new Player()
        cg.circles = []
        cg.hideCursor()
        if (cg.config.touchmove)
            $(document).bind('touchmove', cg.touchMove)
        else
            $(cg.canvas).mousemove(cg.mouseMove)
        $(window).blur(function () {
            cg.pause()

        })

        $(window).keydown(function (e) {
                if (e.keyCode == 27) {
                    if ($('#overlays').css('display') == 'none') {
                        cg.togglePause()
                        $('#overlays').toggle();
                    }
                }
            }),

            $(window).keydown(function (e) {
                if (e.keyCode == 32) {
                    cg.togglePause()
                    e.preventDefault()
                }
            })
    },
    maxCircles: function () {
        return Math.round(cg.config.width * cg.config.height / (10 * 1000) / cg.config.circle.count)
    },
    hideCursor: function () {
        $(cg.canvas).css('cursor', 'none')
    },
    showCursor: function () {
        $(cg.canvas).css('cursor', 'default')
    },
    pause: function () {
        if (!this.paused) {
            cg.showCursor()
            cg.dispText = function () {
                cg.ctx.font = '60pt Lucida Handwriting'
                cg.ctx.fillStyle = '#00ff00'
                w = cg.ctx.measureText(t = 'Paused').width
                cg.ctx.fillText(t, (cg.config.width - w) / 2, cg.config.height / 2)

                cg.ctx.font = '30pt Lucida Handwriting'


                w = this.ctx.measureText(t = '(Press space to unpause)').width
                cg.ctx.fillText(t, (cg.config.width - w) / 2, cg.config.height / 2 + 60)
            }
            this.paused = true
        }
    },
    unpause: function () {
        if (this.paused) {
            cg.dispText = function () {}
            cg.hideCursor()
            this.paused = false
        }
    },



    togglePause: function () {
        if (this.paused)
            this.unpause()
        else
            this.pause()
    },
    init: function () {
        cg.autosize()
        this.z = new Image()
        this.z.src = 'img/agarmenlogo.png'

        this.canvas = $('canvas')
        this.canvas.attr({
            width: this.config.width,
            height: this.config.height
        })
        this.canvas = this.canvas[0]
        this.ctx = this.canvas.getContext('2d')

        for (var i = this.circles.length; i < cg.maxCircles(); i++)
            this.circles[i] = new Circle(true)


        var mm = function (e) {
            if (cg.inZBounds(e.clientX, e.clientY)) {
                $(cg.canvas).css('cursor', 'pointer')
            } else {
                $(cg.canvas).css('cursor', 'default')
            }
        }

        $(this.canvas).mousemove(mm)

        $(this.canvas).click(function (e) {
            if (cg.inZBounds(e.clientX, e.clientY)) {
                window.open('http://agarmen.com', '_blank')
            } else {
                $(cg.canvas).unbind('click')
                cg.start()
            }
        })

        this.tick()
    },
    inZBounds: function (x, y) {
        return (x > cg.zLogoX &&
            x < cg.zLogoX + cg.zWidth &&
            y > cg.zLogoY &&
            y < cg.zLogoY + cg.zHeight)
    },
    autosize: function () {
        if (cg.config.autosize) {
            cg.config.width = window.innerWidth
            cg.config.height = window.innerHeight
            $(cg.canvas).attr({
                width: cg.config.width,
                height: cg.config.height
            })
        }
    },
    tick: function () {
        now = (new Date()).getTime()
        window.elapsed = now - cg.lastTime
        cg.lastTime = now

        requestAnimFrame(cg.tick)

        cg.autosize()

        cg.ctx.clearRect(0, 0, cg.config.width, cg.config.height)

        if (cg.paused) {
            for (var i = 0; i < cg.circles.length; i++)
                if (cg.circles[i])
                    if (cg.circles[i].render())
                        i--
        } else {
            if (cg.circles.length < cg.maxCircles() && Math.random() < 0.25)
                cg.circles.push(new Circle())

            for (var i = 0; i < cg.circles.length; i++)
                if (cg.circles[i])
                    if (cg.circles[i].tick())
                        i--
        }
        if (typeof (cg.player) != 'undefined' && cg.player)
            cg.player.tick()

        cg.dispText()
    },
    touchMove: function (e) {
        e.preventDefault()
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]
        cg.mouseMove(touch)
    },
    mouseMove: function (e) {
        if (!cg.paused) {
            cg.player.x = e.clientX
            cg.player.y = e.clientY
        }
    },
    dispText: function () {

        this.ctx.font = '50pt Bradley Hand ITC'
        this.ctx.fillStyle = 'cyan';
        w = this.ctx.measureText(t = 'Eat smaller Circles').width
        this.ctx.fillText(t, (this.config.width - w) / 2, cg.config.height / 2 - 100)

        w = this.ctx.measureText(t = 'Avoid bigger Circles').width
        this.ctx.fillText(t, (this.config.width - w) / 2, cg.config.height / 2 - 40)

        this.ctx.font = '25pt Bradley Hand ITC'
        w = this.ctx.measureText(t = '(Click to begin)').width
        this.ctx.fillText(t, (this.config.width - w) / 2, cg.config.height / 2)

        /*this.ctx.fillStyle = 'yellow';
        w = this.ctx.measureText(t = 'Agarmen Online Eat Me game').width
        this.ctx.fillText(t, (this.config.width - w) / 2, cg.config.height / 2 + 295)*/

        this.zHeight = 74
        this.zWidth = 367
        this.ctx.drawImage(this.z, this.zLogoX = (cg.config.width - this.zWidth) / 2, this.zLogoY = cg.config.height / 2 + 200) //296x81
    }
}

function calcScore(score) {
    let myscore = document.getElementById("myscore");
    myscore.innerHTML = score;
}


var Circle = function (inCenter) {
    min = cg.config.circle.minRadius
    max = cg.config.circle.maxRadius

    if (typeof (cg.player) != 'undefined' && cg.player) {
        if (min < cg.player.radius - 35)
            min = cg.player.radius - 35
        if (max < cg.player.radius + 15)
            max = cg.player.radius + 15
    }
    this.radius = rand(min, max, cg.config.circle.radiusInterval)
    this.color = cg.config.circle.colors[Math.floor(Math.random() * cg.config.circle.colors.length)]

    if (inCenter) {
        this.x = Math.random() * cg.config.width
        this.y = Math.random() * cg.config.height
        this.vx = Math.random() - .5
        this.vy = Math.random() - .5
    } else {
        r = Math.random()
        if (r <= .25) {
            this.x = 1 - this.radius
            this.y = Math.random() * cg.config.height
            this.vx = Math.random()
            this.vy = Math.random() - .5
        } else if (r > .25 && r <= .5) {
            this.x = cg.config.width + this.radius - 1
            this.y = Math.random() * cg.config.height
            this.vx = -Math.random()
            this.vy = Math.random() - .5
        } else if (r > .5 && r <= .75) {
            this.x = Math.random() * cg.config.height
            this.y = 1 - this.radius
            this.vx = Math.random() - .5
            this.vy = Math.random()
        } else {
            this.x = Math.random() * cg.config.height
            this.y = cg.config.height + this.radius - 1
            this.vx = Math.random() - .5
            this.vy = -Math.random()
        }
    }
    this.vx *= cg.config.circle.speedScale
    this.vy *= cg.config.circle.speedScale
    if (Math.abs(this.vx) + Math.abs(this.vy) < 1) {
        this.vx = this.vx < 0 ? -1 : 1
        this.vy = this.vy < 0 ? -1 : 1
    }

    this.tick = function () {
        if (!this.inBounds()) {
            for (var i = 0; i < cg.circles.length; i++)
                if (cg.circles[i].x == this.x && cg.circles[i].y == this.y) {
                    cg.circles.splice(i, 1)
                    return true
                }
        } else {
            this.move()
            this.render()
        }
    }

    this.inBounds = function () {
        if (this.x + this.radius < 0 ||
            this.x - this.radius > cg.config.width ||
            this.y + this.radius < 0 ||
            this.y - this.radius > cg.config.height)
            return false
        else
            return true
    }

    this.move = function () {
        this.x += this.vx * elapsed / 15
        this.y += this.vy * elapsed / 15
    }

    this.render = function () {
        cg.ctx.beginPath()
        cg.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        cg.ctx.fillStyle = this.color
        cg.ctx.closePath()
        cg.ctx.fill()
    }

    this.render()
}
var Player = function () {
    this.x = cg.config.width / 2
    this.y = cg.config.height / 2
    this.color = 'white'
    this.radius = cg.config.circle.playerRadius
    this.tick = function () {
        this.detectCollision()
        this.render()
    }
    this.detectCollision = function () {
        for (var i = 0; i < cg.circles.length; i++) {
            circle = cg.circles[i]
            dist = Math.pow(Math.pow(circle.x - this.x, 2) + Math.pow(circle.y - this.y, 2), .5)
            if (dist < circle.radius + this.radius) {
                if (circle.radius > this.radius) {
                    cg.death()
                } else {
                    calcScore(this.radius++ - 9)
                    cg.circles.splice(i, 1)
                    i--
                }
            }
        }
    }
    this.render = function () {
        cg.ctx.beginPath()
        cg.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        cg.ctx.fillStyle = '#fff'
        cg.ctx.closePath()
        cg.ctx.fill()

        /*    cg.ctx.font = this.radius + 'pt Verdana'
            cg.ctx.fillStyle = 'black'
            w = cg.ctx.measureText(t = this.radius).width
            cg.ctx.fillText(t, this.x - w / 2, this.y + this.radius  / 2)*/
    }
}
