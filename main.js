/*
   Hi
   How you today
   This is my code
   (the version without logging to discord)
   There some annotations dotted around to show what various chunks of code do
   feel free to edit stuff
   i am not responsible for anything that happens if you change stuff, also if you don't change stuff i am still not responsible
   nothing much should happen but yk, gotta put that in here
   good day
*/

const fs = require('fs')
const spawn = require('child_process').spawn;
//This is the download command for the videos, please do not edit this. There are certain parts of the script that requires some of these and removing some of them can break it and cause multiple file to be deleted due to the folder checker.
const command = `yt-dlp --write-description --write-info-json --write-playlist-metafiles --write-comments --write-thumbnail --write-link --write-url-link --write-webloc-link --merge-output-format mkv --write-subs --no-write-auto-subs --sub-format srt --embed-subs --embed-thumbnail --embed-metadata --embed-chapters --embed-info-json --convert-thumbnails jpg `

//This set of variables are ones that are called throughout the script
let num = fs.readdirSync('./videos').length+1;
let k = num;

//the cmd function is called anytime that a command needs to be exectued in the command prompt.
async function cmd(cmd, dir) {
    //directory selection
    const cwd = dir || process.cwd();

    //creating the command prompt process and running it
    let childProcess;
    try {
        childProcess = spawn(cmd, { cwd, shell: true });
    } catch (err) {
        process.exit()
    }
  
    //anytimg to would show something in the prompt to catches it and shows it here
    childProcess.stdout.on('data', (data) => {
        //the reply thread is useless and spams even more
        if(data.toString().startsWith('[youtube]     Downloading comment API JSON reply thread')) return;
        console.log(`${data}`);
    });

    //this will hopefully catch and handle most errors that would end up happening within the script
    childProcess.stderr.on('data', (data) => {
        if(data.toString().startsWith('A subdirectory or file ')) {
            console.error(`${data}`)
            try {
                const fold = data.toString().replace('A subdirectory or file ', '').replace(' already exists.', '')
                const l = fs.readdirSync(`./videos/${fold}`)
                if(l.length===0) {
                    fs.unlinkSync(`./videos/${fold}`)
                    console.log('There was a file error but it was able to self fix.')
                } else {
                    console.error('There was an error in folder creation and it was unable to self fix.\nThis process will now exit');
                    process.exit();
                }
            } catch (er) {console.log('ayo wtf did u do');process.exit()}
        } 
        //we dont want the script exiting if its just a warning now do we
        else if(data.toString().startsWith('WARNING:')) return;
        
        else {
            console.error(`Command execution error: ${data}`);
            process.exit(2)
        }
    });
  
    //this is for uhh... idk really.
    return new Promise((resolve, reject) => {
        childProcess.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(`Command exited with code ${code}`);
            }
        });
    });
}

//small function that counts how many links are in the link file
async function links(){
    const lin = fs.readFileSync('./links.txt', 'utf8').split(' ')
    if(lin[0]==='') lin.shift()
    await repspace()
    let n = 0;
    for(let link in lin) {
        n++;
    }
    return n;
}
//this replaces the first link in the link file to nothing
async function rep() {
    const h = await nextlink()
    const text = fs.readFileSync('./links.txt', 'utf8').replace(`${h}`, '')
    fs.writeFileSync('./links.txt', text)
    await repspace()
}
//this removes any amount of spaces at the beginning of the link file to prevent certain errors
async function repspace() {
    const text = fs.readFileSync('./links.txt', 'utf8').split(' ')
    let no = 0;
    let hmmmmmmm = 0;
    while(no===0) {
        if(text[hmmmmmmm]==='') {text.shift();} else {no=1}
    }
    fs.writeFileSync('./links.txt', text.join(' '))
}
//just gets the next link
async function nextlink(){const e = fs.readFileSync('./links.txt', 'utf8').split(' ');if(e[0]==='') e.shift();return e[0];}

//the (async () thing is to allow javascript code to run asynchronously
(async () => {
    //checks for empty folders which will mess up the amount of videos downloaded count
    let no;
    if(num!=1) { no = 0; } else { no = 1; }
    while (no===0){
        const las = fs.readdirSync(`./videos/${num-1}`)
        if(las.length===0) { await cmd(`rmdir ${num-1} /Q /S`, './videos'); num--; k--; console.log(`deleted empty folder`) } else { no++; }
    }
    //this is another check that will see if the video files are unfinished or something
    let anotherno;
    if(num!=1) { anotherno = 0; } else { anotherno = 1; }
    while (anotherno===0){
        let delornotweshallsee = 0;
        const las = fs.readdirSync(`./videos/${num-1}`)
        las.forEach(async filename => {
            if(filename.endsWith('.description')||filename.endsWith('.info.json')||filename.endsWith('.jpg')||filename.endsWith('.url')||filename.endsWith('.webloc')||filename.endsWith('.mkv')) { delornotweshallsee++; } else { anotherno++; }
        })
        if(delornotweshallsee!=6) {
            await cmd(`rmdir ${num-1} /Q /S`, './videos'); num--; k--; console.log(`Deleted folder that had corrupted/unfinished download`)
        } else {
            anotherno++;
        }
    }

    //now this is where the actual videos get downloaded. the for(;;) means that it should run forever
    for(;;){
        //the promise makes it wait for the video to download before doing the next, otherwise you'd be getting all your videos downloading at the same time
        await new Promise(async resolve => {
            //checks if there are any more
            const amount = await links();
            if(amount>0) {
                //the try is to catch the errors
                try{ 
                    //grab next link
                    const next = await nextlink()
                    console.log(`downloading video ${next}`)
                    //make the folder for the video
                    await cmd(`mkdir ${num.toString()}`, './videos')
                    console.log(`dir ${num.toString()} created`)
                    //time logging
                    const time = Date.now()
                    //the video download command
                    await cmd(command+next,`./videos/${num.toString()}`)
                    //lil timeout just cuz
                    setTimeout(() => {}, 3000);
                    //donedownload is shown later
                    await donedownload(num, time)
                    num++;
                    //see function earlier
                    await rep();
                    console.log(`\n${amount-1} video/s left`)
                    //random space
                    console.log('\n\n')
                    //a small timeout just so it doesn't go straight into the next one. Probably not needed but oh well
                    setTimeout(() => {}, 5000);
                //and finally the catch for this stuff
                } catch (err) { console.error(err); exit(0) }
                resolve()
            } else {
                //exiting when evreything's downloaded
                console.log('All videos downloaded');
                process.exit(0)
            }
        })
    }
})();

//just sends a message when the download is done with a few stats and video info
async function donedownload(num, time) {
    //time formatting
    let tim = Date.now() - time;
    tim = Math.round(tim/1000)
    let min=0;
    while(tim>59) {min++;tim=tim-60}
    let yo = []
    if(min===1) {yo.push(`${min} Minute`);} else if (min>1) {yo.push(`${min} Minutes`);}
    if(tim===1) {yo.push(`${tim} Second`);} else if (tim>1) {yo.push(`${tim} Seconds`);}
    yo = yo.join(', ')
    //another try to catch errors
    try {
        //fetching video information here
        const alr = fs.readdirSync(`./videos/${num}`).filter(file => file.endsWith('.info.json'))
        const {title, webpage_url, description, uploader_id, channel} = require(`./videos/${num}/${alr}`)
        //send stuff to console
        console.log('Video downloaded')
        console.log('Time taken '+`${yo}`)
        console.log('Video '+`Title: ${title},\nURL: ${webpage_url}\nChannel: ${channel} (${uploader_id})`)
        console.log('Description '+`${description}`)
    } catch (err) {
        //and some logging
        console.error(err)
    }
}


//This just allows the script to send the logs and cleanup if a videos did not finish downloading if the user does ctrl + c (this exits scripts of any kind)
process.on('SIGINT', async () => {
    //this is literally just the same code from earlier that runs on startup lol

    //checks for empty folders
    let no;
    if(num!=1) { no = 0; } else { no = 1; }
    while (no===0){
        const las = fs.readdirSync(`./videos/${num-1}`)
        if(las.length===0) { await cmd(`rmdir ${num-1} /Q /S`, './videos'); num--; k--; console.log(`deleted empty folder`) } else { no++; }
    }
    //checks for unfinished downloaded videos
    let anotherno;
    if(num!=1) { anotherno = 0; } else { anotherno = 1; }
    while (anotherno===0){
        let delornotweshallsee = 0;
        const las = fs.readdirSync(`./videos/${num-1}`)
        las.forEach(async filename => {
            if(filename.endsWith('.description')||filename.endsWith('.info.json')||filename.endsWith('.jpg')||filename.endsWith('.url')||filename.endsWith('.webloc')||filename.endsWith('.mkv')) { delornotweshallsee++; } else { anotherno++; }
        })
        if(delornotweshallsee!=6) {
            await cmd(`rmdir ${num-1} /Q /S`, './videos'); num--; k--; console.log(`Deleted folder that had corrupted/unfinished download`)
        } else {
            anotherno++;
        }
    }


    process.exit(3)
})