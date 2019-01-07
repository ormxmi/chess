var offsetTop = document.getElementsByClassName("board")[0].getBoundingClientRect().top;
var offsetLeft = document.getElementsByClassName("board")[0].getBoundingClientRect().left;
var squareClickedX, squareClickedY;
selectedPieceBool = false; selectedPieceCoords = []; var playerTurn = "w"; var whiteKingChecked = false;var legalMoves = []; var blackKingChecked = false;

var board = [[['R','w',[0,0]],['N','w',[0,1]],['B','w',[0,2]],['Q','w',[0,3]],['K','w',[0,4]],['B','w',[0,5]],['N','w',[0,6]],['R','w',[0,7]]],[['P','w',[1,0],true],['P','w',[1,1],true],['P','w',[1,2],true],['P','w',[1,3],true],['P','w',[1,4],true],['P','w',[1,5],true],['P','w',[1,6],true],['P','w',[1,7],true]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[['P','b',[6,0],true],['P','b',[6,1],true],['P','b',[6,2],true],['P','b',[6,3],true],['P','b',[6,4],true],['P','b',[6,5],true],['P','b',[6,6],true],['P','b',[6,7],true]],[['R','b',[7,0]],['N','b',[7,1]],['B','b',[7,2]],['Q','b',[7,3]],['K','b',[7,4]],['B','b',[7,5]],['N','b',[7,6]],['R','b',[7,7]]]]
let piecesWidth = 64;
    if(window.innerWidth<=512){
        piecesWidth = window.innerWidth/8;
    }


//////////////
init();///////
//////////////
// TODO: check for checks every move.
// the king has xray vision until the 1st black element
// 
// 
function kingXray(pos){
    legalMoves = [];
    let counterSameTeamPieces = 0;
    for(var i = pos[0]+1;i<=7;i++){
        legalMoves.push([i,pos[1]]);
        if(board[i][pos[1]][1]==playerTurn&&board[i][pos[1]][1]!==undefined){
            if(board[i][pos[1]][0]=='R'||board[i][pos[1]][0]=='Q'){
                if(counterSameTeamPieces==0){
                    console.log(playerTurn+"'s king is checked..");
                    whiteKingChecked = true;
                    console.log(legalMoves);
                }
                else{
                    console.log("a threat! a queen or rook pinning!");
                }
            }
            else{
                console.log("not a threat! not queen or rook!");
            }
            return false; // after 1st enemy encounter
        }
        else{
            if(board[i][pos[1]][1]!==playerTurn&&board[i][pos[1]][1]!==undefined){
                console.log(board[i][pos[1]]);
                counterSameTeamPieces++;
                if(counterSameTeamPieces>=2){
                    console.log("not a threat! 2 pieces ahead");
                    counterSameTeamPieces = 0;
                    return false;
                }

            }
        }
        
    }
}

//function atLeastTwoFriendlyPiecesAhead(pos,forEnd,increment){
//    let counterFriendlyPieces = 0;
//    for(var i = pos[0]+1;i < forEnd;i = i + increment){
//        if(board[i][pos[1]][1]==)
//    }
//}
document.getElementsByClassName("board")[0].onclick = function(e){
    squareClickedY = 7 - Math.floor((e.clientY - offsetTop)/piecesWidth);
    squareClickedX = Math.floor((e.clientX - offsetLeft)/piecesWidth);
    
    if(playerTurn=="w"){
        if(!selectedPieceBool){
            selectPiece(squareClickedY,squareClickedX);
            if(board[squareClickedY][squareClickedX][1]!==playerTurn) selectedPieceBool = false;
        }
        else{
            
                if(movePiece(selectedPieceCoords,[squareClickedY,squareClickedX],playerTurn)){
                    let currentPiece =  document.getElementById(selectedPieceCoords[0].toString()+selectedPieceCoords[1]);
                    if(currentPiece.style.transform==""){
                        currentPiece.style.transform = "translate("+(squareClickedX-selectedPieceCoords[1])+"00%, -"+(squareClickedY-selectedPieceCoords[0])+"00%)"; 
                        currentPiece.id = squareClickedY.toString() + squareClickedX.toString();
                        selectedPieceBool = false;
                    }
                    else{
                        currentPiece.id = squareClickedY.toString() + squareClickedX.toString();                
                        currentPiece.style.transform = "translate("+(squareClickedX-board[currentPiece.id[0]][currentPiece.id[1]][2][1])+"00%, -"+(squareClickedY-board[currentPiece.id[0]][currentPiece.id[1]][2][0])+"00%)"; 
                    }
                        selectedPieceBool = false;
                        
                        playerTurn = "b";
                }
                else{
                    selectedPieceBool = false;
                }
            }
    }
    else{ // if playerTurn == "b"
        if(!selectedPieceBool){
            selectPiece(squareClickedY,squareClickedX);
            if(board[squareClickedY][squareClickedX][1]!==playerTurn) selectedPieceBool = false;
        }
        else{
            if(movePiece(selectedPieceCoords,[squareClickedY,squareClickedX],playerTurn)){
                let currentPiece =  document.getElementById(selectedPieceCoords[0].toString()+selectedPieceCoords[1]);
                if(currentPiece.style.transform==""){
                    currentPiece.style.transform = "translate("+(squareClickedX-selectedPieceCoords[1])+"00%, "+Math.abs(squareClickedY-selectedPieceCoords[0])+"00%)"; 
                    currentPiece.id = squareClickedY.toString() + squareClickedX.toString();
                    selectedPieceBool = false;
                }
                else{
                    currentPiece.id = squareClickedY.toString() + squareClickedX.toString();
            
                    
                    currentPiece.style.transform = "translate("+(squareClickedX-board[currentPiece.id[0]][currentPiece.id[1]][2][1])+"00%, "+Math.abs(squareClickedY-board[currentPiece.id[0]][currentPiece.id[1]][2][0])+"00%)"; 
                }
                    selectedPieceBool = false;
                    for(var y = 0; y<=7;y++){
                        for(var x = 0; x<=7;x++){
                            if(board[y][x][0]=='K'&&board[y][x][1]=='w'){
                                kingXray([y,x]);
                            }
                        }
                    }
                    playerTurn = "w";
            }
            else{
                selectedPieceBool = false;
            }
        }
    }   
}

function selectPiece(y,x){
    if(board[y][x].length!=0){
        selectedPieceCoords = [y,x];
        selectedPieceBool = true;
    }
}

function movePiece(from,to,playerTurn){
    if(isLegalMove(from,to,playerTurn)){
        if(playerTurn=='w'&&whiteKingChecked){
            for(var c = 0; c<legalMoves.length;c++){
                console.log("["+to[0]+","+to[1]+"]",legalMoves[c]);
                if(to[0]==legalMoves[c][0]&&to[1]==legalMoves[c][1]){
                    
                    console.log("legal move!");
                    board[to[0]][to[1]] = board[from[0]][from[1]];
                    board[from[0]][from[1]]=[];
                    return true;
                }
                
            }
                    console.log("white king is under check!");
                    return false;
        }
        console.log("legal move!");
        board[to[0]][to[1]] = board[from[0]][from[1]];
        board[from[0]][from[1]]=[];
        return true;
    }
    else{
        console.log("illegal move!");
        return false;
    }
}
function isLegalMove(from,to){
    


    switch(board[from[0]][from[1]][0]){
        case 'R': 
            if(axisMove(from,to)) return true;
            else return false;
        case 'P':
            if(pawnMove(from,to)) return true;
            else return false;
        case 'N':
            if(knightMove(from,to)) return true;
            else return false;
        case 'B':
            if(diagonalMove(from,to)) return true;
            else return false;
        case 'Q':
            if(diagonalMove(from,to)||axisMove(from,to)) return true;
            else return false;
        case 'K':
            if(kingMove(from,to)) return true;
            else return false;
        default: return false;
        
    }
}
function moveOrTake(playerMoving,square){
    
    if(board[square[0]][square[1]].length>=1){
        
        if(board[square[0]][square[1]][1]!==playerMoving){
          
           console.log("takes!");
           moveAndTake(playerMoving,square);
            return true;
        
           
        }
        else{
           
            return false;
        }
    }
    else{
        return true;
    }
}
function moveAndTake(playerMoving,square){
    
        let pieceToRemove =  document.getElementById(square[0].toString()+square[1].toString());
        setTimeout(()=>{
            pieceToRemove.outerHTML = "";
        },150)
    
    
}
function axisMove(from,to){
    if(from[0]==to[0]){     //  moving horizontally
        if(from[1]<to[1]){  //  moving right
            for(var i = from[1]+1;i<=to[1];i++){
            
                if(!(moveOrTake(playerTurn,[from[0],i]))) return false;
                
            }
            return true;
        }
        else{               // moving left
            for(var i = from[1]-1;i>=to[1];i--){
                if(!(moveOrTake(playerTurn,[from[0],i]))) return false;
             
            }
            return true;
        }
      
    }
    else if(from[1]==to[1]){     // moving vertically
        console.log(from[0],to[0])
        if(from[0]<to[0]){       // moving up
            for(var i = from[0]+1;i<=to[0];i++){
                
                if(!(moveOrTake(playerTurn,[i,from[1]]))) return false;
               

            }
            return true;
        }
        else{                    // moving down
            for(var i = from[0]-1;i>=to[0];i--){
                
                if(!(moveOrTake(playerTurn,[i,from[1]]))) return false;
                
            }
            return true;
        }

       
        return true;
    }
    else return false;
}
function diagonalMove(from,to){
    if(Math.abs(from[0]-to[0])==Math.abs(from[1]-to[1])){
        if(from[0]<to[0]&&from[1]<to[1]){
            for(var i = 1;i<=Math.abs(from[0]-to[0]);i++){
                if(!(moveOrTake(playerTurn,[from[0]+i,from[1]+i]))) return false;
            }
            return true;
        }
        else if(from[0]>to[0]&&from[1]<to[1]){
            for(var i = 1;i<=Math.abs(from[0]-to[0]);i++){
                if(!(moveOrTake(playerTurn,[from[0]-i,from[1]+i]))) return false;
            }
            return true;
        }
        else if(from[0]>to[0]&&from[1]>to[1]){
            for(var i = 1;i<=Math.abs(from[0]-to[0]);i++){
                if(!(moveOrTake(playerTurn,[from[0]-i,from[1]-i]))) return false;
            }
            return true;
        }
        else if(from[0]<to[0]&&from[1]>to[1]){
            for(var i = 1;i<=Math.abs(from[0]-to[0]);i++){
                if(!(moveOrTake(playerTurn,[from[0]+i,from[1]-i]))) return false;
            }
            return true;
        }
        else return false;
    }
    else return false;
}
function pawnMove(from,to){
    if(playerTurn=='w'){
        if(board[from[0]][from[1]][3]==true){ //if FIRST move pawn
            if(to[0]==from[0]+1){
                
                if(to[1]==from[1]+1){ //if pawn is trying to take a piece up right
                    if(board[to[0]][to[1]][1]==='b'){
                        if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
                        else return false;
                    }
                    else return false;//if pawn is trying to take a piece up right but there isnt such a piece
                }
                else if(to[1]==from[1]-1){//if pawn is trying to take a piece up left
                    console.log("hey"+to[0]+" "+to[1]);
                    if(board[to[0]][to[1]][1]==='b'){
                        console.log("hey1")
                        if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
                        else return false;
                    }
                    else return false;//if pawn is trying to take a piece up left but there isnt such a piece
                }
                else if(board[to[0]][to[1]].length!==0){ //if there is a piece ahead of the pawn trying to move
                    return false;
                }
                else if(to[1]==from[1]){
                    board[from[0]][from[1]][3]=false;
                    return true;
                }
                else return false;
            }
            else if(to[0]==from[0]+2){
                
                if(to[1]==from[1]){ 
                    board[from[0]][from[1]][3]=false;
                    return true;
                }
                else return false;
            }
            
            else{
                
                return false;
            }
        }
        else{ //if not first move pawn
            if(to[0]==from[0]+1){
                
                if(to[1]==from[1]+1){ //if pawn is trying to take a piece up right
                    if(board[to[0]][to[1]][1]==='b'){
                        if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
                        else return false;
                    }
                    else return false;
                   
                }
                else if(to[1]==from[1]-1){
                    if(board[to[0]][to[1]][1]==='b'){
                        if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
                        else return false;
                    }
                    else return false;
                }
                else if(board[to[0]][to[1]].length!==0){ //if there is a piece ahead of the pawn trying to move
                    return false;
                }                 
                else if(to[1]==from[1]){ // the most common pawn one up 
                    return true;
                }
                else return false;
            }   
            else{ //if moving not exactly 1 Y level upwards
                return false;
            }
        }
    }
    else{ // if black's turn
    if(board[from[0]][from[1]][3]==true){ 
        if(to[0]==from[0]-1){
            
            if(to[1]==from[1]+1){ 
                if(board[to[0]][to[1]][1]==='w'){
                    if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
                    else return false;
                }
                else return false;
            }
            else if(to[1]==from[1]-1){
                if(board[to[0]][to[1]][1]==='w'){
                    if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
                    else return false;
                }
                else return false;
            }
           
            else if(to[1]==from[1]){
                board[from[0]][from[1]][3]=false;
                return true;
            }
            else return false;
        }
        else if(to[0]==from[0]-2){
        
            if(to[1]==from[1]){ 
                board[from[0]][from[1]][3]=false;
                return true;
            }
            else return false;
        }
        
        else{
            
            return false;
        }
    }
    else{
        if(to[0]==from[0]-1){
            
            if(to[1]==from[1]+1){
          
                if(board[to[0]][to[1]][1]==='w'){
                    if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
                    else return false;
                }
                else return false;
            }
            else if(to[1]==from[1]-1){
                
                if(board[to[0]][to[1]][1]==='w'){
                    if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
                    else return false;
                }
                else return false;
            }
            else if(board[to[0]][to[1]].length!==0){ 
                return false;
            }                 
            else if(to[1]==from[1]){ 
                return true;
            }
            else return false;
        }   
        else{
            return false;
        }
    }
    }
} 
function knightMove(from,to){
    if(from[0]+2==to[0]){
        if(from[1]+1==to[1]){
            if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
            else return false;
        }
        else if(from[1]-1==to[1]){
            if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
            else return false;
        }
        else return false;
    }
    if(from[0]-2==to[0]){
        if(from[1]+1==to[1]){
            if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
            else return false;
        }
        else if(from[1]-1==to[1]){
            if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
            else return false;
        }
        else return false;
    }
    if(from[0]-1==to[0]){
        if(from[1]+2==to[1]){
            if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
            else return false;
        }
        else if(from[1]-2==to[1]){
            if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
            else return false;
        }
        else return false;
    }
    if(from[0]+1==to[0]){
        if(from[1]+2==to[1]){
            if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
            else return false;
        }
        else if(from[1]-2==to[1]){
            if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
            else return false;
        }
        else return false;
    }
}
function kingMove(from,to){
    if((from[0]+1==to[0]&&from[1]==to[1])||(from[0]==to[0]&&from[1]+1==to[1])||(from[0]+1==to[0]&&from[1]+1==to[1])
    ||(from[0]-1==to[0]&&from[1]+1==to[1])||(from[0]-1==to[0]&&from[1]==to[1])||(from[0]-1==to[0]&&from[1]-1==to[1])
    ||(from[0]==to[0]&&from[1]-1==to[1])||(from[0]+1==to[0]&&from[1]-1==to[1])){
        if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
    }
}

function init(){
        for(var i = 0;i<=7;i++){
            document.getElementById("7"+i.toString()).style = "top: 0; left: "+i*piecesWidth+"px;";
        }
        for(var i = 0;i<=7;i++){
            document.getElementById("6"+i.toString()).style = "top: "+piecesWidth+"px; left: "+i*piecesWidth+"px;";
        }
        for(var i = 0;i<=7;i++){
            document.getElementById("0"+i.toString()).style = "bottom: 0; left: "+i*piecesWidth+"px;";
        }
        for(var i = 0;i<=7;i++){
            document.getElementById("1"+i.toString()).style = "bottom: "+piecesWidth+"px; left: "+i*piecesWidth+"px;";
        }
    
}