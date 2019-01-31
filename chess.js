var board = [[['R','w',[0,0],true],['N','w',[0,1]],['B','w',[0,2]],['Q','w',[0,3]],['K','w',[0,4],true],['B','w',[0,5]],['N','w',[0,6]],['R','w',[0,7],true]],[['P','w',[1,0],true],['P','w',[1,1],true],['P','w',[1,2],true],['P','w',[1,3],true],['P','w',[1,4],true],['P','w',[1,5],true],['P','w',[1,6],true],['P','w',[1,7],true]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[['P','b',[6,0],true],['P','b',[6,1],true],['P','b',[6,2],true],['P','b',[6,3],true],['P','b',[6,4],true],['P','b',[6,5],true],['P','b',[6,6],true],['P','b',[6,7],true]],[['R','b',[7,0],true],['N','b',[7,1]],['B','b',[7,2]],['Q','b',[7,3]],['K','b',[7,4],true],['B','b',[7,5]],['N','b',[7,6]],['R','b',[7,7],true]]]
var horizontal = ['a','b','c','d','e','f','g','h'];
var moveName = "";var movesPlayed = 1; var pieceName =""; var castling = false;var castlingCoords = [];
let piecesWidth = 64;
var offsetTop = document.getElementsByClassName("board")[0].getBoundingClientRect().top;
var offsetLeft = document.getElementsByClassName("board")[0].getBoundingClientRect().left;
var playerTurn = 'w';
var availableMoves = [];
var currentPiece = [];
var currentPieceCoords = [];
var currentPieceHTML;
var movesHistory = [];
var promotionPiece = "none"; var selectingPromotionPiece = false;
var pawnPromoteBlack = false; var pawnPromoteWhite = false; var promoteCoords = [];
var selectedPiece = false;let squaresToCheck ;
let largerPos = 0, lesserPos = 0;  points = [0,0];
let ctrlClicked = false; zClicked = false;
var pieceMoveSoundFx = new Audio('sounds/piece-move.wav');
pieceMoveSoundFx.volume = 0.3;


/////////////
init();//////
/////////////

document.getElementsByClassName("board")[0].onclick = function(e){
    if(!selectingPromotionPiece){
        onBoardClick(e);
    }
};



function onBoardClick(e){
   
        let squareClickedY = 7 - Math.floor((e.clientY - offsetTop)/piecesWidth);
        let squareClickedX = Math.floor((e.clientX - offsetLeft)/piecesWidth);
        moveName = horizontal[squareClickedX] + (squareClickedY+1).toString();
    
        selectPiece(squareClickedY,squareClickedX);
    

}

function selectPiece(y,x){
    
        if(board[y][x][1]==playerTurn){
            selectedPiece = true;
            showAvailableMoves(y,x);
            return true;
        }
        else{
            if(!selectedPiece) return false;
            else{
                movePiece(y,x);
            }
        }
    
}

function showAvailableMoves(y,x){
    
    removeOtherFrames();
    availableMoves = [];
    currentPieceCoords = [y,x];
    currentPieceHTML = document.getElementById(y.toString()+x.toString());
    pieceName = board[y][x][0];
    castlingShort = false;
    castlingLong = false;
    switch(board[y][x][0]){
        case 'P': 
            pieceName = "";
            pawnMove(y,x);
            break;
        case 'R':
            rookMove(y,x);
            break;
        case 'N':
            knightMove(y,x);
            break;
        case 'B':
            bishopMove(y,x);
            break;
        case 'Q':
            bishopMove(y,x);
            rookMove(y,x);
            break;
        case 'K':
            kingMove(y,x);
        default: return false;
        
    }
   
}

function pawnMove(y,x){
    
    if(playerTurn=='w'){
        pawnPromoteWhite = false;
            if(board[y+1][x].length==0&&nextKingMoveLegal([y,x],[y+1,x])){ 
                if(y+1==7) pawnPromoteWhite = true;
                availableMoves.push([y+1,x]);
                appendFrame(y+1,x);
                if(y==1&&nextKingMoveLegal([y,x],[y+2,x])){  //if 1st move pawn - can move 2 squares
                    if(board[y+2][x].length==0){
                        availableMoves.push([y+2,x]);
                        appendFrame(y+2,x);
                    }
                }
            }
            if(y+1<=7 && x+1<=7 && board[y+1][x+1].length > 0 &&board[y+1][x+1][1]!==playerTurn&&nextKingMoveLegal([y,x],[y+1,x+1])){
                if(y+1==7) pawnPromoteWhite = true;
                availableMoves.push([y+1,x+1]);
                appendFrame(y+1,x+1);
            }
            if(y+1<=7 && x-1>=0 && board[y+1][x-1].length > 0 &&board[y+1][x-1][1]!==playerTurn&&nextKingMoveLegal([y,x],[y+1,x-1])){
                if(y+1==7) pawnPromoteWhite = true;
                availableMoves.push([y+1,x-1]);
                appendFrame(y+1,x-1);
            }
    }
    else{
        pawnPromoteBlack = false;
        if(board[y-1][x].length==0&&nextKingMoveLegal([y,x],[y-1,x])){ 
            if(y-1==0) pawnPromoteBlack = true;
            availableMoves.push([y-1,x]);
            appendFrame(y-1,x);
            if(y==6&&nextKingMoveLegal([y,x],[y-2,x])){  //if 1st move pawn - can move 2 squares
                if(board[y-2][x].length==0){
                    availableMoves.push([y-2,x]);
                    appendFrame(y-2,x);
                }
            }
        }
        if(y-1>=0 && x+1<=7 && board[y-1][x+1].length > 0 &&board[y-1][x+1][1]!==playerTurn&&nextKingMoveLegal([y,x],[y-1,x+1])){
            if(y-1==0) pawnPromoteBlack = true;
            availableMoves.push([y-1,x+1]);
            appendFrame(y-1,x+1);
        }
        if(y-1>=0 && x-1>=0 && board[y-1][x-1].length > 0 &&board[y-1][x-1][1]!==playerTurn&&nextKingMoveLegal([y,x],[y-1,x-1])){
            if(y-1==0) pawnPromoteBlack = true;
            availableMoves.push([y-1,x-1]);
            appendFrame(y-1,x-1);
        }
}
}

function rookMove(y,x){


   for(var y1 = y + 1; y1<=7; y1++){ //up vertically 
        if(board[y1][x].length!==0){
            if(board[y1][x][1]==playerTurn){ 
                y1 = 8; //encountered friendly piece. stop the loop
            }
            else{
                if(nextKingMoveLegal([y,x],[y1,x])){
                    availableMoves.push([y1,x]);
                    appendFrame(y1,x);
                }
                y1 = 8; //encountered enemy piece. stop the loop
            }
        }
        else{
            if(nextKingMoveLegal([y,x],[y1,x])){
                availableMoves.push([y1,x]);
                appendFrame(y1,x);
            }
        }
   }

   for(var y2 = y - 1; y2>=0; y2--){ //up vertically 
        if(board[y2][x].length!==0){
            if(board[y2][x][1]==playerTurn){ 
                y2 = -1; //encountered friendly piece. stop the loop
            }
            else{
                if(nextKingMoveLegal([y,x],[y2,x])){
                    availableMoves.push([y2,x]);
                    appendFrame(y2,x);
                }
                y2 = -1; //encountered enemy piece. stop the loop
            }
        }
        else{
            if(nextKingMoveLegal([y,x],[y2,x])){
                availableMoves.push([y2,x]);
                appendFrame(y2,x);
            }
        }
    }
    for(var x1 = x + 1; x1<=7; x1++){ //left horizontally
        if(board[y][x1].length!==0){
            if(board[y][x1][1]==playerTurn){ 
                x1 = 8; //encountered friendly piece. stop the loop
            }
            else{
                if(nextKingMoveLegal([y,x],[y,x1])){
                    availableMoves.push([y,x1]);
                    appendFrame(y,x1);
                }
                x1 = 8; //encountered enemy piece. stop the loop
            }
        }
        else{
            if(nextKingMoveLegal([y,x],[y,x1])){
                availableMoves.push([y,x1]);
                appendFrame(y,x1);
            }
        }
    }
    for(var x2 = x - 1; x2>=0; x2--){ //right horizontally 
        if(board[y][x2].length!==0){
            if(board[y][x2][1]==playerTurn){ 
                x2 = -1; //encountered friendly piece. stop the loop
            }
            else{
                if(nextKingMoveLegal([y,x],[y,x2])){
                    availableMoves.push([y,x2]);
                    appendFrame(y,x2);
                }
                x2 = -1; //encountered enemy piece. stop the loop
            }
        }
        else{
            if(nextKingMoveLegal([y,x],[y,x2])){
                availableMoves.push([y,x2]);
                appendFrame(y,x2);
            }
        }
    }
}

function knightMove(y,x){

    if(y+2<=7 && x+1<=7 && board[y+2][x+1]!==undefined && board[y+2][x+1][1]!== playerTurn && nextKingMoveLegal([y,x],[y+2,x+1])){
        availableMoves.push([y+2,x+1]);
        appendFrame(y+2,x+1); 
    }
    if(y+2<=7 && x-1>=0 && board[y+2][x-1]!==undefined && board[y+2][x-1][1]!== playerTurn && nextKingMoveLegal([y,x],[y+2,x-1])){
        availableMoves.push([y+2,x-1]);
        appendFrame(y+2,x-1); 
    }
    if(y+1<=7 && x-2>=0 && board[y+1][x-2]!==undefined && board[y+1][x-2][1]!== playerTurn && nextKingMoveLegal([y,x],[y+1,x-2])){
        availableMoves.push([y+1,x-2]);
        appendFrame(y+1,x-2); 
    }
    if(y-1>=0 && x-2>=0 && board[y-1][x-2]!==undefined && board[y-1][x-2][1]!== playerTurn && nextKingMoveLegal([y,x],[y-1,x-2])){
        availableMoves.push([y-1,x-2]);
        appendFrame(y-1,x-2); 
    }
    if(y-2>=0 && x-1>=0 && board[y-2][x-1]!==undefined && board[y-2][x-1][1]!== playerTurn && nextKingMoveLegal([y,x],[y-2,x-1])){
        availableMoves.push([y-2,x-1]);
        appendFrame(y-2,x-1); 
    }
    if(y-2>=0 && x+1<=7 && board[y-2][x+1]!==undefined && board[y-2][x+1][1]!== playerTurn && nextKingMoveLegal([y,x],[y-2,x+1])){
        availableMoves.push([y-2,x+1]);
        appendFrame(y-2,x+1); 
    }
    if(y-1>=0 && x+2<=7 && board[y-1][x+2]!==undefined && board[y-1][x+2][1]!== playerTurn && nextKingMoveLegal([y,x],[y-1,x+2])){
        availableMoves.push([y-1,x+2]);
        appendFrame(y-1,x+2); 
    }
    if(y+1<=7 && x+2<=7 && board[y+1][x+2]!==undefined && board[y+1][x+2][1]!== playerTurn && nextKingMoveLegal([y,x],[y+1,x+2])){
        availableMoves.push([y+1,x+2]);
        appendFrame(y+1,x+2); 
    }
}

function bishopMove(y,x){
  
    largerPos = 0, lesserPos = 0;
    if(y>x){
        largerPos = y;
        lesserPos = x;
    }
    else{
        largerPos = x;
        lesserPos = y;
    }

    for(var l = 1;l<=7 - largerPos;l++){ // up and right
        if(y+l<=7&&x+l<=7){
            if(board[y+l][x+l].length!==0){
                if(board[y+l][x+l][1]==playerTurn){ 
                    l = 8; //encountered friendly piece. stop the loop
                }
               
                else{
                    if(nextKingMoveLegal([y,x],[y+l,x+l])){
                        availableMoves.push([y+l,x+l]);
                        appendFrame(y+l,x+l);
                    }
                    l = 8; //encountered enemy piece. stop the loop
                }
            if(l==8) break;
            }
            if(nextKingMoveLegal([y,x],[y+l,x+l])){
                availableMoves.push([y+l,x+l]);
                appendFrame(y+l,x+l); 
            }
        }
    }


    for(var l = 1;l<=lesserPos+1;l++){ //down and left
        
        if(y-l>=0&&x-l>=0){
            if(board[y-l][x-l].length!==0){
                if(board[y-l][x-l][1]==playerTurn){ 
                    l = 9; //encountered friendly piece. stop the loop
                }
                else{
                    if(nextKingMoveLegal([y,x],[y-l,x-l])){
                        availableMoves.push([y-l,x-l]);
                        appendFrame(y-l,x-l);
                    }
                    l = 9; //encountered enemy piece. stop the loop
                }
            }
            if(l==9) break;
            if(nextKingMoveLegal([y,x],[y-l,x-l])){
                availableMoves.push([y-l,x-l]);
                appendFrame(y-l,x-l); 
            }
        }
    }
    squaresToCheck = 0;
    if(y>x){
        squaresToCheckUp = lesserPos;
        squaresToCheckDown = largerPos;
    }
    else{
        squaresToCheckUp = largerPos;
        squaresToCheckDown = lesserPos;
    } 
    
    for(var l = 1;l<=squaresToCheckUp;l++){
        if(y+l<=7&&x-l>=0){
            if(board[y+l][x-l].length!==0){
                if(board[y+l][x-l][1]==playerTurn){ 
                    l = 9; //encountered friendly piece. stop the loop
                }
                else{
                    if(nextKingMoveLegal([y,x],[y+l,x-l])){
                        availableMoves.push([y+l,x-l]);
                        appendFrame(y+l,x-l);
                    }
                    l = 9; //encountered enemy piece. stop the loop
                }
            }
            if(l==9) break;
            if(nextKingMoveLegal([y,x],[y+l,x-l])){
                availableMoves.push([y+l,x-l]);
                appendFrame(y+l,x-l); 
            }
        }
    }

    for(var l1 = 1;l1<=squaresToCheckDown;l1++){
       
        if(y-l1>=0&&x+l1<=7){
            if(board[y-l1][x+l1].length!==0){
                if(board[y-l1][x+l1][1]==playerTurn){ 
                    l1 = 9; //encountered friendly piece. stop the loop
                   
                }
                else{
                    if(nextKingMoveLegal([y,x],[y-l1,x+l1])){
                        availableMoves.push([y-l1,x+l1]);
                        appendFrame(y-l1,x+l1);
                    }
                    l1 = 9; //encountered enemy piece. stop the loop
                 
                }
            }
            if(l1==9) break;
            if(nextKingMoveLegal([y,x],[y-l1,x+l1])){
              
                availableMoves.push([y-l1,x+l1]);
                appendFrame(y-l1,x+l1); 
            }
        }
    } 
}

function kingMove(y,x){
    if(y+1<=7 && board[y+1][x][1]!==playerTurn && nextKingMoveLegal([y,x],[y+1,x])){
        availableMoves.push([y+1,x]);
        appendFrame(y+1,x); 
    }
    if(y-1>=0 && board[y-1][x][1]!==playerTurn && nextKingMoveLegal([y,x],[y-1,x])){
        availableMoves.push([y-1,x]);
        appendFrame(y-1,x);
    }
    if(x+1<=7 && board[y][x+1][1]!==playerTurn && nextKingMoveLegal([y,x],[y,x+1])){
        availableMoves.push([y,x+1]);
        appendFrame(y,x+1);  
    }
    if(x-1>=0 && board[y][x-1][1]!==playerTurn && nextKingMoveLegal([y,x],[y,x-1])){
        availableMoves.push([y,x-1]);
        appendFrame(y,x-1); 
    }
    if(y+1<=7&&x+1<=7 && board[y+1][x+1][1]!==playerTurn && nextKingMoveLegal([y,x],[y+1,x+1])){
        availableMoves.push([y+1,x+1]);
        appendFrame(y+1,x+1);
    }
    if(y-1>=0&&x+1<=7 && board[y-1][x+1][1]!==playerTurn && nextKingMoveLegal([y,x],[y-1,x+1])){
        availableMoves.push([y-1,x+1]);
        appendFrame(y-1,x+1);
    }
    if(y+1<=7&&x-1>=0 && board[y+1][x-1][1]!==playerTurn && nextKingMoveLegal([y,x],[y+1,x-1])){
        availableMoves.push([y+1,x-1]);
        appendFrame(y+1,x-1);
    }
    if(y-1>=0&&x-1>=0 && board[y-1][x-1][1]!==playerTurn && nextKingMoveLegal([y,x],[y-1,x-1])){
        availableMoves.push([y-1,x-1]);
        appendFrame(y-1,x-1);
    }

    //castling

    if(board[y][x][3]==true&&board[y][x+3][1]==playerTurn&&board[y][x+3][0]=='R'&&board[y][x+3][3]&&board[y][x+1].length==0&&board[y][x+2].length==0&&nextKingMoveLegal([y,x],[y,x+1])&&nextKingMoveLegal([y,x],[y,x+2])){
        availableMoves.push([y,x+2]);
        appendFrame(y,x+2);
        castlingShort = true;
        
    }
    if(board[y][x][3]==true&&board[y][x-4][1]==playerTurn&&board[y][x-4][0]=='R'&&board[y][x-4][3]&&board[y][x-1].length==0&&board[y][x-2].length==0&&nextKingMoveLegal([y,x],[y,x-1])&&nextKingMoveLegal([y,x],[y,x-2])){
        availableMoves.push([y,x-2]);
        appendFrame(y,x-2);
        castlingLong = true;
    }
}

function movePiece(y,x){
    
    if(availableMoves.length>0){
        for(var c = 0; c<availableMoves.length; c++){
            if(y==availableMoves[c][0]&&x==availableMoves[c][1]){

                
                selectedPiece = false;
                movePieceTrue(y,x);
                if(castlingShort&&c == availableMoves.length - 1){
                    if(playerTurn == 'w') playerTurn = 'b';
                    else playerTurn = 'w'
                    moveName = "O-O";
                    currentPieceHTML = document.getElementById(findKing()[0].toString()+(findKing()[1]+1).toString());
                    currentPieceCoords=[findKing()[0],findKing()[1]+1];
                    board[findKing()[0]][findKing()[1]][3] = false;
                    movePieceTrue(findKing()[0],findKing()[1]-1);
                   
                }
                else if((castlingLong&&c == availableMoves.length - 1)){
                    if(playerTurn == 'w') playerTurn = 'b';
                    else playerTurn = 'w'
                    moveName = "O-O-O";
                    currentPieceHTML = document.getElementById(findKing()[0].toString()+(findKing()[1]-2).toString());
                    currentPieceCoords=[findKing()[0],findKing()[1]-2];
                    board[findKing()[0]][findKing()[1]][3] = false;
                    movePieceTrue(findKing()[0],findKing()[1]+1);
                   
                }
                return true;
            }
        }
    }
}

function updateMovesHistoryHTML(side){

    
    if(side=='w'){
        
        if(movesPlayed!==1){
            
            var newSpanContainer = document.createElement('SPAN');
            newSpanContainer.setAttribute("class","moves-history-span");
            var newSpanCounter = document.createElement('SPAN');
            newSpanCounter.setAttribute("class","moves-history-span-counter");
            newSpanCounter.innerHTML = movesPlayed.toString() + ".";
            newSpanContainer.appendChild(newSpanCounter);
            document.getElementsByClassName("moves-history")[0].appendChild(newSpanContainer);
        }
        var newSpanWhiteMove = document.createElement("SPAN");
        newSpanWhiteMove.setAttribute("class","moves-history-span-white");
        if(moveName == "O-O"||moveName == "O-O-O"){
            document.getElementsByClassName("moves-history-span-counter")[document.getElementsByClassName("moves-history-span-counter").length-2].outerHTML = "";
            document.getElementsByClassName("moves-history-span-white")[document.getElementsByClassName("moves-history-span-white").length-1].outerHTML = "";
            pieceName = "";
        }
        newSpanWhiteMove.innerHTML = pieceName + moveName+" ";

        document.getElementsByClassName("moves-history-span")[document.getElementsByClassName("moves-history-span").length-1].appendChild(newSpanWhiteMove);
    }
    else{
        movesPlayed++;
        var newSpanBlackMove = document.createElement("SPAN");
        newSpanBlackMove.setAttribute("class","moves-history-span-black");
        if(moveName == "O-O"||moveName == "O-O-O"){
            document.getElementsByClassName("moves-history-span-black")[document.getElementsByClassName("moves-history-span-black").length-1].outerHTML = "";
            pieceName = "";
        }
        newSpanBlackMove.innerHTML = pieceName + moveName;
        document.getElementsByClassName("moves-history-span")[document.getElementsByClassName("moves-history-span").length-1].appendChild(newSpanBlackMove);

    }
}

function pawnPromoteShow(coords){
    let pawnPromoteOffset = coords[1]*piecesWidth-piecesWidth-piecesWidth/2;
    if(pawnPromoteOffset<0) pawnPromoteOffset = 0;
    selectingPromotionPiece = true;
    if(playerTurn == 'w'){
        document.getElementsByClassName("promotion-white")[0].style.display = "block";
        
        document.getElementsByClassName("promotion-white")[0].style.left = pawnPromoteOffset+"px";
        
    }
    else{
        document.getElementsByClassName("promotion-black")[0].style.display = "block";
        document.getElementsByClassName("promotion-black")[0].style.left = pawnPromoteOffset+"px";
    }
}
function selectedPromotionPiece(piece){
    let addPieceSide = "";
    
    if(playerTurn == 'w'){
        document.getElementsByClassName("promotion-black")[0].style.display = "none";
        addPieceSide = 'b';
    }
    else{
        document.getElementsByClassName("promotion-white")[0].style.display = "none";
        addPieceSide = 'w';
    }
    
    document.getElementById(currentPiece[currentPiece.length-1][2][0]+""+currentPiece[currentPiece.length-1][2][1]).outerHTML = "";
    board[currentPiece[currentPiece.length-1][2][0]][currentPiece[currentPiece.length-1][2][1]] = [piece,addPieceSide,promoteCoords];
    addPiece(promoteCoords,piece,addPieceSide);
    setTimeout(()=>{selectingPromotionPiece = false;},50);
    
}
function movePieceTrue(y,x){
    currentPiece.push(board[currentPieceCoords[0]][currentPieceCoords[1]]);
    if(currentPiece[currentPiece.length-1][0]=='R'&&currentPiece[currentPiece.length-1][3])currentPiece[currentPiece.length-1][3]=false;
   
    let pieceToRemove = document.getElementById(y.toString()+x.toString());
    updateBoardVisualHTML(y,x);
    removeOtherFrames();
    
    if(board[y][x].length>0 && board[y][x][1]!==playerTurn){ //taking another piece
        movesHistory[movesHistory.length-1].push(board[y][x]);
        setTimeout(function(){
            pieceToRemove.outerHTML = "";
        },100)
    } 

    if(board[currentPieceCoords[0]][currentPieceCoords[1]][0]=='P'){
        
        if(playerTurn == 'w' && board[currentPieceCoords[0]][currentPieceCoords[1]][1]=='w' && pawnPromoteWhite && y == 7){
            pawnPromoteShow([y,x]);
            promoteCoords = [y,x];
        }
        else if(playerTurn == 'b' && board[currentPieceCoords[0]][currentPieceCoords[1]][1]=='b'&& pawnPromoteBlack && y == 0){
            pawnPromoteShow([y,x]);
            promoteCoords = [y,x];
        }
    }
    pieceMoveSoundFx.play();
    board[y][x] = currentPiece[currentPiece.length-1];
    board[currentPiece[currentPiece.length-1][2][0]][currentPiece[currentPiece.length-1][2][1]] = [];
    board[y][x][2] = [y,x];
    
   

    
    updateMovesHistoryHTML(playerTurn);
    lastMoveHighlighter();

    if(playerTurn == 'w') playerTurn = 'b';
    else playerTurn = 'w'
  
    if(!nextKingMoveLegal(findKing(),findKing())){
        let isNotCheckmated = false;
        for(var l = 0;l<=7;l++){
            for(var z = 0;z<=7;z++){       
                if(board[l][z].length>0&&board[l][z][1]==playerTurn){
                    
                    showAvailableMoves(l,z);
                    if(availableMoves.length>0){
                     
                        isNotCheckmated = true;
                    }
                }
            } 
           
        }
        if(!isNotCheckmated){
            let winner;
            if(playerTurn == 'w') winner = 'b';
            else winner = 'w';
            gameEnd(winner,"checkmate")
        }
    }
    
        
    
}

function lastMoveHighlighter(){
    let offsetTopHighlight = 1, offsetLeftHighlight = 0;
    if(window.innerWidth<=512){
         offsetTopHighlight = 3;
         offsetLeftHighlight = 3;
    }
    document.getElementsByClassName("last-move-start")[0].style.display = "block";
    document.getElementsByClassName("last-move-start")[0].style.top = (piecesWidth*7 - currentPieceCoords[0]*piecesWidth- offsetTopHighlight)+"px";
    document.getElementsByClassName("last-move-start")[0].style.left = (currentPieceCoords[1]*piecesWidth -  offsetLeftHighlight)+"px";
    document.getElementsByClassName("last-move-end")[0].style.display = "block";
    document.getElementsByClassName("last-move-end")[0].style.top = (piecesWidth*7 - movesHistory[movesHistory.length-1][0][0]*piecesWidth- offsetTopHighlight)+"px";
    document.getElementsByClassName("last-move-end")[0].style.left = (movesHistory[movesHistory.length-1][0][1]*piecesWidth-offsetLeftHighlight)+"px";
}

function updateBoardVisualHTML(y,x){
    
    let topPixels = Number(currentPieceHTML.style.top.slice(0, -2)) + (currentPiece[currentPiece.length-1][2][0] - y)*piecesWidth + "px";
    let leftPixels = Number(currentPieceHTML.style.left.slice(0, -2)) - (currentPiece[currentPiece.length-1][2][1] - x)*piecesWidth + "px";

    currentPieceHTML.id = y.toString() + x.toString();
    movesHistory.push([currentPieceHTML.id,currentPieceHTML.style.top,currentPieceHTML.style.left ]);

    currentPieceHTML.style.top = topPixels;
    currentPieceHTML.style.left = leftPixels;

}

function appendFrame(y,x){
    if(piecesWidth<64){
        let newFrame = document.createElement("DIV");
        newFrame.setAttribute("class","square-frame");
        newFrame.style.top = (piecesWidth*8 - piecesWidth-3- y*piecesWidth).toString() + "px";
        newFrame.style.left = (x*piecesWidth-2).toString() + "px";
        document.getElementsByClassName("board")[0].appendChild(newFrame);
    }
    else{
        let newFrame = document.createElement("DIV");
        newFrame.setAttribute("class","square-frame");
        newFrame.style.top = (512 - 65 - y*64).toString() + "px";
        newFrame.style.left = (x*64).toString() + "px";
        document.getElementsByClassName("board")[0].appendChild(newFrame);
    }

}
function removeOtherFrames(){
    
    if(document.getElementsByClassName("square-frame").length>0){
        var length1 = document.getElementsByClassName("square-frame").length;
        for(var i = 0; i<length1; i++){
            document.getElementsByClassName("square-frame")[0].outerHTML = "";
        }
    }
}

function init(){

    if(window.innerWidth<=512){
        piecesWidth = window.innerWidth/8;
        for(var i = 0;i<=7;i++){
            document.getElementById("7"+i.toString()).style = "top: 0; left: "+(i*piecesWidth-2)+"px;";
        }
        for(var i = 0;i<=7;i++){
            document.getElementById("6"+i.toString()).style = "top: "+(piecesWidth)+"px; left: "+(i*piecesWidth-2)+"px;";
        }
        for(var i = 0;i<=7;i++){
            document.getElementById("0"+i.toString()).style = "top: "+(piecesWidth*7-2)+"px; left: "+(i*piecesWidth-2)+"px;";
        }
        for(var i = 0;i<=7;i++){
            document.getElementById("1"+i.toString()).style = "top: "+(piecesWidth*6-2)+"px; left: "+(i*piecesWidth-2)+"px;";
        }
    }
    else{
        for(var i = 0;i<=7;i++){
            document.getElementById("7"+i.toString()).style = "top: 0; left: "+(i*piecesWidth)+"px;";
        }
        for(var i = 0;i<=7;i++){
            document.getElementById("6"+i.toString()).style = "top: "+(piecesWidth)+"px; left: "+(i*piecesWidth)+"px;";
        }
        for(var i = 0;i<=7;i++){
            document.getElementById("0"+i.toString()).style = "top: "+(piecesWidth*7)+"px; left: "+(i*piecesWidth)+"px;";
        }
        for(var i = 0;i<=7;i++){
            document.getElementById("1"+i.toString()).style = "top: "+(piecesWidth*6)+"px; left: "+(i*piecesWidth)+"px;";
        }
    }   
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 17){
        ctrlClicked = true;
    }
    else if(event.keyCode == 90){
        zClicked = true;
    }
    if(ctrlClicked&&zClicked){
        moveBackwards();
    }
}, false);
document.addEventListener('keyup', function(event) {
    if(event.keyCode == 17){
        ctrlClicked = false;
    }
    else if(event.keyCode == 90){
        zClicked = false;
    }
}, false);


function findKing(){

    for(var l = 0;l<=7;l++){
        for(var z = 0;z<=7;z++){       
            if(board[l][z].length>0&&board[l][z][1]==playerTurn&&board[l][z][0]=='K'){
                return [l,z];          
            }
       
        } 
       
    }

}

function moveBackwards(){

    if(movesHistory.length == 0) return false;
    

    removeOtherFrames();


    let lastPiece = document.getElementById(movesHistory[movesHistory.length-1][0]); //vrushtame sushtestvuvashtata figura nazad
    lastPiece.style.top = movesHistory[movesHistory.length-1][1]; //
    lastPiece.style.left = movesHistory[movesHistory.length-1][2]; //
  
    lastPiece.id = (7- (movesHistory[movesHistory.length-1][1].slice(0,-2)/piecesWidth)).toString()
     +""+ (movesHistory[movesHistory.length-1][2].slice(0,-2)/piecesWidth).toString(); // i sled tova smenqme id
    
    if(movesHistory[movesHistory.length-1][3]!==undefined){ //ako e vzeta figura na protivnika
     board[Number(movesHistory[movesHistory.length-1][0][0])][Number(movesHistory[movesHistory.length-1][0][1])] = movesHistory[movesHistory.length-1][3];
     addPiece(movesHistory[movesHistory.length-1][3][2],movesHistory[movesHistory.length-1][3][0],movesHistory[movesHistory.length-1][3][1]) ; 
    }
    else{
        board[Number(movesHistory[movesHistory.length-1][0][0])][Number(movesHistory[movesHistory.length-1][0][1])] = [];
    }
    board[lastPiece.id[0]][lastPiece.id[1]] = currentPiece[currentPiece.length-1];
    board[lastPiece.id[0]][lastPiece.id[1]][2] = [Number(lastPiece.id[0]),Number(lastPiece.id[1])];
    movesHistory.splice(-1,1);
    currentPiece.splice(-1,1);
    if(movesHistory.length == 0){
        board = [[['R','w',[0,0]],['N','w',[0,1]],['B','w',[0,2]],['Q','w',[0,3]],['K','w',[0,4]],['B','w',[0,5]],['N','w',[0,6]],['R','w',[0,7]]],[['P','w',[1,0],true],['P','w',[1,1],true],['P','w',[1,2],true],['P','w',[1,3],true],['P','w',[1,4],true],['P','w',[1,5],true],['P','w',[1,6],true],['P','w',[1,7],true]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[['P','b',[6,0],true],['P','b',[6,1],true],['P','b',[6,2],true],['P','b',[6,3],true],['P','b',[6,4],true],['P','b',[6,5],true],['P','b',[6,6],true],['P','b',[6,7],true]],[['R','b',[7,0]],['N','b',[7,1]],['B','b',[7,2]],['Q','b',[7,3]],['K','b',[7,4]],['B','b',[7,5]],['N','b',[7,6]],['R','b',[7,7]]]]

    }

    
    if(playerTurn == 'w') playerTurn = 'b';
    else playerTurn = 'w';
    if(playerTurn == 'w'){
        if(document.getElementsByClassName("moves-history-span-counter").length!==1){
            document.getElementsByClassName("moves-history-span")[document.getElementsByClassName("moves-history-span").length-1].outerHTML = "";
        }
        else{
            document.getElementsByClassName("moves-history-span-white")[document.getElementsByClassName("moves-history-span-white").length-1].outerHTML = "";

        }
    }
    else{
        movesPlayed--;
        document.getElementsByClassName("moves-history-span-black")[document.getElementsByClassName("moves-history-span-black").length-1].outerHTML = "";
       
    }
    if(movesPlayed<=0){
        var newSpanContainer = document.createElement('SPAN');
        newSpanContainer.setAttribute("class","moves-history-span");
        document.getElementsByClassName("moves-history")[0].appendChild(newSpanContainer);
        movesPlayed = 1;
    }
    
      document.getElementsByClassName("last-move-start")[0].style.display = "none";
      document.getElementsByClassName("last-move-end")[0].style.display = "none";

}
function addPiece(to,type,whiteOrBlack){
    
    switch(type){
        case 'P': type = "pawn";
        break;
        case 'R': type = "rook";
        break;
        case 'B': type = "bishop";
        break;
        case 'Q': type = "queen";
        break;
        case 'K': type = "king";
        break;
        case 'N': type = "knight";
    }
    if(whiteOrBlack == 'w') type+="-white";
    else type+="-black";
    let newPiece = document.createElement("DIV");
    newPiece.setAttribute("class","piece "+type);
    newPiece.setAttribute("id",to[0].toString()+to[1].toString());
    newPiece.style.top = (512 - 64 - (to[0])*64).toString()+"px"; 
    newPiece.style.left = ((to[1])*64).toString()+"px"; 
    document.getElementsByClassName("board")[0].prepend(newPiece);
   
}
function nextKingMoveLegal(from,to){  
    let checkingForKing = false;
    var pos = [];
    if(from[0]==to[0]&&from[1]==to[1]){
        checkingForKing = true;
        pos = from;
    }
    if(!checkingForKing){
        var backupFrom = board[from[0]][from[1]];
        var backupTo = board[to[0]][to[1]];
        board[to[0]][to[1]] = board[from[0]][from[1]];
        board[from[0]][from[1]] = [];
        pos = findKing();
    }
    if(!nextKingMoveLegalKnight(pos)){
        if(!checkingForKing){
            board[to[0]][to[1]] = backupTo;
            board[from[0]][from[1]] = backupFrom;
        }
        return false;
    };
    if(!nextKingMoveLegalPawn(pos)){
        if(!checkingForKing){
            board[to[0]][to[1]] = backupTo;
            board[from[0]][from[1]] = backupFrom;
        }
        return false;
    };
    if(!nextKingMoveLegalDiagonal(pos)){
        if(!checkingForKing){
            board[to[0]][to[1]] = backupTo;
            board[from[0]][from[1]] = backupFrom;
        }
        return false;
    };
    if(!nextKingMoveLegalAxis(pos)){
        if(!checkingForKing){
            board[to[0]][to[1]] = backupTo;
            board[from[0]][from[1]] = backupFrom;
        }
        return false;
    };
    if(!nextKingMoveLegalEnemyKing(pos)){
        if(!checkingForKing){
            board[to[0]][to[1]] = backupTo;
            board[from[0]][from[1]] = backupFrom;
        }
        return false;
    };
    if(!checkingForKing){
        board[to[0]][to[1]] = backupTo;
        board[from[0]][from[1]] = backupFrom;
    }
        return true;
}
function nextKingMoveLegalKnight(pos){
    if(pos[1]-1>=0&&pos[0]+2<=7){ 
        if(board[pos[0]+2][pos[1]-1]!==undefined){
            if(board[pos[0]+2][pos[1]-1].length!==0&&(board[pos[0]+2][pos[1]-1][1]!==playerTurn&&board[pos[0]+2][pos[1]-1][0]=='N')){
                return false;
            }
        }
    }
    if(pos[0]+2<=7&&pos[1]+1<=7){
        if(board[pos[0]+2][pos[1]+1]!==undefined){
            if(board[pos[0]+2][pos[1]+1].length!==0&&(board[pos[0]+2][pos[1]+1][1]!==playerTurn&&board[pos[0]+2][pos[1]+1][0]=='N')){
                return false;
            }
        }
    }
    if(pos[0]+1<=7&&pos[1]-2>=0){
        if(board[pos[0]+1][pos[1]-2]!==undefined){
            if(board[pos[0]+1][pos[1]-2].length!==0&&(board[pos[0]+1][pos[1]-2][1]!==playerTurn&&board[pos[0]+1][pos[1]-2][0]=='N')){
                return false;
            }
        }
    }
    if(pos[0]-1>=0&&pos[1]-2>=0){
        if(board[pos[0]-1][pos[1]-2]!==undefined){
            if(board[pos[0]-1][pos[1]-2].length!==0&&(board[pos[0]-1][pos[1]-2][1]!==playerTurn&&board[pos[0]-1][pos[1]-2][0]=='N')){
                
                return false;
            }
        }
    }
    if(pos[0]-2>=0&&pos[1]+1<=7){
        if(board[pos[0]-2][pos[1]+1]!==undefined){
            if(board[pos[0]-2][pos[1]+1].length!==0&&(board[pos[0]-2][pos[1]+1][1]!==playerTurn&&board[pos[0]-2][pos[1]+1][0]=='N') ){
                
                return false;
            }
        }
    }
    if(pos[0]-2>=0&&pos[1]-1>=0){
        if(board[pos[0]-2][pos[1]-1]!==undefined){
            if(board[pos[0]-2][pos[1]-1].length!==0&&(board[pos[0]-2][pos[1]-1][1]!==playerTurn&&board[pos[0]-2][pos[1]-1][0]=='N') ){
               
                return false;
            }
        }
    }
    if(pos[0]+1<=7&&pos[1]+2<=7){
        if(board[pos[0]+1][pos[1]+2]!==undefined){
            if(board[pos[0]+1][pos[1]+2].length!==0&&(board[pos[0]+1][pos[1]+2][1]!==playerTurn&&board[pos[0]+1][pos[1]+2][0]=='N') ){
               
                return false;
            }
        }
    }
    if(pos[0]-1>=0&&pos[1]+2<=7){
        if(board[pos[0]-1][pos[1]+2]!==undefined){
            if(board[pos[0]-1][pos[1]+2].length!==0&&(board[pos[0]-1][pos[1]+2][1]!==playerTurn&&board[pos[0]-1][pos[1]+2][0]=='N') ){
             
                return false;
            }
        }
    }
    return true;
}
function nextKingMoveLegalPawn(pos){
  
    if(playerTurn == 'w'){
        if(pos[0]+1<=7&&pos[1]-1>=0){  
            if(board[pos[0]+1][pos[1]-1]!==undefined){
                if(board[pos[0]+1][pos[1]-1].length!==0&&(board[pos[0]+1][pos[1]-1][1]!==playerTurn&&board[pos[0]+1][pos[1]-1][0]=='P') ){
                    
                    return false;
                }
            }
        }
       
        if(pos[0]+1<=7&&pos[1]+1<=7){  
            if(board[pos[0]+1][pos[1]+1]!==undefined){
                if(board[pos[0]+1][pos[1]+1].length!==0&&(board[pos[0]+1][pos[1]+1][1]!==playerTurn&&board[pos[0]+1][pos[1]+1][0]=='P') ){
                   
                    return false;
                }
            }
        }
    }
    else{ //if playerTurn == 'b'
 
        if(pos[0]-1>=0&&pos[1]-1>=0){
            if(board[pos[0]-1][pos[1]-1]!==undefined){
                if(board[pos[0]-1][pos[1]-1].length!==0&&(board[pos[0]-1][pos[1]-1][1]!==playerTurn&&board[pos[0]-1][pos[1]-1][0]=='P') ){
                  
                    return false;
                }
            }
        }
      
        if(pos[0]-1>=0&&pos[1]+1<=7){
            if(board[pos[0]-1][pos[1]+1]!==undefined){
                if(board[pos[0]-1][pos[1]+1].length!==0&&(board[pos[0]-1][pos[1]+1][1]!==playerTurn&&board[pos[0]-1][pos[1]+1][0]=='P') ){
               
                    return false;
                }
            }
        }
    }
    return true;
}
function nextKingMoveLegalAxis(pos,onlyRead){
    
    if(pos[0]+1<=7){       //up
        for(let l = pos[0]+1;l<=7;l++){   
         
            if(board[l][pos[1]]!==undefined){
                if(board[l][pos[1]].length!==0){  
                    if(board[l][pos[1]][1]!==playerTurn&&(board[l][pos[1]][0]=='R'||board[l][pos[1]][0]=='Q')){
                 
                        return false;
                    }
                    l=8;//end the for loop. encountered a piece;
                }
            }
        }
    }
  
    if(pos[0]-1>=0){       //down
        for(let l = pos[0]-1;l>=0;l--){  
           
            if(board[l][pos[1]]!==undefined){
                if(board[l][pos[1]].length!==0){  
                    if(board[l][pos[1]][1]!==playerTurn&&(board[l][pos[1]][0]=='R'||board[l][pos[1]][0]=='Q')){
               
                        return false;
                    }
                    l=-1;//end the for loop. encountered a piece;
                }
            }
        }
    }
  
    if(pos[1]+1<=7){       //right
        for(let l = pos[1]+1;l<=7;l++){   
           
            if(board[pos[0]][l]!==undefined){
                if(board[pos[0]][l].length!==0){  
                    if(board[pos[0]][l][1]!==playerTurn&&(board[pos[0]][l][0]=='R'||board[pos[0]][l][0]=='Q')){
                  
                        return false;
                    }
                    l=8;//end the for loop. encountered a piece;
                }
            }
        }
    }
 
    if(pos[1]-1>=0){       //left
        for(let l = pos[1]-1;l>=0;l--){   
         
            if(board[pos[0]][l]!==undefined){
                if(board[pos[0]][l].length!==0){  
                    if(board[pos[0]][l][1]!==playerTurn&&(board[pos[0]][l][0]=='R'||board[pos[0]][l][0]=='Q')){
                      
                        return false;
                    }
                    l=-1;//end the for loop. encountered a piece;
                }
            }
        }
    }
    return true;
}
function nextKingMoveLegalDiagonal(pos){

    let largerPos = 0, lesserPos = 0;
    if(pos[0]>pos[1]){
        largerPos = pos[0];
        lesserPos = pos[1];
    }
    else{
        largerPos = pos[1];
        lesserPos = pos[0];
    }
  
    if(pos[0]+1<=7&&pos[1]+1<=7){ //up and right diagonal
        for(var i = 1;i<=7 - largerPos;i++){
           
            if(board[pos[0]+i][pos[1]+i]!==undefined){               
                if(board[pos[0]+i][pos[1]+i].length!==0){  
                    if(board[pos[0]+i][pos[1]+i][1]!==playerTurn&&(board[pos[0]+i][pos[1]+i][0]=='B'||board[pos[0]+i][pos[1]+i][0]=='Q')){     

                        return false;
                    }
                    i=8;//end the for loop. encountered a piece;
                }
            }
        }
    }
     //down and left
    
        for(var i = 1;i<=lesserPos+1;i++){
          
            if(pos[0]-i>=0&&pos[1]-i>=0){
                if(board[pos[0]-i][pos[1]-i]!==undefined){
                    if(board[pos[0]-i][pos[1]-i].length!==0){  
                        if(board[pos[0]-i][pos[1]-i][1]!==playerTurn&&(board[pos[0]-i][pos[1]-i][0]=='B'||board[pos[0]-i][pos[1]-i][0]=='Q')){        
                            return false;
                        }
                        i=8;//end the for loop. encountered a piece;
                    }
                }
            }
        } 
        if(pos[0]>pos[1]){
            squaresToCheck = lesserPos;
        }
        else{
            squaresToCheck = largerPos;
        }  
     //up and left diagonal
    
     for(var i = 1;i<=squaresToCheck;i++){
       
        if(pos[0]+i<=7&&pos[1]-i>=0){
            if(board[pos[0]+i][pos[1]-i]!==undefined){
             
                if(board[pos[0]+i][pos[1]-i].length!==0){  
                    if(board[pos[0]+i][pos[1]-i][1]!==playerTurn&&(board[pos[0]+i][pos[1]-i][0]=='B'||board[pos[0]+i][pos[1]-i][0]=='Q')){  
                        
                        return false;
                    }
                    i=222;//end the for loop. encountered a piece;
                }
            }  
        }
    }
    
    for(var i = 1;i<=squaresToCheck;i++){ //down and right diagonal
       
        if(pos[0]-i>=0&&pos[1]+i<=7){
            if(board[pos[0]-i][pos[1]+i]!==undefined){
                if(board[pos[0]-i][pos[1]+i].length!==0){  
                    if(board[pos[0]-i][pos[1]+i][1]!==playerTurn&&(board[pos[0]-i][pos[1]+i][0]=='B'||board[pos[0]-i][pos[1]+i][0]=='Q')){  
                        
                        return false;
                    }
                    i=222;//end the for loop. encountered a piece;
                }
            }  
        }
    }
    return true;
}
function nextKingMoveLegalEnemyKing(pos){
    

    if(pos[0]+1<=7){
        if(board[pos[0]+1][pos[1]]!==undefined){
            if(board[pos[0]+1][pos[1]].length!==0&&(board[pos[0]+1][pos[1]][1]!==playerTurn&&board[pos[0]+1][pos[1]][0]=='K')) return false;
        }
    }
    if(pos[0]-1>=0){
        if(board[pos[0]-1][pos[1]]!==undefined){
            if(board[pos[0]-1][pos[1]].length!==0&&(board[pos[0]-1][pos[1]][1]!==playerTurn&&board[pos[0]-1][pos[1]][0]=='K')) return false;
        }
    }
    if(pos[1]+1<=7){
        if(board[pos[0]][pos[1]+1]!==undefined){
            if(board[pos[0]][pos[1]+1].length!==0&&(board[pos[0]][pos[1]+1][1]!==playerTurn&&board[pos[0]][pos[1]+1][0]=='K')) return false;
        }
    }
    if(pos[1]-1>=0){
        if(board[pos[0]][pos[1]-1]!==undefined){
            if(board[pos[0]][pos[1]-1].length!==0&&(board[pos[0]][pos[1]-1][1]!==playerTurn&&board[pos[0]][pos[1]-1][0]=='K')) return false;
        }
    }
    if(pos[0]+1<=7&&pos[1]+1<=7){
        if(board[pos[0]+1][pos[1]+1]!==undefined){
            if(board[pos[0]+1][pos[1]+1].length!==0&&(board[pos[0]+1][pos[1]+1][1]!==playerTurn&&board[pos[0]+1][pos[1]+1][0]=='K')) return false;
        }
    }
    if(pos[0]-1>=0&&pos[1]+1<=7){
        if(board[pos[0]-1][pos[1]+1]!==undefined){
            if(board[pos[0]-1][pos[1]+1].length!==0&&(board[pos[0]-1][pos[1]+1][1]!==playerTurn&&board[pos[0]-1][pos[1]+1][0]=='K')) return false;
        }
    }
    if(pos[0]+1<=7&&pos[1]-1>=0){
        if(board[pos[0]+1][pos[1]-1]!==undefined){
            if(board[pos[0]+1][pos[1]-1].length!==0&&(board[pos[0]+1][pos[1]-1][1]!==playerTurn&&board[pos[0]+1][pos[1]-1][0]=='K')) return false;
        }
    }
    if(pos[0]-1>=0&pos[1]-1>=0){
        if(board[pos[0]-1][pos[1]-1]!==undefined){
            if(board[pos[0]-1][pos[1]-1].length!==0&&(board[pos[0]-1][pos[1]-1][1]!==playerTurn&&board[pos[0]-1][pos[1]-1][0]=='K')) return false;
        }
    }
    return true;
}

function gameEnd(winner,how){
    if(winner=='w'){
        points[0]++;
        document.getElementById("score-white-span").innerHTML = points[0].toString();
    }
    else{
        points[1]++;
        document.getElementById("score-black-span").innerHTML = points[1].toString();
    }
    setTimeout(()=>{
        showEndGameModal(winner,how);
    },1000)
}
function showEndGameModal(winner,how){
    document.getElementsByClassName("modal-background")[0].style.display = "block";
    setTimeout(()=>{
        document.getElementsByClassName("modal-container")[0].style.transform = "translate(-50%, -50%)";
    },10)
    if(winner=='w'){
        document.getElementById("who-won-span-modal").innerHTML = "White";
        document.getElementById("who-lost-span-modal").innerHTML = "Black";
        
    }
    else{
        document.getElementById("who-won-span-modal").innerHTML = "Black";
        document.getElementById("who-lost-span-modal").innerHTML = "White";
    }
    if(how == "checkmate"){
        document.getElementById("type-of-loss-span-modal").innerHTML = " is checkmated";
        
    }
    document.getElementsByClassName("btn-play-again")[0].addEventListener("click", function(){
        document.getElementsByClassName("modal-background")[0].style.display = "none";
        document.getElementsByClassName("modal-container")[0].style.transform = "translate(-50%, -350%)";
        resetGame();
    })
    document.getElementsByClassName("btn-return")[0].addEventListener("click", function(){
        document.getElementsByClassName("modal-background")[0].style.display = "none";
        document.getElementsByClassName("modal-container")[0].style.transform = "translate(-50%, -350%)";
    })
}
function resetGame(){
    board = [[['R','w',[0,0]],['N','w',[0,1]],['B','w',[0,2]],['Q','w',[0,3]],['K','w',[0,4]],['B','w',[0,5]],['N','w',[0,6]],['R','w',[0,7]]],[['P','w',[1,0],true],['P','w',[1,1],true],['P','w',[1,2],true],['P','w',[1,3],true],['P','w',[1,4],true],['P','w',[1,5],true],['P','w',[1,6],true],['P','w',[1,7],true]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[['P','b',[6,0],true],['P','b',[6,1],true],['P','b',[6,2],true],['P','b',[6,3],true],['P','b',[6,4],true],['P','b',[6,5],true],['P','b',[6,6],true],['P','b',[6,7],true]],[['R','b',[7,0]],['N','b',[7,1]],['B','b',[7,2]],['Q','b',[7,3]],['K','b',[7,4]],['B','b',[7,5]],['N','b',[7,6]],['R','b',[7,7]]]];
    document.getElementsByClassName("board")[0].outerHTML = "<div class='board'><div class='piece rook-black' id='70'></div><div class='piece knight-black' id='71'></div><div class='piece bishop-black' id='72'></div><div class='piece queen-black' id='73'></div><div class='piece king-black' id='74'></div><div class='piece bishop-black' id='75'></div><div class='piece knight-black' id='76'></div><div class='piece rook-black' id='77'></div><div class='piece pawn-black' id='60'></div><div class='piece pawn-black' id='61'></div><div class='piece pawn-black' id='62'></div><div class='piece pawn-black' id='63'></div><div class='piece pawn-black' id='64'></div><div class='piece pawn-black' id='65'></div><div class='piece pawn-black' id='66'></div><div class='piece pawn-black' id='67'>     </div><div class='piece pawn-white' id='10'></div><div class='piece pawn-white' id='11'>     </div><div class='piece pawn-white' id='12'></div><div class='piece pawn-white' id='13'>     </div><div class='piece pawn-white' id='14'></div><div class='piece pawn-white' id='15'>     </div><div class='piece pawn-white' id='16'></div><div class='piece pawn-white' id='17'>     </div><div class='piece rook-white' id='00'></div><div class='piece knight-white' id='01'>     </div><div class='piece bishop-white' id='02'></div><div class='piece queen-white' id='03'>     </div><div class='piece king-white' id='04'></div><div class='piece bishop-white' id='05'></div><div class='piece knight-white' id='06'></div><div class='piece rook-white' id='07'></div>     </div>"
    document.getElementsByClassName("moves-history")[0].outerHTML = "<span class='moves-history'><span class='moves-history-span'><span class='moves-history-span-counter' id='moves-history-span-1'>1.</span></span></span>";
    init();
    movesPlayed = 1;
    playerTurn = 'w';
    document.getElementsByClassName("board")[0].onclick = function(e){
        onBoardClick(e);
    };
    
}

