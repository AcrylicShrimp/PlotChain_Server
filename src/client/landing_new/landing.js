
const $window     = $(window);
const $document   = $(document);
const $background = $('.background');

$(document).ready(() => {
	$(window).scroll(updateBackground);
	$(window).resize(updateBackground);
	$('html').css('opacity', 1);
});

function updateBackground() {
	$background.css('background-position', `${calcBackgroundHorizontal()}% ${calcBackgroundVertical()}%`);
}

function calcBackgroundHorizontal() {
	const factor = ($document.width() - $window.width());

	if (factor <= 0)
		return 50;

	return $window.scrollLeft() / factor * 100;
}

function calcBackgroundVertical() {
	const factor = ($document.height() - $window.height());

	if (factor <= 0)
		return 50;
	
	return $window.scrollTop() / factor * 100;
}