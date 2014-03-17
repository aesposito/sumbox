function Storage()
{

	var _storage = this;

	this.getBestScore = function(){
		var score = localStorage.getItem('best');
		if (score == null)
		{
			score = 0;
		}
		return score;
	}

	this.saveBestScore = function(score){
		if (score > _storage.getBestScore())
		{
			localStorage.setItem('best', score);
			return true;
		}
		return false;
	}

	this.getBestBox = function()
	{
		var best = localStorage.getItem('bestBox');
		if (best == null)
		{
			best = 0;
		}
		return best;
	}

	this.saveBestBox = function(best){
		if (best > _storage.getBestBox())
		{
			localStorage.setItem('bestBox', best);
			return true;
		}
		return false;
	}

}