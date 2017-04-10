var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0,
    starty = 0,
    endx = 0,
    endy = 0;
$(document).ready(function() {
    //移动端适配
    prepareForMobile();
    newgame();
});

//移动端适配
function prepareForMobile(){
    if(documentWidth > 500){
        gridContainerWidth =500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);

}

function newgame() {
    //初始化网格
    init();
    updateScore(0);
    //随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

//通过js布局页面
function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

    score = 0;
}

function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + "-" + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength/2);
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength/2);
            } else {
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j] = false;
        }
    }
    $(".number-cell").css('line-height',cellSideLength+'px');
    $(".number-cell").css('font-size', .5 * cellSideLength + 'px');
}

function generateOneNumber() {
    if (nospace(board)) {
        return false;
    }

    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));

    var times = 0;
    while (times < 50) {
        if (board[randx][randy] == 0) {
            break;
        }
        var randx = parseInt(Math.floor(Math.random() * 4));
        var randy = parseInt(Math.floor(Math.random() * 4));

        times++;
    }
    if(times == 50){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}

$(document).keydown(function(event) {
    switch (event.keyCode) {
        case 37: //left
            event.preventDefault();
            if (moveLeft()) {
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover()",300);
            }
            break;
        case 38: // up
            event.preventDefault();
            if (moveUp()) {
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover()",300);
            }
            break;
        case 39: // right
            event.preventDefault();
            if (moveRight()) {
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover()",300);
            }
            break;
        case 40: // dowm
            event.preventDefault();
            if (moveDown()) {
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover()",300);
            }
            break;
        default:
            break;
    }
});

//捕捉移动端触摸事件
document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
})

document.addEventListener('touchmove',function(event){
    event.preventDefault();
})

document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    if(Math.abs(deltax) < 0.2*documentWidth && Math.abs(deltay) < 0.2*documentWidth)
        return;

    if(Math.abs(deltax) >= Math.abs(deltay)){
        if(deltax > 0){
            //向右移动
            if (moveRight()) {
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover()",300);
            }
        }else{
            //向左移动
            if (moveLeft()) {
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover()",300);
            }
        }
    }else{
        if(deltay>0){
            //向下移动
            if (moveDown()) {
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover()",300);
            }
        }else{
            //向上移动
            if (moveUp()) {
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover()",300);
            }
        }
    }
})

function isgameover() {
    if(nospace(board) && nomove(board)){
        gameover();
    }
}

function gameover(){
    alert('gameover!');
}


function moveLeft() {
    if (!canMoverLeft(board)) {
        return false;
    }
    //向左移动
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //移动
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //移动
                        showMoveAnimation(i, j, i, k);

                        //相加
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //添加总分
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}


function moveRight() {
    if (!canMoverRight(board)) {
        return false;
    }
    //向右移动
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //移动
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        //移动
                        showMoveAnimation(i, j, i, k);

                        //相加
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        //添加总分
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200);
    return true;
}


function moveUp() {
    if (!canMoverUp(board)) {
        return false;
    }
    //向上移动
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        //移动
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        //移动
                        showMoveAnimation(i, j, k, j);

                        //相加
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        //添加总分
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200);
    return true;
}



function moveDown() {
    if (!canMoverDown(board)) {
        return false;
    }
    //向下移动
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        //移动
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        //移动
                        showMoveAnimation(i, j, k, j);

                        //相加
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        //添加总分
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200);
    return true;
}
