function Sumbox ()
{
	var _next = 1;
	var _game = this;
	var _size = 0;
	var _list_cells = Array();
	var _max_value = 2;
	var _base_color = "#E6DDCF";
	var _score = 0;
	var _storage;

	this.start = function(size)
	{
		_storage = new Storage();
		$('.best span').html(_game.formatNumber(_storage.getBestScore()));
		
		_size = size;
		for(var x = 0; x < size; x++)
		{
			$('.game_container').append('<div class="game_row row_'+x+'"></div>');	
			for(var y = 0; y < size; y++)
			{
				$('.row_'+x).append('<div class="game_cell cell_'+x+'_'+y+'" data-past="false" data-x="'+x+'" data-y="'+y+'" data-value="0"><span></span></div>');
			}
		}
		_game.events();
		_game.next();
	};

	this.events = function()
	{
		$('.game_cell').click(function(e){
			var cell = $(this);
			var value = cell.attr('data-value');
			if (value === '0')
			{
				_game.setActual(cell);
			}
		});

		$('.play_again').click(function(e){
			_game.restartGame();
		});
	}


	this.restartGame = function()
	{
		$('.game_over').fadeOut(300);
		_score = 0;
		$('.score span').html("0");
		$('.game_cell').each(function(e){
			$(this).attr('data-value', '0');
			$(this).children('span').html('');
			$(this).children('span').css('background-color', _base_color);
			_max_value = 2;
			_game.next();
		});
	}

	this.setActual = function(cell)
	{
		cell.children('span').css({
			'width': 0,
			'height': 0,
			'margin':'48px 48px',
			'font-size': 0
		});

		cell.children('span').animate({
			'width': 96,
			'height': 96,
			'margin':'0px 0px',
			'font-size': 50
		}, 150, function(e){
			cell.children('span').html(_next);
			_game.next();
			_game.checkGame(cell);
		});

		cell.attr('data-value', _next);
		var colors = _game.getColor(_next);
		cell.children('span').css('background-color', colors[0]);
		cell.children('span').css('color', colors[1]);
		
	}

	this.next = function()
	{
		var n = Math.floor((Math.random() * _max_value)+1);
		_next = n;
		$('.cell_next').html(_next);
		var colors = _game.getColor(_next);
		$('.cell_next').css('background-color', colors[0]);
		$('.cell_next').css('color', colors[1]);
	}

	this.checkGame = function(cell)
	{
		_list_cells = Array();
		$('.game_cell').attr('data-past', 'false');
		_game.searchCell(cell, null);

		while(_list_cells.length > 2)
		{
			for(var i = 1; i < _list_cells.length; i++)
			{
				var item = _list_cells[i];
				_game.moveCell(item, cell);
			}	

			var next = parseInt(cell.attr('data-value')) + 1;
			var colors = _game.getColor(next);
			cell.attr('data-value', next);
			cell.children('span').html(next);

			cell.children('span').css('background-color', colors[0]);
			cell.children('span').css('color', colors[1]);

			if (next > _max_value)
			{
				_max_value = next;
			}

			_score += (_list_cells.length * 10) * next;
			$('.score span').html(_game.formatNumber(_score));
			var best = _storage.saveBestScore(_score);
			if (best)
			{
				$('.best span').html(_game.formatNumber(_score));
			}

			_list_cells = Array();
			$('.game_cell').attr('data-past', 'false');
			_game.searchCell(cell, null);
		}

		if (_game.checkEndGame())
		{
			$('.game_over').fadeIn(500);
		}

	}

	this.checkEndGame = function()
	{
		var count_empty = 0;
		$('.game_cell').each(function(e){
			if ($(this).attr('data-value') == '0')
			{
				count_empty++;
			}	
		});
		
		return count_empty == 0;
	}

	this.searchCell = function(cell, previous_cell)
	{
		var x = parseInt(cell.attr('data-x'));
		var y = parseInt(cell.attr('data-y'));
		var value = cell.attr('data-value');

		_list_cells.push(cell);
		cell.attr('data-past', 'true');
		//x
		//y + 1
		var next_cell = $('.cell_' + (x) + '_' + (y + 1));
		var past = next_cell.attr('data-past');
		if (next_cell != undefined && next_cell.attr('data-value') == value && past == 'false')
		{
			var around = _game.searchAround(x, y, previous_cell);
			if (around)
			{
				_game.searchCell(next_cell, cell);
			}
		}

		//x - 1
		//y 
		var next_cell = $('.cell_' + (x - 1) + '_' + (y));
		var past = next_cell.attr('data-past');
		if (next_cell != undefined && next_cell.attr('data-value') == value && past == 'false')
		{
			var around = _game.searchAround(x, y, previous_cell);
			if (around)
			{
				_game.searchCell(next_cell, cell);
			}
		}

		//x
		//y - 1
		var next_cell = $('.cell_' + (x) + '_' + (y - 1));
		var past = next_cell.attr('data-past');
		if (next_cell != undefined && next_cell.attr('data-value') == value && past == 'false')
		{
			var around = _game.searchAround(x, y, previous_cell);
			if (around)
			{
				_game.searchCell(next_cell, cell);
			}
		}

		//x + 1
		//y
		var next_cell = $('.cell_' + (x + 1) + '_' + (y));
		var past = next_cell.attr('data-past');
		if (next_cell != undefined && next_cell.attr('data-value') == value && past == 'false')
		{
			var around = _game.searchAround(x, y, previous_cell);
			if (around)
			{
				_game.searchCell(next_cell, cell);
			}
		}


	}

	this.moveCell = function(origen, destine)
	{
		var top = origen.children('span').position().top;
		var left = origen.children('span').position().left;
		origen.children('span').animate({
			'top' : destine.position().top - top,
			'left': destine.position().left - left,
			'opacity':0
		}, 200, function(e){
			origen.children('span').html('');
			origen.children('span').css('background-color', _base_color);
			origen.children('span').css({
				'top' : 0,
				'left': 0,
				'opacity':1
			});
		});

		origen.attr('data-value', '0');
	}


	this.searchAround = function(x, y, previous_cell)
	{
		if (previous_cell != null)
		{
			var x_prev = parseInt(previous_cell.attr('data-x'));
			var y_prev = parseInt(previous_cell.attr('data-y'));
			if (x == x_prev && y == y_prev)
			{
				return false;
			}
			else
			{
				return true;
			}
		}
		else
		{
			return true;
		}
	}

	this.getColor = function(nro)
	{
		var colors = Array();
		colors.push(["#00A6FF", '#FFF']);
		colors.push(["#F6A1C3", '#FFF']);
		colors.push(["#B0CF00", '#FFF']);
		colors.push(["#F0305D", '#FFF']);
		colors.push(["#F0B330", '#FFF']);
		colors.push(["#30F0D0", '#FFF']);
		colors.push(["#E08031", '#FFF']);
		colors.push(["#E340D8", '#FFF']);
		colors.push(["#65B332", '#FFF']);
		colors.push(["#327DB3", '#FFF']);
		colors.push(["#B3324E", '#FFF']);
		colors.push(["#ACB332", '#FFF']);
		colors.push(["#3259B3", '#FFF']);
		colors.push(["#99B332", '#FFF']);
		colors.push(["#B33232", '#FFF']);
		colors.push(["#9C9C9C", '#FFF']);
		colors.push(["#E3AE00", '#FFF']);
		colors.push(["#000000", '#FFF']);
		colors.push(["#FFFFFF", '#000']);
		
		return (colors.length >= nro) ? colors[nro - 1] : colors[0];
		
	}


	this.formatNumber = function(nro)
	{
		var separador_decimal = ',';
		var separador_miles = '.';
		
		nro = nro.toString().replace(".", separador_decimal !== undefined ? separador_decimal : ",");

		if (separador_miles) {
			var miles = new RegExp("(-?[0-9]+)([0-9]{3})");
			while (miles.test(nro)) {
				nro = nro.replace(miles, "$1" + separador_miles + "$2");
			}
		}

		return nro;
	}


}








