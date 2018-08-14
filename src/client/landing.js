
const $window     = $(window);
const $document   = $(document);
const $background = $('.background-image');

$('#about-button').on('click', function() {
	console.error('WTF!');
	$('html').animate({
		scrollTop: $('#about').offset().top - $('#about').height() / 2
	}, 500);
});

$('#value-button').on('click', function () {
	$('html').animate({
		scrollTop: $('#value').offset().top - $('#value').height() / 2
	}, 500);
});

$('#member-button').on('click', function () {
	$('html').animate({
		scrollTop: $('#member').offset().top - $('#member').height() / 4
	}, 500);
});

$(document).ready(() => {
	$('html').smoothWheel();
	$('html').css('opacity', 1);
	
	$window.scroll(updateBackground);
	$window.resize(updateBackground);

	updateBackground();
});

function updateBackground() {
	for (let index = 0; index < $background.length; ++index)
		$($background[index]).css(
			'background-position',
			`${calcBackgroundHorizontal($($background[index]))}% ${calcBackgroundVertical($($background[index]))}%`);
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