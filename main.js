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

const fs = require('fs');
const spawn = require('child_process').spawn;
// This is the download command for the videos, please do not edit this. There are certain parts of the script that requires some of these and removing some of them can break it and cause multiple file to be deleted due to the folder checker.
const command = 'yt-dlp --write-description --write-info-json --write-playlist-metafiles --write-comments --write-thumbnail --write-link --write-url-link --write-webloc-link --merge-output-format mkv --write-subs --no-write-auto-subs --sub-format srt --embed-subs --embed-thumbnail --embed-metadata --embed-chapters --embed-info-json --convert-thumbnails jpg ';

// This set of variables are ones that are called throughout the script
let num = fs.readdirSync('./videos').length + 1;


const { red, green, yellow, blue, magenta, cyan, white, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta } = require('chalk');

async function colourise(text) {
	const split = text.split(' ');
	let ok = text;
	/*
	download stat thing has extra spaces, need to put in several for one
	*/
	if (split[0] == '[download]' && split[1].includes('%') && split[2] == 'of') ok = [bgGreen(split[0]), blue(split[1]), yellow(split[2]), cyan(split[3]), yellow(split[4]), blue(split[5]), yellow(split[6]), cyan(split[7])].join(' '); // [download] 100.0% of    4.51GiB at   17.57MiB/s ETA 00:00
	else if (split[0] == '[download]' && split[1] == '100%' && split[2] == 'of' && split[4] == 'in' && split[5].includes(':') && split[6] == 'at') ok = [bgGreen(split[0]), blue(split[1]), yellow(split[2]), cyan(split[3]), yellow(split[4]), blue(split[5]), yellow(split[6]), cyan(split[7])].join(' '); // [download] 100% of    4.51GiB in 00:05:12 at 14.78MiB/s
	else if (split[0] == '[youtube]' && split[1] == 'Extracting' && split[2] == 'URL:') ok = [bgRed(split[0]), yellow(split[1], split[2]), cyan(split.slice(3).join(' '))].join(' '); // extracting url
	else if (split[0] == '[youtube]' && split[2] == 'Downloading' && split[3] == 'webpage') ok = [bgRed(split[0]), split[1], yellow(split[2], split[3])].join(' '); // downloading webpage
	else if (split[0] == '[youtube]' && split[2] == 'Downloading' && split[3] == 'player') ok = [bgRed(split[0]), split[1], yellow(split[2], split[3])].join(' '); // downloading player
	else if (split[0] == '[youtube]' && split[2] == 'Downloading' && split[3] == 'ios' && split[4] == 'player' && split[5] == 'API' && split[6] == 'JSON') ok = [bgRed(split[0]), split[1], yellow(split[2], split[3], split[4], split[5], split[6])].join(' '); // [youtube] .... Downloading ios player API JSON
	else if (split[0] == '[youtube]' && split[2] == 'Downloading' && split[3] == 'android' && split[4] == 'player' && split[5] == 'API' && split[6] == 'JSON') ok = [bgRed(split[0]), split[1], yellow(split[2], split[3], split[4], split[5], split[6])].join(' '); // [youtube] .... Downloading android player API JSON
	else if (split[0] == '[youtube]' && split[2] == 'Downloading' && split[3] == 'm3u8' && split[4] == 'information') ok = [bgRed(split[0]), split[1], yellow(split[2], split[3], split[4])].join(' '); // [youtube] .... Downloading m3u8 information
	else if (split[0] == '[youtube]' && split[1] == 'Downloading' && split[2] == 'comment' && split[3] == 'section' && split[4] == 'API' && split[5] == 'JSON') ok = [bgRed(split[0]), yellow(split[1], split[2], split[3], split[4], split[5])].join(' '); // [youtube] Downloading comment section API JSON
	else if (split[0] == '[youtube]' && split[1] == 'Downloading' && split[3] == 'comments') ok = [bgRed(split[0]), yellow(split[1], split[2], split[3])].join(' '); // [youtube] Downloading ~.... comments
	else if (split[0] == '[youtube]' && split[1] == 'Downloading' && split[2] == 'comment' && split[3] == 'API' && split[4] == 'JSON' && split[5] == 'page') ok = [bgRed(split[0]), yellow(split[1], split[2], split[3], split[4], split[5], split[6]), magenta(split[7])].join(' '); // [youtube] Downloading comment API JSON page .. (..../~....)
	else if (split[0] == '[youtube]' && split[1] == 'Extracted' && split[3] == 'comments') ok = [bgRed(split[0]), yellow(split[1], split[2], split[3])].join(' '); // [youtube] Extracted .... comments
	else if (split[0] == '[info]' && split[2] == 'Downloading' && split[4] == 'format(s):') ok = [bgYellow.black(split[0]), white(split[1], yellow(split[2], split[3], split[4], split[5]))].join(' '); // [info] mJgGzKu77JM: Downloading 1 format(s): 303+251
	else if (split[0] == '[info]' && split[1] == 'Writing' && split[2] == 'video' && split[3] == 'description' && split[4] == 'to:') ok = [bgYellow.black(split[0]), yellow(split[1], split[2], split[3], split[4]), cyan(split.slice(5).join(' '))].join(' '); // [info] Writing video description to: ...
	else if (split[0] == '[info]' && split[1] == 'There' && split[2] == 'are' && split[3] == 'no' && split[4] == 'subtitles' && split[5] == 'for' && split[6] == 'the' && split[7] == 'requested' && split[8] == 'languages') ok = ''; // [info] There are no subtitles for the requested languages    i don't think there is much use for this
	else if (split[0] == '[info]' && split[1] == 'Downloading' && split[2] == 'video' && split[3] == 'thumbnail') ok = [bgYellow.black(split[0]), yellow(split[1], split[2], split[3], split[4], split[5])].join(' '); // [info] Downloading video thumbnail .. ...
	else if (split[0] == '[info]' && split[1] == 'Writing' && split[2] == 'video' && split[3] == 'thumbnail' && split[5] == 'to:') ok = [bgYellow.black(split[0]), yellow(split[1], split[2], split[3], split[4], split[5]), cyan(split.slice(6).join(' '))].join(' '); // [info] Writing video thumbnail 41 to:
	else if (split[0] == '[info]' && split[1] == 'Writing' && split[2] == 'video' && split[3] == 'metadata' && split[4] == 'as' && split[5] == 'JSON' && split[6] == 'to:') ok = [bgYellow.black(split[0]), yellow(split[1], split[2], split[3], split[4], split[5], split[6]), cyan(split.slice(7).join(' '))].join(' '); // [info] Writing video metadata as JSON to:
	else if (split[0] == '[info]' && split[1] == 'Writing' && split[2] == 'internet' && split[3] == 'shortcut' && split[4] == '(.url)' && split[5] == 'to:') ok = [bgYellow.black(split[0]), yellow(split[1], split[2], split[3], split[4], split[5]), cyan(split.slice(6).join(' '))].join(' '); // [info] Writing internet shortcut (.url) to:
	else if (split[0] == '[info]' && split[1] == 'Writing' && split[2] == 'internet' && split[3] == 'shortcut' && split[4] == '(.webloc)' && split[5] == 'to:') ok = [bgYellow.black(split[0]), yellow(split[1], split[2], split[3], split[4], split[5]), cyan(split.slice(6).join(' '))].join(' '); // [info] Writing internet shortcut (.webloc) to:
	else if (split[0] == '[ThumbnailsConvertor]' && split[1] == 'Converting' && split[2] == 'thumbnail') ok = [bgBlue(split[0]), yellow(split[1], split[2]), cyan(split.slice(3, -2).join(' ')), yellow(split.slice(-2).join(' '))].join(' '); // [ThumbnailsConvertor] Converting thumbnail "...." to jpg
	else if (split[0] == 'Deleting' && split[1] == 'original' && split[2] == 'file') ok = [yellow(split[0], split[1], split[2]), cyan(split.slice(3, -4).join(' ')), yellow(split.slice(-4).join(' '))].join(' '); // Deleting original file ....... (pass -k to keep)
	else if (split[0] == '[Merger]' && split[1] == 'Merging' && split[2] == 'formats' && split[3] == 'into') ok = [bgBlue(split[0]), yellow(split[1], split[2], split[3]), cyan(split.slice(4).join(' '))].join(' '); // [Merger] Merging formats into ....
	else if (split[0] == '[EmbedSubtitle]' && split[1] == 'There' && split[2] == 'aren\'t' && split[3] == 'any' && split[4] == 'subtitles' && split[5] == 'to' && split[6] == 'embed') ok = [bgYellow.black(split[0]), yellow(split[1], split[2], split[3], split[4], split[5], split[6])].join(' '); // [EmbedSubtitle] There aren't any subtitles to embed
	else if (split[0] == '[Metadata]' && split[1] == 'Adding' && split[2] == 'metadata' && split[3] == 'to') ok = [bgMagenta(split[0]), yellow(split[1], split[2], split[3]), cyan(split.slice(4).join(' '))].join(' '); // [Metadata] Adding metadata to ......
	else if (split[0] == '[EmbedThumbnail]' && split[1] == 'ffmpeg:' && split[2] == 'Adding' && split[3] == 'thumbnail' && split[4] == 'to') ok = [bgYellow.black(split[0]), yellow(split[1], split[2], split[3], split[4]), cyan(split.slice(5).join(' '))].join(' '); // [EmbedThumbnail] ffmpeg: Adding thumbnail to ......
	else if (split[0] == 'Downloaded' && split[1] == 'video') ok = [green(split[0], split[1])].join(' '); // Downloaded video
	else if (split[1] == 'video/s' && split[2] == 'left') ok = [yellow(split[0], split[1], split[2])].join(' '); // 114 video/s left
	else if (split[0] == '[youtube]' && split[1] == 'Sorting' && split[2] == 'comments' && split[3] == 'by' && split[4] == 'newest' && split[5] == 'first') ok = ''; // [bgRed(split[0]), yellow(split.slice(1).join(' ')), '\n'].join(' '); // [youtube] Sorting comments by newest first
	else if (split[0] == '[download]' && split[1] == 'Destination:') ok = [bgGreen(split[0]), yellow(split[1]), cyan(split.slice(2).join(' ')), '\n'].join(' '); // [download] Destination: ....

	return ok;
}
// the cmd function is called anytime that a command needs to be exectued in the command prompt.
async function cmd(cmd, dir) {
	// directory selection
	const cwd = dir || process.cwd();

	// creating the command prompt process and running it
	let childProcess;
	try {
		childProcess = spawn(cmd, { cwd, shell: true });
	}
	catch (err) {
		process.exit();
	}

	// anything to would show something in the prompt to catches it and shows it here
	childProcess.stdout.on('data', async (data) => {
		// the reply thread is useless and spams even more
		if (data.toString().startsWith('[youtube]     Downloading comment API JSON reply thread')) return;
		if (data.toString().startsWith('[youtube]        Downloading comment replies API JSON page')) return;
		// manages the overwrite for the downlaoding video and comment sections
		const dat = data.toString().replace(new RegExp('\n', 'g'), '');
		const dat2 = await colourise(dat);
		// i am using process.stdout.write instead of console.log so that i can use \r to go back to the start of the line as console.log automatically adds a newline when used
		if (dat.includes('[download]') && !dat.includes('100%') && dat.includes('%')) {
			process.stdout.write(`\r${dat2}`);
		}
		else if (dat.startsWith('[youtube] Downloading comment API JSON page ')) {
			process.stdout.write(`\r${dat2}`);
		}
		else {
			process.stdout.write(`\n${dat2}`);
		}
	});

	// this will hopefully catch and handle most errors that would end up happening within the script
	childProcess.stderr.on('data', (data) => {
		if (data.toString().startsWith('A subdirectory or file ')) {
			process.stdout.write(`\n${data}`);
			try {
				const fold = data.toString().replace('A subdirectory or file ', '').replace(' already exists.', '');
				const l = fs.readdirSync(`./videos/${fold}`);
				if (l.length === 0) {
					fs.unlinkSync(`./videos/${fold}`);
					process.stdout.write('\nThere was a file error but it was able to self fix.');
				}
				else {
					process.stderr.write('\n\nThere was an error in folder creation and it was unable to self fix.\nThis process will now exit');
					process.exit();
				}
			}
			catch (er) { process.exit(); }
		}
		// we dont want the script exiting if its just a warning now do we
		else if (data.toString().startsWith('WARNING:')) { return; }

		else {
			process.stderr.write(`\n\nCommand execution error: ${data}`);
			process.exit(2);
		}
	});

	// this is for uhh... idk really.
	return new Promise((resolve, reject) => {
		childProcess.on('close', (code) => {
			if (code === 0) {
				resolve();
			}
			else {
				reject(`Command exited with code ${code}`);
			}
		});
	});
}

// small function that counts how many links are in the link file
async function links() {
	const lin = fs.readFileSync('./links.txt', 'utf8').split(' ');
	if (lin[0] === '') lin.shift();
	await repspace();
	let n = 0;
	lin.forEach(() => {
		n++;
	});
	return n;
}
// this replaces the first link in the link file to nothing
async function rep() {
	const h = await nextlink();
	const text = fs.readFileSync('./links.txt', 'utf8').replace(`${h}`, '');
	fs.writeFileSync('./links.txt', text);
	await repspace();
}
// this removes any amount of spaces at the beginning of the link file to prevent certain errors
async function repspace() {
	const text = fs.readFileSync('./links.txt', 'utf8').split(' ');
	let no = 0;
	while (no === 0) {
		if (text[0] === '') { text.shift(); }
		else { no = 1; }
	}
	fs.writeFileSync('./links.txt', text.join(' '));
}
// just gets the next link
async function nextlink() { const e = fs.readFileSync('./links.txt', 'utf8').split(' '); if (e[0] === '') e.shift(); return e[0]; }

// the (async () thing is to allow javascript code to run asynchronously
(async () => {
	if (await links() === 0) return process.stdout.write(red('\n\nYou have no videos to download :p'));
	// checks for empty folders which will mess up the amount of videos downloaded count
	let no;
	if (num != 1) { no = 0; }
	else { no = 1; }
	while (no === 0) {
		const las = fs.readdirSync(`./videos/${num - 1}`);
		if (las.length === 0) { await cmd(`rmdir ${num - 1} /Q /S`, './videos'); num--; process.stdout.write(yellow('\ndeleted empty folder')); }
		else { no++; }
	}
	// this is another check that will see if the video files are unfinished or something
	let anotherno;
	if (num != 1) { anotherno = 0; }
	else { anotherno = 1; }
	while (anotherno === 0) {
		let delornotweshallsee = 0;
		const las = fs.readdirSync(`./videos/${num - 1}`);
		las.forEach(async filename => {
			if (filename.endsWith('.description') || filename.endsWith('.info.json') || filename.endsWith('.jpg') || filename.endsWith('.url') || filename.endsWith('.webloc') || filename.endsWith('.mkv')) { delornotweshallsee++; }
			else { anotherno++; }
		});
		if (delornotweshallsee != 6) {
			await cmd(`rmdir ${num - 1} /Q /S`, './videos'); num--; process.stdout.write(yellow('\nDeleted folder that had corrupted/unfinished download'));
		}
		else {
			anotherno++;
		}
	}

	// now this is where the actual videos get downloaded. the for(;;) means that it should run forever
	for (; ;) {
		// the promise makes it wait for the video to download before doing the next, otherwise you'd be getting all your videos downloading at the same time
		await new Promise(async resolve => {
			// checks if there are any more
			const amount = await links();
			if (amount > 0) {
				// the try is to catch the errors
				try {
					const next = await nextlink();
					process.stdout.write(yellow('\ndownloading video ') + cyan(`${next}`));

					await cmd(`mkdir ${num.toString()}`, './videos');
					process.stdout.write(green(`\ndir ${num.toString()} created`));

					const time = Date.now();
					await cmd(command + next, `./videos/${num.toString()}`);
					process.stdout.write(green('\nDownloaded video'));

					await donedownload(num, time);
					num++;

					await rep();
					process.stdout.write(yellow(`\n\n${amount - 1} video/s left`));

					process.stdout.write('\n\n');

				}
				catch (err) { process.stderr.write(red(`\n${err}`)); process.exit(); }
				resolve();
			}
			else {
				// exiting when evreything's downloaded
				process.stdout.write(bgGreen.black('\n\nAll videos downloaded'));
				process.exit(0);
			}
		});
	}
})();

// just sends a message when the download is done with a few stats and video info
async function donedownload(num, time) {
	// time formatting
	let tim = Date.now() - time;
	tim = Math.round(tim / 1000);
	let min = 0;
	while (tim > 59) { min++; tim = tim - 60; }
	let yo = [];
	if (min === 1) { yo.push(`${min} Minute`); }
	else if (min > 1) { yo.push(`${min} Minutes`); }
	if (tim === 1) { yo.push(`${tim} Second`); }
	else if (tim > 1) { yo.push(`${tim} Seconds`); }
	yo = yo.join(', ');
	// another try to catch errors
	try {
		// fetching video information here
		const alr = fs.readdirSync(`./videos/${num}`).filter(file => file.endsWith('.info.json'));
		const { title, webpage_url, description, uploader_id, channel } = require(`./videos/${num}/${alr}`);
		// send stuff to console
		process.stdout.write('\nVideo downloaded');
		process.stdout.write('\nTime taken ' + `${yo}`);
		process.stdout.write('\nVideo ' + `Title: ${title},\nURL: ${webpage_url}\nChannel: ${channel} (${uploader_id})`);
		process.stdout.write('\nDescription ' + `${description}`);
	}
	catch (err) {
		// and some logging
		process.stderr.write(err);
	}
}


// This just allows the script to send the logs and cleanup if a videos did not finish downloading if the user does ctrl + c (this exits scripts of any kind)
process.on('SIGINT', async () => {
	// this is literally just the same code from earlier that runs on startup lol

	// checks for empty folders
	let no;
	if (num != 1) { no = 0; }
	else { no = 1; }
	while (no === 0) {
		const las = fs.readdirSync(`./videos/${num - 1}`);
		if (las.length === 0) { await cmd(`rmdir ${num - 1} /Q /S`, './videos'); num--; console.log('deleted empty folder'); }
		else { no++; }
	}
	// checks for unfinished downloaded videos
	let anotherno;
	if (num != 1) { anotherno = 0; }
	else { anotherno = 1; }
	while (anotherno === 0) {
		let delornotweshallsee = 0;
		const las = fs.readdirSync(`./videos/${num - 1}`);
		las.forEach(async filename => {
			if (filename.endsWith('.description') || filename.endsWith('.info.json') || filename.endsWith('.jpg') || filename.endsWith('.url') || filename.endsWith('.webloc') || filename.endsWith('.mkv')) { delornotweshallsee++; }
			else { anotherno++; }
		});
		if (delornotweshallsee != 6) {
			await cmd(`rmdir ${num - 1} /Q /S`, './videos'); num--; console.log('Deleted folder that had corrupted/unfinished download');
		}
		else {
			anotherno++;
		}
	}


	process.exit(3);
});