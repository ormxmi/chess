var offsetTop = document.getElementsByClassName("board")[0].getBoundingClientRect().top;
var offsetLeft = document.getElementsByClassName("board")[0].getBoundingClientRect().left;
var squareClickedX, squareClickedY;
selectedPieceBool = false; selectedPieceCoords = []; var playerTurn = "w"; var whiteKingChecked = false;var legalMoves = []; var blackKingChecked = false;
var lastMovedPiece = [];
var board = [[['R','w',[0,0]],['N','w',[0,1]],['B','w',[0,2]],['Q','w',[0,3]],['K','w',[0,4]],['B','w',[0,5]],['N','w',[0,6]],['R','w',[0,7]]],[['P','w',[1,0],true],['P','w',[1,1],true],['P','w',[1,2],true],['P','w',[1,3],true],['P','w',[1,4],true],['P','w',[1,5],true],['P','w',[1,6],true],['P','w',[1,7],true]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[['P','b',[6,0],true],['P','b',[6,1],true],['P','b',[6,2],true],['P','b',[6,3],true],['P','b',[6,4],true],['P','b',[6,5],true],['P','b',[6,6],true],['P','b',[6,7],true]],[['R','b',[7,0]],['N','b',[7,1]],['B','b',[7,2]],['Q','b',[7,3]],['K','b',[7,4]],['B','b',[7,5]],['N','b',[7,6]],['R','b',[7,7]]]]
let piecesWidth = 64;var invalidMovePlayed=false; 
var backupLegalMoves;var backupFrom, backupTo;

if(window.innerWidth<=512){
    piecesWidth = window.innerWidth/8;
}

//////////////
init();///////
//////////////




function kingXray(pos){ // ...?
    
    let counterSameTeamPieces = 0;
    for(var i = pos[0]+1;i<=7;i++){
        legalMoves.push([i,pos[1]]);
        if(board[i][pos[1]][1]==playerTurn&&board[i][pos[1]][1]!==undefined){
            if(board[i][pos[1]][0]=='R'||board[i][pos[1]][0]=='Q'){
                if(counterSameTeamPieces==0){
                    console.log(playerTurn+"'s king is checked..");
                    whiteKingChecked = true;
               
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
function nextKingMoveLegal(pos,onlyRead){  
    if(!onlyRead) legalMoves = [];
    if(!nextKingMoveLegalKnight(pos,onlyRead)) return false;
    if(!nextKingMoveLegalPawn(pos,onlyRead)) return false;
    if(!nextKingMoveLegalDiagonal(pos,onlyRead)) return false;
    if(!nextKingMoveLegalAxis(pos,onlyRead)) return false;
    if(!nextKingMoveLegalEnemyKing(pos,onlyRead)) return false;;
    return true;
}
function nextKingMoveLegalKnight(pos,onlyRead){
    if(pos[1]-1>=0&&pos[0]+2<=7){ 
        if(board[pos[0]+2][pos[1]-1]!==undefined){
            if(board[pos[0]+2][pos[1]-1].length!==0&&(board[pos[0]+2][pos[1]-1][1]!==playerTurn&&board[pos[0]+2][pos[1]-1][0]=='N')){
                if(!onlyRead) legalMoves.push([pos[0]+2,pos[1]-1]);
                return false;
            }
        }
    }
    if(pos[0]+2<=7&&pos[1]+1<=7){
        if(board[pos[0]+2][pos[1]+1]!==undefined){
            if(board[pos[0]+2][pos[1]+1].length!==0&&(board[pos[0]+2][pos[1]+1][1]!==playerTurn&&board[pos[0]+2][pos[1]+1][0]=='N')){
                if(!onlyRead) legalMoves.push([pos[0]+2,pos[1]+1]);
                return false;
            }
        }
    }
    if(pos[0]+1<=7&&pos[1]-2>=0){
        if(board[pos[0]+1][pos[1]-2]!==undefined){
            if(board[pos[0]+1][pos[1]-2].length!==0&&(board[pos[0]+1][pos[1]-2][1]!==playerTurn&&board[pos[0]+1][pos[1]-2][0]=='N')){
                if(!onlyRead) legalMoves.push([pos[0]+1,pos[1]-2]);
                return false;
            }
        }
    }
    if(pos[0]-1>=0&&pos[1]-2>=0){
        if(board[pos[0]-1][pos[1]-2]!==undefined){
            if(board[pos[0]-1][pos[1]-2].length!==0&&(board[pos[0]-1][pos[1]-2][1]!==playerTurn&&board[pos[0]-1][pos[1]-2][0]=='N')){
                if(!onlyRead) legalMoves.push([pos[0]-1,pos[1]-2]);
                return false;
            }
        }
    }
    if(pos[0]-2>=0&&pos[1]+1<=7){
        if(board[pos[0]-2][pos[1]+1]!==undefined){
            if(board[pos[0]-2][pos[1]+1].length!==0&&(board[pos[0]-2][pos[1]+1][1]!==playerTurn&&board[pos[0]-2][pos[1]+1][0]=='N') ){
                if(!onlyRead) legalMoves.push([pos[0]-2,pos[1]+1]);
                return false;
            }
        }
    }
    if(pos[0]-2>=0&&pos[1]-1>=0){
        if(board[pos[0]-2][pos[1]-1]!==undefined){
            if(board[pos[0]-2][pos[1]-1].length!==0&&(board[pos[0]-2][pos[1]-1][1]!==playerTurn&&board[pos[0]-2][pos[1]-1][0]=='N') ){
                if(!onlyRead) legalMoves.push([pos[0]-2,pos[1]-1]);
                return false;
            }
        }
    }
    if(pos[0]+1<=7&&pos[1]+2<=7){
        if(board[pos[0]+1][pos[1]+2]!==undefined){
            if(board[pos[0]+1][pos[1]+2].length!==0&&(board[pos[0]+1][pos[1]+2][1]!==playerTurn&&board[pos[0]+1][pos[1]+2][0]=='N') ){
                if(!onlyRead) legalMoves.push([pos[0]+1,pos[1]+2]);
                return false;
            }
        }
    }
    if(pos[0]-1>=0&&pos[1]+2<=7){
        if(board[pos[0]-1][pos[1]+2]!==undefined){
            if(board[pos[0]-1][pos[1]+2].length!==0&&(board[pos[0]-1][pos[1]+2][1]!==playerTurn&&board[pos[0]-1][pos[1]+2][0]=='N') ){
                if(!onlyRead) legalMoves.push([pos[0]-1,pos[1]+2]);
                return false;
            }
        }
    }
    return true;
}
function nextKingMoveLegalPawn(pos,onlyRead){
    if(!onlyRead) legalMoves = [];
    if(playerTurn == 'w'){
        if(pos[0]+1<=7&&pos[1]-1>=0){  
            if(board[pos[0]+1][pos[1]-1]!==undefined){
                if(board[pos[0]+1][pos[1]-1].length!==0&&(board[pos[0]+1][pos[1]-1][1]!==playerTurn&&board[pos[0]+1][pos[1]-1][0]=='P') ){
                    if(!onlyRead) legalMoves.push([pos[0]+1,pos[1]-1]);
                    return false;
                }
            }
        }
        if(!onlyRead) legalMoves = [];
        if(pos[0]+1<=7&&pos[1]+1<=7){  
            if(board[pos[0]+1][pos[1]+1]!==undefined){
                if(board[pos[0]+1][pos[1]+1].length!==0&&(board[pos[0]+1][pos[1]+1][1]!==playerTurn&&board[pos[0]+1][pos[1]+1][0]=='P') ){
                    if(!onlyRead) legalMoves.push([pos[0]+1,pos[1]+1]);
                    return false;
                }
            }
        }
    }
    else{ //if playerTurn == 'b'
    if(!onlyRead) legalMoves = [];
        if(pos[0]-1>=0&&pos[1]-1>=0){
            if(board[pos[0]-1][pos[1]-1]!==undefined){
                if(board[pos[0]-1][pos[1]-1].length!==0&&(board[pos[0]-1][pos[1]-1][1]!==playerTurn&&board[pos[0]-1][pos[1]-1][0]=='P') ){
                    if(!onlyRead) legalMoves.push([pos[0]-1,pos[1]-1]);
                    return false;
                }
            }
        }
        if(!onlyRead) legalMoves = [];
        if(pos[0]-1>=0&&pos[1]+1<=7){
            if(board[pos[0]-1][pos[1]+1]!==undefined){
                if(board[pos[0]-1][pos[1]+1].length!==0&&(board[pos[0]-1][pos[1]+1][1]!==playerTurn&&board[pos[0]-1][pos[1]+1][0]=='P') ){
                    if(!onlyRead) legalMoves.push([pos[0]-1,pos[1]+1]);
                    return false;
                }
            }
        }
    }
    return true;
}
function nextKingMoveLegalAxis(pos,onlyRead){
    if(!onlyRead) legalMoves = [];
    if(pos[0]+1<=7){       //up
        for(let l = pos[0]+1;l<=7;l++){   
            if(!onlyRead) legalMoves.push([l,pos[1],"up"]);
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
    if(!onlyRead) legalMoves = [];
    if(pos[0]-1>=0){       //down
        for(let l = pos[0]-1;l>=0;l--){  
            if(!onlyRead) legalMoves.push([l,pos[1],"down"]); 
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
    if(!onlyRead) legalMoves = [];
    if(pos[1]+1<=7){       //right
        for(let l = pos[1]+1;l<=7;l++){   
            if(!onlyRead) legalMoves.push([pos[0],l,"right"]); 
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
    if(!onlyRead) legalMoves = [];
    if(pos[1]-1>=0){       //left
        for(let l = pos[1]-1;l>=0;l--){   
            if(!onlyRead) legalMoves.push([pos[0],l,"left"]); 
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
function nextKingMoveLegalDiagonal(pos,onlyRead){

    let largerPos = 0, lesserPos = 0;
    if(pos[0]>pos[1]){
        largerPos = pos[0];
        lesserPos = pos[1];
    }
    else{
        largerPos = pos[1];
        lesserPos = pos[0];
    }
    if(!onlyRead) legalMoves = [];
    if(pos[0]+1<=7&&pos[1]+1<=7){ //up and right diagonal
        for(var i = 1;i<=7 - largerPos;i++){
            if(!onlyRead) legalMoves.push([pos[0]+i,pos[1]+i]);
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
     if(!onlyRead) legalMoves = [];
        for(var i = 1;i<=lesserPos+1;i++){
            if(!onlyRead) legalMoves.push([pos[0]-i,pos[1]-i]);
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
     if(!onlyRead) legalMoves = [];
     for(var i = 1;i<=squaresToCheck;i++){
        legalMoves.push([pos[0]+i,pos[1]-i]);
        if(pos[0]+i<=7&&pos[1]-i>=0){
            if(board[pos[0]+i][pos[1]-i]!==undefined){
             
                if(board[pos[0]+i][pos[1]-i].length!==0){  
                    if(board[pos[0]+i][pos[1]-i][1]!==playerTurn&&(board[pos[0]+i][pos[1]-i][0]=='B'||board[pos[0]+i][pos[1]-i][0]=='Q')){  
                        
                        return false;
                    }
                    i=10;//end the for loop. encountered a piece;
                }
            }  
        }
    }
    if(!onlyRead) legalMoves = [];
    for(var i = 1;i<=squaresToCheck;i++){ //down and right diagonal
        if(!onlyRead) legalMoves.push([pos[0]-i,pos[1]+i]);
        if(pos[0]-i>=0&&pos[1]+i<=7){
            if(board[pos[0]-i][pos[1]+i]!==undefined){
                if(board[pos[0]-i][pos[1]+i].length!==0){  
                    if(board[pos[0]-i][pos[1]+i][1]!==playerTurn&&(board[pos[0]-i][pos[1]+i][0]=='B'||board[pos[0]-i][pos[1]+i][0]=='Q')){  
                        
                        return false;
                    }
                    i=10;//end the for loop. encountered a piece;
                }
            }  
        }
    }
    return true;
}
function nextKingMoveLegalEnemyKing(pos,onlyRead){
    

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
document.getElementsByClassName("board")[0].onclick = function(e){
    squareClickedY = 7 - Math.floor((e.clientY - offsetTop)/piecesWidth);
    squareClickedX = Math.floor((e.clientX - offsetLeft)/piecesWidth);
    console.log(squareClickedY,squareClickedX);
    if(playerTurn=="w"){
        if(!selectedPieceBool){
            selectPiece(squareClickedY,squareClickedX);
            if(board[squareClickedY][squareClickedX][1]!==playerTurn) selectedPieceBool = false;
        }
        else{
                if(movePiece(selectedPieceCoords,[squareClickedY,squareClickedX],playerTurn)){
                 lastMovedPiece[0]=board[squareClickedY][squareClickedX][0];
                 lastMovedPiece[1]=board[squareClickedY][squareClickedX][1];
                 lastMovedPiece[2]=selectedPieceCoords;
                 lastMovedPiece[3]=[squareClickedY,squareClickedX];  
             
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
                        for(var y = 0; y<=7;y++){
                            for(var x = 0; x<=7;x++){
                                if(board[y][x][0]=='K'&&board[y][x][1]=='b'){
                                 
                                    if(!nextKingMoveLegal([y,x],false)){
                                        console.log("black king is checked!");
                                        blackKingChecked = true;
                                    }
                                    else{
                                        blackKingChecked = false;
                                    }
                                }
                            }
                        }
                     
                        
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
                lastMovedPiece[0]=board[squareClickedY][squareClickedX][0];
                lastMovedPiece[1]=board[squareClickedY][squareClickedX][1];
                lastMovedPiece[2]=selectedPieceCoords;
                lastMovedPiece[3]=[squareClickedY,squareClickedX];
    
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
                    
                    playerTurn = "w";
                    for(var y = 0; y<=7;y++){
                        for(var x = 0; x<=7;x++){
                            if(board[y][x][0]=='K'&&board[y][x][1]=='w'){
                           
                                if(!nextKingMoveLegal([y,x],false)){
                                    console.log("white king is checked!");
                                    whiteKingChecked = true;
                                }
                                else{
                                    whiteKingChecked = false;
                                }
                            }
                        }
                    }
                   
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
    var backupLegalMoves = Array.from(legalMoves);
    if(isLegalMove(from,to,false)){
        if((!nextKingMoveLegal(to,true))&&board[from[0]][from[1]][0]=='K') return false; //if trying to move the king but the move is illegal
        if(playerTurn=='w'&&whiteKingChecked){ 
            if((nextKingMoveLegal(to,true))&&board[from[0]][from[1]][0]=='K'){ //if trying to move the king while checked and the move is legal(for the king)
                invalidMovePlayed = false;
                console.log("legal move!");
                board[to[0]][to[1]] = board[from[0]][from[1]];
                board[from[0]][from[1]]=[];
                return true;
            }
            else{ //if trying to move the king while checked and the move is illegal(for the king)
                  // check the legal moves for other pieces
            
                for(var i = 0;i<backupLegalMoves.length;i++){
                   
                  
                    if(to[0]==backupLegalMoves[i][0]&&to[1]==backupLegalMoves[i][1]){
                        invalidMovePlayed = false;
                        console.log("legal move!");
                        board[to[0]][to[1]] = board[from[0]][from[1]];
                        board[from[0]][from[1]]=[];
                        return true;
                    }
                }
                console.log("white king is under check!");
                return false;
            }
                    
        }
        else if(playerTurn=='b'&&blackKingChecked){
            if((nextKingMoveLegal(to,true))&&board[from[0]][from[1]][0]=='K'){ //if trying to move the king while checked and the move is legal(for the king)
                invalidMovePlayed = false;
                console.log("legal move!");
                board[to[0]][to[1]] = board[from[0]][from[1]];
                board[from[0]][from[1]]=[];
                return true;
            }
            else{ //if trying to move the king while checked and the move is illegal(for the king)
                  // check the legal moves for other pieces
                for(var i = 0;i<backupLegalMoves.length;i++){
                    
                  
                    console.log(to[0],backupLegalMoves[i][0],to[1],backupLegalMoves[i][1])
                    if(to[0]==backupLegalMoves[i][0]&&to[1]==backupLegalMoves[i][1]){
                        invalidMovePlayed = false;
                        console.log("legal move!");
                        board[to[0]][to[1]] = board[from[0]][from[1]];
                        board[from[0]][from[1]]=[];
                        return true;
                    }
                }
                console.log("black is under check!");
                return false;
            }
        }
        
                invalidMovePlayed = false;
                console.log("legal move!");
                board[to[0]][to[1]] = board[from[0]][from[1]];
                board[from[0]][from[1]]=[];
                return true;
    }
    else{
        invalidMovePlayed = true;
        console.log("illegal move!");
        return false;
    }
}
function isLegalMove(from,to,onlyRead){
    


    if(!onlyRead){
    
        backupFrom = board[from[0]][from[1]];
        backupTo = board[to[0]][to[1]];
        board[to[0]][to[1]] = board[from[0]][from[1]];
        board[from[0]][from[1]]=[];
        for(var y = 0; y<=7;y++){
            for(var x = 0; x<=7;x++){ 
                if(board[y][x][0]=='K'&&board[y][x][1]==playerTurn){                           
                    if(!nextKingMoveLegal([y,x],false)){
                        board[to[0]][to[1]]=backupTo;
                        board[from[0]][from[1]]=backupFrom;
                        return false;
                    }
                    else{
                        board[to[0]][to[1]]=backupTo;
                        board[from[0]][from[1]]=backupFrom;
                    }
                }    
            }
        }
    }
    switch(board[from[0]][from[1]][0]){
        case 'R': 
            if(axisMove(from,to,onlyRead)) return true;
            else return false;
        case 'P':
            if(pawnMove(from,to,onlyRead)) return true;
            else return false;
        case 'N':
            if(knightMove(from,to,onlyRead)) return true;
            else return false;
        case 'B':
            if(diagonalMove(from,to,onlyRead)) return true;
            else return false;
        case 'Q':
            if(diagonalMove(from,to,onlyRead)||axisMove(from,to,onlyRead)) return true;
            else return false;
        case 'K':
            if(kingMove(from,to,onlyRead)) return true;
            else return false;
        default: return false;
        
    }
}
function moveOrTake(playerMoving,square,onlyRead){
    
    if(board[square[0]][square[1]].length>=1){
        if(board[square[0]][square[1]][1]!==playerMoving){
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
function axisMove(from,to,onlyRead){
    if(from[0]==to[0]){     //  moving horizontally
        if(from[1]<to[1]){  //  moving right
            for(var i = from[1]+1;i<=to[1];i++){
                if(onlyRead){
                    if(!(moveOrTake(playerTurn,[from[0],i],true))) return false;
                }
                else{
                    if(!(moveOrTake(playerTurn,[from[0],i]))) return false;
                }
            }
            return true;
        }
        else{               // moving left
            for(var i = from[1]-1;i>=to[1];i--){
                if(onlyRead){
                    if(!(moveOrTake(playerTurn,[from[0],i],true))) return false;
                }
                else{
                    if(!(moveOrTake(playerTurn,[from[0],i]))) return false;
                }
             
            }
            return true;
        }
      
    }
    else if(from[1]==to[1]){     // moving vertically
        if(from[0]<to[0]){       // moving up
            for(var i = from[0]+1;i<=to[0];i++){
                
                if(onlyRead){
                    if(!(moveOrTake(playerTurn,[i,from[1]],true))) return false;
                }
                else{
                    if(!(moveOrTake(playerTurn,[i,from[1]]))) return false;
                }
               

            }
            return true;
        }
        else{                    // moving down
            for(var i = from[0]-1;i>=to[0];i--){
                
                if(onlyRead){
                    if(!(moveOrTake(playerTurn,[i,from[1]],true))) return false;
                }
                else{
                    if(!(moveOrTake(playerTurn,[i,from[1]]))) return false;
                }
                
            }
            return true;
        }

       
        return true;
    }
    else return false;
}
function diagonalMove(from,to,onlyRead){
    if(Math.abs(from[0]-to[0])==Math.abs(from[1]-to[1])){
        if(from[0]<to[0]&&from[1]<to[1]){
            for(var i = 1;i<=Math.abs(from[0]-to[0]);i++){
                if(onlyRead){
                    if(!(moveOrTake(playerTurn,[from[0]+i,from[1]+i],true))) return false;
                }
                else{
                    if(!(moveOrTake(playerTurn,[from[0]+i,from[1]+i]))) return false;
                }
                
            }
            return true;
        }
        else if(from[0]>to[0]&&from[1]<to[1]){
            for(var i = 1;i<=Math.abs(from[0]-to[0]);i++){
                if(onlyRead){
                    if(!(moveOrTake(playerTurn,[from[0]-i,from[1]+i],true))) return false;
                }
                else{
                    if(!(moveOrTake(playerTurn,[from[0]-i,from[1]+i]))) return false;
                }
                
            }
            return true;
        }
        else if(from[0]>to[0]&&from[1]>to[1]){
            for(var i = 1;i<=Math.abs(from[0]-to[0]);i++){
                if(onlyRead){
                    if(!(moveOrTake(playerTurn,[from[0]-i,from[1]-i],true))) return false;
                }
                else{
                    if(!(moveOrTake(playerTurn,[from[0]-i,from[1]-i]))) return false;
                }
                
            }
            return true;
        }
        else if(from[0]<to[0]&&from[1]>to[1]){
            for(var i = 1;i<=Math.abs(from[0]-to[0]);i++){
                if(onlyRead){
                    if(!(moveOrTake(playerTurn,[from[0]+i,from[1]-i],true))) return false;
                }
                else{
                    if(!(moveOrTake(playerTurn,[from[0]+i,from[1]-i]))) return false;
                }
                

            }
            return true;
        }
        else return false;
    }
    else return false;
}
function pawnMove(from,to,onlyRead){
    if(playerTurn === 'w'){
        if(board[from[0]][from[1]][3]==true && to[0]==from[0]+2 && to[1]==from[1] && board[from[0]+1][from[1]].length==0 && board[from[0]+1][from[1]].length==0){ //2 up
            if(!onlyRead) board[from[0]][from[1]][3] = false;
            return true;
        }
        else if(to[0]==from[0]+1 && to[1]==from[1] && board[from[0]+1][from[1]].length==0){ //1 up
            if(!onlyRead) board[from[0]][from[1]][3] = false;
            return true;
        }
        else if(to[0]==from[0]+1 && to[1]==from[1]+1){ //1up and right - taking
           
            if(!onlyRead){
                board[from[0]][from[1]][3] = false;
                if(!moveAndTake(playerTurn,[from[0]+1,from[1]+1])){
                    return false;
                }
                else return true;
            }
            else{
                
                if(!moveAndTake(playerTurn,[from[0]+1,from[1]+1],true)) return false;
                else return true;
            }
        }
        else if(to[0]==from[0]+1 && to[1]==from[1]-1){ //1up and left - taking
            if(!onlyRead){
                board[from[0]][from[1]][3] = false;
                if(!moveAndTake(playerTurn,[from[0]+1,from[1]-1])) return false;
                else return true;
            }
            else{
                if(!moveAndTake(playerTurn,[from[0]+1,from[1]-1],true)) return false;
                else return true;
            }
        } 
        
        else return false;
    }







   
} 
function knightMove(from,to,onlyRead){
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
function kingMove(from,to,onlyRead){
    if((from[0]+1==to[0]&&from[1]==to[1])||(from[0]==to[0]&&from[1]+1==to[1])||(from[0]+1==to[0]&&from[1]+1==to[1])
    ||(from[0]-1==to[0]&&from[1]+1==to[1])||(from[0]-1==to[0]&&from[1]==to[1])||(from[0]-1==to[0]&&from[1]-1==to[1])
    ||(from[0]==to[0]&&from[1]-1==to[1])||(from[0]+1==to[0]&&from[1]-1==to[1])){
    
        if(nextKingMoveLegal(to,true)){
         
            if(moveOrTake(playerTurn,[to[0],to[1]])) return true;
        }
        else return false;
    }
}
var legalMovesAvailable = false; var possibleMoves = [];
function isCheckmated(){
    for(var y = 0; y<=7; y++){
        for(var x = 0; x<=7; x++){
            if(board[y][x].length!==0&&board[y][x][1]==playerTurn){
                for(var y1 = 0; y1<=7;y1++){
                    for(var x1 = 0; x1<=7;x1++){
                        if(isLegalMove([y,x],[y1,x1],true)){
                            possibleMoves.push([y,x],[y1,x1]);
                            legalMovesAvailable = true;
                        }
                    }  
                }
            }
        }
    }
    if(!legalMovesAvailable){
        console.log("kings checked");
    }
    else{
        console.log("kings not checked");
        console.log(possibleMoves);
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
