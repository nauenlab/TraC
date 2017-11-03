//iCheck radio button
$(document).ready(function(){
  	$('input').iCheck({
	    checkboxClass: 'icheckbox_flat-blue',
	    radioClass: 'iradio_flat-blue'
  	});
});

numberOfSV = 3;

//Draw tracks 
function displayTranscripts(x){
	if(!x){
		$("#probeLoc").css("margin-left","750px");
		$("#title").css("display","block");
	}

	$("#probeLoc").empty();

	var spliceVariants= $(".SV").map(function() {
	   return $(this).val();
	}).get();

	var longestSeq = spliceVariants.sort(function (a, b) { return b.length - a.length; })[0];

	spliceVariants= $(".SV").map(function() {
	   return $(this).val();
	}).get();

	var xScale = d3.scaleLinear()//scaleLinear v4
        .domain(
         	[0,longestSeq.length]
        )
        .range([0,580]);

	var height = spliceVariants.length * 30 + 20;

    var svg = d3.select("#probeLoc")
			.append("svg")
			.attr("id", "svgT")
			.attr("width", "700px")
			.attr("class" , "svg")
			.attr("height", height)
			.append("g")
		  	.append("g")
		  	.attr("class", "g");


	//Color for the unique transcripts
	var transcripts = [$( "input[name='name"+1+"']" ).val(), $( "input[name='name"+2+"']" ).val(), $( "input[name='name"+3+"']" ).val(), $( "input[name='name"+4+"']" ).val(),  $( "input[name='name"+5+"']" ).val(), $( "input[name='name"+6+"']" ).val(), $( "input[name='name"+7+"']" ).val(), $( "input[name='name"+8+"']" ).val(),  $( "input[name='name"+9+"']" ).val(), $( "input[name='name"+10+"']" ).val(), $( "input[name='name"+11+"']" ).val(), $( "input[name='name"+12+"']" ).val(), $( "input[name='name"+13+"']" ).val(), $( "input[name='name"+14+"']" ).val(), $( "input[name='name"+15+"']" ).val(), $( "input[name='name"+16+"']" ).val(), $( "input[name='name"+17+"']" ).val()];
	var colors = [ "#1395B5", "#FE7351","rgb(130, 195, 53)",  "#EA706F" ,  "#F1E64E", "#B3AEB2", "#14D9C8" , "rgb(154, 4, 4)", "rgb(49, 152, 206)", "rgb(62, 165, 5)", "#D7E643", "#7486c3", "rgb(64, 135, 24)","#FE6C5F", "#F1E64E", "#98B914",];
	var color = d3.scaleOrdinal()
    	.domain(transcripts)
    	.range(colors);

	svg.append("rect")
	    .attr("class", "overlay")
	    .attr("width", "700px")
	    .attr("height", height);

	var text = svg.append("g").attr("class", "text");
	var yloc = 10;

	// Delete this when actual array arrives
	var exonLengths = [[3,3],[3, 3]];
	// the names array
	var namesArray = [['exon1', 'exon2'],['exon3']];

	for(var i = 0; i < spliceVariants.length; i++){
		var name = $( "input[name='name"+(i+1)+"']" ).val();
		/*svg.append("rect")
            .attr("x", 0)
            .attr("y", yloc)
            .attr("width", xScale(spliceVariants[i].length))
            .attr("height", 20)
            .style("opacity", 0.85)
			.attr("fill", color(name));*/

			//go through exons, mark them if they exist
			var xloc = 0;
			for(var j=0; j < exonLengths[i].length; j++){
				length = exonLengths[i][j];
				svg.append("rect")
		            .attr("x", xloc)
		            .attr("y", yloc)
		            .attr("width", xScale(spliceVariants[i].length)*length/spliceVariants[i].length)
		            .attr("height", 20)
		            .style("opacity", 0.85)
		            .style("stroke", "black")
		            .style("stroke-width", 1)
					.attr("fill", color(name));

				xloc += xScale(spliceVariants[i].length)*length/spliceVariants[i].length;
			/*	svg.append("rect")
	            .attr("x", length)
	            .attr("y", yloc)
	            .attr("width", 1)
	            .attr("height", 20)
	            .style("opacity", 0.85)
				.attr("fill", "black");*/
			}

		// The name of the transcript
		d3.select(".svg").append("text")
			.attr("class", "vals")
			.attr("x", xScale(spliceVariants[i].length)+10)
            .attr("y", yloc+15)
            .text(name)
            .style("font-size", "17px")
            .style('pointer-events', 'none');

        yloc += 30;
    }
	
}

// Add a new splice variants with the given name and sequence
function addSV(name, sequence){
    if(name == null && sequence == null)
    {
        name = numberOfSV;
        sequence = '';
    }
    $("#SVs").append("<span class='"+numberOfSV+"'> Name: </span> <input type='text' name='name"+numberOfSV+"' class='"+numberOfSV+"' value='"+name+"' onfocus='onFocus(this)' onblur='onBlur(this)'> <span class='"+numberOfSV+"'> Sequence: </span><textarea class='SV "+numberOfSV+"' style='width: 525px;  height: 13px; margin-bottom: -5px'>"+sequence+"</textarea><span class="+numberOfSV+" style='margin-right: 4px;'></span><img class='del "+numberOfSV+"' onclick='removeSV(this)' src='x-button.png' alt='delete' height='19px' style='margin-bottom: -5px'> <br class='"+numberOfSV+"'/>")
    numberOfSV++;
}

// Default name of transcript
function onFocus(sv){
	if($( "input[name='name"+sv.className+"']" ).val()==sv.className) 
		$( "input[name='name"+sv.className+"']" ).val("");
}

// Default name of transcript
function onBlur(sv) {
	if($( "input[name='name"+sv.className+"']" ).val()=='')
		{$( "input[name='name"+sv.className+"']" ).val(sv.className);}
}

//Once pressed on x button, delete the corresponding transcript
function removeSV(sv){
	sv = sv.className;
	sv = sv.match(/\d+/)[0]; //get the number
	var remove = "."+sv
	$(remove).remove();
	while(sv < numberOfSV){
		sv++;
		var toggleClass = "."+ sv;
		var newClass = sv-1;
		if($( "input[name='name"+sv+"']" ).val() == sv){
			$( "input[name='name"+sv+"']" ).val(newClass);
		}
		$( "input[name='name"+sv+"']" ).attr("name", "name"+newClass)
		$(toggleClass).addClass(newClass.toString()).removeClass(sv.toString());
	}
	numberOfSV--;
}

function fade(){
	if($("#reverse").val() != ""){
		$(".fade").css("opacity","0.5");
		$(".fade2").css("display","none");
	} else {
		$(".fade").css("opacity","1");
		$(".fade2").css("display","block");
	}
}

function chordData()
{
    $("#results").empty();
    $("#sv-chart").empty();
    $("#probeLoc").empty();
    $("#title").css("display","none");
	$("#probe").css("display","none");
    $("#loadingChord").css('display', 'block');
	
	var reverse = $("#reverse").val();
	if(reverse != ""){
		$("#probeLoc").css("margin-left","0px");
		$("#title").css("display","none");
		$("#probe").css("display","none");
		displayTranscripts(1);
		var found = displayLocation(reverse);
		$("#results").html("the red rectangles correspond to the location of the given subsequence");
		if(!found){
			$("#probeLoc").empty();
			$("#results").html("None of the transcripts share the given subsequence. To find all shared subsequences, please empty the subsequence textbox and resubmit.");
		}
		$("#loadingChord").css('display', 'none');
		return;
	}


    var sequences = $(".SV").map(function() {
        return $(this).val();
    }).get();



    var minLength = Number($("#minLength").val());

    if(window.Worker)
    {
        var chordWorker = new Worker('chordWorker.js');

        chordWorker.postMessage([sequences, minLength]);

        chordWorker.onmessage = function(e) {

        	[arrComb, arrSharedSeqs] = e.data;

            makeJsonData(arrComb, arrSharedSeqs);

            $("#loadingChord").css('display', 'none');
        };

        return;
    }

    [arrComb, arrSharedSeqs] = chordComputation(sequences, minLength);

    makeJsonData(arrComb, arrSharedSeqs);

    $("#loadingChord").css('display', 'none');
}

//Convert the shared probes among different splice variants into JSON format
function makeJsonData(combs, sharedSeqs){
	var length = true; 

	if($('input[name=weight]:checked').val() == "shared"){
		length = false;
		var weights = [];
	}

	var arrayOfProbes = [];
	var chordData = [];

	for(var i = combs.length - 1; i > -1; i--){
		for( var j = 0; j < sharedSeqs[i].length; j++){
			if(arrayOfProbes.indexOf(sharedSeqs[i][j]) == -1){
				arrayOfProbes.push(sharedSeqs[i][j]);
				if(!length){
					weights.push(combs[i].length);
				}
				for(var k = 0; k < combs[i].length; k++){
					chordData.push({
						"SpliceVariant": $( "input[name='name"+(combs[i][k]+1)+"']" ).val(),
						"probe": sharedSeqs[i][j],
						"size": sharedSeqs[i][j].length
					});
				}
			}
		}
	}

	var temp = [];

	for(var i = 0; i < arrayOfProbes.length; i++){
		if(!length){
			temp.push({
				"name" : arrayOfProbes[i],
				"size" : weights[i]*10
			})
		} else {
			temp.push({
				"name" : arrayOfProbes[i],
				"size" : arrayOfProbes[i].length 
			})
		}
		
	}
	var temp2 = [];
	temp2.push({
		"children": temp
	})
	weightedByLength = {"children": temp2};
	if(chordData.length != 0){
		drawChord(chordData, weightedByLength);
		displayTranscripts(0);
	} else {
		$("#results").html("no SVs of desired min length was found");
	}

}

