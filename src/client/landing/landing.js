
'use strict';

let width;

function onLoad() {
	onResize();
	$(window).resize(onResize);
	
	$(document).ready(() => {
		$('html').css('opacity', 1);
	});
}

function onResize() {
	width = $(window).width();
	
	resizeBlockTitle();
	resizeBlockTitlePen();
	resizeBlockTitleLogo();
	resizeBlockTitleMenu();
	resizeBlockTitleText();
	resizeBlockTitleApp();
	resizeBlockTitleApply();
	resizeBlockTitleImg();
	resizeBlock();
	resizeBlockFooter();
	resizeBlockFirst();
	resizeBlockSecond();
	resizeBlockThird();
	resizeBlockFourth();
	resizeBlockFifth();
	resizeBlockFooterContent();
}

function resizeBlockTitle() {
	$('.block-title').css('width', w(1440));
	$('.block-title').css('height', w(1440));
}

function resizeBlockTitlePen() {
	$('.block-title-pen').css('left', w(770));
	$('.block-title-pen').css('width', w(500));
	$('.block-title-pen').css('height', w(500));
}

function resizeBlockTitleLogo() {
	$('.block-title-logo').css('top', w(24));
	$('.block-title-logo').css('left', w(250));
	$('.block-title-logo').css('width', w(186));
	$('.block-title-logo').css('height', w(40));
}

function resizeBlockTitleMenu() {
	$('.block-title-menu').css('font-size', w(18));
	$('.block-title-menu').css('top', w(36));
	$('.block-title-menu').css('height', w(20));

	$('.block-title-menu-about').css('left', w(476));

	$('.block-title-menu-value').css('left', w(550));

	$('.block-title-menu-contactus').css('left', w(619));
}

function resizeBlockTitleText() {
	$('.block-title-text-large').css('font-size', w(50));
	$('.block-title-text-large').css('top', w(204));
	$('.block-title-text-large').css('left', w(250));

	$('.block-title-text-small').css('font-size', w(24));
	$('.block-title-text-small').css('top', w(286));
	$('.block-title-text-small').css('left', w(252));
}

function resizeBlockTitleApp() {
	$('.block-title-app').css('left', w(250));
	$('.block-title-app').css('width', w(220));
	$('.block-title-app').css('height', w(60));
	
	$('.block-title-app-google').css('top', w(467));
	$('.block-title-app-apple').css('top', w(543));
}

function resizeBlockTitleApply() {
	$('.block-title-apply').css('font-size', w(24));
	$('.block-title-apply').css('line-height', w(80) + 'px');
	$('.block-title-apply').css('top', w(523));
	$('.block-title-apply').css('left', w(970));
	$('.block-title-apply').css('width', w(220));
	$('.block-title-apply').css('height', w(80));
}

function resizeBlockTitleImg() {
	$('.block-title-img').css('top', w(905));
	$('.block-title-img').css('left', w(250));
	$('.block-title-img').css('width', w(505));
	$('.block-title-img').css('height', w(405));

	$('.block-title-img-title').css('font-size', w(32));
	$('.block-title-img-title').css('line-height', w(42) + 'px');
	$('.block-title-img-title').css('top', w(965));
	$('.block-title-img-title').css('left', w(890));
	
	$('.block-title-img-text').css('font-size', w(20));
	$('.block-title-img-text').css('line-height', w(35) + 'px');
	$('.block-title-img-text').css('top', w(1089));
	$('.block-title-img-text').css('left', w(890));
}

function resizeBlock() {
	$('.block').css('width', w(1440));
	$('.block').css('height', w(720));
	$('.block-last').css('height', w(800));
}

function resizeBlockFooter() {
	$('.block-footer').css('width', w(1440));
	$('.block-footer').css('height', w(120));
}

function resizeBlockFirst() {
	$('.block-first-title').css('font-size', w(32));
	$('.block-first-title').css('line-height', w(42) + 'px');
	$('.block-first-title').css('top', w(1520));
	$('.block-first-title').css('left', w(562.5));

	$('.block-first-text').css('font-size', w(20));
	$('.block-first-text').css('line-height', w(35) + 'px');
	$('.block-first-text').css('top', w(1644));
	$('.block-first-text').css('left', w(528));

	$('.block-first-img').css('top', w(1798));
	$('.block-first-img').css('left', w(580));
	$('.block-first-img').css('width', w(280));
	$('.block-first-img').css('height', w(280));
}

function resizeBlockSecond() {
	$('.block-second-title').css('font-size', w(32));
	$('.block-second-title').css('line-height', w(42) + 'px');
	$('.block-second-title').css('top', w(2406));
	$('.block-second-title').css('left', w(285));

	$('.block-second-text').css('font-size', w(20));
	$('.block-second-text').css('line-height', w(35) + 'px');
	$('.block-second-text').css('top', w(2530));
	$('.block-second-text').css('left', w(285));

	$('.block-second-img').css('top', w(2285));
	$('.block-second-img').css('left', w(807));
	$('.block-second-img').css('width', w(529));
	$('.block-second-img').css('height', w(595));
}

function resizeBlockThird() {
	$('.block-third-title').css('font-size', w(32));
	$('.block-third-title').css('line-height', w(42) + 'px');
	$('.block-third-title').css('top', w(3108));
	$('.block-third-title').css('left', w(810));

	$('.block-third-text').css('font-size', w(20));
	$('.block-third-text').css('line-height', w(35) + 'px');
	$('.block-third-text').css('top', w(3232));
	$('.block-third-text').css('left', w(810));

	$('.block-third-img').css('top', w(2970));
	$('.block-third-img').css('left', w(250));
	$('.block-third-img').css('width', w(529));
	$('.block-third-img').css('height', w(630));
}

function resizeBlockFourth() {
	$('.block-fourth-img').css('top', w(3784));
	$('.block-fourth-img').css('width', w(160));
	$('.block-fourth-img').css('height', w(160));
	
	$('.block-fourth-img-first').css('left', w(319));
	$('.block-fourth-img-second').css('left', w(642));
	$('.block-fourth-img-third').css('left', w(960));

	$('.block-fourth-title').css('font-size', w(32));
	$('.block-fourth-title').css('line-height', w(42) + 'px');
	$('.block-fourth-title').css('top', w(3984));

	$('.block-fourth-title-first').css('left', w(355));

	$('.block-fourth-title-second').css('left', w(664));
	
	$('.block-fourth-title-third').css('left', w(982));

	$('.block-fourth-text').css('font-size', w(20));
	$('.block-fourth-text').css('line-height', w(30) + 'px');
	$('.block-fourth-text').css('top', w(4046));
	
	$('.block-fourth-text-first').css('left', w(282));

	$('.block-fourth-text-second').css('left', w(573));
	
	$('.block-fourth-text-third').css('left', w(914));
}

function resizeBlockFifth() {
	$('.block-fifth-logo').css('top', w(4380));
	$('.block-fifth-logo').css('left', w(660));
	$('.block-fifth-logo').css('width', w(120));
	$('.block-fifth-logo').css('height', w(88));

	$('.block-fifth-member-first').css('top', w(4528));
	$('.block-fifth-member-first').css('left', w(330));
	$('.block-fifth-member-first').css('width', w(220));
	$('.block-fifth-member-first').css('height', w(220));

	$('.block-fifth-member-second').css('top', w(4528));
	$('.block-fifth-member-second').css('left', w(610));
	$('.block-fifth-member-second').css('width', w(220));
	$('.block-fifth-member-second').css('height', w(220));

	$('.block-fifth-member-third').css('top', w(4528));
	$('.block-fifth-member-third').css('left', w(890));
	$('.block-fifth-member-third').css('width', w(220));
	$('.block-fifth-member-third').css('height', w(220));

	$('.block-fifth-name-first').css('font-size', w(20));
	$('.block-fifth-name-first').css('line-height', w(30) + 'px');
	$('.block-fifth-name-first').css('top', w(4760));
	$('.block-fifth-name-first').css('left', w(367));

	$('.block-fifth-name-second').css('font-size', w(20));
	$('.block-fifth-name-second').css('line-height', w(30) + 'px');
	$('.block-fifth-name-second').css('top', w(4760));
	$('.block-fifth-name-second').css('left', w(645));

	$('.block-fifth-name-third').css('font-size', w(20));
	$('.block-fifth-name-third').css('line-height', w(30) + 'px');
	$('.block-fifth-name-third').css('top', w(4760));
	$('.block-fifth-name-third').css('left', w(936));

	$('.block-fifth-horizontal-first').css('top', w(4802));
	$('.block-fifth-horizontal-first').css('left', w(330));
	$('.block-fifth-horizontal-first').css('width', w(220));

	$('.block-fifth-horizontal-second').css('top', w(4802));
	$('.block-fifth-horizontal-second').css('left', w(610));
	$('.block-fifth-horizontal-second').css('width', w(220));

	$('.block-fifth-horizontal-third').css('top', w(4802));
	$('.block-fifth-horizontal-third').css('left', w(890));
	$('.block-fifth-horizontal-third').css('width', w(220));

	$('.block-fifth-title-first').css('font-size', w(20));
	$('.block-fifth-title-first').css('line-height', w(30) + 'px');
	$('.block-fifth-title-first').css('top', w(4816));
	$('.block-fifth-title-first').css('left', w(371));

	$('.block-fifth-title-second').css('font-size', w(20));
	$('.block-fifth-title-second').css('line-height', w(30) + 'px');
	$('.block-fifth-title-second').css('top', w(4816));
	$('.block-fifth-title-second').css('left', w(631));

	$('.block-fifth-title-third').css('font-size', w(20));
	$('.block-fifth-title-third').css('line-height', w(30) + 'px');
	$('.block-fifth-title-third').css('top', w(4816));
	$('.block-fifth-title-third').css('left', w(914));

	$('.block-fifth-button-first').css('font-size', w(16));
	$('.block-fifth-button-first').css('line-height', w(54) + 'px');
	$('.block-fifth-button-first').css('top', w(4986));
	$('.block-fifth-button-first').css('left', w(535));
	$('.block-fifth-button-first').css('width', w(175));
	$('.block-fifth-button-first').css('height', w(54));

	$('.block-fifth-button-second').css('font-size', w(16));
	$('.block-fifth-button-second').css('line-height', w(54) + 'px');
	$('.block-fifth-button-second').css('top', w(4986));
	$('.block-fifth-button-second').css('left', w(730));
	$('.block-fifth-button-second').css('width', w(170));
	$('.block-fifth-button-second').css('height', w(54));
}

function resizeBlockFooterContent() {
	$('.block-footer-facebook').css('top', w(5182));
	$('.block-footer-facebook').css('left', w(250));
	$('.block-footer-facebook').css('width', w(34));
	$('.block-footer-facebook').css('height', w(34));

	$('.block-footer-vertical').css('top', w(5192));
	$('.block-footer-vertical').css('height', w(20));

	$('.block-footer-vertical-first').css('left', w(451));

	$('.block-footer-vertical-second').css('left', w(662));

	$('.block-footer-text').css('font-size', w(16));
	$('.block-footer-text').css('line-height', w(30) + 'px');
	$('.block-footer-text').css('top', w(5186));

	$('.block-footer-text-terms').css('left', w(314));

	$('.block-footer-text-rights').css('left', w(469));
	
	$('.block-footer-text-privacy').css('left', w(680));

	$('.block-footer-plotchain').css('font-size', w(20));
	$('.block-footer-plotchain').css('line-height', w(30) + 'px');
	$('.block-footer-plotchain').css('top', w(5186));
	$('.block-footer-plotchain').css('left', w(1077));
}

function w(v) {
	return (width < 1000 ? 1000 : width) * v / 1440;
}