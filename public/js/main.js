$(document).ready(function() {

	Woolyarn.init();

	var socket = Woolyarn.getSocket();

	Woolyarn.socket.on('arduino', function(data) {
		console.log('Value arrived from arduino: '+ data.value.value);

		$("#currentValue").html(JSON.stringify(data));
	});
});

