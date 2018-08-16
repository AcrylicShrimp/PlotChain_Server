
'use strict';

let $window;
let $document;
let $background;

$(window).on("load", function() {
	$window     = $(window);
	$document   = $(document);
	$background = $('.background-image');
	
	SmoothScroll({
		animationTime: 400,   // [ms]
		stepSize     : 100,   // [px]

		// Acceleration
		accelerationDelta: 50,   // 50
		accelerationMax  : 3,    // 3

		// Keyboard Settings
		keyboardSupport: true,   // option
		arrowScroll    : 50,     // [px]

		// Pulse (less tweakable)
		// ratio of "tail" to "acceleration"
		pulseAlgorithm: true,
		pulseScale    : 4,
		pulseNormalize: 1,

		// Other
		touchpadSupport: false,   // ignore touchpad by default
		fixedBackground: true,
		excluded       : ''
	});
	$('html').css('transition', 'opacity 2s');
	$('html').css('opacity', 1);
	
	$window.scroll(updateBackground);
	$window.resize(updateBackground);
	
	$('#logo-button').on('click', function() {
		location.reload();
	});
	
	$('#about-button').on('click', function() {
		$('html, body').animate({		//For browser compatibility.
			scrollTop: $('#about').offset().top - $('#about').height() / 2
		}, 500);
	});
	
	$('#value-button').on('click', function () {
		$('html, body').animate({		//For browser compatibility.
			scrollTop: $('#value').offset().top - $('#value').height() / 2
		}, 500);
	});
	
	$('#team-button').on('click', function () {
		$('html, body').animate({		//For browser compatibility.
			scrollTop: $('#member').offset().top - $('#member').height() / 4
		}, 500);
	});

	$('#communication-button').on('click', function () {
		window.open('https://www.facebook.com/plotchain/', '_blank');
	});

	$('#facebook-button').on('click', function() {
		window.open('https://www.facebook.com/plotchain/', '_blank');
	});
	
	updateBackground();
});

function updateBackground() {
	for (let index = 0; index < $background.length; ++index)
		$($background[index]).css(
			'background-position',
			calcBackgroundHorizontal($($background[index])) + '% ' + calcBackgroundVertical($($background[index])) + '%');
}

function calcBackgroundHorizontal(target) {
	const windowScroll = $window.scrollLeft();
	const windowWidth  = $window.width();
	const targetLeft   = target.offset().left;
	const targetWidth  = target.outerWidth();
	
	if (windowScroll + windowWidth <= targetLeft)
		return 0;

	if (windowScroll >= targetLeft + targetWidth)
		return 100;

	return (windowScroll + windowWidth - targetLeft) / (windowWidth + targetWidth) * 100;
}

function calcBackgroundVertical(target) {
	const windowScroll = $window.scrollTop();
	const windowHeight = $window.height();
	const targetTop    = target.offset().top;
	const targetHeight = target.outerHeight();
	
	if (windowScroll + windowHeight <= targetTop)
		return 0;

	if (windowScroll >= targetTop + targetHeight)
		return 100;

	return (windowScroll + windowHeight - targetTop) / (windowHeight + targetHeight) * 100;
}