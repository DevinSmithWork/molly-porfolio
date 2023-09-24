// Document onload: Initialize audio_player object
let audio_player
document.addEventListener("DOMContentLoaded", function(event) {
	audio_player = document.getElementById('player')
	console.log(audio_player)
});


// Load JSON file and parse.
fetch('./portfolio-database.json')
	.then((response) => response.json())
	.then((json) => parse_portfolio(json))

function parse_portfolio(json) {

	// -------------------------------
	// Loop the JSON array of sections
	for (var i=0; i<json.length; i++) {
		let section = json[i]

		// Section setup
		let section_element = ce("details")
		section_element.id = section.name

		// Section summary & H2
		let section_summary = ce("summary")
		let section_h2 = ce("h2")
		section_h2.innerHTML = section.name
		section_summary.appendChild(section_h2)
		section_element.appendChild(section_summary)

		// Section notes
		if (section.hasOwnProperty("notes")) {
			let section_notes = ce("p")
			section_notes.classList.add("section-notes")
			section_notes.innerHTML = section.notes
			section_element.appendChild(section_notes)
		}

		// Section items
		for (var j=0;j<section.items.length; j++) {
			work = section['items'][j]

			if (work.hasOwnProperty('fileArray')) {
				work_element = create_work_element_multi(work, section['mediaFolder'])

			} else if (work.hasOwnProperty('embedHTML')) {
				work_element = create_work_element_embed(work, section['mediaFolder'])

			} else {
				work_element = create_work_element_single(work, section['mediaFolder'])
			}

			// Append the work 
			section_element.appendChild(work_element)

		}

		// append section to main body
		document.getElementById("test").appendChild(section_element)

	}

	// Adds onclick code to buttons
	add_button_onclicks()

}


// quick function to cut down typing lol
function ce(tag) {
	return(document.createElement(tag))
}













// ------------------
// Creates the standard button div
function get_standard_button(file, slider_id) {
	// Play-Pause div
	const pp_div = ce("div")
	pp_div.classList.add("play-pause")

	// Play-pause button
	const pp_button = ce("button")
	pp_button.classList.add("au-play")
	pp_button.innerText = "▶︎"

	// Set attributes
	pp_button.dataset.file = file
	pp_button.dataset.slider = slider_id

	pp_div.appendChild(pp_button)
	return(pp_div)
}


// ------------------
// Creates the standard slider object
function get_standard_slider(slider_id) {
	const std_slider = ce("div")
	std_slider.classList.add("slider-container")

	const std_input = ce("input")
	std_input.type = "range"
	std_input.min = 0
	std_input.max = 100
	std_input.value = 0
	std_input.classList.add("slider")
	std_input.id = slider_id

	std_slider.appendChild(std_input)
	return(std_slider)
}















// ------------------
// single-audio-item div
function create_work_element_single(item, mediaFolder) {

	// ID for audio player + slider
	au_id = item["title"]

	// outer div
	let work_div = ce("div")
	work_div.classList.add("work-div", "audio-player")


	// Title
	let work_h4 = ce("h4")
	work_h4.innerText = item['title']
	work_div.appendChild(work_h4)
	

	if (mediaFolder != undefined) {
		item['file'] = mediaFolder + "/" + item['file']
	}

	// Button
	let work_button = get_standard_button("media/" + item['file'], au_id)
	work_div.appendChild(work_button)


	// Notes
	let work_notes = ce("p")
	work_notes.innerHTML = item['notes']
	work_div.appendChild(work_notes)


	// Slider
	let work_slider = get_standard_slider(au_id)
	work_div.appendChild(work_slider)
	

	return(work_div)

}



// ------------------
// Multi-audio-item div
function create_work_element_multi(item, mediaFolder) {

	// outer div
	let work_div = ce("div")
	work_div.classList.add("work-div")

	// Title
	let work_h4 = ce("h4")
	work_h4.innerText = item['title']
	work_div.appendChild(work_h4)

	// Notes
	if (item.hasOwnProperty("notes")) {
		let work_notes = ce("p")
		work_notes.classList.add("condensed")
		work_notes.innerHTML = item['notes']
		work_div.appendChild(work_notes)
	}

	// Loop the multiple items and all elements
	for (var k =0; k < item.fileArray.length; k++) {
		multi_item = item.fileArray[k]

		// ID for audio player + slider
		au_id = multi_item["title"]

		// audio player div
		let multi_div = ce("div")
		multi_div.classList.add("audio-player", "multi")

		if (mediaFolder != undefined) {
			multi_item['file'] = mediaFolder + "/" + multi_item['file']
		}

		// Button
		let multi_button =get_standard_button("media/" + multi_item['file'], au_id)

		// Second multi div
		let multi_second_div = ce("div")
		multi_second_div.classList.add("multi-controls")

		// Title
		let multi_title = ce("p")
		multi_title.innerText = multi_item['title']

		// Slider
		let multi_slider = get_standard_slider(au_id)

		// Multi layout
		multi_div.appendChild(multi_button)
		multi_second_div.appendChild(multi_title)
		multi_second_div.appendChild(multi_slider)
		multi_div.appendChild(multi_second_div)

		// Append to main work div
		work_div.appendChild(multi_div)

	}

	return(work_div)

}




// ------------------
// Single item with embed
function create_work_element_embed(item, mediaFolder) {

	// outer div
	let work_div = ce("div")
	work_div.classList.add("work-div")


	// Title
	let work_h4 = ce("h4")
	work_h4.innerText = item['title']
	work_div.appendChild(work_h4)


	// External link
	if (item.hasOwnProperty("externalLink")) { 
		let ext_h5 = ce("h5")
		let ext_link = ce("a")
		ext_link.href = item["externalLink"]
		ext_link.innerText = item["externalText"]

		ext_h5.appendChild(ext_link)
		work_div.appendChild(ext_h5)
	}


	// Notes
	if (item.hasOwnProperty("notes")) {
		let work_notes = ce("p")
		work_notes.classList.add("condensed")
		work_notes.innerHTML = item['notes']
		work_div.appendChild(work_notes)
	}


	// embed
	if (item.hasOwnProperty("embedHTML")) {
		let work_embed = ce("div")
		work_embed.classList.add("embed-div")
		work_embed.innerHTML = item["embedHTML"]
		work_div.appendChild(work_embed)
	}


	// Button & Slider 
	if (item.hasOwnProperty("file")) {

		// ID for audio player + slider
		au_id = item["title"]

		if (mediaFolder != undefined) {
			item['file'] = mediaFolder + item['file']
		}

		let work_button = get_standard_button("media/" + item['file'], au_id)
		work_div.appendChild(work_button)
	
		let work_slider = get_standard_slider(au_id)
		work_div.appendChild(work_slider)
	}

	return(work_div)

}

// -----------------------
// Attaches the play/pause script to all au-plays
function add_button_onclicks() {
	
	let pp_buttons = document.getElementsByClassName("au-play") 

	for (let i=0;i<pp_buttons.length; i++) {
		pp_buttons[i].onclick = function() {
			// alert(this.dataset.file)
			togglePlay(this)
		}
	}
}




// Randomize colors
function randomize_colors() {

	const r = document.querySelector(':root');

	const color_vars = [
		"--bg-color",
		"--text-color",
		"--layout-color",
		"--accent-color"]

	for (let i=0;i<color_vars.length;i++) {
		color_var = color_vars[i]
		var random_color = Math.floor(Math.random()*16777215).toString(16);
		r.style.setProperty(color_var, "#" + random_color);
	}

}






















// ==============================
// AUDIO FUNCTIONALITY

let player_status = "FIRST"

var is_playing = false
var first_play = true
var current_btn = ""
var current_slider = ""

// Automatically play when enough of the file has been loaded to do so.
function canplayTriggered() {
	if (player_status != "FIRST") {
    	document.getElementById('player').play();
    	audio_player.addEventListener('timeupdate', () => update_slider_value())
    } else {

    	// TK TK figure out how to resume from paused location
		// if (current_slider.value != 0) {
		// 	audio_player.currentTime = (current_slider.value/100) * audio_player.duration
		// }

    }
}



function togglePlay(btn) {

	let file = btn.dataset.file
	let same_track = (btn == current_btn)
	console.log(player_status)
	console.log("same track: " + same_track)


	switch(player_status) {

		// ----- First play
		case("FIRST"):
			console.log("First play")

			btn.classList.add("currently-playing")
			btn.innerHTML = "✘"

			swap_song(file, btn.dataset.slider, null)

			current_btn = btn
			current_slider = document.getElementById(btn.dataset.slider)

			player_status = "PLAYING"

		break;


		// ----- Player is currently playing
		case("PLAYING"):

			// Pause the current song
			if (same_track) {
				console.log("Same button, pausing")
				audio_player.pause();
				btn.innerHTML = "▶︎"
				player_status = "PAUSED"

			// Clicked a new track
			} else {
				console.log("diff button, playing new track")

				// Reset the previous button
				current_btn.classList.remove("currently-playing")
				current_btn.innerHTML = "▶︎"
				old_slider = current_btn.dataset.slider

				// new button
				btn.classList.add("currently-playing")
				btn.innerHTML = "✘"
				new_slider = btn.dataset.slider

				swap_song(file, new_slider, old_slider)

				current_btn = btn
				current_slider = document.getElementById(btn.dataset.slider)

				player_status = "PLAYING"
			}

		break;


		// ----- Player is paused
		case("PAUSED"):

			// Resume the current track
			if (same_track) {
				console.log("Same button, resuming")
				audio_player.play();
				btn.innerHTML = "✘"
				player_status = "PLAYING"

			// Play a new track
			} else {
				console.log("diff button, playing new track")

				// Reset the previous button
				current_btn.classList.remove("currently-playing")
				current_btn.innerHTML = "▶︎"
				old_slider = current_btn.dataset.slider

				// New button
				btn.classList.add("currently-playing")
				btn.innerHTML = "✘"
				new_slider = btn.dataset.slider

				swap_song(file, new_slider, old_slider)

				current_btn = btn
				current_slider = document.getElementById(btn.dataset.slider)

				player_status = "PLAYING"
			}

		break;
	}

	console.log(player_status)

}



/*================================*/
// Song swapping requires callbacks
function swap_song(song_file, new_slider, old_slider) {
    pause_player(function() {
        change_player_song(song_file, function() {
        	start_player()

        	if (old_slider != null) {
        		document.getElementById(old_slider).value = 0
        		remove_old_slider_listener(document.getElementById(old_slider))
        	}

    		add_new_slider_listener(document.getElementById(new_slider))

        });
    });
}

function pause_player(callback) {
	audio_player.pause();
	callback();
}

function change_player_song(song_file, callback) {
	audio_player.setAttribute('src', song_file);
	callback();
}

function start_player() {
	audio_player.play();
}


function remove_old_slider_listener(old_slider) {
	old_slider.removeEventListener('change', () => {
		audio_player.currentTime = (new_slider.value/100) * audio_player.duration
	});
}

function add_new_slider_listener(new_slider) {
	new_slider.addEventListener('change', () => {
		audio_player.currentTime = (new_slider.value/100) * audio_player.duration
	});
}

// Called from the timeupdate event
function update_slider_value() {

	// When a track first loads, these values can return NaN.
	// This causes the slider to jump to 50% for a few frames -- bad
	if (!isNaN(audio_player.currentTime / audio_player.duration)) {
		current_slider.value = (audio_player.currentTime / audio_player.duration) * 100;
	}
}


/*================================*/