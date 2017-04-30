var pages = [],
	pageCount = 10,// 仮でいまのとこ10ページ分つくってみる
	speed = 3000;

for (var i = 0; i < pageCount; i++) {
	pages[i] = {num: i}
}

function changeSlide(prev, next){
	var $prev = $(prev),
		$next = $(next);

	$prev.off('transitionend');
	setTimeout(function(){$prev.addClass('end')}, 5);
	$prev.css('opacity', '0')

	$next.addClass('start').on('transitionend', function(e){
		var classes = $next.attr('class').split(' ');
		for (var i = 0; i < classes.length; i++) {
			if(classes[i].indexOf('start') > -1){
				$next.removeClass(classes[i]);
			}
		}
	});
	$next.addClass('end-' + $next.attr('data-end-func'));
}


$(function(){
	var slideTmpl = $('#slideTmpl').text(),
		settingsTmpl = $('#settingsTmpl').text();

	$.tmpl(settingsTmpl, pages).appendTo('.page-list');
	$.tmpl(slideTmpl, pages).appendTo('.slide-flame');


	var $slideFlame = $('.slide-flame'),
		$slides = $slideFlame.find('.page'),

		$makeSlideBtn = $('#makeSlide'),
		$startSlideBtn = $('#startSlide');

	$startSlideBtn.hide();
	
	// slideと値を接続
	$makeSlideBtn.on('click', function(e){
		e.preventDefault();
		var $targetForm =  $(this).closest('form');
		$targetForm.find('select').each(function(i, targetSelect){
			var targetVal = $(targetSelect).val();
			if(i === 0){
				$slides.eq(i).addClass('end-' + targetVal);
				$slides.eq(i).css('opacity', 1)
			} else {
				$slides.eq(i).attr('data-end-func', targetVal);
			}
			if(i === $slides.length - 1){
			} else {
				$slides.eq(i + 1).addClass('start-' + targetVal);
				$slides.eq(i + 1).attr('data-end-func', targetVal);
			}
			// 上に重ねてく。
			$slides.eq(i).css({
				zIndex: pageCount - i
			})

			// わかりやすいように仮で背景をそれぞれ分けておきます
			$slides.eq(i).css({
				background: 'hsla('+ (360 * i / pageCount) +',100%, 50%, 1)'
			});
		});

		$startSlideBtn.show();

	});
	function startSlide(count){
		if(count < pageCount - 1){
			var nextCount = count + 1;

			changeSlide($slides.eq(count), $slides.eq(nextCount));
			setTimeout(startSlide, speed, nextCount)
		} else {
			return false;
		}
	}
	// slideを開始
	$startSlideBtn.on('click', function(e){
		e.preventDefault();
		$slideFlame.show();
		setTimeout(startSlide, speed, 0)

	})


})
