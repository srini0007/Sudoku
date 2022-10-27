const grid=document.querySelector('body > article > .overall > .board');
console.log(grid);
for(let i=1;i<=9;i++){
    for(let j=1;j<=9;j++){
        grid.innerHTML+=`<div class="cell id_${i}${j}"></div>`;
    }
}
for(let i=1;i<=9;i++){
    for(let j=1;j<=9;j++){
        grid.querySelector(`.id_${i}${j}`).style.border="1px solid black";
    }
}

for(let i=1;i<=9;i++){
    for(let j=1;j<=9;j++){
        if(j%3==0){
            if(j==9){
                grid.querySelector(`.id_${i}${j}`).style.borderRight='3px solid black';
            }
            else
                document.querySelector(`.id_${i}${j}`).style.borderRight='2px solid black';
        }
        if(i%3==0){
            if(i==9){
                grid.querySelector(`.id_${i}${j}`).style.borderBottom='3px solid black';
            }
            else
                grid.querySelector(`.id_${i}${j}`).style.borderBottom='2px solid black';
        }
        if(j==1){
            grid.querySelector(`.id_${i}${j}`).style.borderLeft='3px solid black';
        }
        if(i==1){
            grid.querySelector(`.id_${i}${j}`).style.borderTop='3px solid black';
        }
    }
}
const input=document.querySelector('body > article > .overall > .input');
for(let i=1;i<=9;i++){
    input.innerHTML+=`<div class="values">${i}</div>`;
}


let count=0; //for debug

let one_time=0; //for winning

let latest_row="-1",latest_col="-1"; 

const arr=new Array(82).fill(false);
const sol=new Array(82).fill(0);

window.onload=setGame();


let new_game=document.querySelector('body > article > h2 > .new_game');
new_game.addEventListener('click',(e)=>{
    console.log(e);
    window.location.reload();
});

const selected_cell=document.querySelectorAll('body > article > .overall > .board > .cell');
selected_cell.forEach(cells=>{
    cells.addEventListener('click', (e)=>{
        // e.stopPropagation(); n
        for(let i=1;i<=9;i++){
            for(let j=1;j<=9;j++){
                grid.querySelector(`.id_${i}${j}`).style.backgroundColor='white';
                // console.log(grid.querySelector(`.id_${i}${j}`).style.border);
            }
        }
        let class_name = cells.className;
        // console.log(cells.className);
        cells.style.backgroundColor='hsl(205, 95%, 92%)';
        let row=class_name[8];
        let col=class_name[9];
        let r=parseInt(row);
        let c=parseInt(col);
        if(row%3==1){
            r+=2;
        }
        if(row%3==2){
            r+=1;
        }
        if(col%3==1){
            c+=2;
        }
        if(col%3==2){
            c+=1;
        }
        // console.log(r,c);
        for(let rev_r=r,cnt=0;cnt<3;cnt++,rev_r--){
            for(let rev_c=c,cnt2=0;cnt2<3;cnt2++,rev_c--){
                // console.log(rev_r,rev_c);
                grid.querySelector(`.id_${rev_r}${rev_c}`).style.backgroundColor='rgb(170, 197, 205,0.3)';
            }
        }
        // console.log(row,col);
        for(let i=1;i<=9;i++){
            // console.log(grid.querySelector(`.id_${row}${i}`));
            grid.querySelector(`.id_${row}${i}`).style.backgroundColor='rgb(170, 197, 205,0.3)';
            grid.querySelector(`.id_${i}${col}`).style.backgroundColor='rgb(170, 197, 205,0.3)';
        }
        grid.querySelector(`.id_${row}${col}`).style.backgroundColor='rgb(116, 192, 252,0.7)';
        console.log(grid.querySelector(`.id_${row}${col}`).style.backgroundColor);
        /* trying to change border but not working

        console.log(parseInt(prev_selected[0]),parseInt(prev_selected[1]));
        grid.querySelector(`.id_${parseInt(prev_selected[0])}${parseInt(prev_selected[1])}`).style.border=`'${prev_selected_border}'`;
        prev_selected=row.concat(col);
        console.log(prev_selected_border);
        prev_selected_border= grid.querySelector(`.id_${row}${col}`).style.border;
        // console.log(prev_selected_border);
        grid.querySelector(`.id_${row}${col}`).style.border='3px solid #5c7cfa';

        */
       
        count+=1;
        latest_col=col;
        latest_row=row;

        
        // console.log("count ",count);
        // console.log(latest_row,latest_col,arr[row_col_to_num(latest_row,latest_col)]);
        let inputs=document.querySelectorAll('body > article > div > div.input > .values');
        inputs.forEach((num_input)=>{
            num_input.addEventListener('click',(e)=>{
                console.log(arr);
                // e.stopPropagation();
                // console.log(e);
                if(grid.querySelector(`.id_${latest_row}${latest_col}`).style.color!='rgb(102, 168, 15)' && grid.querySelector(`.id_${latest_row}${latest_col}`).style.color!='rgb(52, 58, 64)'){
                    grid.querySelector(`.id_${latest_row}${latest_col}`).textContent=num_input.textContent;
                        // console.log(row,col);
                    if(!isValid(latest_row,latest_col, grid.querySelector(`.id_${latest_row}${latest_col}`).textContent)){
                        grid.querySelector(`.id_${latest_row}${latest_col}`).style.color='red';
                    }   
                    remove_red();
                    if(grid.querySelector(`.id_${latest_row}${latest_col}`).style.color!='red'){
                        grid.querySelector(`.id_${latest_row}${latest_col}`).style.color="#1c7ed6";
                    }
                }
            });
            if(checkwin()){
                one_time++;
                if(one_time==1){
                    win_decoration();
                }
            }
        });
        
        
        const erase=document.querySelector('body > article > div > div.input > div.erase > button');
        erase.addEventListener('click',e=>{
            if(grid.querySelector(`.id_${latest_row}${latest_col}`).style.color!='rgb(102, 168, 15)' && grid.querySelector(`.id_${latest_row}${latest_col}`).style.color!='rgb(52, 58, 64)')
            grid.querySelector(`.id_${latest_row}${latest_col}`).textContent="";
            remove_red();
        });

        const hint=document.querySelector('body > article > div > div.input > div.hints > button');
        // console.log(hint);
        hint.addEventListener('click',(e)=>{
            console.log(grid.querySelector(`.id_${latest_row}${latest_col}`).textContent,sol[row_col_to_num(latest_row,latest_col)]);
            if(grid.querySelector(`.id_${latest_row}${latest_col}`).style.color!='rgb(52, 58, 64)' || grid.querySelector(`.id_${latest_row}${latest_col}`).textContent==''){
                grid.querySelector(`.id_${latest_row}${latest_col}`).textContent=sol[row_col_to_num(latest_row,latest_col)];
                grid.querySelector(`.id_${latest_row}${latest_col}`).style.color='#66a80f';
                remove_red();
            }
            if(checkwin()){
                one_time++;
                if(one_time==1){
                    win_decoration();
                }

            }
        });
    });
});



const solve=document.querySelector('body > article > div > div.input > div.solve > button');
console.log(solve);
solve.addEventListener('click',()=>{
    for(let i=1;i<=9;i++){
        for(let j=1;j<=9;j++){
            if(grid.querySelector(`.id_${i}${j}`).textContent!=sol[row_col_to_num(i,j)]){
                grid.querySelector(`.id_${i}${j}`).textContent=sol[row_col_to_num(i,j)];
                grid.querySelector(`.id_${i}${j}`).style.color="#66a80f";
            }
        }
    }
    if(checkwin()){
        one_time++;
        if(one_time==1){
            win_decoration();
        }
    }
});



function row_col_to_num(r,c){
    let cur=r*9-9;
    // console.log(cur);
    cur+=parseInt(c);
    // console.log(cur);
    return cur;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function check_used(arr){
    for(let i=1;i<=9;i++){
        if(arr[i]==false)return true;
    }
    return false;
}

function get_pos(arr,pos){
    let cnt=0;
    for(let i=1;i<=9;i++){
        if(arr[i]==false){
            cnt++;
        }
        if(cnt==pos){
            return i;
        }
    }
    return "error"; //this state is not reachable
}




function backtrack(pos){
    if(pos>=82){
        return true;
    }
    
    let r=Math.floor(pos/9);
    r++;
    let c=pos%9;
    if(c==0){
        r--;
        c=9;
    }
    const used=new Array(10).fill(false);
    let count=10;
    while(check_used(used)){
        let ith_pos=getRandomInt(1,count);
        let cur=get_pos(used,ith_pos);  //positon we get is not used
        // console.log(pos,cur);
        if(isValid(r,c,cur)){
            grid.querySelector(`.id_${r}${c}`).textContent=cur;
            if(backtrack(pos+1)){
                return true;
            }
            grid.querySelector(`.id_${r}${c}`).textContent='';
        }
        used[cur]=true;
        count--;
    }
    return false;
}

function setGame(){
    let cnt=0;
    for(let i=1;i<=9;i++){
        for(let j=1;j<=9;j++){
            grid.querySelector(`.id_${i}${j}`).textContent='';
            arr[++cnt]=false;
        }
    }
    backtrack(1);
    for(let i=1;i<=9;i++){
        for(let j=1;j<=9;j++){
            sol[row_col_to_num(i,j)]=grid.querySelector(`.id_${i}${j}`).textContent;
        }
    }
    let no_of_blank=getRandomInt(40,47);
    console.log(no_of_blank);
    for(let i=0;i<no_of_blank;i++){
        let cur=getRandomInt(1,82);
        while(arr[cur]==true){
            cur=getRandomInt(1,82);
        }
        arr[cur]=true;
        let r=Math.floor(cur/9);
        r++;
        let c=cur%9;
        if(c==0){
            r--;
            c=9;
        }
        grid.querySelector(`.id_${r}${c}`).textContent='';
    }
    for(let i=1;i<=9;i++){
        for(let j=1;j<=9;j++){
            if(grid.querySelector(`.id_${i}${j}`).textContent!='')
                grid.querySelector(`.id_${i}${j}`).style.color="#343a40";
        }
    }
}

function isValid(row,col,val){
    // console.log(typeof row);
    let r=parseInt(row);
    let c=parseInt(col);
    if(row%3==1){
        r+=2;
    }
    if(row%3==2){
        r+=1;
    }
    if(col%3==1){
        c+=2;
    }
    if(col%3==2){
        c+=1;
    }
    // console.log(r,c);
    let ro=parseInt(row),co=parseInt(col);
    // console.log(val);
    for(let rev_r=r,cnt=0;cnt<3;cnt++,rev_r--){
        for(let rev_c=c,cnt2=0;cnt2<3;cnt2++,rev_c--){
            // console.log(rev_r,rev_c);
            if(row==rev_r && col==rev_c){
                continue;
            }
            // console.log(val,(grid.querySelector(`.id_${rev_r}${rev_c}`).textContent));
            if(grid.querySelector(`.id_${rev_r}${rev_c}`).textContent==val){
                // console.log(rev_r,rev_c);
                return 0;
            }
        }
    }
    // console.log(row,col);
    for(let i=1;i<=9;i++){
        // console.log(grid.querySelector(`.id_${row}${i}`));
        if(i!==co){
            // console.log(val,(grid.querySelector(`.id_${row}${i}`).textContent));
            if(grid.querySelector(`.id_${row}${i}`).textContent==val){
                // console.log(row,i);
                
                return 0;
            }
        }
        if(i!==ro){
            // console.log(i);
            // console.log(val,(grid.querySelector(`.id_${i}${col}`).textContent));
            if(grid.querySelector(`.id_${i}${col}`).textContent==val){
                // console.log(i,col);
                return 0;
            }
        }
    }
    return 1;
};


function remove_red(){
    for(let i=1;i<=9;i++){
        for(let j=1;j<=9;j++){
            if(isValid(i,j,grid.querySelector(`.id_${i}${j}`).textContent) && grid.querySelector(`.id_${i}${j}`).style.color=='red'){
                grid.querySelector(`.id_${i}${j}`).style.color='black'; //any color we can set but finally we change into blue
            }
        }
    }
}

function checkwin(){
    for(let i=1;i<=9;i++){
        for(let j=1;j<=9;j++){
            if(grid.querySelector(`.id_${i}${j}`).style.color=='red' || grid.querySelector(`.id_${i}${j}`).textContent==''){
                return 0;
            }
        }
    }
    return 1;
}

let parity=0;

function win_decoration(){
    const board=document.querySelector('body > article > div > div.board');
    console.log(board.querySelectorAll('.cell'));
    if(board.querySelector('.win_msg')==null){
        board.innerHTML+=`<div class='win_msg'>Excellent !</div>`;
        const header=document.querySelector('body > article > h2');
        header.innerHTML+=`<button class="output but" type="button">Display board</button>`;
    }
    for(let i=1;i<=9;i++){
        for(let j=1;j<=9;j++){
            board.querySelector(`.id_${i}${j}`).classList.add("hide");
        }
    }

    board.style.backgroundColor="#5c7cfa";
    board.style.alignItems="center";
    board.style.justifyContent="center";
    board.style.fontFamily="'Open Sans', sans-serif";
    board.style.fontSize="20px";
    board.style.color="white";
    board.style.borderRadius="2%";
    
    const header=document.querySelector('body > article > h2');
    const display_grid=header.querySelector('.output');
    display_grid.addEventListener('click',()=>{
        for(let i=1;i<=9;i++){
            for(let j=1;j<=9;j++){
                if(parity%2==0){
                    board.querySelector(`.id_${i}${j}`).classList.remove("hide");
                    board.querySelector(`.win_msg`).classList.add("hide");
                    board.style.color="black";
                    board.style.backgroundColor="white";
                    display_grid.textContent="Hide Grid   ";
                }
                else{
                    board.querySelector(`.id_${i}${j}`).classList.add("hide");
                    board.querySelector(`.win_msg`).classList.remove("hide");
                 
                    display_grid.textContent="Display Grid";
                    board.style.backgroundColor="#5c7cfa";
                    board.style.color="white";
                }
            }
        }
        parity++;
    });

    let new_games=document.querySelector('body > article > h2 > .new_game');
    new_games.addEventListener('click',(e)=>{
        console.log(e);
        window.location.reload();
    });

}