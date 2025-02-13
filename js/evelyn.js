$(function () {
    // 開始

    // playAudio 變化事件
    let playAudio = $('#playAudio')[0];
    // pin在外面時true
    var pinOut = true;
    // 無限旋轉動畫+紀錄角度
    let deg = 0;
    let rotationId;
    // 用來控制旋轉的 interval
    let rotateInterval;
    // 音樂來源
    const audioSrc = {
        'homeRecord': './audio/snoozyBeats-lazyAfternoon.mp3',
        'aboutRecord': './audio/snoozyBeats-midnightDrifter.mp3',
        'worksRecord': './audio/snoozyBeats-doingGood.mp3',
        'contactRecord': './audio/snoozyBeats-rewind.mp3',
    };


    // 以下11/29測試，重run邏輯
    // 先click在判斷與初始判斷再click是完全不同的邏輯
    $('#pin').click(function () {
        if (pinOut) {
            // 旋轉唱片機到角落(判斷是否已有.moveCorner)
            if (!$('#center').hasClass('moveCorner')) {
                $('#center').addClass('moveCorner');
                if ($(window).width() <= 1280) {
                    $('#center.moveCorner').css({
                        'transform': 'rotate(30deg) translate3d(-66%, 50%, 0)',
                    });
                } if ($(window).width() <= 820) {
                    $('#center.moveCorner').css({
                        'transform': 'rotate(30deg) translate3d(-61%, 40%, 0)',
                    });
                } if ($(window).width() > 1280) {
                    $('#center.moveCorner').css({
                        'transform': 'rotate(30deg) translate3d(-66%, 50%, 0)',
                        'transition': '2s 1.5s all ease-in-out',
                    });
                }
                // 隱藏Evelyn 及 playlist字眼
                $('#center.moveCorner').find('h1,p').delay(1200).fadeOut(900);
                // 顯示logo
                $('header').delay(2000).fadeIn(800);
            }
            // pin從7deg轉到0deg(唱片邊緣)
            $('#pin').addClass('beClick');
            // pinOut狀態改為false
            pinOut = false;
            // 延遲2秒開始旋轉唱片+pin開始轉動 =>第三秒開始播音樂
            setTimeout(function () {
                // 唱片轉動(setInterval控制每15毫秒更新一次角度)
                rotateInterval = setInterval(function () {
                    deg = (deg + 1) % 360; // 每次增加1度
                    $('.rotateImg').css('transform', `rotate(${deg}deg) scale(0.95)`);
                }, 15);
                // pin轉動
                $('#pin').css('animation', `rotatePin linear ${playAudio.duration}s forwards`);
                // 再延1秒後播放音樂
                setTimeout(function () {
                    playAudio.play();
                    // 判斷並顯示content
                    changeContent();
                }, 1000);
            }, 2000);
        } else {
            // pin在內時click為暫停or繼續播放
            // 暫停播放
            if (!$('#pin').hasClass('pause')) {
                $('#pin').addClass('pause');
                setTimeout(function () {
                    if (rotateInterval) {
                        clearInterval(rotateInterval);
                        rotateInterval = null;
                    }
                    // 暫停音樂
                    playAudio.pause();
                    // 暫停 pin 的動畫
                    $('#pin').css('animation-play-state', 'paused');
                }, 2000);
            } else {
                // 繼續播放
                // 移除#pin的pause類別
                $('#pin').removeClass('pause');
                setTimeout(function () {
                    rotateInterval = setInterval(function () {
                        deg = (deg + 1) % 360;
                        $('.rotateImg').css('transform', `rotate(${deg}deg) scale(0.95)`);
                    }, 15);
                    // 播放音樂
                    playAudio.play();
                    // pin旋轉
                    $('#pin').css('animation-play-state', 'running');
                }, 2000);
            }
        }
    });

    // 音樂結束ended，停止旋轉+pin歸位
    // 獨立函示
    function pinReturnAnimation() {
        // 紀錄pin當前角度
        let currentDeg = $('#pin').css('transform');
        let values = currentDeg.split('(')[1].split(')')[0].split(',');
        let a = values[0];
        let b = values[1];
        let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

        // 動態生成pinReturn動畫
        let styleSheet = document.styleSheets[0];
        let keyframes = `
            @keyframes pinReturn {
                from {
                    transform: rotate(${angle}deg);
                }
                to {
                    transform: rotate(7deg);
                }
            }
        `;
        if (styleSheet.cssRules) {
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        } else if (styleSheet.rules) {
            styleSheet.addRule(keyframes, styleSheet.rules.length);
        }

        setTimeout(function () {
            if (angle != 7) {
                // pin 1.8s後歸位(回到7deg)
                $('#pin').css({
                    'animation': 'pinReturn 1.8s ease-in-out forwards',
                });
                pinOut = true;
                $('#pin').on('animationend', function () {
                    if ($(this).css('animation-name') == 'pinReturn') {
                        $(this).css('animation', '');
                    }
                });
            };
        }, 1800);
    }

    // 獨立函示
    function audioEnd() {
        // 停止旋轉
        clearInterval(rotateInterval);
        // pin先remove.beClick(抬高)
        $('#pin').removeClass('beClick');
        pinReturnAnimation();
        // 移除#pin的pause類別
        $('#pin').removeClass('pause');
        // 音樂結束後呼叫audioEnd
    };
    playAudio.onended = audioEnd;
    // 以上11/29測試


    // 以下拖拉唱片(12/1 測試使用GSAP的拖放功能)
    Draggable.create(".draggable", {
        type: "x,y",
        onPress: function () {
            this.target.parentElement.style.rotate = '-5deg';
            this.target.style.left = '-60px';
            this.target.style.rotate = '0deg';
            this.target.style.transition = '0s';
        },
        onDragEnd: function () {
            const draggable = this.target;
            const dropzone = document.querySelector("#droppable");
            const draggableRect = draggable.getBoundingClientRect();        //取得draggable相對於視窗的位置
            const dropzoneRect = dropzone.getBoundingClientRect();          //取得dropzone相對於視窗的位置
            const insideZone =
                draggableRect.top < dropzoneRect.bottom &&
                draggableRect.bottom > dropzoneRect.top &&
                draggableRect.left < dropzoneRect.right &&
                draggableRect.right > dropzoneRect.left;

            if (insideZone) {
                // droppable裡面的唱片切換顯示
                const isBlock = $('#droppable').siblings('.needRotate').filter(function () {
                    return $(this).css('display') == 'block';
                });
                $(isBlock).css('display', 'none');
                $(`.needRotate.${draggable.id}`).css('display', 'block');
                // 目前display:block的唱片要設定是rotateImg
                $('.rotateImg').removeClass('rotateImg').css('transform', '');
                const newRotateImg = $(`.needRotate.${draggable.id}`);
                newRotateImg.addClass('rotateImg').css('transform', 'rotate(0deg) scale(0.95)');
                // 重置旋轉角度
                deg = 0;
                if (rotateInterval) {
                    clearInterval(rotateInterval);
                }
                rotateInterval = setInterval(function () {
                    deg = (deg + 1) % 360;
                    $('.rotateImg').css('transform', `rotate(${deg}deg) scale(0.95)`);
                }, 15);
                // album的rotate切換
                $('.album').css('rotate', '');
                $(`.album.${draggable.id}`).css('rotate', '-5deg');
                // 讓被拖拉的唱片回到原位並切換顯示
                gsap.to(draggable, {
                    zIndex: 0,
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: function () {
                        draggable.style.left = '';
                        draggable.style.rotate = '';
                        draggable.style.transition = '';
                    }
                });
                $('.albumRecord.draggable').css('display', 'block');
                $(draggable).css('display', 'none');
                // 切換音源
                audioEnd();
                const audioKey = $(draggable).attr('data-src');
                const audioNow = audioSrc[audioKey];
                $('#playAudio source').attr('src', audioNow);
                playAudio.load();
                // 淡出音樂content內容
                $('#audioLicense').fadeOut(1800);
                $('#audioLicense2').fadeOut(1800);
                $('#evelynHome').fadeOut(2000);
                $('.inner').fadeOut(2000, function () {
                    $('#content').fadeOut(2500);
                });
            } else {
                gsap.to(draggable, {
                    zIndex: 0,
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: function () {
                        draggable.parentElement.style.rotate = '';
                        draggable.style.left = '';
                        draggable.style.rotate = '';
                        draggable.style.transition = '';

                    }
                });
            };
        },
    });
    // 寫在draggable後面，避免我hover時候rotate失效
    $('.albumRecord.draggable').css('rotate', '');
    // 以上拖拉唱片(12/1 測試使用GSAP的拖放功能)

    // 更換主要內容
    const changeContent = function () {
        const whoPlay = $('.needRotate').filter(function () {
            return $(this).css('display') == 'block';
        });
        switch (whoPlay.attr('data-msg')) {
            case 'home':
                $('#audioLicense').delay(500).fadeIn(2000, function () {
                    $('#evelynHome h2').delay(300).fadeIn(1800, function () {
                        $('#evelynHome p').fadeIn(2000);
                    });
                });
                break;
            case 'about':
                $('#audioLicense2 span').text('《Midnight Drifter》');
                $('#audioLicense2').delay(500).fadeIn(2000, function () {
                    $('#content').delay(300).fadeIn(1800, function () {
                        $('#about').fadeIn(1800);
                    });
                });
                break;
            case 'works':
                $('#audioLicense2 span').text('《Doing Good》');
                $('#audioLicense2').delay(500).fadeIn(2000, function () {
                    $('#content').delay(300).fadeIn(1800, function () {
                        $('#works').fadeIn(1800);
                    });
                });
                break;
            case 'contact':
                $('#audioLicense2 span').text('《Rewind》');
                $('#audioLicense2').delay(500).fadeIn(2000, function () {
                    $('#content').delay(300).fadeIn(1800, function () {
                        $('#contact').fadeIn(1800);
                    });
                });
                break;
        };
    };


    // About Me content Experience點擊下展
    $('#about .card h4').click(function () {
        $(this).next().slideToggle(500);
    });



    // 點擊HOME回歸原位
    $('header').click(function () {
        // playAudio.load();
        // audioEnd();

    });




    // jQuery結束
});