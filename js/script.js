var m4 = m4 || {};
m4.hasJqueryObject = function($elem){return $elem.length > 0;};
m4.rpsGame = new function() {
	this.init = function() {
		//변수 처리
		this.$rpsWrap = $('.rpsWrap'); //m4.rpsGame.$rpsWrap
		this.$viewWrap = this.$rpsWrap.find('.viewWrap'); //m4.rpsGame.$viewWrap
		this.$randomWrap = this.$viewWrap.find('.randomWrap'); //m4.rpsGame.$randomWrap
		this.$rps = this.$randomWrap.find('div'); //m4.rpsGame.$rps
		this.rpsLength = this.$rps.length; //m4.rpsGame.rpsLength
		this.$scoreWrap = this.$viewWrap.find('.scoreWrap'); //m4.rpsGame.$scoreWrap
		this.$lifeWrap = this.$viewWrap.find('.lifeWrap'); //m4.rpsGame.$lifeWrap
		this.life = 5; //m4.rpsGame.life
		this.lifeCount; //m4.rpsGame.lifeCount
		this.$btnWrap = this.$rpsWrap.find('.btnWrap'); //m4.rpsGame.$btnWrap
		this.$btnRpsWrap = this.$btnWrap.find('.btnRpsWrap'); //m4.rpsGame.btnRpsWrap
		this.$btnRps = this.$btnRpsWrap.find('button'); //m4.rpsGame.btnRps
		this.$btnReset = this.$btnWrap.find('.btnReset'); //m4.rpsGame.btnReset
		this.randomTimer; //m4.randomTimer
		this.timerCheck = false; //m4.rpsGame.timerCheck;
		this.score = 0; //m4.rpsGame.score;
		//로컬 스토리지
		this.logArr = []; //m4.rpSgame.logArr;

		//초기화
		this.rpsIdx();
		this.log();
		this.addEvents();
	};

	this.rpsIdx = function() {
		//idx값 설정 : 이미지 - 버튼 idx 매칭 하기 위해서
		//가위0, 바위1, 보2 - 랜덤이미지, 버튼에 설정
		m4.rpsGame.$rps.each( function(idx) {
			$(this).attr('data-idx', idx);
		});
		m4.rpsGame.$btnRps.each( function(idx) {
			$(this).attr('data-idx', idx);
		});
		m4.rpsGame.$rps.eq(0).addClass('on').siblings().removeClass('on');
		this.handleSet();
	};

	this.reset = function() {
		localStorage.clear();
		m4.rpsGame.logArr = [];
		m4.rpsGame.score = 0;
		m4.rpsGame.$scoreWrap.html('');
		m4.rpsGame.lifeCount = m4.rpsGame.life;
		m4.rpsGame.$lifeWrap.html('');
		m4.rpsGame.log();
	};

	this.addEvents = function() {
		//가위, 바위, 보 버튼
		m4.rpsGame.$btnRps.on('click', m4.rpsGame.handleClick);
		//리셋 버튼
		m4.rpsGame.$btnReset.on('click', m4.rpsGame.reset);
	};

	this.handleSet = function() {
		var currentIdx = parseInt(m4.rpsGame.$randomWrap.find('.on').attr('data-idx'));
		var prevIdx;

		if(!m4.timerCheck) {
			m4.randomTimer = setInterval( randomTimerFunc, 100);
		}

		function randomTimerFunc() {
			m4.timerCheck = true;
			prevIdx = currentIdx;
			currentIdx++;
			if(currentIdx >= m4.rpsGame.rpsLength) {
				currentIdx = 0;
				prevIdx = m4.rpsGame.rpsLength - 1;
			}
			m4.rpsGame.$rps.eq(currentIdx).addClass('on');
			m4.rpsGame.$rps.eq(prevIdx).removeClass('on');
		}
	};

	this.handleClick = function() {
		clearInterval(m4.randomTimer);
		m4.timerCheck = false;

		var randomIdx = Math.floor(Math.random() * m4.rpsGame.rpsLength);
		var currentIdx = parseInt(m4.rpsGame.$randomWrap.find('.on').attr('data-idx'));
		var btnIdx = parseInt($(this).attr('data-idx'));

		m4.rpsGame.$rps.eq(randomIdx).addClass('on').siblings().removeClass('on');
		if(currentIdx === btnIdx) { //비김
			alert('비김');
			m4.rpsGame.scoreLifeGet('tie');
		}else if(((currentIdx === 0) && (btnIdx === 1)) || ((currentIdx === 1) && (btnIdx === 2)) || ((currentIdx === 2) && (btnIdx === 0))) { //이김
			alert('이김');
			m4.rpsGame.scoreLifeGet('win');
		}else if(((currentIdx === 0) && (btnIdx === 2)) || ((currentIdx === 1) && (btnIdx === 0)) || ((currentIdx === 2) && (btnIdx === 1))) { //짐
			alert('짐');
			m4.rpsGame.scoreLifeGet('lose');
		}
	};

	this.scoreLifeSet = function() {
		//스코어 설정
		for(var i = 0; i < m4.rpsGame.logArr[m4.rpsGame.logArr.length - 1].score; i++) {
			m4.rpsGame.$scoreWrap.append('<span class="scoreAdd"></span>');
		}
		//라이프 설정
		for(var i = 0; i < m4.rpsGame.logArr[m4.rpsGame.logArr.length - 1].life; i++) {
			m4.rpsGame.$lifeWrap.append('<span class="life"></span>');
		}
	}

	this.scoreLifeGet = function(winCheck) {
		if(winCheck === 'tie') {
			m4.rpsGame.handleSet();
			m4.rpsGame.log('tie');
		}else if(winCheck === 'win') {
			m4.rpsGame.score++;
			m4.rpsGame.$scoreWrap.append('<span class="scoreAdd"></span>');
			if(m4.rpsGame.score < 5) {
				m4.rpsGame.handleSet();
			}else if(m4.rpsGame.score >= 5) {
				setTimeout( function() {
					alert('WIN. 5승 완료!');
					m4.rpsGame.reset();
				}, 500);
			}
			m4.rpsGame.log('win');
		}else if(winCheck === 'lose') {
			m4.rpsGame.lifeCount--;
			if(m4.rpsGame.lifeCount > 0) {
				$('.life').eq(m4.rpsGame.lifeCount).remove();
				m4.rpsGame.handleSet();
			}else if(m4.rpsGame.lifeCount <= 0) {
				$('.life').eq(m4.rpsGame.lifeCount).remove();
				setTimeout( function() {
					alert('GAME OVER. 재실행 됩니다.');
					m4.rpsGame.reset();
				}, 500);
			}
			m4.rpsGame.log('lose');
		}
	};

	this.log = function(winCheck) {
		if(localStorage.length && !winCheck) {
			//맨처음 초기값 로컬 스토리지O : 스코어, 라이프 설정
			m4.rpsGame.logArr = JSON.parse(localStorage.getItem('rpsGameLog'));
			m4.rpsGame.score = m4.rpsGame.logArr[m4.rpsGame.logArr.length - 1].score;
			m4.rpsGame.lifeCount = m4.rpsGame.logArr[m4.rpsGame.logArr.length - 1].life;
			m4.rpsGame.scoreLifeSet();
		}else if(!localStorage.length && !winCheck) {
			//맨처음 초기값 로컬 스토리지X : 스코어, 라이프 설정
			m4.rpsGame.score = 0;
			m4.rpsGame.lifeCount = m4.rpsGame.life;
			m4.rpsGame.logArr.push({
				'score' : m4.rpsGame.score,
				'life' : m4.rpsGame.lifeCount
			});
	 		m4.rpsGame.scoreLifeSet();
		}else if(winCheck) {
			//두번째부터 쌓이는 값
			m4.rpsGame.logArr.push({
				'score' : m4.rpsGame.score,
				'life' : m4.rpsGame.lifeCount
			});
			localStorage.setItem('rpsGameLog', JSON.stringify(m4.rpsGame.logArr));
		}
	};
};

$( function() {
	m4.rpsGame.init();
});