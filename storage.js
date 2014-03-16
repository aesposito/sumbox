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

}