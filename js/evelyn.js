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
    // $('#pin').click(function () {
    //     if (pinOut) {
    //         // 清除pin動畫
    //         $('#pin').css('animation', 'none');
    //         $('#pin').css('transform', 'rotate(0deg)');
    //         if (rotateInterval) {
    //             clearInterval(rotateInterval);
    //         }
    //         // 旋轉唱片機到角落
    //         if (!$('#center').hasClass('moveCorner')) {
    //             $('#center').addClass('moveCorner');
    //             if ($(window).width() <= 1280) {
    //                 $('#center.moveCorner').css({
    //                     'transform': 'rotate(42deg) translate3d(-41%, 80%, 0)',
    //                 });
    //             } if ($(window).width() <= 820) {
    //                 $('#center.moveCorner').css({
    //                     'transform': 'rotate(42deg) translate3d(-61%, 40%, 0)',
    //                 });
    //             } if ($(window).width() > 1280) {
    //                 $('#center.moveCorner').css({
    //                     'transform': 'rotate(42deg) translate3d(-41%, 63%, 0)',
    //                     'transition': '2s 0.8s all ease-in-out',
    //                 });
    //             }
    //             // 隱藏Evelyn 及 playlist字眼
    //             $('#center.moveCorner').find('h1,p').delay(1200).fadeOut(900);
    //             // 顯示logo
    //             $('header').delay(2000).fadeIn(800);
    //         }
    //         // 延遲2秒開始旋轉唱片
    //         setTimeout(function () {
    //             rotateInterval = setInterval(function () {
    //                 deg = (deg + 1) % 360; // 每次增加1度
    //                 $('.rotateImg').css('transform', `rotate(${deg}deg) scale(0.95)`);
    //             }, 15); // 每15毫秒更新一次角度
    //         }, 2000);
    //         // 延遲3秒開始播放音樂，並讓 pin 開始轉動
    //         setTimeout(function () {
    //             $('#pin').css('animation', `rotatePin linear ${playAudio.duration}s forwards`);
    //             $('#pin').css('animation-play-state', 'running'); // 恢復 pin 轉動
    //             playAudio.play();
    //             if ($(playAudio).find('source').attr('src') == './tryAudio/snoozyBeats-lazyAfternoon.mp3') {
    //                 // 顯示HOME內容
    //                 $('#evelynHome h2').delay(800).fadeIn(1800, function () {
    //                     $('#evelynHome p').fadeIn(2000, function () {
    //                         $('#audioLicense').fadeIn(800);
    //                     });
    //                 });

    //             } else {
    //                 $('#audioLicense').remove();
    //                 $('#audioLicense2').delay(800).fadeIn(2500);
    //             }
    //         }, 3000);
    //         pinOut = false;
    //     } else {
    //         // 延遲1.4s停止旋轉+暫停pin
    //         setTimeout(function () {
    //             if (rotateInterval) {
    //                 clearInterval(rotateInterval);
    //                 rotateInterval = null;
    //             }
    //             // 暫停音樂
    //             playAudio.pause();
    //             // 暫停 pin 的動畫
    //             $('#pin').css('animation-play-state', 'paused');
    //         }, 1400);
    //         pinOut = true; // 更新狀態
    //     }
    // });




    // // 音樂結束ended，停止旋轉+pin歸位
    // playAudio.onended = function () {
    //     // 停止旋轉
    //     clearInterval(rotateInterval);
    //     // pin歸位
    //     $('#pin').css({
    //         'animation': 'pinReturn 1.8s ease-in-out forwards',
    //     });
    //     // 淡出音樂license
    //     $('#audioLicense').fadeOut(2500, function () {
    //         $('#evelynHome p').fadeOut(2500, function () {
    //             $('#evelynHome h2').fadeOut(2500)
    //         });
    //     });
    //     $('#audioLicense2').fadeOut(2500);
    //     pinOut = true;
    // }







    // 以下11/29測試，重run邏輯
    // 先click在判斷與初始判斷再click是完全不同的邏輯
    $('#pin').click(function () {
        if (pinOut) {
            // 旋轉唱片機到角落(判斷是否已有.moveCorner)
            if (!$('#center').hasClass('moveCorner')) {
                $('#center').addClass('moveCorner');
                if ($(window).width() <= 1280) {
                    $('#center.moveCorner').css({
                        'transform': 'rotate(42deg) translate3d(-41%, 80%, 0)',
                    });
                } if ($(window).width() <= 820) {
                    $('#center.moveCorner').css({
                        'transform': 'rotate(42deg) translate3d(-61%, 40%, 0)',
                    });
                } if ($(window).width() > 1280) {
                    $('#center.moveCorner').css({
                        'transform': 'rotate(42deg) translate3d(-41%, 63%, 0)',
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
                    if ($(playAudio).find('source').attr('src') == './tryAudio/snoozyBeats-lazyAfternoon.mp3') {
                        // 顯示HOME內容+音樂來源
                        $('#evelynHome h2').delay(800).fadeIn(1800, function () {
                            $('#evelynHome p').fadeIn(2000, function () {
                                $('#audioLicense').fadeIn(800);
                            });
                        });
                    } else {
                        $('#audioLicense').remove();
                        $('#audioLicense2').delay(800).fadeIn(2500);
                    }
                }, 1000);
            }, 2000);
        } else {
            // pin在內時click為暫停or繼續播放
            // 停止播放
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
    playAudio.onended = function () {
        // 停止旋轉
        clearInterval(rotateInterval);
        // pin先remove.beClick(抬高)
        $('#pin').removeClass('beClick');
        setTimeout(function () {
            // pin 1.2s後歸位(回到7deg)
            $('#pin').css({
                'animation': 'pinReturn 1.8s ease-in-out forwards',
            });
            pinOut = true;
            $('#pin').on('animationend', function () {
                if ($(this).css('animation-name') == 'pinReturn') {
                    $(this).css('animation', '');
                }
            });

        }, 1800);
        // 必須刪除剛剛的animation-pinReturn,否則會影響到我pin下次新增.beClick時候的動畫效果

        // 淡出音樂license
        $('#audioLicense').fadeOut(2500, function () {
            $('#evelynHome p').fadeOut(2500, function () {
                $('#evelynHome h2').fadeOut(2500)
            });
        });
        $('#audioLicense2').fadeOut(2500);
    }
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
            const draggableRect = draggable.getBoundingClientRect();
            const dropzoneRect = dropzone.getBoundingClientRect();
            const insideZone =
                draggableRect.top < dropzoneRect.bottom &&
                draggableRect.bottom > dropzoneRect.top &&
                draggableRect.left < dropzoneRect.right &&
                draggableRect.right > dropzoneRect.left;

            if (insideZone) {
                const isBlock = $('#droppable').find('.insideDroppable').filter(function () {
                    return $(this).css('display') == 'block';
                });
                $(isBlock).css('display', 'none');
                $(`.insideDroppable.${draggable.id}`).css('display', 'block');

                $('.album').css('rotate', '');
                $(`.album.${draggable.id}`).css('rotate', '-5deg');

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
            } else {
                console.log(this.target);
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






    // About Me content Experience點擊下展
    $('#about .card h4').click(function () {
        $(this).next().toggleClass('beclick');
    });



    // 以下9/19測試更改
    // // 初始化draggable
    // $(".draggable").draggable({
    //     revert: "invalid",
    //     start: function (event, ui) {
    //         $('#menuList').css('z-index', '2');
    //         // 停止音樂
    //         playAudio.pause();
    //         // 停止旋轉
    //         clearInterval(rotateInterval);
    //         // pin歸位
    //         $('#pin').css({
    //             'animation': 'pinReturn 1.8s ease-in-out forwards',
    //         });
    //         // 淡出音樂license
    //         $('#audioLicense').fadeOut(2500);
    //         $('#audioLicense2').fadeOut(2500);
    //         pinOut = true;
    //     },
    //     drag: function (event, ui) {
    //         $('#contactHome').css('animation', 'fadeOutTopLeft 1.8s forwards');
    //         $('.rotateImg').removeClass('rotateImg');
    //         $("#droppable").find(".draggable").fadeOut(800);
    //     },
    // });

    // // function () {
    // //     let thisDiv = $(this).clone().attr('style', '').css('display', 'none');
    // //     let thisId = thisDiv.attr('id');
    // //     $(`.${thisId}`).find('.albumBasic').after(function () {
    // //         return $(thisDiv).fadeIn(800);
    // //     });
    // //     $(this).remove();
    // //     thisDiv.draggable();
    // // }

    // // 初始化droppable
    // $("#droppable").droppable({
    //     accept: ".draggable",
    //     drop: function (event, ui) {
    //         // 9/19變更
    //         // #droppable裡面的.draggable要移除
    //         let currentItem = $(this).find(".draggable");
    //         console.log(currentItem)





    //         var $droppedItem = ui.helper;
    //         // 將新的物件放入droppable
    //         $(this).append($droppedItem);
    //         $droppedItem.css({
    //             position: "relative",
    //             left: 0,
    //             top: 0
    //         });
    //         $droppedItem.find('img:last').addClass('rotateImg');
    //         if (!$('#center').hasClass('moveCorner')) {
    //             $('#center').addClass('moveCorner');
    //             if ($(window).width() <= 1280) {
    //                 $('#center.moveCorner').css({
    //                     'transform': 'rotate(42deg) translate3d(-41%, 80%, 0)',
    //                 });
    //             } else {
    //                 $('#center.moveCorner').css({
    //                     'transform': 'rotate(42deg) translate3d(-41%, 63%, 0)',
    //                     'transition': '2s 0.8s all ease-in-out',
    //                 });
    //             }
    //         }

    //         $('#center.moveCorner').find('h1,p').delay(1200).fadeOut(900);
    //         $('header').delay(2000).fadeIn(800);
    //         $('#content').delay(2400).fadeIn(800);
    //         switch ($droppedItem.attr('id')) {
    //             case 'aboutRecord':
    //                 $('.inner').css('display', 'none');
    //                 $('#about.inner').fadeIn(900);
    //                 $('#playAudio source').attr('src', './tryAudio/snoozyBeats-midnightDrifter.mp3');
    //                 $('#audioLicense2 span').text('＜Midnight Drifter＞');
    //                 playAudio = $('#playAudio')[0];
    //                 playAudio.load();
    //                 break;
    //             case 'worksRecord':
    //                 $('.inner').css('display', 'none');
    //                 $('#works.inner').fadeIn(900);
    //                 $('#playAudio source').attr('src', './tryAudio/snoozyBeats-doingGood.mp3');
    //                 $('#audioLicense2 span').text('＜Doing Good＞');
    //                 playAudio = $('#playAudio')[0];
    //                 playAudio.load();
    //                 break;
    //             case 'contactRecord':
    //                 $('.inner').css('display', 'none');
    //                 $('#contact.inner').fadeIn(900);
    //                 $('#playAudio source').attr('src', './tryAudio/snoozyBeats-rewind.mp3');
    //                 $('#audioLicense2 span').text('＜Rewind＞');
    //                 playAudio = $('#playAudio')[0];
    //                 playAudio.load();
    //                 break;
    //         }

    //     }
    // });
    // 以上9/19測試更改









    // 點擊HOME回歸原位
    $('header').click(function () {
        // $('#center').addClass('moveback');
        // $('#center.moveback').css({
        //     'transform': 'rotate(0deg) translate3d(0%, 0%, 0)',
        // });
        $('#center.moveCorner').removeClass('.moveCorner');

    });




    // jQuery結束
});