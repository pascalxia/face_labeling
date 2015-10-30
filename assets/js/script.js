$(document).ready(function(){

    // Initialize Global Variables

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    var rectX = 0;
    var rectY = 0;
    var rectWidth = 0;
    var rectHeight = 0;
    var savedRects = [];
    var isDrawing = 0;
    var isBox = 0;
	var isPlay = 0;
    var savedRectCoordinates = [];
    var savedRectSize = [];
    var savedTimeElapsedInVideo = [];

    // Respond to Cursor Movement

    $("#canvas").mousemove(function(event){
        currCursorX = event.pageX;
        currCursorY = event.pageY;
        if (isDrawing == 1 && isBox == 0) {
            rectWidth = currCursorX - rectX;
            rectHeight = currCursorY - rectY;
            context.clearRect(0, 0, canvas.width, canvas.height);
            makeRect();
        }
        else if (isBox == 1) {
            rectX = currCursorX - rectWidth;//Have fixed the jumping problem
            rectY = currCursorY - rectHeight;
            context.clearRect(0, 0, canvas.width, canvas.height);
            makeRect();
        }
        $('#current-box-coordinates').html("Current box coordinates (L, T, R, B): " + [rectX, rectY, rectX + rectWidth, rectY + rectHeight]);
        $('#current-box-size').html("Current box size: " + rectWidth * rectHeight);
    });

    $("#canvas").mousedown(function() {
        if (isBox == 0) {//if there is no box
            rectX = currCursorX;
            rectY = currCursorY;
            isDrawing = 1;
        }
        else {//if there is a box
			if (isPlay) {//if the video is playing
				var interval = 100
				coordinate_tracker = setInterval(function(){ 
					savedRectCoordinates.push([rectX, rectY, rectX + rectWidth, rectY + rectHeight]);
					$('#record-box-coordinates').html("Recording box coordinates (L, T, R, B): " + savedRectCoordinates[savedRectCoordinates.length-1]);
				}, interval);
				size_tracker = setInterval(function(){ 
					savedRectSize.push(rectWidth * rectHeight);
					$('#record-box-size').html("Recording box size: " + savedRectSize[savedRectSize.length-1]);
				}, interval);
				time_tracker = setInterval(function(){ 
					savedTimeElapsedInVideo.push(document.getElementById('movie').currentTime);
					$('#record-time-elapsed-in-video').html("Recording time elapsed in video: " + savedTimeElapsedInVideo[savedTimeElapsedInVideo.length-1]);					
				}, interval);
			}
        }
    });

    $("#canvas").mouseup(function() {
        if (isBox == 0) {
            isDrawing = 0;
            isBox = 1;
        }
        else {
            clearInterval(coordinate_tracker);
			clearInterval(size_tracker);
			clearInterval(time_tracker);
            $('#record-box-coordinates').html("");
            $('#record-box-size').html("");
            $('#record-time-elapsed-in-video').html("");
			savedRectCoordinates.push([0,0,0,0]);
			savedRectSize.push(0);
			savedTimeElapsedInVideo.push(0);
        }
    });

    // Respond to Esc and Space Keys

    $(document).keyup(function(e){
        if (e.keyCode === 27) { // Esc
            context.clearRect(0, 0, canvas.width, canvas.height);
            isDrawing = 0;
            isBox = 0;
        }
        else if (e.keyCode === 32) { // Space
            var movie = document.getElementById('movie');
            if (movie.paused == false) {
                movie.pause();
				isPlay = 0;
            }
            else {
                movie.play();
				isPlay = 1;
            }
        }
		else if (e.keyCode === 13) { // Enter, save recorded data and print it in the textarea on the page
			var output = "";
			for (var i=0; i<savedRectCoordinates.length; i++){
				output = output+savedTimeElapsedInVideo[i]+","+savedRectCoordinates[i]+"\n";
			}
			$("#output-data").html(output);
		}
		else if (e.keyCode === 37) { // Left, go backward
			var movie = document.getElementById('movie');
			var step = 0.1;
			movie.currentTime =  movie.currentTime - step*movie.playbackRate;
		}
		else if (e.keyCode === 39) { // Right, go forward
			var movie = document.getElementById('movie');
			var step = 0.1;
			movie.currentTime =  movie.currentTime + step*movie.playbackRate;
		}
        else if (e.keyCode === 38) { // Up, play faster
            var movie = document.getElementById('movie');
            var ratio = 2;
            movie.playbackRate = movie.playbackRate*ratio;
        }
        else if (e.keyCode === 40) { // Down, play slower
            var movie = document.getElementById('movie');
            var ratio = 2;
            movie.playbackRate = movie.playbackRate/ratio;
        }
    });

    // Construct Rectangle

    function makeRect() {
        context.beginPath();
        context.rect(rectX, rectY, rectWidth, rectHeight);
        context.lineWidth = 5;
        context.strokeStyle = "red";
        context.stroke();
    }

});